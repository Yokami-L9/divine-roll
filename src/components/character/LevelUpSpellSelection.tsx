import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSpells, Spell } from "@/hooks/useRulebook";
import { Search, Sparkles, Wand2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// PHB spell progression tables
const FULL_CASTER_MAX_SPELL_LEVEL: Record<number, number> = {
  1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5,
  11: 6, 12: 6, 13: 7, 14: 7, 15: 8, 16: 8, 17: 9, 18: 9, 19: 9, 20: 9,
};

const HALF_CASTER_MAX_SPELL_LEVEL: Record<number, number> = {
  1: 0, 2: 1, 3: 1, 4: 1, 5: 2, 6: 2, 7: 2, 8: 2, 9: 3, 10: 3,
  11: 3, 12: 3, 13: 4, 14: 4, 15: 4, 16: 4, 17: 5, 18: 5, 19: 5, 20: 5,
};

const THIRD_CASTER_MAX_SPELL_LEVEL: Record<number, number> = {
  1: 0, 2: 0, 3: 1, 4: 1, 5: 1, 6: 1, 7: 2, 8: 2, 9: 2, 10: 2,
  11: 2, 12: 2, 13: 3, 14: 3, 15: 3, 16: 3, 17: 3, 18: 3, 19: 4, 20: 4,
};

const WARLOCK_MAX_SPELL_LEVEL: Record<number, number> = {
  1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5,
  11: 5, 12: 5, 13: 5, 14: 5, 15: 5, 16: 5, 17: 5, 18: 5, 19: 5, 20: 5,
};

// Spells known progression for classes that learn spells
const SPELLS_KNOWN: Record<string, Record<number, number>> = {
  "Бард": { 1: 4, 2: 5, 3: 6, 4: 7, 5: 8, 6: 9, 7: 10, 8: 11, 9: 12, 10: 14, 11: 15, 12: 15, 13: 16, 14: 18, 15: 19, 16: 19, 17: 20, 18: 22, 19: 22, 20: 22 },
  "Чародей": { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 11, 11: 12, 12: 12, 13: 13, 14: 13, 15: 14, 16: 14, 17: 15, 18: 15, 19: 15, 20: 15 },
  "Колдун": { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 10, 11: 11, 12: 11, 13: 12, 14: 12, 15: 13, 16: 13, 17: 14, 18: 14, 19: 15, 20: 15 },
  "Следопыт": { 1: 0, 2: 2, 3: 3, 4: 3, 5: 4, 6: 4, 7: 5, 8: 5, 9: 6, 10: 6, 11: 7, 12: 7, 13: 8, 14: 8, 15: 9, 16: 9, 17: 10, 18: 10, 19: 11, 20: 11 },
};

const FULL_CASTERS = ["Волшебник", "Жрец", "Друид", "Бард", "Чародей"];
const HALF_CASTERS = ["Паладин", "Следопыт"];
const THIRD_CASTER_SUBCLASSES = ["Мистический рыцарь", "Магический ловкач"];

const schoolColors: Record<string, string> = {
  "Вызов": "text-orange-500",
  "Некромантия": "text-green-500",
  "Воплощение": "text-red-500",
  "Преобразование": "text-blue-500",
  "Прорицание": "text-cyan-500",
  "Очарование": "text-pink-500",
  "Иллюзия": "text-purple-500",
  "Ограждение": "text-yellow-500",
};

interface LevelUpSpellSelectionProps {
  className: string;
  classLevel: number;
  subclass?: string;
  currentSpells: string[];
  onSpellsChange: (spells: string[]) => void;
}

export function LevelUpSpellSelection({
  className,
  classLevel,
  subclass,
  currentSpells,
  onSpellsChange,
}: LevelUpSpellSelectionProps) {
  const { data: allSpells, isLoading } = useSpells();
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("new");

  // Calculate max spell level for this class
  const maxSpellLevel = useMemo(() => {
    if (className === "Колдун") {
      return WARLOCK_MAX_SPELL_LEVEL[classLevel] || 1;
    }
    if (FULL_CASTERS.includes(className)) {
      return FULL_CASTER_MAX_SPELL_LEVEL[classLevel] || 1;
    }
    if (HALF_CASTERS.includes(className)) {
      return HALF_CASTER_MAX_SPELL_LEVEL[classLevel] || 0;
    }
    if ((className === "Воин" || className === "Плут") && subclass && THIRD_CASTER_SUBCLASSES.includes(subclass)) {
      return THIRD_CASTER_MAX_SPELL_LEVEL[classLevel] || 0;
    }
    return 0;
  }, [className, classLevel, subclass]);

  // Calculate previous max spell level
  const previousMaxSpellLevel = useMemo(() => {
    const prevLevel = classLevel - 1;
    if (prevLevel < 1) return 0;
    
    if (className === "Колдун") {
      return WARLOCK_MAX_SPELL_LEVEL[prevLevel] || 1;
    }
    if (FULL_CASTERS.includes(className)) {
      return FULL_CASTER_MAX_SPELL_LEVEL[prevLevel] || 1;
    }
    if (HALF_CASTERS.includes(className)) {
      return HALF_CASTER_MAX_SPELL_LEVEL[prevLevel] || 0;
    }
    if ((className === "Воин" || className === "Плут") && subclass && THIRD_CASTER_SUBCLASSES.includes(subclass)) {
      return THIRD_CASTER_MAX_SPELL_LEVEL[prevLevel] || 0;
    }
    return 0;
  }, [className, classLevel, subclass]);

  // Check if new spell circle unlocked
  const newSpellCircleUnlocked = maxSpellLevel > previousMaxSpellLevel;

  // Get spells known limit
  const spellsKnownLimit = SPELLS_KNOWN[className]?.[classLevel];
  const previousSpellsKnown = SPELLS_KNOWN[className]?.[classLevel - 1] || 0;
  const newSpellsToLearn = spellsKnownLimit ? spellsKnownLimit - previousSpellsKnown : 0;

  // Filter spells by class
  const availableSpells = useMemo(() => {
    if (!allSpells) return [];
    return allSpells.filter(spell => {
      const classMatch = spell.classes?.includes(className);
      const levelMatch = spell.level > 0 && spell.level <= maxSpellLevel;
      const searchMatch = !search || 
        spell.name.toLowerCase().includes(search.toLowerCase()) ||
        spell.school.toLowerCase().includes(search.toLowerCase());
      return classMatch && levelMatch && searchMatch;
    });
  }, [allSpells, className, maxSpellLevel, search]);

  // Group spells by level
  const spellsByLevel = useMemo(() => {
    const grouped: Record<number, Spell[]> = {};
    for (let i = 1; i <= 9; i++) {
      grouped[i] = availableSpells.filter(s => s.level === i);
    }
    return grouped;
  }, [availableSpells]);

  // Check if spell is already known
  const isSpellKnown = (spellId: string) => currentSpells.includes(spellId);

  // New spells selected this level
  const newlySelectedSpells = currentSpells.filter(id => {
    const spell = allSpells?.find(s => s.id === id);
    return spell && spell.level > previousMaxSpellLevel;
  });

  const toggleSpell = (spellId: string) => {
    if (isSpellKnown(spellId)) {
      onSpellsChange(currentSpells.filter(id => id !== spellId));
    } else {
      // Check limit for classes with spells known
      if (spellsKnownLimit && newlySelectedSpells.length >= newSpellsToLearn) {
        // Replace the oldest new spell
        const toRemove = newlySelectedSpells[0];
        onSpellsChange([...currentSpells.filter(id => id !== toRemove), spellId]);
      } else {
        onSpellsChange([...currentSpells, spellId]);
      }
    }
  };

  if (maxSpellLevel === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4 text-center text-muted-foreground">
          Загрузка заклинаний...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            <span className="font-medium">Заклинания</span>
          </div>
          <Badge variant="secondary">
            Макс. круг: {maxSpellLevel}
          </Badge>
        </div>

        {newSpellCircleUnlocked && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">
                Открыт {maxSpellLevel} круг заклинаний!
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Теперь вы можете изучить заклинания {maxSpellLevel} круга
            </p>
          </div>
        )}

        {spellsKnownLimit && (
          <div className="flex items-center gap-2 text-sm">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Заклинаний известно: {currentSpells.filter(id => {
                const spell = allSpells?.find(s => s.id === id);
                return spell && spell.level > 0;
              }).length} / {spellsKnownLimit}
            </span>
            {newSpellsToLearn > 0 && (
              <Badge variant="outline">+{newSpellsToLearn} новых</Badge>
            )}
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск заклинаний..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full">
            <TabsTrigger value="new" className="flex-1">
              Новый круг ({maxSpellLevel})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex-1">
              Все доступные
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="mt-3">
            <ScrollArea className="h-[250px]">
              <div className="space-y-2 pr-3">
                {spellsByLevel[maxSpellLevel]?.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    Нет заклинаний {maxSpellLevel} круга для этого класса
                  </p>
                ) : (
                  spellsByLevel[maxSpellLevel]?.map((spell) => (
                    <SpellItem
                      key={spell.id}
                      spell={spell}
                      isSelected={isSpellKnown(spell.id)}
                      onToggle={() => toggleSpell(spell.id)}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="all" className="mt-3">
            <ScrollArea className="h-[250px]">
              <div className="space-y-4 pr-3">
                {Array.from({ length: maxSpellLevel }, (_, i) => i + 1).map((level) => (
                  <div key={level}>
                    <div className="flex items-center gap-2 mb-2 sticky top-0 bg-background py-1">
                      <Badge variant="outline">{level} круг</Badge>
                      <span className="text-xs text-muted-foreground">
                        ({spellsByLevel[level]?.length || 0} заклинаний)
                      </span>
                    </div>
                    <div className="space-y-2">
                      {spellsByLevel[level]?.map((spell) => (
                        <SpellItem
                          key={spell.id}
                          spell={spell}
                          isSelected={isSpellKnown(spell.id)}
                          onToggle={() => toggleSpell(spell.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function SpellItem({
  spell,
  isSelected,
  onToggle,
}: {
  spell: Spell;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-2 rounded-lg border cursor-pointer transition-all",
        isSelected
          ? "border-primary bg-primary/10"
          : "border-border hover:border-primary/50 hover:bg-accent/50"
      )}
      onClick={onToggle}
    >
      <Checkbox checked={isSelected} className="mt-1" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{spell.name}</span>
          <Badge variant="secondary" className={cn("text-xs", schoolColors[spell.school])}>
            {spell.school}
          </Badge>
          {spell.ritual && (
            <Badge variant="outline" className="text-xs">Ритуал</Badge>
          )}
          {spell.concentration && (
            <Badge variant="outline" className="text-xs">Конц.</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {spell.description.slice(0, 100)}...
        </p>
        <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
          <span>{spell.casting_time}</span>
          <span>•</span>
          <span>{spell.range}</span>
          <span>•</span>
          <span>{spell.duration}</span>
        </div>
      </div>
    </div>
  );
}
