import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spell } from "@/hooks/useRulebook";
import { BookOpen } from "lucide-react";

// Import spell school icons
import evocationIcon from "@/assets/spells/evocation.png";
import conjurationIcon from "@/assets/spells/conjuration.png";
import illusionIcon from "@/assets/spells/illusion.png";
import necromancyIcon from "@/assets/spells/necromancy.png";
import abjurationIcon from "@/assets/spells/abjuration.png";
import enchantmentIcon from "@/assets/spells/enchantment.png";
import transmutationIcon from "@/assets/spells/transmutation.png";
import divinationIcon from "@/assets/spells/divination.png";

const schoolIcons: Record<string, string> = {
  Воплощение: evocationIcon,
  Вызов: conjurationIcon,
  Иллюзия: illusionIcon,
  Некромантия: necromancyIcon,
  Ограждение: abjurationIcon,
  Очарование: enchantmentIcon,
  Преобразование: transmutationIcon,
  Прорицание: divinationIcon,
  Проявление: evocationIcon,
};

const schoolColors: Record<string, string> = {
  Воплощение: "bg-red-500/20 text-red-400 border-red-500/30",
  Вызов: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Иллюзия: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Некромантия: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  Ограждение: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Очарование: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Преобразование: "bg-green-500/20 text-green-400 border-green-500/30",
  Прорицание: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Проявление: "bg-red-500/20 text-red-400 border-red-500/30",
};

const schoolGradients: Record<string, string> = {
  Воплощение: "from-red-500/10 via-transparent to-transparent",
  Вызов: "from-yellow-500/10 via-transparent to-transparent",
  Иллюзия: "from-purple-500/10 via-transparent to-transparent",
  Некромантия: "from-gray-500/10 via-transparent to-transparent",
  Ограждение: "from-blue-500/10 via-transparent to-transparent",
  Очарование: "from-pink-500/10 via-transparent to-transparent",
  Преобразование: "from-green-500/10 via-transparent to-transparent",
  Прорицание: "from-cyan-500/10 via-transparent to-transparent",
  Проявление: "from-red-500/10 via-transparent to-transparent",
};

interface SpellCardProps {
  spell: Spell;
  onClick?: () => void;
}

export function SpellCard({ spell, onClick }: SpellCardProps) {
  const levelText = spell.level === 0 ? "Заговор" : `${spell.level} ур.`;
  const schoolIcon = schoolIcons[spell.school];
  const gradient = schoolGradients[spell.school] || "";

  return (
    <Card 
      className={`h-full cursor-pointer transition-all hover:shadow-lg hover:border-primary/30 group overflow-hidden bg-gradient-to-br ${gradient}`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex gap-3">
          {/* Icon */}
          <div className="w-12 h-12 rounded-lg overflow-hidden shadow-md border border-border/50 flex-shrink-0 group-hover:scale-105 transition-transform">
            {schoolIcon ? (
              <img 
                src={schoolIcon} 
                alt={spell.school}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>
          
          {/* Title */}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base group-hover:text-primary transition-colors line-clamp-1">
              {spell.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground line-clamp-1">{spell.name_en}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {levelText}
              </Badge>
              <Badge className={`text-xs px-1.5 py-0 ${schoolColors[spell.school] || "bg-muted"}`}>
                {spell.school}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {spell.description}
        </p>
        
        <div className="flex gap-1 mt-2">
          {spell.ritual && (
            <Badge variant="outline" className="text-xs px-1.5 py-0 border-amber-500/50 text-amber-400">
              Р
            </Badge>
          )}
          {spell.concentration && (
            <Badge variant="outline" className="text-xs px-1.5 py-0 border-purple-500/50 text-purple-400">
              К
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
