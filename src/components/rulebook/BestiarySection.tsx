import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Loader2, Shield, Heart, Wind, Bug, ChevronDown } from "lucide-react";
import { useMonsters, type Monster } from "@/hooks/useRulebook";

const mod = (score: number) => {
  const m = Math.floor((score - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
};

function MonsterCard({ monster }: { monster: Monster }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="bg-card border-border hover:border-primary/50 transition-all overflow-hidden">
        <CollapsibleTrigger className="w-full p-4 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <Bug className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-serif font-semibold">{monster.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {monster.size} {monster.type}, {monster.alignment || '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">CR {monster.challenge_rating}</Badge>
              <Badge variant="outline">{monster.experience_points} XP</Badge>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
            {monster.description && (
              <p className="text-sm text-muted-foreground italic">{monster.description}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm">
              <div><Shield className="w-4 h-4 inline mr-1 text-primary" />КД {monster.armor_class}</div>
              <div><Heart className="w-4 h-4 inline mr-1 text-accent" />HP {monster.hit_points}</div>
              <div><Wind className="w-4 h-4 inline mr-1 text-secondary" />{monster.speed}</div>
            </div>
            <div className="grid grid-cols-6 gap-2 text-center text-sm">
              {(['strength','dexterity','constitution','intelligence','wisdom','charisma'] as const).map(stat => (
                <div key={stat} className="bg-secondary/10 rounded p-2">
                  <div className="text-xs text-muted-foreground uppercase">
                    {stat === 'strength' ? 'СИЛ' : stat === 'dexterity' ? 'ЛОВ' : stat === 'constitution' ? 'ТЕЛ' : stat === 'intelligence' ? 'ИНТ' : stat === 'wisdom' ? 'МДР' : 'ХАР'}
                  </div>
                  <div className="font-bold">{monster[stat]}</div>
                  <div className="text-xs text-muted-foreground">{mod(monster[stat])}</div>
                </div>
              ))}
            </div>
            {monster.senses && <p className="text-sm"><span className="font-semibold">Чувства:</span> {monster.senses}</p>}
            {monster.languages && <p className="text-sm"><span className="font-semibold">Языки:</span> {monster.languages}</p>}
            {monster.damage_resistances && monster.damage_resistances.length > 0 && (
              <p className="text-sm"><span className="font-semibold">Сопротивления:</span> {monster.damage_resistances.join(', ')}</p>
            )}
            {monster.damage_immunities && monster.damage_immunities.length > 0 && (
              <p className="text-sm"><span className="font-semibold">Иммунитеты:</span> {monster.damage_immunities.join(', ')}</p>
            )}
            {monster.condition_immunities && monster.condition_immunities.length > 0 && (
              <p className="text-sm"><span className="font-semibold">Иммунитет к состояниям:</span> {monster.condition_immunities.join(', ')}</p>
            )}
            {monster.abilities?.length > 0 && (
              <div>
                <h4 className="font-serif font-semibold text-sm mb-1">Особенности</h4>
                {monster.abilities.map((a, i) => (
                  <p key={i} className="text-sm mb-1"><span className="font-semibold text-primary">{a.name}.</span> {a.description}</p>
                ))}
              </div>
            )}
            {monster.actions?.length > 0 && (
              <div>
                <h4 className="font-serif font-semibold text-sm mb-1">Действия</h4>
                {monster.actions.map((a, i) => (
                  <p key={i} className="text-sm mb-1"><span className="font-semibold text-accent">{a.name}.</span> {a.description}</p>
                ))}
              </div>
            )}
            {monster.legendary_actions?.length > 0 && (
              <div>
                <h4 className="font-serif font-semibold text-sm mb-1">Легендарные действия</h4>
                {monster.legendary_actions.map((a, i) => (
                  <p key={i} className="text-sm mb-1"><span className="font-semibold text-primary">{a.name}.</span> {a.description}</p>
                ))}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export function BestiarySection() {
  const { data: monsters, isLoading } = useMonsters();
  const [search, setSearch] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filtered = (monsters || []).filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Input
        placeholder="Поиск монстра..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Монстры не найдены</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(monster => (
            <MonsterCard key={monster.id} monster={monster} />
          ))}
        </div>
      )}
    </div>
  );
}
