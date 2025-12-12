import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Save, Loader2, User } from "lucide-react";
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
  speed: number | null;
  personality_trait: string | null;
  ideal: string | null;
  bond: string | null;
  flaw: string | null;
  backstory: string | null;
  avatar_url: string | null;
}

const ALIGNMENTS = [
  "Законопослушный добрый",
  "Нейтральный добрый",
  "Хаотичный добрый",
  "Законопослушный нейтральный",
  "Истинно нейтральный",
  "Хаотичный нейтральный",
  "Законопослушный злой",
  "Нейтральный злой",
  "Хаотичный злой",
];

const CharacterEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    } catch (error) {
      console.error("Error fetching character:", error);
      toast.error("Ошибка загрузки персонажа");
    } finally {
      setLoading(false);
    }
  };

  const updateField = <K extends keyof CharacterData>(field: K, value: CharacterData[K]) => {
    if (!character) return;
    setCharacter({ ...character, [field]: value });
  };

  const handleSave = async () => {
    if (!character) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("characters")
        .update({
          name: character.name,
          level: character.level,
          alignment: character.alignment,
          hp: character.hp,
          max_hp: character.max_hp,
          strength: character.strength,
          dexterity: character.dexterity,
          constitution: character.constitution,
          intelligence: character.intelligence,
          wisdom: character.wisdom,
          charisma: character.charisma,
          armor_class: character.armor_class,
          speed: character.speed,
          personality_trait: character.personality_trait,
          ideal: character.ideal,
          bond: character.bond,
          flaw: character.flaw,
          backstory: character.backstory,
        })
        .eq("id", character.id);

      if (error) throw error;

      toast.success("Персонаж сохранён!");
      navigate(`/characters/${id}`);
    } catch (error) {
      console.error("Error saving character:", error);
      toast.error("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Войдите в систему</p>
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
              <Button className="mt-4">Вернуться</Button>
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
            <Link to={`/characters/${id}`}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Отмена
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-gradient-gold">
              {character.avatar_url ? (
                <img 
                  src={character.avatar_url} 
                  alt={character.name}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 15%' }}
                />
              ) : (
                <User className="w-6 h-6 text-primary-foreground" />
              )}
            </div>
            <h1 className="text-2xl font-bold">Редактирование персонажа</h1>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Сохранить
          </Button>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="bg-card border">
            <TabsTrigger value="basic">Основное</TabsTrigger>
            <TabsTrigger value="abilities">Характеристики</TabsTrigger>
            <TabsTrigger value="combat">Боевые</TabsTrigger>
            <TabsTrigger value="personality">Личность</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Имя</Label>
                  <Input
                    value={character.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Уровень</Label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={character.level}
                    onChange={(e) => updateField("level", parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Раса</Label>
                  <Input value={character.race} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Класс</Label>
                  <Input value={character.class} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label>Мировоззрение</Label>
                  <Select
                    value={character.alignment || ""}
                    onValueChange={(value) => updateField("alignment", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите мировоззрение" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALIGNMENTS.map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Предыстория</Label>
                  <Input value={character.background || ""} disabled className="bg-muted" />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="abilities">
            <Card className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { key: "strength", label: "Сила" },
                  { key: "dexterity", label: "Ловкость" },
                  { key: "constitution", label: "Телосложение" },
                  { key: "intelligence", label: "Интеллект" },
                  { key: "wisdom", label: "Мудрость" },
                  { key: "charisma", label: "Харизма" },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-2">
                    <Label>{label}</Label>
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      value={character[key as keyof CharacterData] as number}
                      onChange={(e) => updateField(key as keyof CharacterData, parseInt(e.target.value) || 10)}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="combat">
            <Card className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label>Текущие хиты</Label>
                  <Input
                    type="number"
                    min={0}
                    value={character.hp}
                    onChange={(e) => updateField("hp", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Максимум хитов</Label>
                  <Input
                    type="number"
                    min={1}
                    value={character.max_hp}
                    onChange={(e) => updateField("max_hp", parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Класс брони</Label>
                  <Input
                    type="number"
                    min={1}
                    value={character.armor_class || 10}
                    onChange={(e) => updateField("armor_class", parseInt(e.target.value) || 10)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Скорость</Label>
                  <Input
                    type="number"
                    min={0}
                    value={character.speed || 30}
                    onChange={(e) => updateField("speed", parseInt(e.target.value) || 30)}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="personality">
            <Card className="p-6 space-y-6">
              <div className="space-y-2">
                <Label>Черта характера</Label>
                <Textarea
                  value={character.personality_trait || ""}
                  onChange={(e) => updateField("personality_trait", e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Идеал</Label>
                <Textarea
                  value={character.ideal || ""}
                  onChange={(e) => updateField("ideal", e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Привязанность</Label>
                <Textarea
                  value={character.bond || ""}
                  onChange={(e) => updateField("bond", e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Слабость</Label>
                <Textarea
                  value={character.flaw || ""}
                  onChange={(e) => updateField("flaw", e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Предыстория персонажа</Label>
                <Textarea
                  value={character.backstory || ""}
                  onChange={(e) => updateField("backstory", e.target.value)}
                  rows={6}
                  placeholder="Расскажите историю своего персонажа..."
                />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CharacterEdit;
