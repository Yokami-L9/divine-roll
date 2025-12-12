import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, Edit, Save, X, Loader2, Shield, Heart, 
  Footprints, Star, User, Sword, BookOpen, Sparkles, Info
} from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

interface CharacterData {
  id: string;
  name: string;
  race: string;
  subrace: string | null;
  class: string;
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

interface SpellData {
  id: string;
  name: string;
  level: number;
  school: string;
  casting_time: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  higher_levels: string | null;
  concentration: boolean | null;
  ritual: boolean | null;
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

const CharacterView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [spells, setSpells] = useState<SpellData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpell, setSelectedSpell] = useState<SpellData | null>(null);
  const [spellDialogOpen, setSpellDialogOpen] = useState(false);

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

      setCharacter(data);

      // Fetch spells if character has any
      if (data.known_spells && data.known_spells.length > 0) {
        const { data: spellsData } = await supabase
          .from("spells")
          .select("*")
          .in("id", data.known_spells);
        
        if (spellsData) {
          setSpells(spellsData);
        }
      }
    } catch (error) {
      console.error("Error fetching character:", error);
      toast.error("Ошибка загрузки персонажа");
    } finally {
      setLoading(false);
    }
  };

  const getModifier = (score: number) => Math.floor((score - 10) / 2);
  
  const formatModifier = (mod: number) => (mod >= 0 ? `+${mod}` : `${mod}`);

  const getSkillModifier = (skillName: string, abilityKey: string) => {
    if (!character) return 0;
    const abilityScore = character[abilityKey as keyof CharacterData] as number;
    const abilityMod = getModifier(abilityScore);
    const isProficient = character.skill_proficiencies?.includes(skillName) || false;
    const profBonus = character.proficiency_bonus || 2;
    return abilityMod + (isProficient ? profBonus : 0);
  };

  const getSavingThrowModifier = (abilityKey: string) => {
    if (!character) return 0;
    const abilityScore = character[abilityKey as keyof CharacterData] as number;
    const abilityMod = getModifier(abilityScore);
    const abilityName = ABILITY_NAMES[abilityKey];
    const isProficient = character.saving_throw_proficiencies?.includes(abilityName) || false;
    const profBonus = character.proficiency_bonus || 2;
    return abilityMod + (isProficient ? profBonus : 0);
  };

  const openSpellDetails = (spell: SpellData) => {
    setSelectedSpell(spell);
    setSpellDialogOpen(true);
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
          <Link to={`/characters/${id}/edit`}>
            <Button className="gap-2">
              <Edit className="h-4 w-4" />
              Редактировать
            </Button>
          </Link>
        </div>

        {/* Character Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-gold rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-serif font-bold mb-2">{character.name}</h1>
              <p className="text-lg text-muted-foreground mb-3">
                {character.race}{character.subrace ? ` (${character.subrace})` : ""} • {character.class} • Уровень {character.level}
              </p>
              <div className="flex flex-wrap gap-2">
                {character.background && (
                  <Badge variant="secondary">{character.background}</Badge>
                )}
                {character.alignment && (
                  <Badge variant="outline">{character.alignment}</Badge>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Combat Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4 text-center">
            <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{character.armor_class || 10}</div>
            <div className="text-sm text-muted-foreground">Класс брони</div>
          </Card>
          <Card className="p-4 text-center">
            <Heart className="w-6 h-6 mx-auto mb-2 text-destructive" />
            <div className="text-2xl font-bold">{character.hp}/{character.max_hp}</div>
            <div className="text-sm text-muted-foreground">Хиты</div>
          </Card>
          <Card className="p-4 text-center">
            <Footprints className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{character.speed || 30}</div>
            <div className="text-sm text-muted-foreground">Скорость</div>
          </Card>
          <Card className="p-4 text-center">
            <Star className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">+{character.proficiency_bonus || 2}</div>
            <div className="text-sm text-muted-foreground">Мастерство</div>
          </Card>
          <Card className="p-4 text-center">
            <Sword className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{formatModifier(getModifier(character.dexterity))}</div>
            <div className="text-sm text-muted-foreground">Инициатива</div>
          </Card>
        </div>

        <Tabs defaultValue="abilities" className="space-y-6">
          <TabsList className="bg-card border">
            <TabsTrigger value="abilities">Характеристики</TabsTrigger>
            <TabsTrigger value="spells">Заклинания</TabsTrigger>
            <TabsTrigger value="equipment">Снаряжение</TabsTrigger>
            <TabsTrigger value="personality">Личность</TabsTrigger>
          </TabsList>

          <TabsContent value="abilities">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(ABILITY_NAMES).map(([key, name]) => {
                const score = character[key as keyof CharacterData] as number;
                const mod = getModifier(score);
                const saveMod = getSavingThrowModifier(key);
                const isSaveProficient = character.saving_throw_proficiencies?.includes(name) || false;
                const relatedSkills = SKILLS.filter(s => s.ability === key);

                return (
                  <Card key={key} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{name}</h3>
                        <div className="text-2xl font-bold">
                          {score} <span className="text-muted-foreground text-lg">({formatModifier(mod)})</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className={`flex items-center justify-between text-sm p-2 rounded ${isSaveProficient ? 'bg-primary/10' : 'bg-muted/50'}`}>
                        <span className="flex items-center gap-2">
                          {isSaveProficient && <div className="w-2 h-2 rounded-full bg-primary" />}
                          Спасбросок
                        </span>
                        <span className="font-medium">{formatModifier(saveMod)}</span>
                      </div>

                      {relatedSkills.map(skill => {
                        const skillMod = getSkillModifier(skill.name, key);
                        const isProficient = character.skill_proficiencies?.includes(skill.name) || false;
                        
                        return (
                          <div 
                            key={skill.name} 
                            className={`flex items-center justify-between text-sm p-2 rounded ${isProficient ? 'bg-primary/10' : 'bg-muted/50'}`}
                          >
                            <span className="flex items-center gap-2">
                              {isProficient && <div className="w-2 h-2 rounded-full bg-primary" />}
                              {skill.name}
                            </span>
                            <span className="font-medium">{formatModifier(skillMod)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Languages & Traits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {character.languages && character.languages.length > 0 && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Языки</h3>
                  <div className="flex flex-wrap gap-2">
                    {character.languages.map((lang, idx) => (
                      <Badge key={idx} variant="secondary">{lang}</Badge>
                    ))}
                  </div>
                </Card>
              )}

              {character.traits && character.traits.length > 0 && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Расовые особенности</h3>
                  <ul className="space-y-1 text-sm">
                    {character.traits.map((trait, idx) => (
                      <li key={idx} className="text-muted-foreground">• {trait}</li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="spells">
            {spells.length === 0 ? (
              <Card className="p-8 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Нет известных заклинаний</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {spells
                  .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
                  .map(spell => (
                    <Card 
                      key={spell.id} 
                      className="p-4 hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => openSpellDetails(spell)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{spell.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {spell.level === 0 ? "Заговор" : `${spell.level} уровень`} • {spell.school}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {spell.concentration && <Badge variant="outline" className="text-xs">К</Badge>}
                        {spell.ritual && <Badge variant="outline" className="text-xs">Р</Badge>}
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="equipment">
            {!character.equipment || character.equipment.length === 0 ? (
              <Card className="p-8 text-center">
                <Sword className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Нет снаряжения</p>
              </Card>
            ) : (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Снаряжение</h3>
                <ul className="space-y-2">
                  {character.equipment
                    .filter(e => e !== "__NO_EQUIPMENT__")
                    .map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                </ul>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="personality">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {character.personality_trait && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Черта характера</h3>
                  <p className="text-muted-foreground">{character.personality_trait}</p>
                </Card>
              )}
              {character.ideal && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Идеал</h3>
                  <p className="text-muted-foreground">{character.ideal}</p>
                </Card>
              )}
              {character.bond && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Привязанность</h3>
                  <p className="text-muted-foreground">{character.bond}</p>
                </Card>
              )}
              {character.flaw && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">Слабость</h3>
                  <p className="text-muted-foreground">{character.flaw}</p>
                </Card>
              )}
              {character.backstory && (
                <Card className="p-4 md:col-span-2">
                  <h3 className="font-semibold mb-2">Предыстория</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{character.backstory}</p>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Spell Dialog */}
        <Dialog open={spellDialogOpen} onOpenChange={setSpellDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedSpell?.name}
                <Badge variant="secondary">
                  {selectedSpell?.level === 0 ? "Заговор" : `${selectedSpell?.level} уровень`}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              {selectedSpell && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><strong>Школа:</strong> {selectedSpell.school}</div>
                    <div><strong>Время:</strong> {selectedSpell.casting_time}</div>
                    <div><strong>Дистанция:</strong> {selectedSpell.range}</div>
                    <div><strong>Компоненты:</strong> {selectedSpell.components}</div>
                    <div><strong>Длительность:</strong> {selectedSpell.duration}</div>
                    <div className="flex gap-2">
                      {selectedSpell.concentration && <Badge>Концентрация</Badge>}
                      {selectedSpell.ritual && <Badge variant="outline">Ритуал</Badge>}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Описание</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{selectedSpell.description}</p>
                  </div>
                  {selectedSpell.higher_levels && (
                    <div>
                      <h4 className="font-semibold mb-2">На более высоких уровнях</h4>
                      <p className="text-muted-foreground">{selectedSpell.higher_levels}</p>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default CharacterView;
