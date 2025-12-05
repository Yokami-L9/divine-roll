import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sword, Sparkles, Shield, Save, Wand2, Loader2 } from "lucide-react";
import { useHomebrew } from "@/hooks/useHomebrew";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const HomebrewCreator = () => {
  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState("");
  const [itemRarity, setItemRarity] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemEffect, setItemEffect] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const { createItem } = useHomebrew();
  const { user } = useAuth();
  const { toast } = useToast();

  const itemTypes = ["Оружие", "Броня", "Зелье", "Кольцо", "Жезл", "Свиток", "Чудесный предмет"];
  const rarities = ["Обычный", "Необычный", "Редкий", "Очень редкий", "Легендарный", "Артефакт"];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Необычный": return "text-green-400";
      case "Редкий": return "text-blue-400";
      case "Очень редкий": return "text-purple-400";
      case "Легендарный": return "text-orange-400";
      case "Артефакт": return "text-accent";
      default: return "text-muted-foreground";
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({ title: "Войдите для сохранения", variant: "destructive" });
      return;
    }
    if (!itemName || !itemType) {
      toast({ title: "Заполните название и тип", variant: "destructive" });
      return;
    }
    
    setIsSaving(true);
    await createItem({
      name: itemName,
      type: itemType,
      rarity: itemRarity || undefined,
      description: itemDescription || undefined,
      effect: itemEffect || undefined,
      is_public: false,
    });
    setIsSaving(false);
    
    // Reset form
    setItemName("");
    setItemType("");
    setItemRarity("");
    setItemDescription("");
    setItemEffect("");
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-3 mb-6">
        <Wand2 className="w-6 h-6 text-primary gold-glow" />
        <h2 className="text-2xl font-serif font-bold">Создать контент</h2>
      </div>

      <Tabs defaultValue="item">
        <TabsList className="bg-background border border-border mb-6">
          <TabsTrigger value="item" className="gap-2 data-[state=active]:bg-primary/20">
            <Sword className="w-4 h-4" />
            Предмет
          </TabsTrigger>
          <TabsTrigger value="spell" className="gap-2 data-[state=active]:bg-primary/20">
            <Sparkles className="w-4 h-4" />
            Заклинание
          </TabsTrigger>
          <TabsTrigger value="class" className="gap-2 data-[state=active]:bg-primary/20">
            <Shield className="w-4 h-4" />
            Класс
          </TabsTrigger>
        </TabsList>

        {/* Item Creator */}
        <TabsContent value="item">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Название</label>
                <Input
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Меч Вечного Огня"
                  className="bg-background border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Тип</label>
                  <Select value={itemType} onValueChange={setItemType}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      {itemTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Редкость</label>
                  <Select value={itemRarity} onValueChange={setItemRarity}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Редкость" />
                    </SelectTrigger>
                    <SelectContent>
                      {rarities.map((rarity) => (
                        <SelectItem key={rarity} value={rarity}>{rarity}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Описание</label>
                <Textarea
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="Опишите внешний вид и историю предмета..."
                  className="bg-background border-border min-h-[100px]"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Эффекты</label>
                <Textarea
                  value={itemEffect}
                  onChange={(e) => setItemEffect(e.target.value)}
                  placeholder="Опишите магические свойства..."
                  className="bg-background border-border min-h-[80px]"
                />
              </div>
              
              <Button 
                onClick={handleSave} 
                disabled={isSaving || !itemName || !itemType}
                className="w-full bg-gradient-gold hover:opacity-90 gap-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Сохранить предмет
              </Button>
            </div>

            {/* Preview */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Предпросмотр</label>
              <Card className="p-4 bg-gradient-arcane border-primary/30">
                <div className="flex items-start gap-3 mb-3">
                  <Sword className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-serif font-bold text-lg">
                      {itemName || "Название предмета"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {itemType || "Тип"}, <span className={getRarityColor(itemRarity)}>{itemRarity || "редкость"}</span>
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 italic">
                  {itemDescription || "Описание предмета появится здесь..."}
                </p>
                {itemEffect && (
                  <div className="p-3 bg-background/30 rounded border border-primary/20">
                    <p className="text-sm">{itemEffect}</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Spell Creator Placeholder */}
        <TabsContent value="spell">
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-primary/50 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold mb-2">Создание заклинаний</h3>
            <p className="text-muted-foreground">Редактор заклинаний в разработке</p>
          </div>
        </TabsContent>

        {/* Class Creator Placeholder */}
        <TabsContent value="class">
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-primary/50 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold mb-2">Создание классов</h3>
            <p className="text-muted-foreground">Редактор классов в разработке</p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default HomebrewCreator;
