import { useSpells, useClasses, Spell } from "@/hooks/useRulebook";
import { CharacterData } from "@/hooks/useCharacterCreator";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Loader2, Wand2, Search, Info, Sparkles } from "lucide-react";
import { useState, useMemo } from "react";
import { SpellDescriptionDialog } from "../SpellDescriptionDialog";

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

interface SpellsStepProps {
  character: CharacterData;
  updateCharacter: (updates: Partial<CharacterData>) => void;
}

// School colors
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

export function SpellsStep({ character, updateCharacter }: SpellsStepProps) {
  const { data: spells, isLoading: spellsLoading } = useSpells();
  const { data: classes } = useClasses();
  const [search, setSearch] = useState("");
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const selectedClass = classes?.find(c => c.name === character.class);
  const hasSpellcasting = selectedClass?.spellcasting !== null;

  // Get spells available to this class
  const availableSpells = useMemo(() => {
    if (!spells || !character.class) return [];
    
    return spells.filter(spell => {
      // Filter by class
      if (!spell.classes?.some(c => c.toLowerCase().includes(character.class.toLowerCase()))) {
        return false;
      }
      // Only cantrips and 1st level for level 1 character
      if (spell.level > 1) return false;
      
      // Filter by search
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          spell.name.toLowerCase().includes(searchLower) ||
          spell.name_en?.toLowerCase().includes(searchLower) ||
          spell.school.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [spells, character.class, search]);

  const cantrips = availableSpells.filter(s => s.level === 0);
  const level1Spells = availableSpells.filter(s => s.level === 1);

  // Determine spell limits based on class
  const getSpellLimits = () => {
    switch (character.class) {
      case "Волшебник":
        return { cantrips: 3, known: 6 };
      case "Чародей":
        return { cantrips: 4, known: 2 };
      case "Бард":
        return { cantrips: 2, known: 4 };
      case "Колдун":
        return { cantrips: 2, known: 2 };
      case "Жрец":
      case "Друид":
        return { cantrips: 3, known: "all" }; // Prepared casters
      case "Паладин":
      case "Следопыт":
        return { cantrips: 0, known: 0 }; // No spells at level 1
      default:
        return { cantrips: 0, known: 0 };
    }
  };

  const limits = getSpellLimits();
  const selectedCantrips = character.known_spells.filter(id => 
    cantrips.some(s => s.id === id)
  );
  const selectedLevel1 = character.known_spells.filter(id => 
    level1Spells.some(s => s.id === id)
  );

  const toggleSpell = (spellId: string, isCantrip: boolean) => {
    const currentSpells = [...character.known_spells];
    const index = currentSpells.indexOf(spellId);
    
    if (index >= 0) {
      currentSpells.splice(index, 1);
    } else {
      // Check limits
      if (isCantrip && selectedCantrips.length >= limits.cantrips) return;
      if (!isCantrip && typeof limits.known === "number" && selectedLevel1.length >= limits.known) return;
      currentSpells.push(spellId);
    }
    
    updateCharacter({ known_spells: currentSpells });
  };

  const openSpellDetails = (spell: Spell, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSpell(spell);
    setDialogOpen(true);
  };

  if (spellsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasSpellcasting) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Заклинания</h2>
          <p className="text-muted-foreground">
            Класс {character.class || "не выбран"} не имеет заклинаний на 1 уровне.
          </p>
        </div>
        <Card className="p-8 text-center">
          <Wand2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Заклинания станут доступны на более высоких уровнях или при выборе магического класса.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Выберите заклинания</h2>
        <p className="text-muted-foreground">
          Выберите начальные заклинания для вашего {character.class}. Нажмите на <Info className="h-4 w-4 inline" /> для просмотра описания.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск заклинания..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Limits info */}
      <div className="flex gap-4 flex-wrap">
        <Badge variant="outline" className="text-sm">
          Заговоры: {selectedCantrips.length} / {limits.cantrips}
        </Badge>
        <Badge variant="outline" className="text-sm">
          Заклинания 1 ур.: {selectedLevel1.length} / {typeof limits.known === "number" ? limits.known : "все"}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Cantrips */}
        {limits.cantrips > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Badge>Заговоры</Badge>
              <span className="text-sm text-muted-foreground">
                ({selectedCantrips.length}/{limits.cantrips})
              </span>
            </h3>
            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-2">
                {cantrips.map((spell) => {
                  const isSelected = character.known_spells.includes(spell.id);
                  const colorClass = schoolColors[spell.school] || "";
                  const spellIconKey = getSpellIconKey(spell.name_en);
                  const schoolIconKey = schoolIconKeys[spell.school] || "evocation";
                  const spellIcon = spellIcons[spellIconKey] || spellIcons[schoolIconKey];
                  
                  return (
                    <Card
                      key={spell.id}
                      className={`cursor-pointer transition-all ${isSelected ? "border-primary ring-1 ring-primary/50" : ""}`}
                      onClick={() => toggleSpell(spell.id, true)}
                    >
                      <CardHeader className="py-2 px-3">
                        <div className="flex items-center gap-3">
                          <Checkbox checked={isSelected} />
                          {/* Spell Icon */}
                          <div className="w-10 h-10 rounded-md overflow-hidden border border-border/50 flex-shrink-0">
                            {spellIcon ? (
                              <img 
                                src={spellIcon} 
                                alt={spell.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm">{spell.name}</CardTitle>
                            <div className="flex gap-1 mt-1">
                              <Badge variant="outline" className={`text-xs ${colorClass}`}>
                                {spell.school}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={(e) => openSpellDetails(spell, e)}
                          >
                            <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Level 1 Spells */}
        {(limits.known === "all" || (typeof limits.known === "number" && limits.known > 0)) && (
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Badge variant="secondary">1 уровень</Badge>
              <span className="text-sm text-muted-foreground">
                ({selectedLevel1.length}/{typeof limits.known === "number" ? limits.known : level1Spells.length})
              </span>
            </h3>
            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-2">
                {level1Spells.map((spell) => {
                  const isSelected = character.known_spells.includes(spell.id);
                  const colorClass = schoolColors[spell.school] || "";
                  const spellIconKey = getSpellIconKey(spell.name_en);
                  const schoolIconKey = schoolIconKeys[spell.school] || "evocation";
                  const spellIcon = spellIcons[spellIconKey] || spellIcons[schoolIconKey];
                  
                  return (
                    <Card
                      key={spell.id}
                      className={`cursor-pointer transition-all ${isSelected ? "border-primary ring-1 ring-primary/50" : ""}`}
                      onClick={() => toggleSpell(spell.id, false)}
                    >
                      <CardHeader className="py-2 px-3">
                        <div className="flex items-center gap-3">
                          <Checkbox checked={isSelected} />
                          {/* Spell Icon */}
                          <div className="w-10 h-10 rounded-md overflow-hidden border border-border/50 flex-shrink-0">
                            {spellIcon ? (
                              <img 
                                src={spellIcon} 
                                alt={spell.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm">{spell.name}</CardTitle>
                            <div className="flex gap-1 mt-1 flex-wrap">
                              <Badge variant="outline" className={`text-xs ${colorClass}`}>
                                {spell.school}
                              </Badge>
                              {spell.concentration && (
                                <Badge variant="outline" className="text-xs">К</Badge>
                              )}
                              {spell.ritual && (
                                <Badge variant="outline" className="text-xs">Р</Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={(e) => openSpellDetails(spell, e)}
                          >
                            <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Spell Description Dialog */}
      <SpellDescriptionDialog
        spell={selectedSpell}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
