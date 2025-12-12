import { useRaces, Race } from "@/hooks/useRulebook";
import { CharacterData } from "@/hooks/useCharacterCreator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Import race images
const raceIconsContext = import.meta.glob('@/assets/races/*.png', { eager: true, import: 'default' });
const raceIcons: Record<string, string> = {};
Object.entries(raceIconsContext).forEach(([path, module]) => {
  const fileName = path.split('/').pop()?.replace('.png', '') || '';
  raceIcons[fileName] = module as string;
});

interface RaceStepProps {
  character: CharacterData;
  updateCharacter: (updates: Partial<CharacterData>) => void;
}

export function RaceStep({ character, updateCharacter }: RaceStepProps) {
  const { data: races, isLoading } = useRaces();

  const handleRaceSelect = (race: Race) => {
    const raceTraits = race.traits?.map((t: unknown) => {
      if (typeof t === 'string') return t;
      if (typeof t === 'object' && t !== null && 'name' in t) return (t as { name: string }).name;
      return '';
    }).filter(Boolean) || [];

    updateCharacter({
      race: race.name,
      raceId: race.id,
      subrace: null,
      speed: race.speed || 30,
      languages: race.languages || ["Общий"],
      traits: raceTraits,
    });
  };

  const handleSubraceSelect = (subraceName: string) => {
    updateCharacter({ subrace: subraceName });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectedRace = races?.find(r => r.id === character.raceId);
  const subraces = selectedRace?.subraces || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Выберите расу</h2>
        <p className="text-muted-foreground">
          Раса определяет базовые характеристики, способности и культурные особенности вашего персонажа.
        </p>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {races?.map((race) => {
            const isSelected = character.raceId === race.id;
            const iconKey = race.name_en?.toLowerCase().replace(/\s+/g, '-') || '';
            const raceIcon = raceIcons[iconKey];
            
            // Get ability bonuses as string
            const abilityBonuses = race.ability_bonuses 
              ? Object.entries(race.ability_bonuses as Record<string, number>)
                  .map(([ability, bonus]) => `${ability} +${bonus}`)
                  .join(", ")
              : "";

            return (
              <Card
                key={race.id}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50",
                  isSelected && "border-primary ring-2 ring-primary/20"
                )}
                onClick={() => handleRaceSelect(race)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    {raceIcon ? (
                      <img 
                        src={raceIcon} 
                        alt={race.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <span className="text-xl">{race.name[0]}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{race.name}</CardTitle>
                        {isSelected && <Check className="h-5 w-5 text-primary" />}
                      </div>
                      <CardDescription className="text-xs">{race.name_en}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {abilityBonuses && (
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {abilityBonuses}
                    </Badge>
                  )}
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {race.description}
                  </p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      Скорость: {race.speed} фт.
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {race.size}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {/* Subrace selection */}
      {selectedRace && subraces.length > 0 && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold">Выберите подрасу</h3>
          <RadioGroup
            value={character.subrace || ""}
            onValueChange={handleSubraceSelect}
            className="grid md:grid-cols-2 gap-3"
          >
            {subraces.map((subrace: { name: string; ability_bonus?: Record<string, number>; traits?: string[] }) => (
              <Label
                key={subrace.name}
                htmlFor={subrace.name}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                  character.subrace === subrace.name 
                    ? "border-primary bg-primary/10" 
                    : "border-border hover:border-primary/50"
                )}
              >
                <RadioGroupItem value={subrace.name} id={subrace.name} className="mt-1" />
                <div>
                  <div className="font-medium">{subrace.name}</div>
                  {subrace.traits && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {subrace.traits.slice(0, 2).join(", ")}
                    </p>
                  )}
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Selected race summary */}
      {selectedRace && (
        <div className="p-4 bg-primary/10 rounded-lg">
          <h4 className="font-semibold mb-2">Выбрано: {selectedRace.name}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Скорость:</span>
              <p className="font-medium">{selectedRace.speed} фт.</p>
            </div>
            <div>
              <span className="text-muted-foreground">Размер:</span>
              <p className="font-medium">{selectedRace.size}</p>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Языки:</span>
              <p className="font-medium">{selectedRace.languages?.join(", ")}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
