import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Race } from "@/hooks/useRulebook";
import { useState } from "react";

// Import race images
import dwarfImg from "@/assets/races/dwarf.png";
import elfImg from "@/assets/races/elf.png";
import humanImg from "@/assets/races/human.png";
import halflingImg from "@/assets/races/halfling.png";
import gnomeImg from "@/assets/races/gnome.png";
import dragonbornImg from "@/assets/races/dragonborn.png";
import halfElfImg from "@/assets/races/half-elf.png";
import halfOrcImg from "@/assets/races/half-orc.png";
import tieflingImg from "@/assets/races/tiefling.png";

// Import subrace images
import hillDwarfImg from "@/assets/races/subraces/hill-dwarf.png";
import mountainDwarfImg from "@/assets/races/subraces/mountain-dwarf.png";
import highElfImg from "@/assets/races/subraces/high-elf.png";
import woodElfImg from "@/assets/races/subraces/wood-elf.png";
import darkElfImg from "@/assets/races/subraces/dark-elf.png";
import lightfootHalflingImg from "@/assets/races/subraces/lightfoot-halfling.png";
import stoutHalflingImg from "@/assets/races/subraces/stout-halfling.png";
import forestGnomeImg from "@/assets/races/subraces/forest-gnome.png";
import rockGnomeImg from "@/assets/races/subraces/rock-gnome.png";
import blackDragonbornImg from "@/assets/races/subraces/black-dragonborn.png";
import blueDragonbornImg from "@/assets/races/subraces/blue-dragonborn.png";
import brassDragonbornImg from "@/assets/races/subraces/brass-dragonborn.png";
import bronzeDragonbornImg from "@/assets/races/subraces/bronze-dragonborn.png";
import copperDragonbornImg from "@/assets/races/subraces/copper-dragonborn.png";
import goldDragonbornImg from "@/assets/races/subraces/gold-dragonborn.png";
import greenDragonbornImg from "@/assets/races/subraces/green-dragonborn.png";
import redDragonbornImg from "@/assets/races/subraces/red-dragonborn.png";
import silverDragonbornImg from "@/assets/races/subraces/silver-dragonborn.png";
import whiteDragonbornImg from "@/assets/races/subraces/white-dragonborn.png";

const raceImages: Record<string, string> = {
  "Dwarf": dwarfImg,
  "Elf": elfImg,
  "Human": humanImg,
  "Halfling": halflingImg,
  "Gnome": gnomeImg,
  "Dragonborn": dragonbornImg,
  "Half-Elf": halfElfImg,
  "Half-Orc": halfOrcImg,
  "Tiefling": tieflingImg,
};

const subraceImages: Record<string, string> = {
  // Dwarves
  "Холмовой дварф": hillDwarfImg,
  "Горный дварф": mountainDwarfImg,
  // Elves
  "Высший эльф": highElfImg,
  "Лесной эльф": woodElfImg,
  "Тёмный эльф (Дроу)": darkElfImg,
  // Halflings
  "Легконогий полурослик": lightfootHalflingImg,
  "Коренастый полурослик": stoutHalflingImg,
  // Gnomes
  "Лесной гном": forestGnomeImg,
  "Скальный гном": rockGnomeImg,
  // Dragonborn
  "Чёрный дракон": blackDragonbornImg,
  "Синий дракон": blueDragonbornImg,
  "Латунный дракон": brassDragonbornImg,
  "Бронзовый дракон": bronzeDragonbornImg,
  "Медный дракон": copperDragonbornImg,
  "Золотой дракон": goldDragonbornImg,
  "Зелёный дракон": greenDragonbornImg,
  "Красный дракон": redDragonbornImg,
  "Серебряный дракон": silverDragonbornImg,
  "Белый дракон": whiteDragonbornImg,
};

const abilityNames: Record<string, string> = {
  strength: "Сила",
  dexterity: "Ловкость",
  constitution: "Телосложение",
  intelligence: "Интеллект",
  wisdom: "Мудрость",
  charisma: "Харизма",
  "Сила": "Сила",
  "Ловкость": "Ловкость",
  "Телосложение": "Телосложение",
  "Интеллект": "Интеллект",
  "Мудрость": "Мудрость",
  "Харизма": "Харизма",
};

