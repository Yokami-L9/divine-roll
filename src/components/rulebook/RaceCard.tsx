import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface RaceCardProps {
  race: Race;
  onClick?: () => void;
}

export function RaceCard({ race, onClick }: RaceCardProps) {
  const bonuses = Object.entries(race.ability_bonuses || {})
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => `${abilityNames[key] || key} +${value}`)
    .join(", ");

  const raceImage = race.name_en ? raceImages[race.name_en] : null;

  return (
    <Card 
      className="h-full overflow-hidden group hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer"
      onClick={onClick}
    >
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
            <p className="font-medium text-xs text-primary">{bonuses}</p>
          </div>
        )}

        {race.subraces && race.subraces.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Подрасы:</span>
            <Badge variant="outline" className="text-[10px]">
              {race.subraces.length}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
