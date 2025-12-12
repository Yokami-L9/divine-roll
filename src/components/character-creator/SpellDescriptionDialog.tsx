import { Spell } from "@/hooks/useRulebook";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Target, Timer, Sparkles, BookOpen, Zap } from "lucide-react";

// Dynamically import all spell icons
const spellIconsContext = import.meta.glob('@/assets/spells/*.png', { eager: true, import: 'default' });

const spellIcons: Record<string, string> = {};
Object.entries(spellIconsContext).forEach(([path, module]) => {
  const fileName = path.split('/').pop()?.replace('.png', '') || '';
  spellIcons[fileName] = module as string;
});

// Helper function to convert spell name to file name format
function getSpellIconKey(nameEn: string | null): string {
  if (!nameEn) return '';
  return nameEn
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Fallback school icons
const schoolIconKeys: Record<string, string> = {
  Воплощение: "evocation",
  Вызов: "conjuration",
  Иллюзия: "illusion",
  Некромантия: "necromancy",
  Ограждение: "abjuration",
  Очарование: "enchantment",
  Преобразование: "transmutation",
  Прорицание: "divination",
  Проявление: "evocation",
};

interface SpellDescriptionDialogProps {
  spell: Spell | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const schoolColors: Record<string, string> = {
  Воплощение: "bg-orange-500/20 text-orange-500 border-orange-500/50",
  Вызов: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
  Иллюзия: "bg-purple-500/20 text-purple-500 border-purple-500/50",
  Некромантия: "bg-gray-500/20 text-gray-400 border-gray-500/50",
  Ограждение: "bg-blue-500/20 text-blue-500 border-blue-500/50",
  Очарование: "bg-pink-500/20 text-pink-500 border-pink-500/50",
  Преобразование: "bg-green-500/20 text-green-500 border-green-500/50",
  Прорицание: "bg-cyan-500/20 text-cyan-500 border-cyan-500/50",
};

const schoolGradients: Record<string, string> = {
  Воплощение: "from-red-500/30 to-orange-500/10",
  Вызов: "from-yellow-500/30 to-amber-500/10",
  Иллюзия: "from-purple-500/30 to-violet-500/10",
  Некромантия: "from-gray-500/30 to-green-900/10",
  Ограждение: "from-blue-500/30 to-cyan-500/10",
  Очарование: "from-pink-500/30 to-rose-500/10",
  Преобразование: "from-green-500/30 to-emerald-500/10",
  Прорицание: "from-cyan-500/30 to-teal-500/10",
};

export function SpellDescriptionDialog({ spell, open, onOpenChange }: SpellDescriptionDialogProps) {
  if (!spell) return null;

  const colorClass = schoolColors[spell.school] || "";
  const gradientColor = schoolGradients[spell.school] || "from-primary/30 to-transparent";
  
  // Get spell icon
  const spellIconKey = getSpellIconKey(spell.name_en);
  const schoolIconKey = schoolIconKeys[spell.school] || "evocation";
  const spellIcon = spellIcons[spellIconKey] || spellIcons[schoolIconKey];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header with Icon */}
          <div className={`relative bg-gradient-to-br ${gradientColor} p-6`}>
            <div className="flex gap-4">
              {/* Spell Icon */}
              <div className="w-20 h-20 rounded-lg overflow-hidden shadow-lg border border-border/50 flex-shrink-0">
                {spellIcon ? (
                  <img 
                    src={spellIcon} 
                    alt={spell.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
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
                  <Badge variant="secondary">
                    {spell.level === 0 ? "Заговор" : `${spell.level} уровень`}
                  </Badge>
                  <Badge className={colorClass}>{spell.school}</Badge>
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
