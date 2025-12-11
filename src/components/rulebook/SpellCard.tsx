import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spell } from "@/hooks/useRulebook";
import { Clock, Target, Timer, Sparkles } from "lucide-react";

const schoolColors: Record<string, string> = {
  Воплощение: "bg-red-500/20 text-red-400",
  Вызов: "bg-yellow-500/20 text-yellow-400",
  Иллюзия: "bg-purple-500/20 text-purple-400",
  Некромантия: "bg-gray-500/20 text-gray-400",
  Ограждение: "bg-blue-500/20 text-blue-400",
  Очарование: "bg-pink-500/20 text-pink-400",
  Преобразование: "bg-green-500/20 text-green-400",
  Прорицание: "bg-cyan-500/20 text-cyan-400",
};

export function SpellCard({ spell }: { spell: Spell }) {
  const levelText = spell.level === 0 ? "Заговор" : `${spell.level} уровень`;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">{spell.name}</CardTitle>
            <CardDescription className="text-xs">{spell.name_en}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="secondary">{levelText}</Badge>
            <Badge className={schoolColors[spell.school] || "bg-muted"}>
              {spell.school}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span>{spell.casting_time}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-3 w-3 text-muted-foreground" />
            <span>{spell.range}</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-muted-foreground" />
            <span>{spell.components}</span>
          </div>
          <div className="flex items-center gap-1">
            <Timer className="h-3 w-3 text-muted-foreground" />
            <span className="truncate">{spell.duration}</span>
          </div>
        </div>

        <div className="flex gap-1">
          {spell.ritual && (
            <Badge variant="outline" className="text-xs">
              Ритуал
            </Badge>
          )}
          {spell.concentration && (
            <Badge variant="outline" className="text-xs">
              Концентрация
            </Badge>
          )}
        </div>

        <p className="text-sm leading-relaxed">{spell.description}</p>

        {spell.higher_levels && (
          <div className="bg-muted/50 rounded-lg p-2">
            <p className="text-xs font-medium text-muted-foreground mb-1">На более высоких уровнях:</p>
            <p className="text-xs">{spell.higher_levels}</p>
          </div>
        )}

        {spell.classes && spell.classes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {spell.classes.map((cls) => (
              <Badge key={cls} variant="outline" className="text-xs">
                {cls}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
