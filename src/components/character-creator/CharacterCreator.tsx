import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCharacterCreator } from "@/hooks/useCharacterCreator";
import { StepIndicator } from "./StepIndicator";
import { RaceStep } from "./steps/RaceStep";
import { ClassStep } from "./steps/ClassStep";
import { AbilitiesStep } from "./steps/AbilitiesStep";
import { BackgroundStep } from "./steps/BackgroundStep";
import { SpellsStep } from "./steps/SpellsStep";
import { EquipmentStep } from "./steps/EquipmentStep";
import { DetailsStep } from "./steps/DetailsStep";
import { ReviewStep } from "./steps/ReviewStep";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Save, Home, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function CharacterCreator() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const {
    currentStep,
    character,
    updateCharacter,
    nextStep,
    prevStep,
    goToStep,
    getModifier,
    calculateHP,
  } = useCharacterCreator();

  // Get spell limits for validation
  const getSpellLimits = () => {
    switch (character.class) {
      case "Волшебник": return { cantrips: 3, known: 6 };
      case "Чародей": return { cantrips: 4, known: 2 };
      case "Бард": return { cantrips: 2, known: 4 };
      case "Колдун": return { cantrips: 2, known: 2 };
      case "Жрец":
      case "Друид": return { cantrips: 3, known: 0 }; // Prepared casters - no known spells needed
      case "Паладин":
      case "Следопыт": return { cantrips: 0, known: 0 }; // No spells at level 1
      default: return { cantrips: 0, known: 0 };
    }
  };

  // Check if abilities are properly distributed
  const areAbilitiesValid = () => {
    const abilities = [character.strength, character.dexterity, character.constitution, 
                      character.intelligence, character.wisdom, character.charisma];
    
    if (character.abilityMethod === "standard") {
      // All values should be from standard array and all assigned
      const standardArray = [15, 14, 13, 12, 10, 8];
      const sortedAbilities = [...abilities].sort((a, b) => b - a);
      return JSON.stringify(sortedAbilities) === JSON.stringify(standardArray);
    } else if (character.abilityMethod === "pointbuy") {
      // Points should be fully spent (27 points)
      const pointCosts: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
      const spent = abilities.reduce((sum, val) => sum + (pointCosts[val] || 0), 0);
      return spent === 27;
    } else {
      // Manual - just check all are between 1-20
      return abilities.every(a => a >= 1 && a <= 20);
    }
  };

  // Check if background personality is filled
  const isBackgroundValid = () => {
    return !!character.backgroundId && 
           !!character.personality_trait && 
           !!character.ideal && 
           !!character.bond && 
           !!character.flaw;
  };

  // Check if all required spells are selected
  const areSpellsValid = () => {
    const limits = getSpellLimits();
    if (limits.cantrips === 0 && limits.known === 0) return true;
    
    // Count selected cantrips and spells
    const selectedCount = character.known_spells.length;
    const requiredTotal = limits.cantrips + limits.known;
    
    return selectedCount >= requiredTotal;
  };

  // Check if equipment is selected
  const isEquipmentValid = () => {
    // User explicitly chose "no equipment"
    if (character.equipment.includes("__NO_EQUIPMENT__")) return true;
    
    // Check if equipment array has valid items (not just background items)
    const validEquipment = character.equipment.filter(e => e !== "__NO_EQUIPMENT__");
    return validEquipment.length > 0;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!character.raceId;
      case 1: return !!character.classId;
      case 2: return areAbilitiesValid();
      case 3: return isBackgroundValid();
      case 4: return areSpellsValid();
      case 5: return isEquipmentValid();
      case 6: return !!character.name && !!character.gender;
      case 7: return true; // Review
      default: return true;
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Необходимо войти в систему для сохранения персонажа");
        navigate("/auth");
        return;
      }

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
        equipment: character.equipment.filter(e => e !== "__NO_EQUIPMENT__"),
        traits: character.traits,
        known_spells: character.known_spells,
        personality_trait: character.personality_trait,
        ideal: character.ideal,
        bond: character.bond,
        flaw: character.flaw,
        backstory: character.backstory,
      });

      if (error) throw error;

      toast.success("Персонаж сохранён!");
      navigate("/characters");
    } catch (error) {
      console.error("Error saving character:", error);
      toast.error("Ошибка при сохранении персонажа");
    } finally {
      setIsSaving(false);
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
      case 7: return <ReviewStep character={character} getModifier={getModifier} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" asChild>
            <Link to="/characters">
              <Home className="h-4 w-4 mr-2" />
              Назад
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Создание персонажа</h1>
          <div className="w-24" />
        </div>

        {/* Step Indicator */}
        <Card className="p-4 mb-6">
          <StepIndicator currentStep={currentStep} onStepClick={goToStep} />
        </Card>

        {/* Step Content */}
        <Card className="p-6 mb-6 min-h-[500px]">
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

          {currentStep < 7 ? (
            <Button onClick={nextStep} disabled={!canProceed()}>
              Далее
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={isSaving || !character.name}>
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
    </div>
  );
}
