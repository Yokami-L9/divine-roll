import { Spell } from "@/hooks/useRulebook";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Target, Timer, Sparkles, BookOpen } from "lucide-react";

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

export function SpellDescriptionDialog({ spell, open, onOpenChange }: SpellDescriptionDialogProps) {
  if (!spell) return null;

  const colorClass = schoolColors[spell.school] || "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {spell.name}
          </DialogTitle>
          {spell.name_en && (
            <p className="text-sm text-muted-foreground italic">{spell.name_en}</p>
          )}
        </DialogHeader>

        <div className="space-y-4">
          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className={colorClass}>
              {spell.school}
            </Badge>
            <Badge variant="secondary">
              {spell.level === 0 ? "Заговор" : `${spell.level} уровень`}
            </Badge>
            {spell.concentration && (
              <Badge variant="outline">Концентрация</Badge>
            )}
            {spell.ritual && (
              <Badge variant="outline">Ритуал</Badge>
            )}
          </div>

          <Separator />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Время накладывания</div>
                <div className="font-medium">{spell.casting_time}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Дистанция</div>
                <div className="font-medium">{spell.range}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Длительность</div>
                <div className="font-medium">{spell.duration}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Компоненты</div>
                <div className="font-medium">{spell.components}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Описание</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {spell.description}
            </p>
          </div>

          {/* Higher levels */}
          {spell.higher_levels && (
            <div className="p-3 bg-primary/10 rounded-lg">
              <h4 className="text-sm font-semibold mb-1">На более высоких уровнях</h4>
              <p className="text-sm text-muted-foreground">
                {spell.higher_levels}
              </p>
            </div>
          )}

          {/* Classes */}
          {spell.classes && spell.classes.length > 0 && (
            <div>
              <h4 className="text-xs text-muted-foreground mb-1">Классы:</h4>
              <div className="flex gap-1 flex-wrap">
                {spell.classes.map((cls) => (
                  <Badge key={cls} variant="outline" className="text-xs">
                    {cls}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
