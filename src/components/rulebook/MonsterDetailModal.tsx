import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { type Monster } from "@/hooks/useRulebook";
import { Shield, Heart, Wind, Footprints, Eye, Languages, Skull, Swords, Star, ImageOff } from "lucide-react";

const mod = (score: number) => {
  const m = Math.floor((score - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
};

const statLabels: Record<string, string> = {
  strength: "СИЛ",
  dexterity: "ЛОВ",
  constitution: "ТЕЛ",
  intelligence: "ИНТ",
  wisdom: "МДР",
  charisma: "ХАР",
};

const crColors: Record<string, string> = {
  "0": "bg-muted text-muted-foreground",
  "1/8": "bg-emerald-500/20 text-emerald-400",
  "1/4": "bg-emerald-500/20 text-emerald-400",
  "1/2": "bg-green-500/20 text-green-400",
  "1": "bg-green-500/20 text-green-400",
  "2": "bg-yellow-500/20 text-yellow-400",
  "3": "bg-yellow-500/20 text-yellow-400",
  "4": "bg-amber-500/20 text-amber-400",
  "5": "bg-orange-500/20 text-orange-400",
};

function getCrColor(cr: string) {
  if (crColors[cr]) return crColors[cr];
  const num = parseFloat(cr);
  if (num >= 17) return "bg-red-500/20 text-red-400 border-red-500/30";
  if (num >= 11) return "bg-rose-500/20 text-rose-400 border-rose-500/30";
  if (num >= 6) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
  return "bg-muted text-muted-foreground";
}

interface MonsterDetailModalProps {
  monster: Monster | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MonsterDetailModal({ monster, open, onOpenChange }: MonsterDetailModalProps) {
  if (!monster) return null;

  const stats = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden bg-card">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-accent/20 to-primary/5 p-6">
            <div className="flex gap-4">
              {/* Monster Image Placeholder */}
              <div className="w-24 h-24 rounded-lg overflow-hidden shadow-lg border border-border/50 flex-shrink-0 bg-muted flex items-center justify-center">
                <ImageOff className="h-10 w-10 text-muted-foreground/50" />
              </div>

              <div className="flex-1 min-w-0">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold font-serif text-foreground">
                    {monster.name}
                  </DialogTitle>
                  {monster.name_en && (
                    <p className="text-sm text-muted-foreground italic">{monster.name_en}</p>
                  )}
                </DialogHeader>
                <p className="text-sm text-muted-foreground mt-1">
                  {monster.size} {monster.type}, {monster.alignment || "без мировоззрения"}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className={getCrColor(monster.challenge_rating)}>
                    CR {monster.challenge_rating}
                  </Badge>
                  <Badge variant="outline">{monster.experience_points} XP</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 overflow-auto">
            <div className="p-6 space-y-5">
              {/* Description */}
              {monster.description && (
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  {monster.description}
                </p>
              )}

              {/* Core Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span className="text-xs font-medium">Класс Доспеха</span>
                  </div>
                  <p className="text-lg font-bold">{monster.armor_class}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs font-medium">Хиты</span>
                  </div>
                  <p className="text-lg font-bold">{monster.hit_points}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Footprints className="h-4 w-4" />
                    <span className="text-xs font-medium">Скорость</span>
                  </div>
                  <p className="text-sm font-bold">{monster.speed || "30 фт."}</p>
                </div>
              </div>

              {/* Ability Scores */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Характеристики</h3>
                <div className="grid grid-cols-6 gap-2">
                  {stats.map((stat) => (
                    <div key={stat} className="bg-muted/50 rounded-lg p-2 text-center">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {statLabels[stat]}
                      </div>
                      <div className="text-lg font-bold">{monster[stat]}</div>
                      <div className="text-xs text-primary font-medium">{mod(monster[stat])}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Senses, Languages, Immunities */}
              <div className="space-y-2">
                {monster.senses && (
                  <div className="flex items-start gap-2 text-sm">
                    <Eye className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Чувства: </span>
                      <span className="text-muted-foreground">{monster.senses}</span>
                    </div>
                  </div>
                )}
                {monster.languages && (
                  <div className="flex items-start gap-2 text-sm">
                    <Languages className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Языки: </span>
                      <span className="text-muted-foreground">{monster.languages}</span>
                    </div>
                  </div>
                )}
                {monster.damage_resistances && monster.damage_resistances.length > 0 && (
                  <div className="flex items-start gap-2 text-sm">
                    <Shield className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Сопротивления к урону: </span>
                      <span className="text-muted-foreground">{monster.damage_resistances.join(", ")}</span>
                    </div>
                  </div>
                )}
                {monster.damage_immunities && monster.damage_immunities.length > 0 && (
                  <div className="flex items-start gap-2 text-sm">
                    <Shield className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Иммунитеты к урону: </span>
                      <span className="text-muted-foreground">{monster.damage_immunities.join(", ")}</span>
                    </div>
                  </div>
                )}
                {monster.condition_immunities && monster.condition_immunities.length > 0 && (
                  <div className="flex items-start gap-2 text-sm">
                    <Wind className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">Иммунитеты к состояниям: </span>
                      <span className="text-muted-foreground">{monster.condition_immunities.join(", ")}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Abilities */}
              {monster.abilities?.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Star className="h-4 w-4 text-primary" />
                      Особенности
                    </h3>
                    <div className="space-y-3">
                      {monster.abilities.map((a, i) => (
                        <div key={i} className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                          <p className="text-sm">
                            <span className="font-bold text-primary">{a.name}.</span>{" "}
                            <span className="text-muted-foreground">{a.description}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Actions */}
              {monster.actions?.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Swords className="h-4 w-4 text-accent" />
                      Действия
                    </h3>
                    <div className="space-y-3">
                      {monster.actions.map((a, i) => (
                        <div key={i} className="bg-accent/5 border border-accent/10 rounded-lg p-3">
                          <p className="text-sm">
                            <span className="font-bold text-accent">{a.name}.</span>{" "}
                            <span className="text-muted-foreground">{a.description}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Legendary Actions */}
              {monster.legendary_actions?.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Skull className="h-4 w-4 text-primary" />
                      Легендарные действия
                    </h3>
                    <div className="space-y-3">
                      {monster.legendary_actions.map((a, i) => (
                        <div key={i} className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                          <p className="text-sm">
                            <span className="font-bold text-primary">{a.name}.</span>{" "}
                            <span className="text-muted-foreground">{a.description}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
