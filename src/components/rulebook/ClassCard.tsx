import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

const classIcons: Record<string, React.ReactNode> = {
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

interface ClassCardProps {
  characterClass: CharacterClass;
  onClick?: () => void;
}

export function ClassCard({ characterClass, onClick }: ClassCardProps) {
  const classImage = characterClass.name_en ? classImages[characterClass.name_en] : null;

  return (
    <Card 
      className="h-full overflow-hidden group hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer"
      onClick={onClick}
    >
      {classImage && (
        <div className="h-56 overflow-hidden relative">
          <img 
            src={classImage} 
            alt={characterClass.name}
            className="w-full h-full object-cover object-[center_25%] group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
          <div className="absolute top-3 right-3">
            <div className="h-10 w-10 rounded-lg bg-background/80 backdrop-blur flex items-center justify-center text-primary">
              {classIcons[characterClass.name] || <Sword className="h-5 w-5" />}
            </div>
          </div>
        </div>
      )}

      <CardHeader className={classImage ? "pt-3 pb-2" : "pb-2"}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{characterClass.name}</CardTitle>
          <Badge variant="secondary" className="text-xs">{characterClass.name_en}</Badge>
        </div>
        <CardDescription className="text-xs line-clamp-2">{characterClass.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Кость хитов:</span>{" "}
            <span className="font-medium">d{characterClass.hit_die}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Основная:</span>{" "}
            <span className="font-medium text-xs">{characterClass.primary_ability}</span>
          </div>
        </div>

        {characterClass.saving_throws && characterClass.saving_throws.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {characterClass.saving_throws.map((st) => (
              <Badge key={st} variant="outline" className="text-[10px]">
                {st}
              </Badge>
            ))}
          </div>
        )}

        {characterClass.spellcasting && (
          <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
            Заклинатель
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
