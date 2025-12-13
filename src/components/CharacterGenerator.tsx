import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dices, 
  RefreshCw, 
  Save, 
  User, 
  Sparkles, 
  Loader2, 
  ChevronRight, 
  ChevronLeft,
  Shuffle,
  Settings2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useRaces, useClasses, useBackgrounds, useSpells } from "@/hooks/useRulebook";
import { useRaceNames, ALIGNMENTS, SKILLS, CharacterData } from "@/hooks/useCharacterCreator";
import { supabase } from "@/integrations/supabase/client";

// Step components (reuse from character creator)
import { RaceStep } from "./character-creator/steps/RaceStep";
import { ClassStep } from "./character-creator/steps/ClassStep";
import { AbilitiesStep } from "./character-creator/steps/AbilitiesStep";
import { BackgroundStep } from "./character-creator/steps/BackgroundStep";
import { SpellsStep } from "./character-creator/steps/SpellsStep";
import { EquipmentStep } from "./character-creator/steps/EquipmentStep";
import { DetailsStep } from "./character-creator/steps/DetailsStep";
import { ReviewStep } from "./character-creator/steps/ReviewStep";
import { StepIndicator } from "./character-creator/StepIndicator";

const STEP_NAMES = [
  "Раса",
  "Класс", 
  "Характеристики",
  "Предыстория",
  "Заклинания",
  "Снаряжение",
  "Детали",
  "Обзор"
];

