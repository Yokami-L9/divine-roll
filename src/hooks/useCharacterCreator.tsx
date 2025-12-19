import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Race, CharacterClass } from "./useRulebook";
import { InventoryItem } from "@/types/inventory";

export interface CharacterData {
  // Basic info
  name: string;
  gender: "male" | "female";
  avatar_url: string | null;
  
  // Race
  race: string;
  raceId: string;
  subrace: string | null;
  
  // Class
  class: string;
  classId: string;
  class_levels: Record<string, number>; // For multiclassing: { "Воин": 3, "Волшебник": 2 }
  subclasses: Record<string, string>; // Selected subclass per class: { "Волшебник": "Школа Воплощения" }
  
  // Background
  background: string;
  backgroundId: string;
  
  // Abilities
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  abilityMethod: "standard" | "pointbuy" | "manual";
  
  // Derived stats
  level: number;
  hp: number;
  max_hp: number;
  proficiency_bonus: number;
  armor_class: number;
  initiative: number;
  speed: number;
  
  // Proficiencies
  skill_proficiencies: string[];
  saving_throw_proficiencies: string[];
  languages: string[];
  
  // Equipment & traits
  equipment: InventoryItem[];
  traits: string[];
  
  // Spells (for spellcasters)
  known_spells: string[];
  prepared_spells: string[];
  
  // Personality
  alignment: string;
  personality_trait: string;
  ideal: string;
  bond: string;
  flaw: string;
  backstory: string;
}

export const ABILITY_NAMES = {
  strength: "Сила",
  dexterity: "Ловкость",
  constitution: "Телосложение",
  intelligence: "Интеллект",
  wisdom: "Мудрость",
  charisma: "Харизма",
} as const;

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

export const POINT_BUY_COSTS: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9,
};

export const ALIGNMENTS = [
  "Законопослушный добрый",
  "Нейтральный добрый",
  "Хаотичный добрый",
  "Законопослушный нейтральный",
  "Истинно нейтральный",
  "Хаотичный нейтральный",
  "Законопослушный злой",
  "Нейтральный злой",
  "Хаотичный злой",
];

export const SKILLS = [
  { name: "Акробатика", ability: "dexterity" },
  { name: "Анализ", ability: "intelligence" },
  { name: "Атлетика", ability: "strength" },
  { name: "Восприятие", ability: "wisdom" },
  { name: "Выживание", ability: "wisdom" },
  { name: "Выступление", ability: "charisma" },
  { name: "Запугивание", ability: "charisma" },
  { name: "История", ability: "intelligence" },
  { name: "Ловкость рук", ability: "dexterity" },
  { name: "Магия", ability: "intelligence" },
  { name: "Медицина", ability: "wisdom" },
  { name: "Обман", ability: "charisma" },
  { name: "Природа", ability: "intelligence" },
  { name: "Проницательность", ability: "wisdom" },
  { name: "Религия", ability: "intelligence" },
  { name: "Скрытность", ability: "dexterity" },
  { name: "Убеждение", ability: "charisma" },
  { name: "Уход за животными", ability: "wisdom" },
];

export function useCharacterCreator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [character, setCharacter] = useState<CharacterData>({
    name: "",
    gender: "male",
    avatar_url: null,
    race: "",
    raceId: "",
    subrace: null,
    class: "",
    classId: "",
    class_levels: {},
    subclasses: {},
    background: "",
    backgroundId: "",
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    abilityMethod: "standard",
    level: 1,
    hp: 10,
    max_hp: 10,
    proficiency_bonus: 2,
    armor_class: 10,
    initiative: 0,
    speed: 30,
    skill_proficiencies: [],
    saving_throw_proficiencies: [],
    languages: ["Общий"],
    equipment: [],
    traits: [],
    known_spells: [],
    prepared_spells: [],
    alignment: "Истинно нейтральный",
    personality_trait: "",
    ideal: "",
    bond: "",
    flaw: "",
    backstory: "",
  });

  const updateCharacter = useCallback((updates: Partial<CharacterData>) => {
    setCharacter(prev => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 7));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, 7)));
  }, []);

  // Calculate modifier
  const getModifier = useCallback((score: number) => {
    return Math.floor((score - 10) / 2);
  }, []);

  // Calculate HP based on class and constitution
  const calculateHP = useCallback((hitDie: number, constitution: number, level: number) => {
    const conMod = getModifier(constitution);
    return hitDie + conMod + (level - 1) * (Math.floor(hitDie / 2) + 1 + conMod);
  }, [getModifier]);

  return {
    currentStep,
    character,
    updateCharacter,
    nextStep,
    prevStep,
    goToStep,
    setCurrentStep,
    getModifier,
    calculateHP,
  };
}

export function useRaceNames(raceNameEn: string | null, gender: "male" | "female") {
  return useQuery({
    queryKey: ["raceNames", raceNameEn, gender],
    queryFn: async () => {
      if (!raceNameEn) return { firstNames: [], lastNames: [] };
      
      const { data: firstNames, error: firstError } = await supabase
        .from("race_names")
        .select("name")
        .eq("race_name_en", raceNameEn)
        .eq("gender", gender)
        .eq("name_type", "first");
      
      const { data: lastNames, error: lastError } = await supabase
        .from("race_names")
        .select("name")
        .eq("race_name_en", raceNameEn)
        .eq("gender", "neutral");
      
      if (firstError || lastError) throw firstError || lastError;
      
      return {
        firstNames: firstNames?.map(n => n.name) || [],
        lastNames: lastNames?.map(n => n.name) || [],
      };
    },
    enabled: !!raceNameEn,
  });
}
