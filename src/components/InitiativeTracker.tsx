import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Play,
  RotateCcw,
  Swords,
  Heart,
  Shield,
} from "lucide-react";

interface Combatant {
  id: string;
  name: string;
  initiative: number;
  hp: number;
  maxHp: number;
  ac: number;
  conditions: string[];
}

const InitiativeTracker = () => {
  const [combatants, setCombatants] = useState<Combatant[]>([
    { id: "1", name: "Торин", initiative: 18, hp: 45, maxHp: 45, ac: 18, conditions: [] },
    { id: "2", name: "Эльвира", initiative: 15, hp: 32, maxHp: 32, ac: 14, conditions: [] },
    { id: "3", name: "Гоблин 1", initiative: 12, hp: 7, maxHp: 7, ac: 13, conditions: [] },
    { id: "4", name: "Гоблин 2", initiative: 8, hp: 7, maxHp: 7, ac: 13, conditions: [] },
  ]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [newName, setNewName] = useState("");
  const [newInitiative, setNewInitiative] = useState("");
  const [round, setRound] = useState(1);

  const conditions = [
    "Оглушён",
    "Отравлен",
    "Парализован",
    "Испуган",
    "Невидимый",
    "Лежит",
    "Ослеплён",
  ];

  const sortedCombatants = [...combatants].sort(
    (a, b) => b.initiative - a.initiative
  );

  const addCombatant = () => {
    if (!newName || !newInitiative) return;
    const newCombatant: Combatant = {
      id: Date.now().toString(),
      name: newName,
      initiative: parseInt(newInitiative) || 0,
      hp: 10,
      maxHp: 10,
      ac: 10,
      conditions: [],
    };
    setCombatants([...combatants, newCombatant]);
    setNewName("");
    setNewInitiative("");
  };

  const removeCombatant = (id: string) => {
    setCombatants(combatants.filter((c) => c.id !== id));
    if (currentTurn >= sortedCombatants.length - 1) {
      setCurrentTurn(0);
    }
  };

  const updateHp = (id: string, delta: number) => {
    setCombatants(
      combatants.map((c) =>
        c.id === id
          ? { ...c, hp: Math.max(0, Math.min(c.maxHp, c.hp + delta)) }
          : c
      )
    );
  };

  const toggleCondition = (id: string, condition: string) => {
    setCombatants(
      combatants.map((c) =>
        c.id === id
          ? {
              ...c,
              conditions: c.conditions.includes(condition)
                ? c.conditions.filter((cond) => cond !== condition)
                : [...c.conditions, condition],
            }
          : c
      )
    );
  };

  const nextTurn = () => {
    if (currentTurn >= sortedCombatants.length - 1) {
      setCurrentTurn(0);
      setRound((r) => r + 1);
    } else {
      setCurrentTurn((t) => t + 1);
    }
  };

  const resetCombat = () => {
    setCurrentTurn(0);
    setRound(1);
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Swords className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-serif font-bold">Трекер инициативы</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Раунд:</span>
          <span className="text-xl font-bold text-primary">{round}</span>
        </div>
      </div>

      {/* Add Combatant */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Имя"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 bg-background border-border"
        />
        <Input
          type="number"
          placeholder="Инициатива"
          value={newInitiative}
          onChange={(e) => setNewInitiative(e.target.value)}
          className="w-28 bg-background border-border"
        />
        <Button onClick={addCombatant} className="bg-gradient-gold hover:opacity-90">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Combatant List */}
      <div className="space-y-2 mb-6">
        {sortedCombatants.map((combatant, index) => (
          <div
            key={combatant.id}
            className={`p-4 rounded-lg border transition-all ${
              index === currentTurn
                ? "bg-primary/10 border-primary shadow-lg shadow-primary/20"
                : "bg-background/50 border-border hover:border-primary/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index === currentTurn
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/30 text-muted-foreground"
                  }`}
                >
                  {combatant.initiative}
                </div>
                <div>
                  <h4 className="font-semibold">{combatant.name}</h4>
                  {combatant.conditions.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {combatant.conditions.map((cond) => (
                        <span
                          key={cond}
                          className="px-2 py-0.5 bg-accent/20 text-accent text-xs rounded"
                        >
                          {cond}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* HP */}
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-accent" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => updateHp(combatant.id, -1)}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <span
                    className={`font-semibold min-w-[60px] text-center ${
                      combatant.hp < combatant.maxHp / 2
                        ? "text-accent"
                        : "text-primary"
                    }`}
                  >
                    {combatant.hp}/{combatant.maxHp}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => updateHp(combatant.id, 1)}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                </div>

                {/* AC */}
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{combatant.ac}</span>
                </div>

                {/* Remove */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCombatant(combatant.id)}
                  className="text-muted-foreground hover:text-accent"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Conditions */}
            {index === currentTurn && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex flex-wrap gap-1">
                  {conditions.map((cond) => (
                    <Button
                      key={cond}
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCondition(combatant.id, cond)}
                      className={`text-xs h-7 ${
                        combatant.conditions.includes(cond)
                          ? "bg-accent/20 text-accent"
                          : "text-muted-foreground"
                      }`}
                    >
                      {cond}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <Button
          onClick={nextTurn}
          className="bg-gradient-gold hover:opacity-90 gap-2"
        >
          <Play className="w-4 h-4" />
          Следующий ход
        </Button>
        <Button
          variant="outline"
          onClick={resetCombat}
          className="border-primary/50 gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Сбросить
        </Button>
      </div>
    </Card>
  );
};

export default InitiativeTracker;
