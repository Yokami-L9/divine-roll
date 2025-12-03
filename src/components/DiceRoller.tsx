import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dices, Plus, Minus, RotateCcw, History } from "lucide-react";

interface DiceResult {
  dice: string;
  rolls: number[];
  modifier: number;
  total: number;
  timestamp: Date;
}

const DiceRoller = () => {
  const [modifier, setModifier] = useState(0);
  const [results, setResults] = useState<DiceResult[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [currentRoll, setCurrentRoll] = useState<number | null>(null);

  const diceTypes = [
    { name: "d4", sides: 4 },
    { name: "d6", sides: 6 },
    { name: "d8", sides: 8 },
    { name: "d10", sides: 10 },
    { name: "d12", sides: 12 },
    { name: "d20", sides: 20 },
    { name: "d100", sides: 100 },
  ];

  const rollDice = (sides: number, diceName: string) => {
    setIsRolling(true);
    setCurrentRoll(null);

    // Animate rolling
    let count = 0;
    const interval = setInterval(() => {
      setCurrentRoll(Math.floor(Math.random() * sides) + 1);
      count++;
      if (count > 10) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * sides) + 1;
        setCurrentRoll(finalRoll);
        setIsRolling(false);

        const newResult: DiceResult = {
          dice: diceName,
          rolls: [finalRoll],
          modifier,
          total: finalRoll + modifier,
          timestamp: new Date(),
        };

        setResults((prev) => [newResult, ...prev.slice(0, 9)]);
      }
    }, 50);
  };

  const clearHistory = () => {
    setResults([]);
    setCurrentRoll(null);
  };

  return (
    <Card className="p-6 bg-gradient-arcane">
      <div className="text-center max-w-2xl mx-auto">
        <Dices className="w-12 h-12 text-primary mx-auto mb-4 gold-glow animate-float" />
        <h2 className="text-2xl font-serif font-bold mb-4">Бросок кубиков</h2>

        {/* Current Roll Display */}
        <div className="mb-6">
          <div
            className={`text-6xl font-bold text-primary mb-2 transition-all ${
              isRolling ? "animate-pulse scale-110" : ""
            }`}
          >
            {currentRoll !== null ? currentRoll : "—"}
          </div>
          {results.length > 0 && !isRolling && (
            <div className="text-muted-foreground">
              {results[0].dice} + {results[0].modifier} ={" "}
              <span className="text-primary font-bold">{results[0].total}</span>
            </div>
          )}
        </div>

        {/* Modifier Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="text-muted-foreground">Модификатор:</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setModifier((m) => m - 1)}
            className="border-primary/50"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Input
            type="number"
            value={modifier}
            onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
            className="w-20 text-center bg-card border-primary/50"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setModifier((m) => m + 1)}
            className="border-primary/50"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Dice Buttons */}
        <div className="flex gap-2 justify-center flex-wrap mb-6">
          {diceTypes.map((dice) => (
            <Button
              key={dice.name}
              size="lg"
              onClick={() => rollDice(dice.sides, dice.name)}
              disabled={isRolling}
              className="bg-card hover:bg-primary/20 border border-primary/50 w-14 h-14 text-lg font-bold transition-all hover:scale-105 disabled:opacity-50"
            >
              {dice.name}
            </Button>
          ))}
        </div>

        {/* History */}
        {results.length > 0 && (
          <div className="mt-6 p-4 bg-card/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <History className="w-4 h-4" />
                <span className="text-sm">История бросков</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="text-muted-foreground hover:text-primary"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Очистить
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="px-3 py-1 bg-secondary/20 rounded text-sm"
                >
                  <span className="text-muted-foreground">{result.dice}:</span>{" "}
                  <span className="text-primary font-semibold">
                    {result.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DiceRoller;
