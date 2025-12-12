import { useClasses, CharacterClass } from "@/hooks/useRulebook";
import { CharacterData } from "@/hooks/useCharacterCreator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Check, Sword, Shield, Wand2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

// Import class images
const classIconsContext = import.meta.glob('@/assets/classes/*.png', { eager: true, import: 'default' });
const classIcons: Record<string, string> = {};
Object.entries(classIconsContext).forEach(([path, module]) => {
  const fileName = path.split('/').pop()?.replace('.png', '') || '';
  classIcons[fileName] = module as string;
});

interface ClassStepProps {
  character: CharacterData;
  updateCharacter: (updates: Partial<CharacterData>) => void;
  calculateHP: (hitDie: number, constitution: number, level: number) => number;
}

export function ClassStep({ character, updateCharacter, calculateHP }: ClassStepProps) {
  const { data: classes, isLoading } = useClasses();

  const handleClassSelect = (cls: CharacterClass) => {
    const hp = calculateHP(cls.hit_die, character.constitution, character.level);
    
    updateCharacter({
      class: cls.name,
      classId: cls.id,
      hp: hp,
      max_hp: hp,
      saving_throw_proficiencies: cls.saving_throws || [],
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectedClass = classes?.find(c => c.id === character.classId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Выберите класс</h2>
        <p className="text-muted-foreground">
          Класс определяет ваши боевые способности, заклинания и роль в группе.
        </p>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes?.map((cls) => {
            const isSelected = character.classId === cls.id;
            const iconKey = cls.name_en?.toLowerCase().replace(/\s+/g, '-') || '';
            const classIcon = classIcons[iconKey];
            const hasSpellcasting = cls.spellcasting !== null;

            return (
              <Card
                key={cls.id}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50",
                  isSelected && "border-primary ring-2 ring-primary/20"
                )}
                onClick={() => handleClassSelect(cls)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    {classIcon ? (
                      <img 
                        src={classIcon} 
                        alt={cls.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <Sword className="h-6 w-6" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{cls.name}</CardTitle>
                        {isSelected && <Check className="h-5 w-5 text-primary" />}
                      </div>
                      <CardDescription className="text-xs">{cls.name_en}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {cls.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      <Heart className="h-3 w-3 mr-1" />
                      к{cls.hit_die}
                    </Badge>
                    {cls.primary_ability && (
                      <Badge variant="outline" className="text-xs">
                        {cls.primary_ability}
                      </Badge>
                    )}
                    {hasSpellcasting && (
                      <Badge variant="default" className="text-xs">
                        <Wand2 className="h-3 w-3 mr-1" />
                        Магия
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      {/* Selected class details */}
      {selectedClass && (
        <div className="p-4 bg-primary/10 rounded-lg space-y-4">
          <h4 className="font-semibold">Выбрано: {selectedClass.name}</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Кость хитов:</span>
              <p className="font-medium">к{selectedClass.hit_die}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Основная:</span>
              <p className="font-medium">{selectedClass.primary_ability || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Спасброски:</span>
              <p className="font-medium">{selectedClass.saving_throws?.join(", ") || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">HP на 1 ур.:</span>
              <p className="font-medium">{character.max_hp}</p>
            </div>
          </div>

          {selectedClass.armor_proficiencies && selectedClass.armor_proficiencies.length > 0 && (
            <div>
              <span className="text-sm text-muted-foreground">Владение доспехами:</span>
              <div className="flex gap-1 flex-wrap mt-1">
                {selectedClass.armor_proficiencies.map((armor) => (
                  <Badge key={armor} variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    {armor}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {selectedClass.weapon_proficiencies && selectedClass.weapon_proficiencies.length > 0 && (
            <div>
              <span className="text-sm text-muted-foreground">Владение оружием:</span>
              <div className="flex gap-1 flex-wrap mt-1">
                {selectedClass.weapon_proficiencies.map((weapon) => (
                  <Badge key={weapon} variant="outline" className="text-xs">
                    <Sword className="h-3 w-3 mr-1" />
                    {weapon}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