const CharacterGenerator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch data from database
  const { data: races = [] } = useRaces();
  const { data: classes = [] } = useClasses();
  const { data: backgrounds = [] } = useBackgrounds();
  const { data: spells = [] } = useSpells();

  // Character state
  const [character, setCharacter] = useState<CharacterData>({
    name: "",
    gender: "male",
    avatar_url: null,
    race: "",
    raceId: "",
    subrace: null,
    class: "",
    classId: "",
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

  // UI state
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mode, setMode] = useState<"random" | "step">("random");

  // Get race names for random generation
  const selectedRace = races.find(r => r.id === character.raceId);
  const { data: namesData } = useRaceNames(selectedRace?.name_en || null, character.gender);

  // Helper functions
  const getModifier = (score: number) => Math.floor((score - 10) / 2);
  
  const calculateHP = (hitDie: number, constitution: number, level: number) => {
    const conMod = getModifier(constitution);
    return hitDie + conMod + (level - 1) * (Math.floor(hitDie / 2) + 1 + conMod);
  };

  const updateCharacter = (updates: Partial<CharacterData>) => {
    setCharacter(prev => ({ ...prev, ...updates }));
  };

  const rollStat = (): number => {
    // 4d6 drop lowest
    const rolls = Array(4)
      .fill(0)
      .map(() => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => b - a);
    return rolls.slice(0, 3).reduce((a, b) => a + b, 0);
  };

  // Generate random character based on PHB rules
  const generateRandomCharacter = async () => {
    if (races.length === 0 || classes.length === 0 || backgrounds.length === 0) {
      toast({
        title: "Загрузка данных",
        description: "Подождите, пока загружаются данные справочника",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Random gender
      const gender = Math.random() > 0.5 ? "male" : "female";

      // Random race
      const randomRace = races[Math.floor(Math.random() * races.length)];
      let subrace = null;
      const subraces = randomRace.subraces as { name: string; ability_bonuses?: Record<string, number> }[] | null;
      if (subraces && subraces.length > 0) {
        subrace = subraces[Math.floor(Math.random() * subraces.length)].name;
      }

      // Random class
      const randomClass = classes[Math.floor(Math.random() * classes.length)];

      // Random background
      const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];

      // Roll stats (4d6 drop lowest)
      const stats = {
        strength: rollStat(),
        dexterity: rollStat(),
        constitution: rollStat(),
        intelligence: rollStat(),
        wisdom: rollStat(),
        charisma: rollStat(),
      };

      // Apply race ability bonuses
      const abilityBonuses = randomRace.ability_bonuses as Record<string, number> | null;
      if (abilityBonuses) {
        Object.entries(abilityBonuses).forEach(([ability, bonus]) => {
          const key = ability.toLowerCase() as keyof typeof stats;
          if (key in stats) {
            stats[key] = Math.min(20, stats[key] + bonus);
          }
        });
      }

      // Calculate HP
      const hp = calculateHP(randomClass.hit_die, stats.constitution, 1);

      // Random alignment
      const alignment = ALIGNMENTS[Math.floor(Math.random() * ALIGNMENTS.length)];

      // Get class skills and pick random ones
      const skillChoices = randomClass.skill_choices as { choose?: number; from?: string[] } | null;
      const classSkills: string[] = [];
      if (skillChoices?.from && skillChoices?.choose) {
        const availableSkills = [...skillChoices.from];
        for (let i = 0; i < skillChoices.choose && availableSkills.length > 0; i++) {
          const idx = Math.floor(Math.random() * availableSkills.length);
          classSkills.push(availableSkills[idx]);
          availableSkills.splice(idx, 1);
        }
      }

      // Background skills
      const bgSkills = randomBackground.skill_proficiencies || [];

      // Combine skills
      const allSkills = [...new Set([...classSkills, ...bgSkills])];

      // Languages
      const raceLanguages = randomRace.languages || ["Общий"];

      // Get random spells for spellcasters
      const knownSpells: string[] = [];
      const classSpellcasting = randomClass.spellcasting as { 
        cantrips_known?: number; 
        spells_known?: number 
      } | null;
      
      if (classSpellcasting) {
        const classSpells = spells.filter(s => s.classes?.includes(randomClass.name));
        
        // Cantrips
        if (classSpellcasting.cantrips_known) {
          const cantrips = classSpells.filter(s => s.level === 0);
          for (let i = 0; i < classSpellcasting.cantrips_known && cantrips.length > 0; i++) {
            const idx = Math.floor(Math.random() * cantrips.length);
            knownSpells.push(cantrips[idx].name);
            cantrips.splice(idx, 1);
          }
        }

        // 1st level spells
        if (classSpellcasting.spells_known) {
          const firstLevel = classSpells.filter(s => s.level === 1);
          for (let i = 0; i < classSpellcasting.spells_known && firstLevel.length > 0; i++) {
            const idx = Math.floor(Math.random() * firstLevel.length);
            knownSpells.push(firstLevel[idx].name);
            firstLevel.splice(idx, 1);
          }
        }
      }

      // Get traits from race
      const raceTraits = randomRace.traits as { name: string }[] | string[] | null;
      let traits: string[] = [];
      if (raceTraits && raceTraits.length > 0) {
        if (typeof raceTraits[0] === 'string') {
          traits = raceTraits as string[];
        } else {
          traits = (raceTraits as { name: string }[]).map(t => t.name);
        }
      }

      // Random personality from background
      const personalityTraits = randomBackground.personality_traits || [];
      const ideals = randomBackground.ideals || [];
      const bonds = randomBackground.bonds || [];
      const flaws = randomBackground.flaws || [];

      const personality_trait = personalityTraits.length > 0 
        ? personalityTraits[Math.floor(Math.random() * personalityTraits.length)]
        : "";
      const ideal = ideals.length > 0
        ? ideals[Math.floor(Math.random() * ideals.length)]
        : "";
      const bond = bonds.length > 0
        ? bonds[Math.floor(Math.random() * bonds.length)]
        : "";
      const flaw = flaws.length > 0
        ? flaws[Math.floor(Math.random() * flaws.length)]
        : "";

      // Fetch names for selected race
      const { data: firstNames } = await supabase
        .from("race_names")
        .select("name")
        .eq("race_name_en", randomRace.name_en || randomRace.name)
        .eq("gender", gender)
        .eq("name_type", "first");

      const { data: lastNames } = await supabase
        .from("race_names")
        .select("name")
        .eq("race_name_en", randomRace.name_en || randomRace.name)
        .eq("gender", "neutral");

      // Generate random name
      let name = "";
      if (firstNames && firstNames.length > 0) {
        name = firstNames[Math.floor(Math.random() * firstNames.length)].name;
      }
      if (lastNames && lastNames.length > 0) {
        name += ` ${lastNames[Math.floor(Math.random() * lastNames.length)].name}`;
      }
      if (!name) {
        name = `Герой ${Math.floor(Math.random() * 1000)}`;
      }

      // Background equipment
      const bgEquipment = randomBackground.equipment || [];

      // Update character with all random values
      setCharacter({
        name,
        gender,
        avatar_url: null,
        race: randomRace.name,
        raceId: randomRace.id,
        subrace,
        class: randomClass.name,
        classId: randomClass.id,
        background: randomBackground.name,
        backgroundId: randomBackground.id,
        ...stats,
        abilityMethod: "manual",
        level: 1,
        hp,
        max_hp: hp,
        proficiency_bonus: 2,
        armor_class: 10 + getModifier(stats.dexterity),
        initiative: getModifier(stats.dexterity),
        speed: randomRace.speed || 30,
        skill_proficiencies: allSkills,
        saving_throw_proficiencies: randomClass.saving_throws || [],
        languages: raceLanguages,
        equipment: bgEquipment,
        traits,
        known_spells: knownSpells,
        prepared_spells: [],
        alignment,
        personality_trait,
        ideal,
        bond,
        flaw,
        backstory: "",
      });

      // Move to equipment step so user can choose equipment sets
      setCurrentStep(5);
      setMode("step");

      toast({
        title: "Персонаж сгенерирован!",
        description: "Выберите снаряжение и внесите изменения если нужно",
      });
    } catch (error) {
      console.error("Error generating character:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сгенерировать персонажа",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите, чтобы сохранять персонажей",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!character.name || !character.race || !character.class) {
      toast({
        title: "Заполните данные",
        description: "Укажите имя, расу и класс персонажа",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const { error } = await supabase.from("characters").insert({
        user_id: user.id,
        name: character.name,
        race: character.race,
        subrace: character.subrace,
        class: character.class,
        level: character.level,
        background: character.background,
        alignment: character.alignment,
        hp: character.hp,
        max_hp: character.max_hp,
        strength: character.strength,
        dexterity: character.dexterity,
        constitution: character.constitution,
        intelligence: character.intelligence,
        wisdom: character.wisdom,
        charisma: character.charisma,
        proficiency_bonus: character.proficiency_bonus,
        armor_class: character.armor_class,
        speed: character.speed,
        skill_proficiencies: character.skill_proficiencies,
        saving_throw_proficiencies: character.saving_throw_proficiencies,
        languages: character.languages,
        equipment: character.equipment,
        traits: character.traits,
        known_spells: character.known_spells,
        personality_trait: character.personality_trait,
        ideal: character.ideal,
        bond: character.bond,
        flaw: character.flaw,
        backstory: character.backstory,
        avatar_url: character.avatar_url,
      });

      if (error) throw error;

      toast({
        title: "Персонаж сохранён!",
        description: `${character.name} добавлен в ваш список персонажей`,
      });

      navigate("/characters");
    } catch (error) {
      console.error("Error saving character:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить персонажа",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 7));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  const goToStep = (step: number) => setCurrentStep(Math.max(0, Math.min(step, 7)));

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!character.raceId;
      case 1: return !!character.classId;
      case 2: return true;
      case 3: return !!character.backgroundId;
      case 4: return true;
      case 5: return true;
      case 6: return !!character.name;
      case 7: return true;
      default: return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <RaceStep character={character} updateCharacter={updateCharacter} />;
      case 1: return <ClassStep character={character} updateCharacter={updateCharacter} calculateHP={calculateHP} />;
      case 2: return <AbilitiesStep character={character} updateCharacter={updateCharacter} getModifier={getModifier} />;
      case 3: return <BackgroundStep character={character} updateCharacter={updateCharacter} />;
      case 4: return <SpellsStep character={character} updateCharacter={updateCharacter} />;
      case 5: return <EquipmentStep character={character} updateCharacter={updateCharacter} />;
      case 6: return <DetailsStep character={character} updateCharacter={updateCharacter} />;
      case 7: return <ReviewStep character={character} getModifier={getModifier} updateCharacter={updateCharacter} />;
      default: return null;
    }
  };

  const isDataLoading = races.length === 0 || classes.length === 0 || backgrounds.length === 0;

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-primary gold-glow" />
          <h2 className="text-2xl font-serif font-bold">Генератор персонажа</h2>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={generateRandomCharacter}
            variant="outline"
            className="border-primary/50 gap-2"
            disabled={isGenerating || isDataLoading}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Случайный персонаж
          </Button>
        </div>
      </div>

      {isDataLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Загрузка данных справочника...</span>
        </div>
      ) : (
        <>
          {/* Step Indicator */}
          <Card className="p-4 mb-6 bg-background/50">
            <StepIndicator currentStep={currentStep} onStepClick={goToStep} />
          </Card>

          {/* Step Content */}
          <Card className="p-6 mb-6 min-h-[500px] bg-background/50">
            {renderStep()}
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={generateRandomCharacter}
                disabled={isGenerating}
                className="gap-2"
              >
                <Shuffle className="h-4 w-4" />
                Перегенерировать
              </Button>
              
              {currentStep < 7 ? (
                <Button onClick={nextStep} disabled={!canProceed()}>
                  Далее
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving || !character.name}
                  className="bg-gradient-gold hover:opacity-90"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Сохранить персонажа
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default CharacterGenerator;
