import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CharacterClass } from "@/hooks/useRulebook";
import { Axe, Music, Cross, Leaf, Sword, Hand, Sun, Trees, Skull, Flame, Moon, BookOpen } from "lucide-react";

// Import class images
import barbarianImg from "@/assets/classes/barbarian.png";
import bardImg from "@/assets/classes/bard.png";
import clericImg from "@/assets/classes/cleric.png";
import druidImg from "@/assets/classes/druid.png";
import fighterImg from "@/assets/classes/fighter.png";
import monkImg from "@/assets/classes/monk.png";
import paladinImg from "@/assets/classes/paladin.png";
import rangerImg from "@/assets/classes/ranger.png";
import rogueImg from "@/assets/classes/rogue.png";
import sorcererImg from "@/assets/classes/sorcerer.png";
import warlockImg from "@/assets/classes/warlock.png";
import wizardImg from "@/assets/classes/wizard.png";

const classImages: Record<string, string> = {
  "Barbarian": barbarianImg,
  "Bard": bardImg,
  "Cleric": clericImg,
  "Druid": druidImg,
  "Fighter": fighterImg,
  "Monk": monkImg,
  "Paladin": paladinImg,
  "Ranger": rangerImg,
  "Rogue": rogueImg,
  "Sorcerer": sorcererImg,
  "Warlock": warlockImg,
  "Wizard": wizardImg,
};

export const classIcons: Record<string, React.ReactNode> = {
  Варвар: <Axe className="h-5 w-5" />,
  Бард: <Music className="h-5 w-5" />,
  Жрец: <Cross className="h-5 w-5" />,
  Друид: <Leaf className="h-5 w-5" />,
  Воин: <Sword className="h-5 w-5" />,
  Монах: <Hand className="h-5 w-5" />,
  Паладин: <Sun className="h-5 w-5" />,
  Следопыт: <Trees className="h-5 w-5" />,
  Плут: <Skull className="h-5 w-5" />,
  Чародей: <Flame className="h-5 w-5" />,
  Колдун: <Moon className="h-5 w-5" />,
  Волшебник: <BookOpen className="h-5 w-5" />,
};

interface ClassDetailModalProps {
  characterClass: CharacterClass | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClassDetailModal({ characterClass, open, onOpenChange }: ClassDetailModalProps) {
  if (!characterClass) return null;

  const classImage = characterClass.name_en ? classImages[characterClass.name_en] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* Image Section */}
          <div className="relative w-full md:w-2/5 h-64 md:h-auto bg-gradient-to-b from-background to-muted">
            {classImage && (
              <img 
                src={classImage} 
                alt={characterClass.name}
                className="w-full h-full object-cover object-[center_25%] transition-all duration-300"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-8 w-8 rounded-lg bg-primary/20 backdrop-blur flex items-center justify-center text-primary">
                  {classIcons[characterClass.name] || <Sword className="h-4 w-4" />}
                </div>
                <h2 className="text-2xl font-bold text-foreground">{characterClass.name}</h2>
              </div>
              {characterClass.name_en && (
                <p className="text-sm text-muted-foreground">{characterClass.name_en}</p>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <DialogHeader className="p-4 pb-2 border-b">
              <DialogTitle className="sr-only">{characterClass.name}</DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">d{characterClass.hit_die}</Badge>
                {characterClass.spellcasting && (
                  <Badge className="bg-purple-500/20 text-purple-400">Заклинатель</Badge>
                )}
              </div>
            </DialogHeader>

            <ScrollArea className="flex-1 overflow-auto">
              <div className="p-4 space-y-4 pb-4">
                <p className="text-muted-foreground">{characterClass.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <span className="text-xs text-muted-foreground block">Кость хитов</span>
                    <span className="text-lg font-semibold">d{characterClass.hit_die}</span>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <span className="text-xs text-muted-foreground block">Основная характеристика</span>
                    <span className="text-sm font-semibold">{characterClass.primary_ability || "—"}</span>
                  </div>
                </div>

                {characterClass.saving_throws && characterClass.saving_throws.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Спасброски</h4>
                    <div className="flex flex-wrap gap-1">
                      {characterClass.saving_throws.map((st) => (
                        <Badge key={st} variant="outline">{st}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {characterClass.armor_proficiencies && characterClass.armor_proficiencies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Владение доспехами</h4>
                    <p className="text-sm text-muted-foreground">
                      {characterClass.armor_proficiencies.join(", ")}
                    </p>
                  </div>
                )}

                {characterClass.weapon_proficiencies && characterClass.weapon_proficiencies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Владение оружием</h4>
                    <p className="text-sm text-muted-foreground">
                      {characterClass.weapon_proficiencies.join(", ")}
                    </p>
                  </div>
                )}

                {characterClass.features && characterClass.features.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Умения класса</h4>
                    <div className="space-y-3">
                      {characterClass.features.map((feature, i) => (
                        <div key={i} className="border-l-2 border-primary/30 pl-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              Ур. {feature.level}
                            </Badge>
                            <p className="font-medium text-sm">{feature.name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{feature.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {characterClass.spellcasting && (
                  <div className="bg-purple-500/10 rounded-lg p-4">
                    <h4 className="text-sm font-semibold mb-2 text-purple-400">Заклинательство</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {(characterClass.spellcasting as { ability?: string }).ability && (
                        <p><span className="font-medium">Базовая характеристика:</span> {(characterClass.spellcasting as { ability?: string }).ability}</p>
                      )}
                      {(characterClass.spellcasting as { cantrips_known?: number }).cantrips_known && (
                        <p><span className="font-medium">Заговоров на 1 уровне:</span> {(characterClass.spellcasting as { cantrips_known?: number }).cantrips_known}</p>
                      )}
                      {(characterClass.spellcasting as { spells_known?: number }).spells_known && (
                        <p><span className="font-medium">Заклинаний на 1 уровне:</span> {(characterClass.spellcasting as { spells_known?: number }).spells_known}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
