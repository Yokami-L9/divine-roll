import { useBackgrounds } from "@/hooks/useRulebook";
import { CharacterData, ALIGNMENTS } from "@/hooks/useCharacterCreator";
import { InventoryItem } from "@/types/inventory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Check, BookOpen } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface BackgroundStepProps {
  character: CharacterData;
  updateCharacter: (updates: Partial<CharacterData>) => void;
}

export function BackgroundStep({ character, updateCharacter }: BackgroundStepProps) {
  const { data: backgrounds, isLoading } = useBackgrounds();

  const handleBackgroundSelect = (bg: { id: string; name: string; skill_proficiencies?: string[] | null; equipment?: string[] | null; personality_traits?: string[] | null; ideals?: string[] | null; bonds?: string[] | null; flaws?: string[] | null }) => {
    // Add background skill proficiencies to character
    const newSkills = [
      ...character.skill_proficiencies.filter(s => !backgrounds?.find(b => b.skill_proficiencies?.includes(s))),
      ...(bg.skill_proficiencies || []),
    ];

    updateCharacter({
      background: bg.name,
      backgroundId: bg.id,
      skill_proficiencies: newSkills,
      equipment: [
        ...character.equipment, 
        ...(bg.equipment || []).map((name: string): InventoryItem => ({ name, quantity: 1, weight: 0 }))
      ],
    });

    // Auto-fill personality if not set
    if (!character.personality_trait && bg.personality_traits?.length) {
      const randomTrait = bg.personality_traits[Math.floor(Math.random() * bg.personality_traits.length)];
      updateCharacter({ personality_trait: randomTrait });
    }
    if (!character.ideal && bg.ideals?.length) {
      const randomIdeal = bg.ideals[Math.floor(Math.random() * bg.ideals.length)];
      updateCharacter({ ideal: randomIdeal });
    }
    if (!character.bond && bg.bonds?.length) {
      const randomBond = bg.bonds[Math.floor(Math.random() * bg.bonds.length)];
      updateCharacter({ bond: randomBond });
    }
    if (!character.flaw && bg.flaws?.length) {
      const randomFlaw = bg.flaws[Math.floor(Math.random() * bg.flaws.length)];
      updateCharacter({ flaw: randomFlaw });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectedBackground = backgrounds?.find(b => b.id === character.backgroundId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Предыстория</h2>
        <p className="text-muted-foreground">
          Предыстория определяет навыки, снаряжение и особенности характера персонажа.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Background selection */}
        <div className="space-y-4">
          <h3 className="font-semibold">Выберите предысторию</h3>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {backgrounds?.map((bg) => {
                const isSelected = character.backgroundId === bg.id;
                
                return (
                  <Card
                    key={bg.id}
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary/50",
                      isSelected && "border-primary ring-2 ring-primary/20"
                    )}
                    onClick={() => handleBackgroundSelect(bg)}
                  >
                    <CardHeader className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{bg.name}</CardTitle>
                            <CardDescription className="text-xs">{bg.name_en}</CardDescription>
                          </div>
                        </div>
                        {isSelected && <Check className="h-5 w-5 text-primary" />}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 pb-3">
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {bg.description}
                      </p>
                      {bg.skill_proficiencies && (
                        <div className="flex gap-1 flex-wrap">
                          {bg.skill_proficiencies.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Personality & Details */}
        <div className="space-y-4">
          <h3 className="font-semibold">Характер и мировоззрение</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Мировоззрение</Label>
              <Select
                value={character.alignment}
                onValueChange={(value) => updateCharacter({ alignment: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALIGNMENTS.map((alignment) => (
                    <SelectItem key={alignment} value={alignment}>
                      {alignment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Черта характера</Label>
              <Textarea
                value={character.personality_trait}
                onChange={(e) => updateCharacter({ personality_trait: e.target.value })}
                placeholder="Опишите черту характера..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Идеал</Label>
              <Textarea
                value={character.ideal}
                onChange={(e) => updateCharacter({ ideal: e.target.value })}
                placeholder="К чему стремится персонаж..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Привязанность</Label>
              <Textarea
                value={character.bond}
                onChange={(e) => updateCharacter({ bond: e.target.value })}
                placeholder="Что связывает персонажа с миром..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Слабость</Label>
              <Textarea
                value={character.flaw}
                onChange={(e) => updateCharacter({ flaw: e.target.value })}
                placeholder="Недостаток или слабость персонажа..."
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Selected background details */}
      {selectedBackground && (
        <div className="p-4 bg-primary/10 rounded-lg">
          <h4 className="font-semibold mb-2">{selectedBackground.name}</h4>
          {selectedBackground.feature_name && (
            <div className="mb-2">
              <span className="text-sm font-medium">{selectedBackground.feature_name}:</span>
              <p className="text-sm text-muted-foreground">{selectedBackground.feature_description}</p>
            </div>
          )}
          {selectedBackground.equipment && selectedBackground.equipment.length > 0 && (
            <div>
              <span className="text-sm font-medium">Снаряжение:</span>
              <p className="text-sm text-muted-foreground">{selectedBackground.equipment.join(", ")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
