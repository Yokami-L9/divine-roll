import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Race {
  id: string;
  name: string;
  name_en: string | null;
  description: string | null;
  speed: number;
  size: string;
  ability_bonuses: Record<string, number>;
  traits: string[];
  languages: string[];
  subraces: Array<{
    name: string;
    ability_bonus: Record<string, number>;
    traits: string[];
  }>;
}

export interface SubclassFeature {
  name: string;
  level: number;
  description: string;
}

export interface Subclass {
  name: string;
  name_en: string;
  level: number;
  description: string;
  features: SubclassFeature[];
}

export interface CharacterClass {
  id: string;
  name: string;
  name_en: string | null;
  description: string | null;
  hit_die: number;
  primary_ability: string | null;
  saving_throws: string[] | null;
  armor_proficiencies: string[] | null;
  weapon_proficiencies: string[] | null;
  skill_choices: { count: number; choices: string[] } | null;
  features: Array<{ level: number; name: string; description: string }>;
  spellcasting: Record<string, unknown> | null;
  subclasses: Subclass[];
}

export interface Background {
  id: string;
  name: string;
  name_en: string | null;
  description: string | null;
  skill_proficiencies: string[] | null;
  tool_proficiencies: string[] | null;
  languages_count: number | null;
  equipment: string[] | null;
  feature_name: string | null;
  feature_description: string | null;
  personality_traits: string[] | null;
  ideals: string[] | null;
  bonds: string[] | null;
  flaws: string[] | null;
}

export interface Spell {
  id: string;
  name: string;
  name_en: string | null;
  level: number;
  school: string;
  casting_time: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  higher_levels: string | null;
  classes: string[] | null;
  ritual: boolean;
  concentration: boolean;
}

export interface Equipment {
  id: string;
  name: string;
  name_en: string | null;
  category: string;
  subcategory: string | null;
  cost: string | null;
  weight: number | null;
  description: string | null;
  damage: string | null;
  damage_type: string | null;
  properties: string[] | null;
  armor_class: string | null;
  stealth_disadvantage: boolean;
}

export interface Condition {
  id: string;
  name: string;
  name_en: string | null;
  description: string;
  effects: string[] | null;
}

export interface RuleSubsection {
  title: string;
  content: string;
}

export interface Rule {
  id: string;
  category: string;
  title: string;
  content: string;
  chapter: number | null;
  book: string;
  subsections: RuleSubsection[] | null;
}

export function useRaces() {
  return useQuery({
    queryKey: ["races"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .order("name");
      if (error) throw error;
      return (data as unknown) as Race[];
    },
  });
}

export function useClasses() {
  return useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .order("name");
      if (error) throw error;
      return (data as unknown) as CharacterClass[];
    },
  });
}

export function useBackgrounds() {
  return useQuery({
    queryKey: ["backgrounds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("backgrounds")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as Background[];
    },
  });
}

export function useSpells() {
  return useQuery({
    queryKey: ["spells"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("spells")
        .select("*")
        .order("level")
        .order("name");
      if (error) throw error;
      return data as Spell[];
    },
  });
}

export function useEquipment() {
  return useQuery({
    queryKey: ["equipment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipment")
        .select("*")
        .order("category")
        .order("name");
      if (error) throw error;
      return data as Equipment[];
    },
  });
}

export function useConditions() {
  return useQuery({
    queryKey: ["conditions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conditions")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as Condition[];
    },
  });
}

export function useRules() {
  return useQuery({
    queryKey: ["rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rules")
        .select("*")
        .order("category")
        .order("chapter");
      if (error) throw error;
      return data.map(rule => ({
        ...rule,
        subsections: (rule.subsections as unknown as RuleSubsection[]) || [],
      })) as Rule[];
    },
  });
}