interface RaceDetailModalProps {
  race: Race | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RaceDetailModal({ race, open, onOpenChange }: RaceDetailModalProps) {
  const [selectedSubrace, setSelectedSubrace] = useState<string | null>(null);

  if (!race) return null;

  const raceImage = race.name_en ? raceImages[race.name_en] : null;
  const currentSubrace = race.subraces?.find(s => s.name === selectedSubrace);
  const displayedImage = selectedSubrace && currentSubrace 
    ? subraceImages[currentSubrace.name] || raceImage 
    : raceImage;

  const bonuses = Object.entries(race.ability_bonuses || {})
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => `${abilityNames[key] || key} +${value}`)
    .join(", ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* Image Section */}
          <div className="relative w-full md:w-2/5 h-64 md:h-auto bg-gradient-to-b from-background to-muted">
            {displayedImage && (
              <img 
                src={displayedImage} 
                alt={selectedSubrace || race.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl font-bold text-foreground">
                {selectedSubrace || race.name}
              </h2>
              {!selectedSubrace && race.name_en && (
                <p className="text-sm text-muted-foreground">{race.name_en}</p>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col">
            <DialogHeader className="p-4 pb-2 border-b">
              <DialogTitle className="sr-only">{race.name}</DialogTitle>
              {selectedSubrace && (
                <button 
                  onClick={() => setSelectedSubrace(null)}
                  className="text-sm text-primary hover:underline text-left"
                >
                  ← Назад к {race.name}
                </button>
              )}
            </DialogHeader>

            <ScrollArea className="flex-1 overflow-auto">
              <div className="p-4">
              {!selectedSubrace ? (
                // Main race view
                <div className="space-y-4 pb-4">
                  <p className="text-muted-foreground">{race.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <span className="text-xs text-muted-foreground block">Скорость</span>
                      <span className="text-lg font-semibold">{race.speed} фт.</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <span className="text-xs text-muted-foreground block">Размер</span>
                      <span className="text-lg font-semibold">{race.size}</span>
                    </div>
                  </div>

                  {bonuses && (
                    <div className="bg-primary/10 rounded-lg p-3">
                      <span className="text-xs text-muted-foreground block mb-1">Бонусы характеристик</span>
                      <span className="font-semibold text-primary">{bonuses}</span>
                    </div>
                  )}

                  {race.languages && race.languages.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Языки</h4>
                      <div className="flex flex-wrap gap-1">
                        {race.languages.map((lang) => (
                          <Badge key={lang} variant="outline">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {race.traits && race.traits.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Особенности</h4>
                      <ul className="space-y-1">
                        {race.traits.map((trait, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-primary mt-1">•</span>
                            <span className="text-muted-foreground">{trait}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {race.subraces && race.subraces.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Подрасы</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {race.subraces.map((subrace, i) => {
                          const subraceImg = subraceImages[subrace.name];
                          return (
                            <button
                              key={i}
                              onClick={() => setSelectedSubrace(subrace.name)}
                              className="relative group rounded-lg overflow-hidden border border-border hover:border-primary transition-colors text-left"
                            >
                              {subraceImg ? (
                                <div className="h-24 overflow-hidden">
                                  <img 
                                    src={subraceImg} 
                                    alt={subrace.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                                </div>
                              ) : (
                                <div className="h-24 bg-muted" />
                              )}
                              <div className="absolute bottom-0 left-0 right-0 p-2">
                                <p className="font-medium text-sm">{subrace.name}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Subrace view
                <div className="space-y-4">
                  {currentSubrace?.ability_bonus && Object.keys(currentSubrace.ability_bonus).length > 0 && (
                    <div className="bg-primary/10 rounded-lg p-3">
                      <span className="text-xs text-muted-foreground block mb-1">Дополнительные бонусы</span>
                      <span className="font-semibold text-primary">
                        {Object.entries(currentSubrace.ability_bonus)
                          .map(([key, value]) => `${abilityNames[key] || key} +${value}`)
                          .join(", ")}
                      </span>
                    </div>
                  )}

                  {currentSubrace?.traits && currentSubrace.traits.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Особенности подрасы</h4>
                      <ul className="space-y-2">
                        {currentSubrace.traits.map((trait, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-primary mt-1">•</span>
                            <span className="text-muted-foreground">{trait}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
