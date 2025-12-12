import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spell } from "@/hooks/useRulebook";
import { Clock, Target, Timer, Sparkles, BookOpen, Zap } from "lucide-react";

// Import spell school icons
import evocationIcon from "@/assets/spells/evocation.png";
import conjurationIcon from "@/assets/spells/conjuration.png";
import illusionIcon from "@/assets/spells/illusion.png";
import necromancyIcon from "@/assets/spells/necromancy.png";
import abjurationIcon from "@/assets/spells/abjuration.png";
import enchantmentIcon from "@/assets/spells/enchantment.png";
import transmutationIcon from "@/assets/spells/transmutation.png";
import divinationIcon from "@/assets/spells/divination.png";

export const schoolIcons: Record<string, string> = {
  Воплощение: evocationIcon,
  Вызов: conjurationIcon,
  Иллюзия: illusionIcon,
  Некромантия: necromancyIcon,
  Ограждение: abjurationIcon,
  Очарование: enchantmentIcon,
  Преобразование: transmutationIcon,
  Прорицание: divinationIcon,
  Проявление: evocationIcon, // fallback
};

export const schoolColors: Record<string, string> = {
  Воплощение: "from-red-500/30 to-orange-500/10",
  Вызов: "from-yellow-500/30 to-amber-500/10",
  Иллюзия: "from-purple-500/30 to-violet-500/10",
  Некромантия: "from-gray-500/30 to-green-900/10",
  Ограждение: "from-blue-500/30 to-cyan-500/10",
  Очарование: "from-pink-500/30 to-rose-500/10",
  Преобразование: "from-green-500/30 to-emerald-500/10",
  Прорицание: "from-cyan-500/30 to-teal-500/10",
  Проявление: "from-red-500/30 to-orange-500/10",
};

export const schoolBadgeColors: Record<string, string> = {
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

interface SpellDetailModalProps {
  spell: Spell | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SpellDetailModal({ spell, open, onOpenChange }: SpellDetailModalProps) {
  if (!spell) return null;

  const levelText = spell.level === 0 ? "Заговор" : `${spell.level} уровень`;
  const schoolIcon = schoolIcons[spell.school];
  const gradientColor = schoolColors[spell.school] || "from-primary/30 to-transparent";
  const badgeColor = schoolBadgeColors[spell.school] || "bg-muted";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header with Icon */}
          <div className={`relative bg-gradient-to-br ${gradientColor} p-6`}>
            <div className="flex gap-4">
              {/* School Icon */}
              <div className="w-20 h-20 rounded-lg overflow-hidden shadow-lg border border-border/50 flex-shrink-0">
                {schoolIcon ? (
                  <img 
                    src={schoolIcon} 
                    alt={spell.school}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              {/* Title */}
              <div className="flex-1 min-w-0">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-foreground">
                    {spell.name}
                  </DialogTitle>
                  {spell.name_en && (
                    <p className="text-sm text-muted-foreground">{spell.name_en}</p>
                  )}
                </DialogHeader>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">{levelText}</Badge>
                  <Badge className={badgeColor}>{spell.school}</Badge>
                  {spell.ritual && (
                    <Badge variant="outline" className="border-amber-500/50 text-amber-400">
                      Ритуал
                    </Badge>
                  )}
                  {spell.concentration && (
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                      Концентрация
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 overflow-auto">
            <div className="p-6 space-y-6">
              {/* Spell Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-medium">Время накладывания</span>
                  </div>
                  <p className="text-sm font-semibold">{spell.casting_time}</p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Target className="h-4 w-4" />
                    <span className="text-xs font-medium">Дистанция</span>
                  </div>
                  <p className="text-sm font-semibold">{spell.range}</p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs font-medium">Компоненты</span>
                  </div>
                  <p className="text-sm font-semibold">{spell.components}</p>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Timer className="h-4 w-4" />
                    <span className="text-xs font-medium">Длительность</span>
                  </div>
                  <p className="text-sm font-semibold">{spell.duration}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Описание
                </h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {spell.description}
                </p>
              </div>

              {/* Higher Levels */}
              {spell.higher_levels && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    На более высоких уровнях
                  </h3>
                  <p className="text-sm text-muted-foreground">{spell.higher_levels}</p>
                </div>
              )}

              {/* Classes */}
              {spell.classes && spell.classes.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Доступно классам</h3>
                  <div className="flex flex-wrap gap-2">
                    {spell.classes.map((cls) => (
                      <Badge key={cls} variant="outline">
                        {cls}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
