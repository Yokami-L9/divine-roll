import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Race } from "@/hooks/useRulebook";

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

export function RaceCard({ race }: { race: Race }) {
  const bonuses = Object.entries(race.ability_bonuses || {})
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => `${abilityNames[key] || key} +${value}`)
    .join(", ");

  const raceImage = race.name_en ? raceImages[race.name_en] : null;

  return (
    <Card className="h-full overflow-hidden group hover:shadow-lg transition-shadow">
      {raceImage && (
        <div className="h-48 overflow-hidden relative">
          <img 
            src={raceImage} 
            alt={race.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
        </div>
      )}

      <CardHeader className={raceImage ? "pt-3 pb-2" : "pb-2"}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{race.name}</CardTitle>
          <Badge variant="secondary" className="text-xs">{race.name_en}</Badge>
        </div>
        <CardDescription className="text-xs line-clamp-2">{race.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Скорость:</span>{" "}
            <span className="font-medium">{race.speed} фт.</span>
          </div>
          <div>
            <span className="text-muted-foreground">Размер:</span>{" "}
            <span className="font-medium">{race.size}</span>
          </div>
        </div>

        {bonuses && (
          <div>
            <span className="text-xs text-muted-foreground">Бонусы:</span>
            <p className="font-medium text-xs">{bonuses}</p>
          </div>
        )}

        {race.languages && race.languages.length > 0 && (
          <div>
            <span className="text-xs text-muted-foreground">Языки:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {race.languages.map((lang) => (
                <Badge key={lang} variant="outline" className="text-[10px] px-1.5 py-0">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {race.traits && race.traits.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="traits" className="border-none">
              <AccordionTrigger className="py-1.5 text-xs hover:no-underline">
                Особенности ({race.traits.length})
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-0.5 text-xs">
                  {race.traits.map((trait, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-primary">•</span>
                      <span className="text-muted-foreground">{trait}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {race.subraces && race.subraces.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="subraces" className="border-none">
              <AccordionTrigger className="py-1.5 text-xs hover:no-underline">
                Подрасы ({race.subraces.length})
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                {race.subraces.map((subrace, i) => (
                  <div 
                    key={i} 
                    className="border-l-2 border-primary/30 pl-2 py-1 hover:bg-accent/50 rounded-r transition-colors"
                  >
                    <p className="font-medium text-xs">{subrace.name}</p>
                    {subrace.ability_bonus && Object.keys(subrace.ability_bonus).length > 0 && (
                      <p className="text-[10px] text-muted-foreground">
                        {Object.entries(subrace.ability_bonus)
                          .map(([key, value]) => `${abilityNames[key] || key} +${value}`)
                          .join(", ")}
                      </p>
                    )}
                    {subrace.traits && subrace.traits.length > 0 && (
                      <ul className="text-[10px] mt-0.5 space-y-0">
                        {subrace.traits.slice(0, 2).map((trait, j) => (
                          <li key={j} className="text-muted-foreground truncate">• {trait}</li>
                        ))}
                        {subrace.traits.length > 2 && (
                          <li className="text-muted-foreground">...ещё {subrace.traits.length - 2}</li>
                        )}
                      </ul>
                    )}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
