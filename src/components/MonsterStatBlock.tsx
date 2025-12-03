import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Zap, Footprints, Eye, Brain } from "lucide-react";

interface MonsterStats {
  name: string;
  type: string;
  size: string;
  alignment: string;
  cr: string;
  xp: number;
  ac: number;
  hp: number;
  speed: string;
  stats: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  skills?: string[];
  resistances?: string[];
  immunities?: string[];
  senses?: string[];
  languages?: string[];
  abilities?: { name: string; description: string }[];
  actions?: { name: string; description: string; damage?: string }[];
}

interface MonsterStatBlockProps {
  monster: MonsterStats;
  onClose?: () => void;
}

const MonsterStatBlock = ({ monster }: MonsterStatBlockProps) => {
  const getModifier = (stat: number): string => {
    const mod = Math.floor((stat - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  return (
    <Card className="p-6 bg-card border-2 border-accent/50 max-w-2xl">
      {/* Header */}
      <div className="border-b-2 border-accent/30 pb-4 mb-4">
        <h2 className="text-2xl font-serif font-bold text-accent">{monster.name}</h2>
        <p className="text-sm text-muted-foreground italic">
          {monster.size} {monster.type}, {monster.alignment}
        </p>
      </div>

      {/* Core Stats */}
      <div className="space-y-2 border-b border-border pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Класс доспеха:</span>
          <span className="font-semibold">{monster.ac}</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-accent" />
          <span className="text-muted-foreground">Хиты:</span>
          <span className="font-semibold">{monster.hp}</span>
        </div>
        <div className="flex items-center gap-2">
          <Footprints className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Скорость:</span>
          <span className="font-semibold">{monster.speed}</span>
        </div>
      </div>

      {/* Ability Scores */}
      <div className="grid grid-cols-6 gap-2 border-b border-border pb-4 mb-4">
        {Object.entries(monster.stats).map(([key, value]) => (
          <div key={key} className="text-center p-2 bg-background/50 rounded">
            <div className="text-xs text-muted-foreground uppercase">{key}</div>
            <div className="font-bold text-lg">{value}</div>
            <div className="text-xs text-primary">{getModifier(value)}</div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="space-y-2 border-b border-border pb-4 mb-4 text-sm">
        {monster.skills && monster.skills.length > 0 && (
          <div>
            <span className="text-muted-foreground">Навыки: </span>
            <span>{monster.skills.join(", ")}</span>
          </div>
        )}
        {monster.resistances && monster.resistances.length > 0 && (
          <div>
            <span className="text-muted-foreground">Сопротивления: </span>
            <span className="text-primary">{monster.resistances.join(", ")}</span>
          </div>
        )}
        {monster.immunities && monster.immunities.length > 0 && (
          <div>
            <span className="text-muted-foreground">Иммунитеты: </span>
            <span className="text-accent">{monster.immunities.join(", ")}</span>
          </div>
        )}
        {monster.senses && monster.senses.length > 0 && (
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">Чувства: </span>
            <span>{monster.senses.join(", ")}</span>
          </div>
        )}
        {monster.languages && monster.languages.length > 0 && (
          <div className="flex items-center gap-1">
            <Brain className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">Языки: </span>
            <span>{monster.languages.join(", ")}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-accent" />
          <span className="text-muted-foreground">Опасность:</span>
          <Badge variant="outline" className="bg-accent/20 text-accent">
            CR {monster.cr}
          </Badge>
          <span className="text-muted-foreground">({monster.xp} XP)</span>
        </div>
      </div>

      {/* Abilities */}
      {monster.abilities && monster.abilities.length > 0 && (
        <div className="mb-4">
          <h3 className="font-serif font-semibold text-primary mb-2">Особенности</h3>
          <div className="space-y-2">
            {monster.abilities.map((ability, index) => (
              <div key={index}>
                <span className="font-semibold italic">{ability.name}. </span>
                <span className="text-sm text-muted-foreground">{ability.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {monster.actions && monster.actions.length > 0 && (
        <div>
          <h3 className="font-serif font-semibold text-accent mb-2 border-b border-accent/30 pb-1">
            Действия
          </h3>
          <div className="space-y-3">
            {monster.actions.map((action, index) => (
              <div key={index}>
                <span className="font-semibold italic">{action.name}. </span>
                <span className="text-sm text-muted-foreground">{action.description}</span>
                {action.damage && (
                  <span className="ml-2 text-accent font-semibold">{action.damage}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default MonsterStatBlock;
