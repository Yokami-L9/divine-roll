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
import { Sword, Sparkles, Shield, Scroll, Save, Eye, Wand2 } from "lucide-react";

const HomebrewCreator = () => {
  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState("");
  const [itemRarity, setItemRarity] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemEffect, setItemEffect] = useState("");

  const [spellName, setSpellName] = useState("");
  const [spellLevel, setSpellLevel] = useState("");
  const [spellSchool, setSpellSchool] = useState("");
  const [spellCastTime, setSpellCastTime] = useState("");
  const [spellRange, setSpellRange] = useState("");
  const [spellComponents, setSpellComponents] = useState("");
  const [spellDuration, setSpellDuration] = useState("");
  const [spellDescription, setSpellDescription] = useState("");

  const itemTypes = ["Оружие", "Броня", "Зелье", "Кольцо", "Жезл", "Свиток", "Чудесный предмет"];
  const rarities = ["Обычный", "Необычный", "Редкий", "Очень редкий", "Легендарный", "Артефакт"];
  const spellSchools = ["Воплощение", "Вызов", "Иллюзия", "Некромантия", "Ограждение", "Очарование", "Преобразование", "Прорицание"];

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

        {/* Spell Creator */}
        <TabsContent value="spell">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Название</label>
                <Input
                  value={spellName}
                  onChange={(e) => setSpellName(e.target.value)}
                  placeholder="Тень Разума"
                  className="bg-background border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Уровень</label>
                  <Select value={spellLevel} onValueChange={setSpellLevel}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Уровень" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Заговор</SelectItem>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                        <SelectItem key={lvl} value={lvl.toString()}>{lvl} уровень</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Школа</label>
                  <Select value={spellSchool} onValueChange={setSpellSchool}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Школа" />
                    </SelectTrigger>
                    <SelectContent>
                      {spellSchools.map((school) => (
                        <SelectItem key={school} value={school}>{school}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Время накладывания</label>
                  <Input
                    value={spellCastTime}
                    onChange={(e) => setSpellCastTime(e.target.value)}
                    placeholder="1 действие"
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Дистанция</label>
                  <Input
                    value={spellRange}
                    onChange={(e) => setSpellRange(e.target.value)}
                    placeholder="60 футов"
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Компоненты</label>
                  <Input
                    value={spellComponents}
                    onChange={(e) => setSpellComponents(e.target.value)}
                    placeholder="В, С, М"
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Длительность</label>
                  <Input
                    value={spellDuration}
                    onChange={(e) => setSpellDuration(e.target.value)}
                    placeholder="Концентрация, 1 минута"
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Описание</label>
                <Textarea
                  value={spellDescription}
                  onChange={(e) => setSpellDescription(e.target.value)}
                  placeholder="Опишите эффект заклинания..."
                  className="bg-background border-border min-h-[120px]"
                />
              </div>
            </div>

            {/* Spell Preview */}
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Предпросмотр</label>
              <Card className="p-4 bg-gradient-arcane border-primary/30">
                <div className="flex items-start gap-3 mb-3">
                  <Sparkles className="w-8 h-8 text-primary gold-glow" />
                  <div>
                    <h3 className="font-serif font-bold text-lg">{spellName || "Название заклинания"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {spellLevel === "0" ? "Заговор" : `${spellLevel || "?"} уровень`}, {spellSchool || "школа магии"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div><span className="text-muted-foreground">Время:</span> {spellCastTime || "—"}</div>
                  <div><span className="text-muted-foreground">Дистанция:</span> {spellRange || "—"}</div>
                  <div><span className="text-muted-foreground">Компоненты:</span> {spellComponents || "—"}</div>
                  <div><span className="text-muted-foreground">Длительность:</span> {spellDuration || "—"}</div>
                </div>

                <p className="text-sm">{spellDescription || "Описание заклинания появится здесь..."}</p>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Class Creator Placeholder */}
        <TabsContent value="class">
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-primary/50 mx-auto mb-4" />
            <h3 className="text-xl font-serif font-semibold mb-2">Создание классов</h3>
            <p className="text-muted-foreground mb-6">
              Продвинутый редактор для создания кастомных классов и подклассов
            </p>
            <Button className="bg-gradient-gold hover:opacity-90">
              Скоро
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-border">
        <Button variant="outline" className="gap-2 border-primary/50">
          <Eye className="w-4 h-4" />
          Предпросмотр
        </Button>
        <Button className="bg-gradient-gold hover:opacity-90 gap-2">
          <Save className="w-4 h-4" />
          Сохранить
        </Button>
      </div>
    </Card>
  );
};

export default HomebrewCreator;
