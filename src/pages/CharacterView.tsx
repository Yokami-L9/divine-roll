import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSpells, Spell } from "@/hooks/useRulebook";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, Loader2, Shield, Heart, 
  Footprints, Star, User, Sparkles, Languages,
  Swords, Package, BookOpen, Plus
} from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { cn } from "@/lib/utils";
import { SpellDescriptionDialog } from "@/components/character-creator/SpellDescriptionDialog";
import { InventoryGrid } from "@/components/character/InventoryGrid";
import { CharacterJournal } from "@/components/character/CharacterJournal";
import { LevelUpDialog } from "@/components/character/LevelUpDialog";
import { ASIDialog } from "@/components/character/ASIDialog";

// Dynamically import all spell icons
const spellIconsContext = import.meta.glob('@/assets/spells/*.png', { eager: true, import: 'default' });

const spellIcons: Record<string, string> = {};
Object.entries(spellIconsContext).forEach(([path, module]) => {
  const fileName = path.split('/').pop()?.replace('.png', '') || '';
  spellIcons[fileName] = module as string;
});

function getSpellIconKey(nameEn: string | null): string {
  if (!nameEn) return '';
  return nameEn
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

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

interface CharacterData {
  id: string;
  name: string;
  race: string;
  subrace: string | null;
  class: string;
  class_levels: Record<string, number> | null;
  subclasses: Record<string, string> | null;
  level: number;
  background: string | null;
  alignment: string | null;
  hp: number;
  max_hp: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiency_bonus: number | null;
  armor_class: number | null;
  initiative: number | null;
  speed: number | null;
  skill_proficiencies: string[] | null;
  saving_throw_proficiencies: string[] | null;
  languages: string[] | null;
  equipment: string[] | null;
  traits: string[] | null;
  known_spells: string[] | null;
  prepared_spells: string[] | null;
  personality_trait: string | null;
  ideal: string | null;
  bond: string | null;
  flaw: string | null;
  backstory: string | null;
  avatar_url: string | null;
}

const ABILITY_NAMES: Record<string, string> = {
  strength: "Сила",
  dexterity: "Ловкость",
  constitution: "Телосложение",
  intelligence: "Интеллект",
  wisdom: "Мудрость",
  charisma: "Харизма",
};

const SKILLS: { name: string; ability: string }[] = [
  { name: "Акробатика", ability: "dexterity" },
  { name: "Анализ", ability: "intelligence" },
  { name: "Атлетика", ability: "strength" },
  { name: "Внимательность", ability: "wisdom" },
  { name: "Выживание", ability: "wisdom" },
  { name: "Выступление", ability: "charisma" },
  { name: "Запугивание", ability: "charisma" },
  { name: "История", ability: "intelligence" },
  { name: "Ловкость рук", ability: "dexterity" },
  { name: "Магия", ability: "intelligence" },
  { name: "Медицина", ability: "wisdom" },
  { name: "Обман", ability: "charisma" },
  { name: "Природа", ability: "intelligence" },
  { name: "Проницательность", ability: "wisdom" },
  { name: "Религия", ability: "intelligence" },
  { name: "Скрытность", ability: "dexterity" },
  { name: "Убеждение", ability: "charisma" },
  { name: "Уход за животными", ability: "wisdom" },
];

type AbilityKey = keyof typeof ABILITY_NAMES;

const CharacterView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: allSpells } = useSpells();
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [spellDialogOpen, setSpellDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [levelUpOpen, setLevelUpOpen] = useState(false);
  const [asiOpen, setAsiOpen] = useState(false);
  const [pendingASIClass, setPendingASIClass] = useState<string | null>(null);

  const abilities: AbilityKey[] = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];

  useEffect(() => {
    if (id && user) {
      fetchCharacter();
    }
  }, [id, user]);

  const fetchCharacter = async () => {
    try {
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast.error("Персонаж не найден");
        navigate("/characters");
        return;
      }

      setCharacter({
        ...data,
        class_levels: (data.class_levels as Record<string, number>) || { [data.class]: data.level },
        subclasses: (data.subclasses as Record<string, string>) || {}
      });
    } catch (error) {
      console.error("Error fetching character:", error);
      toast.error("Ошибка загрузки персонажа");
    } finally {
      setLoading(false);
    }
  };

  const getModifier = (score: number) => Math.floor((score - 10) / 2);
  const formatModifier = (mod: number) => (mod >= 0 ? `+${mod}` : `${mod}`);

  const getSpell = (spellId: string) => {
    return allSpells?.find(s => s.id === spellId);
  };

  const openSpellDetails = (spell: Spell) => {
    setSelectedSpell(spell);
    setSpellDialogOpen(true);
  };

  const handleUpdateEquipment = async (newEquipment: string[]) => {
    if (!character || !id) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("characters")
        .update({ equipment: newEquipment })
        .eq("id", id);

      if (error) throw error;
      setCharacter({ ...character, equipment: newEquipment });
      toast.success("Инвентарь обновлён");
    } catch (error) {
      console.error("Error updating equipment:", error);
      toast.error("Не удалось обновить инвентарь");
    } finally {
      setSaving(false);
    }
  };
  // ASI levels (PHB)
  const ASI_LEVELS = [4, 8, 12, 16, 19];
  
  const isASILevel = (className: string, classLevel: number) => {
    if (className === "Воин") {
      return ASI_LEVELS.includes(classLevel) || classLevel === 6 || classLevel === 14;
    }
    if (className === "Плут") {
      return ASI_LEVELS.includes(classLevel) || classLevel === 10;
    }
    return ASI_LEVELS.includes(classLevel);
  };

  const handleLevelUp = async (
    selectedClass: string, 
    newClassLevels: Record<string, number>, 
    hpIncrease: number,
    selectedSubclass: string | null,
    newSubclasses: Record<string, string>
  ) => {
    if (!character || !id) return;

    setSaving(true);
    try {
      const newLevel = character.level + 1;
      const newProficiencyBonus = Math.floor((newLevel - 1) / 4) + 2;
      const newClassLevel = newClassLevels[selectedClass] || 1;
      
      const { error } = await supabase
        .from("characters")
        .update({ 
          level: newLevel,
          class_levels: newClassLevels,
          subclasses: newSubclasses,
          hp: character.hp + hpIncrease,
          max_hp: character.max_hp + hpIncrease,
          proficiency_bonus: newProficiencyBonus,
        })
        .eq("id", id);

      if (error) throw error;
      
      setCharacter({ 
        ...character, 
        level: newLevel,
        class_levels: newClassLevels,
        subclasses: newSubclasses,
        hp: character.hp + hpIncrease,
        max_hp: character.max_hp + hpIncrease,
        proficiency_bonus: newProficiencyBonus,
      });
      
      const subclassMsg = selectedSubclass ? ` Выбран архетип: ${selectedSubclass}` : '';
      toast.success(`Уровень повышен до ${newLevel}! +${hpIncrease} HP${subclassMsg}`);
      
      // Check if ASI is available at this level
      if (isASILevel(selectedClass, newClassLevel)) {
        setPendingASIClass(selectedClass);
        setAsiOpen(true);
      }
    } catch (error) {
      console.error("Error leveling up:", error);
      toast.error("Не удалось повысить уровень");
    } finally {
      setSaving(false);
    }
  };

  const handleASIConfirm = async (
    abilityChanges: Record<string, number>,
    selectedFeat: string | null
  ) => {
    if (!character || !id) return;

    setSaving(true);
    try {
      const updates: Record<string, unknown> = {};
      
      // Apply ability changes
      if (Object.keys(abilityChanges).length > 0) {
        for (const [ability, change] of Object.entries(abilityChanges)) {
          if (change > 0) {
            const currentValue = character[ability as keyof CharacterData] as number;
            updates[ability] = Math.min(currentValue + change, 20);
          }
        }
      }
      
      // Apply feat (store in traits)
      if (selectedFeat) {
        updates.traits = [...(character.traits || []), `Черта: ${selectedFeat}`];
      }

      if (Object.keys(updates).length > 0) {
        const { error } = await supabase
          .from("characters")
          .update(updates)
          .eq("id", id);

        if (error) throw error;

        setCharacter({
          ...character,
          ...updates as Partial<CharacterData>,
        });

        if (selectedFeat) {
          toast.success(`Получена черта: ${selectedFeat}`);
        } else {
          const changes = Object.entries(abilityChanges)
            .filter(([_, v]) => v > 0)
            .map(([k, v]) => `${ABILITY_NAMES[k]} +${v}`)
            .join(", ");
          toast.success(`Характеристики улучшены: ${changes}`);
        }
      }
    } catch (error) {
      console.error("Error applying ASI:", error);
      toast.error("Не удалось применить улучшения");
    } finally {
      setSaving(false);
      setPendingASIClass(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Войдите в систему для просмотра персонажа</p>
            <Link to="/auth">
              <Button className="mt-4">Войти</Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Персонаж не найден</p>
            <Link to="/characters">
              <Button className="mt-4">Вернуться к списку</Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  const proficiencyBonus = character.proficiency_bonus || 2;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" asChild>
            <Link to="/characters">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Назад
            </Link>
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="space-y-4 pr-4">
            {/* Character Header */}
            <Card className="bg-gradient-to-br from-primary/20 to-transparent">
              <CardContent className="py-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center border-4 border-primary shadow-lg overflow-hidden">
                    {character.avatar_url ? (
                      <img 
                        src={character.avatar_url} 
                        alt={character.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-primary">
                        {character.name?.charAt(0) || "?"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold">{character.name}</h1>
                    <p className="text-lg text-muted-foreground">
                      {character.race} {character.subrace ? `(${character.subrace})` : ""}
                    </p>
                    {/* Multiclass display */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {character.class_levels && Object.keys(character.class_levels).length > 0 ? (
                        Object.entries(character.class_levels)
                          .filter(([_, lvl]) => lvl > 0)
                          .map(([className, lvl]) => {
                            const subclass = character.subclasses?.[className];
                            return (
                              <Badge key={className} variant="secondary" className="text-xs">
                                {className} {lvl}
                                {subclass && <span className="ml-1 opacity-70">({subclass})</span>}
                              </Badge>
                            );
                          })
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          {character.class} {character.level}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap items-center">
                      <Badge>Уровень {character.level}</Badge>
                      {character.level < 20 && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                          onClick={() => setLevelUpOpen(true)}
                          disabled={saving}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                      {character.alignment && <Badge variant="outline">{character.alignment}</Badge>}
                      {character.background && <Badge variant="secondary">{character.background}</Badge>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Combat Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="py-4">
                  <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
                  <div className="text-2xl font-bold">{character.hp}/{character.max_hp}</div>
                  <div className="text-xs text-muted-foreground">Хиты</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="py-4">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{character.armor_class || 10}</div>
                  <div className="text-xs text-muted-foreground">КД</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="py-4">
                  <Swords className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold">
                    {formatModifier(getModifier(character.dexterity))}
                  </div>
                  <div className="text-xs text-muted-foreground">Инициатива</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="py-4">
                  <Footprints className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{character.speed || 30}</div>
                  <div className="text-xs text-muted-foreground">Скорость (фт)</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="abilities" className="space-y-4">
              <TabsList className="bg-card border w-full justify-start">
                <TabsTrigger value="abilities">Характеристики</TabsTrigger>
                <TabsTrigger value="spells">Заклинания</TabsTrigger>
                <TabsTrigger value="inventory">Инвентарь</TabsTrigger>
                <TabsTrigger value="journal">Дневник</TabsTrigger>
                <TabsTrigger value="personality">Личность</TabsTrigger>
              </TabsList>

              <TabsContent value="abilities">
                {/* Abilities Grid - same style as ReviewStep */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {abilities.map((ability) => {
                    const value = character[ability];
                    const abilityMod = getModifier(value);
                    const isSaveProficient = character.saving_throw_proficiencies?.includes(
                      ABILITY_NAMES[ability]
                    );
                    const saveMod = isSaveProficient ? abilityMod + proficiencyBonus : abilityMod;
                    const abilitySkills = SKILLS.filter(s => s.ability === ability);
                    
                    return (
                      <Card key={ability} className="overflow-hidden">
                        <CardHeader className="pb-2 bg-primary/5">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-base">{ABILITY_NAMES[ability]}</CardTitle>
                              <p className="text-xs text-muted-foreground">Модификатор</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold">{value}</div>
                              <div className={cn(
                                "text-lg font-bold",
                                abilityMod > 0 && "text-green-500",
                                abilityMod < 0 && "text-red-500",
                                abilityMod === 0 && "text-muted-foreground"
                              )}>
                                {formatModifier(abilityMod)}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-3 space-y-1.5">
                          {/* Saving Throw */}
                          <div className={cn(
                            "flex items-center justify-between py-1.5 px-2 rounded text-sm border",
                            isSaveProficient ? "bg-primary/10 border-primary/30" : "bg-muted/30 border-transparent"
                          )}>
                            <span className={cn(
                              "flex items-center gap-1.5",
                              isSaveProficient && "font-medium"
                            )}>
                              {isSaveProficient && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                              <Shield className="h-3 w-3" />
                              Спасбросок
                            </span>
                            <span className={cn(
                              "font-mono text-sm font-bold",
                              saveMod > 0 && "text-green-500",
                              saveMod < 0 && "text-red-500"
                            )}>
                              {formatModifier(saveMod)}
                            </span>
                          </div>
                          
                          {/* Skills */}
                          {abilitySkills.length > 0 && (
                            <div className="pt-1 border-t border-border/50">
                              <p className="text-xs text-muted-foreground mb-1.5 px-2">Навыки:</p>
                              {abilitySkills.map((skill) => {
                                const isProficient = character.skill_proficiencies?.includes(skill.name) || false;
                                const skillMod = isProficient 
                                  ? abilityMod + proficiencyBonus 
                                  : abilityMod;
                                
                                return (
                                  <div 
                                    key={skill.name}
                                    className={cn(
                                      "flex items-center justify-between py-1.5 px-2 rounded text-sm",
                                      isProficient ? "bg-primary/10" : ""
                                    )}
                                  >
                                    <span className={cn(
                                      "flex items-center gap-1.5",
                                      isProficient ? "font-medium" : "text-muted-foreground"
                                    )}>
                                      {isProficient && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                      {skill.name}
                                    </span>
                                    <span className={cn(
                                      "font-mono text-sm font-bold",
                                      skillMod > 0 && "text-green-500",
                                      skillMod < 0 && "text-red-500",
                                      skillMod === 0 && "text-muted-foreground"
                                    )}>
                                      {formatModifier(skillMod)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Proficiency Bonus */}
                <div className="text-center text-sm text-muted-foreground mt-4">
                  <Badge variant="outline" className="font-mono">
                    Бонус мастерства: {formatModifier(proficiencyBonus)}
                  </Badge>
                  <p className="mt-1 text-xs">
                    • Маркер показывает владение навыком или спасброском
                  </p>
                </div>

                {/* Languages & Traits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {character.languages && character.languages.length > 0 && (
                    <Card className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Languages className="h-4 w-4" />
                        Языки
                      </h3>
                      <div className="flex gap-1 flex-wrap">
                        {character.languages.map((lang, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  )}

                  {character.traits && character.traits.length > 0 && (
                    <Card className="p-4">
                      <h3 className="font-semibold mb-3">Расовые черты</h3>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {character.traits.map((trait, i) => (
                          <li key={i}>• {trait}</li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="spells">
                {!character.known_spells || character.known_spells.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Нет известных заклинаний</p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {character.known_spells.map((spellId) => {
                      const spell = getSpell(spellId);
                      if (!spell) return null;
                      
                      const spellIconKey = getSpellIconKey(spell.name_en);
                      const schoolIconKey = schoolIconKeys[spell.school] || "evocation";
                      const spellIcon = spellIcons[spellIconKey] || spellIcons[schoolIconKey];
                      
                      return (
                        <div 
                          key={spellId}
                          className="flex items-center gap-2 p-2 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
                          onClick={() => openSpellDetails(spell)}
                        >
                          <div className="w-8 h-8 rounded overflow-hidden border border-border/50 flex-shrink-0">
                            {spellIcon ? (
                              <img 
                                src={spellIcon} 
                                alt={spell.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{spell.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {spell.level === 0 ? "Заговор" : `${spell.level} ур.`} • {spell.school}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {spell.concentration && (
                              <Badge variant="outline" className="text-[10px] px-1 py-0">К</Badge>
                            )}
                            {spell.ritual && (
                              <Badge variant="outline" className="text-[10px] px-1 py-0">Р</Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="inventory">
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      Инвентарь
                    </h3>
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                  <InventoryGrid 
                    items={character.equipment || []}
                    onUpdate={handleUpdateEquipment}
                    columns={6}
                    rows={5}
                  />
                </Card>
              </TabsContent>

              <TabsContent value="journal">
                <Card className="p-4">
                  <CharacterJournal characterId={id!} />
                </Card>
              </TabsContent>

              <TabsContent value="personality">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {character.personality_trait && (
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Черта характера</h3>
                      <p className="text-muted-foreground text-sm">{character.personality_trait}</p>
                    </Card>
                  )}
                  {character.ideal && (
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Идеал</h3>
                      <p className="text-muted-foreground text-sm">{character.ideal}</p>
                    </Card>
                  )}
                  {character.bond && (
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Привязанность</h3>
                      <p className="text-muted-foreground text-sm">{character.bond}</p>
                    </Card>
                  )}
                  {character.flaw && (
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Слабость</h3>
                      <p className="text-muted-foreground text-sm">{character.flaw}</p>
                    </Card>
                  )}
                  {character.backstory && (
                    <Card className="p-4 md:col-span-2">
                      <h3 className="font-semibold mb-2">Предыстория</h3>
                      <p className="text-muted-foreground text-sm whitespace-pre-wrap">{character.backstory}</p>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>

        {/* Spell Dialog */}
        <SpellDescriptionDialog
          spell={selectedSpell}
          open={spellDialogOpen}
          onOpenChange={setSpellDialogOpen}
        />

        {/* Level Up Dialog */}
        <LevelUpDialog
          open={levelUpOpen}
          onOpenChange={setLevelUpOpen}
          characterName={character.name}
          currentLevel={character.level}
          classLevels={character.class_levels || { [character.class]: character.level }}
          primaryClass={character.class}
          abilities={{
            strength: character.strength,
            dexterity: character.dexterity,
            constitution: character.constitution,
            intelligence: character.intelligence,
            wisdom: character.wisdom,
            charisma: character.charisma,
          }}
          characterSubclasses={character.subclasses || {}}
          onLevelUp={handleLevelUp}
        />

        {/* ASI Dialog */}
        <ASIDialog
          open={asiOpen}
          onOpenChange={setAsiOpen}
          currentAbilities={{
            strength: character.strength,
            dexterity: character.dexterity,
            constitution: character.constitution,
            intelligence: character.intelligence,
            wisdom: character.wisdom,
            charisma: character.charisma,
          }}
          onConfirm={handleASIConfirm}
        />
      </main>
    </div>
  );
};

export default CharacterView;
