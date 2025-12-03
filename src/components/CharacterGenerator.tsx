import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dices, RefreshCw, Download, User, Sparkles } from "lucide-react";

interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

const CharacterGenerator = () => {
  const [name, setName] = useState("");
  const [race, setRace] = useState("");
  const [charClass, setCharClass] = useState("");
  const [background, setBackground] = useState("");
  const [stats, setStats] = useState<CharacterStats>({
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  });
  const [isRolling, setIsRolling] = useState(false);

  const races = [
    "Человек", "Эльф", "Дварф", "Полурослик", "Драконорождённый",
    "Гном", "Полуэльф", "Полуорк", "Тифлинг",
  ];

  const classes = [
    "Воин", "Маг", "Жрец", "Плут", "Варвар", "Бард",
    "Друид", "Монах", "Паладин", "Следопыт", "Чародей", "Колдун",
  ];

  const backgrounds = [
    "Солдат", "Преступник", "Мудрец", "Артист", "Народный герой",
    "Отшельник", "Благородный", "Странник", "Прислужник",
  ];

  const randomNames = [
    "Торин Дубощит", "Эларин Звёздная", "Гримнир Каменный",
    "Лира Лунная", "Кадан Бурерождённый", "Селена Туманная",
    "Рагнар Железнорукий", "Миранда Светлая", "Зорак Тёмный",
  ];

  const rollStat = (): number => {
    // 4d6 drop lowest
    const rolls = Array(4)
      .fill(0)
      .map(() => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => b - a);
    return rolls.slice(0, 3).reduce((a, b) => a + b, 0);
  };

  const rollAllStats = () => {
    setIsRolling(true);
    setTimeout(() => {
      setStats({
        strength: rollStat(),
        dexterity: rollStat(),
        constitution: rollStat(),
        intelligence: rollStat(),
        wisdom: rollStat(),
        charisma: rollStat(),
      });
      setIsRolling(false);
    }, 500);
  };

  const generateRandom = () => {
    setName(randomNames[Math.floor(Math.random() * randomNames.length)]);
    setRace(races[Math.floor(Math.random() * races.length)]);
    setCharClass(classes[Math.floor(Math.random() * classes.length)]);
    setBackground(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
    rollAllStats();
  };

  const getModifier = (stat: number): string => {
    const mod = Math.floor((stat - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const statLabels: { key: keyof CharacterStats; label: string }[] = [
    { key: "strength", label: "СИЛ" },
    { key: "dexterity", label: "ЛОВ" },
    { key: "constitution", label: "ТЕЛ" },
    { key: "intelligence", label: "ИНТ" },
    { key: "wisdom", label: "МДР" },
    { key: "charisma", label: "ХАР" },
  ];

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-primary gold-glow" />
          <h2 className="text-2xl font-serif font-bold">Генератор персонажа</h2>
        </div>
        <Button
          onClick={generateRandom}
          variant="outline"
          className="border-primary/50 gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Случайный
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Имя</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите имя персонажа"
              className="bg-background border-border"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Раса</label>
            <Select value={race} onValueChange={setRace}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Выберите расу" />
              </SelectTrigger>
              <SelectContent>
                {races.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Класс</label>
            <Select value={charClass} onValueChange={setCharClass}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Выберите класс" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Предыстория
            </label>
            <Select value={background} onValueChange={setBackground}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Выберите предысторию" />
              </SelectTrigger>
              <SelectContent>
                {backgrounds.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm text-muted-foreground">Характеристики</label>
            <Button
              onClick={rollAllStats}
              variant="ghost"
              size="sm"
              disabled={isRolling}
              className="gap-2"
            >
              <Dices className={`w-4 h-4 ${isRolling ? "animate-spin" : ""}`} />
              Бросить 4d6
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {statLabels.map(({ key, label }) => (
              <div
                key={key}
                className={`p-4 bg-background/50 rounded-lg border border-border text-center transition-all ${
                  isRolling ? "animate-pulse" : ""
                }`}
              >
                <div className="text-xs text-muted-foreground mb-1">{label}</div>
                <div className="text-2xl font-bold text-primary">{stats[key]}</div>
                <div className="text-sm text-muted-foreground">
                  {getModifier(stats[key])}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      {(name || race || charClass) && (
        <div className="p-4 bg-gradient-arcane rounded-lg mb-6">
          <h3 className="text-lg font-serif font-semibold mb-2">
            {name || "Безымянный герой"}
          </h3>
          <p className="text-muted-foreground">
            {race && `${race}`}
            {charClass && ` • ${charClass}`}
            {background && ` • ${background}`}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <Button className="bg-gradient-gold hover:opacity-90 gap-2">
          <Download className="w-4 h-4" />
          Сохранить персонажа
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setName("");
            setRace("");
            setCharClass("");
            setBackground("");
            setStats({
              strength: 10,
              dexterity: 10,
              constitution: 10,
              intelligence: 10,
              wisdom: 10,
              charisma: 10,
            });
          }}
          className="border-primary/50 gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Сбросить
        </Button>
      </div>
    </Card>
  );
};

export default CharacterGenerator;
