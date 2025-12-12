import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCharacterCreator } from "@/hooks/useCharacterCreator";
import { StepIndicator } from "./StepIndicator";
import { RaceStep } from "./steps/RaceStep";
import { ClassStep } from "./steps/ClassStep";
import { AbilitiesStep } from "./steps/AbilitiesStep";
import { BackgroundStep } from "./steps/BackgroundStep";
import { SpellsStep } from "./steps/SpellsStep";
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

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!character.raceId;
      case 1: return !!character.classId;
      case 2: return true;
      case 3: return !!character.backgroundId;
      case 4: return true;
      case 5: return !!character.name;
      case 6: return true;
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
        equipment: character.equipment,
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
      case 5: return <DetailsStep character={character} updateCharacter={updateCharacter} />;
      case 6: return <ReviewStep character={character} getModifier={getModifier} />;
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

          {currentStep < 6 ? (
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
