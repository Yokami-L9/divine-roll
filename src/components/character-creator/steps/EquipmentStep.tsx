import { CharacterData } from "@/hooks/useCharacterCreator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Backpack, Sword, Shield, Wand2, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface EquipmentStepProps {
  character: CharacterData;
  updateCharacter: (updates: Partial<CharacterData>) => void;
}

interface EquipmentSet {
  id: string;
  name: string;
  items: string[];
}

// Equipment sets based on Player's Handbook
const CLASS_EQUIPMENT: Record<string, { choices: { options: EquipmentSet[] }[] }> = {
  "Воин": {
    choices: [
      {
        options: [
          { id: "chain-shield", name: "Кольчуга и щит", items: ["Кольчуга", "Щит"] },
          { id: "leather-longbow", name: "Кожаный доспех и длинный лук", items: ["Кожаный доспех", "Длинный лук", "20 стрел"] },
        ]
      },
      {
        options: [
          { id: "martial-shield", name: "Воинское оружие и щит", items: ["Длинный меч", "Щит"] },
          { id: "two-martial", name: "Два воинских оружия", items: ["Длинный меч", "Боевой топор"] },
        ]
      },
      {
        options: [
          { id: "crossbow", name: "Лёгкий арбалет и 20 болтов", items: ["Лёгкий арбалет", "20 болтов"] },
          { id: "handaxes", name: "Два ручных топора", items: ["Ручной топор", "Ручной топор"] },
        ]
      },
      {
        options: [
          { id: "dungeoneer", name: "Набор исследователя подземелий", items: ["Набор исследователя подземелий"] },
          { id: "explorer", name: "Набор путешественника", items: ["Набор путешественника"] },
        ]
      },
    ]
  },
  "Плут": {
    choices: [
      {
        options: [
          { id: "rapier", name: "Рапира", items: ["Рапира"] },
          { id: "shortsword", name: "Короткий меч", items: ["Короткий меч"] },
        ]
      },
      {
        options: [
          { id: "shortbow", name: "Короткий лук и колчан с 20 стрелами", items: ["Короткий лук", "20 стрел"] },
          { id: "shortsword2", name: "Короткий меч", items: ["Короткий меч"] },
        ]
      },
      {
        options: [
          { id: "burglar", name: "Набор взломщика", items: ["Набор взломщика"] },
          { id: "dungeoneer", name: "Набор исследователя подземелий", items: ["Набор исследователя подземелий"] },
          { id: "explorer", name: "Набор путешественника", items: ["Набор путешественника"] },
        ]
      },
    ]
  },
  "Волшебник": {
    choices: [
      {
        options: [
          { id: "quarterstaff", name: "Боевой посох", items: ["Боевой посох"] },
          { id: "dagger", name: "Кинжал", items: ["Кинжал"] },
        ]
      },
      {
        options: [
          { id: "component", name: "Мешочек с компонентами", items: ["Мешочек с компонентами"] },
          { id: "focus", name: "Магический фокус", items: ["Магический фокус"] },
        ]
      },
      {
        options: [
          { id: "scholar", name: "Набор учёного", items: ["Набор учёного"] },
          { id: "explorer", name: "Набор путешественника", items: ["Набор путешественника"] },
        ]
      },
    ]
  },
  "Жрец": {
    choices: [
      {
        options: [
          { id: "mace", name: "Булава", items: ["Булава"] },
          { id: "warhammer", name: "Боевой молот (если владеет)", items: ["Боевой молот"] },
        ]
      },
      {
        options: [
          { id: "scale", name: "Чешуйчатый доспех", items: ["Чешуйчатый доспех"] },
          { id: "leather", name: "Кожаный доспех", items: ["Кожаный доспех"] },
          { id: "chain", name: "Кольчуга (если владеет)", items: ["Кольчуга"] },
        ]
      },
      {
        options: [
          { id: "crossbow", name: "Лёгкий арбалет и 20 болтов", items: ["Лёгкий арбалет", "20 болтов"] },
          { id: "simple", name: "Любое простое оружие", items: ["Булава"] },
        ]
      },
      {
        options: [
          { id: "priest", name: "Набор священника", items: ["Набор священника"] },
          { id: "explorer", name: "Набор путешественника", items: ["Набор путешественника"] },
        ]
      },
    ]
  },
  "Бард": {
    choices: [
      {
        options: [
          { id: "rapier", name: "Рапира", items: ["Рапира"] },
          { id: "longsword", name: "Длинный меч", items: ["Длинный меч"] },
          { id: "simple", name: "Любое простое оружие", items: ["Кинжал"] },
        ]
      },
      {
        options: [
          { id: "diplomat", name: "Набор дипломата", items: ["Набор дипломата"] },
          { id: "entertainer", name: "Набор артиста", items: ["Набор артиста"] },
        ]
      },
      {
        options: [
          { id: "lute", name: "Лютня", items: ["Лютня"] },
          { id: "instrument", name: "Другой музыкальный инструмент", items: ["Музыкальный инструмент"] },
        ]
      },
    ]
  },
  "Варвар": {
    choices: [
      {
        options: [
          { id: "greataxe", name: "Секира", items: ["Секира"] },
          { id: "martial", name: "Любое воинское рукопашное оружие", items: ["Длинный меч"] },
        ]
      },
      {
        options: [
          { id: "handaxes", name: "Два ручных топора", items: ["Ручной топор", "Ручной топор"] },
          { id: "simple", name: "Любое простое оружие", items: ["Копьё"] },
        ]
      },
    ]
  },
  "Друид": {
    choices: [
      {
        options: [
          { id: "shield", name: "Деревянный щит", items: ["Деревянный щит"] },
          { id: "simple", name: "Любое простое оружие", items: ["Дубинка"] },
        ]
      },
      {
        options: [
          { id: "scimitar", name: "Скимитар", items: ["Скимитар"] },
          { id: "melee", name: "Простое рукопашное оружие", items: ["Дубинка"] },
        ]
      },
    ]
  },
  "Монах": {
    choices: [
      {
        options: [
          { id: "shortsword", name: "Короткий меч", items: ["Короткий меч"] },
          { id: "simple", name: "Любое простое оружие", items: ["Дубинка"] },
        ]
      },
      {
        options: [
          { id: "dungeoneer", name: "Набор исследователя подземелий", items: ["Набор исследователя подземелий"] },
          { id: "explorer", name: "Набор путешественника", items: ["Набор путешественника"] },
        ]
      },
    ]
  },
  "Паладин": {
    choices: [
      {
        options: [
          { id: "martial-shield", name: "Воинское оружие и щит", items: ["Длинный меч", "Щит"] },
          { id: "two-martial", name: "Два воинских оружия", items: ["Длинный меч", "Боевой топор"] },
        ]
      },
      {
        options: [
          { id: "javelins", name: "Пять метательных копий", items: ["Метательное копьё x5"] },
          { id: "simple", name: "Любое простое рукопашное оружие", items: ["Булава"] },
        ]
      },
      {
        options: [
          { id: "priest", name: "Набор священника", items: ["Набор священника"] },
          { id: "explorer", name: "Набор путешественника", items: ["Набор путешественника"] },
        ]
      },
    ]
  },
  "Следопыт": {
    choices: [
      {
        options: [
          { id: "scale", name: "Чешуйчатый доспех", items: ["Чешуйчатый доспех"] },
          { id: "leather", name: "Кожаный доспех", items: ["Кожаный доспех"] },
        ]
      },
      {
        options: [
          { id: "shortswords", name: "Два коротких меча", items: ["Короткий меч", "Короткий меч"] },
          { id: "simple", name: "Два простых рукопашных оружия", items: ["Ручной топор", "Ручной топор"] },
        ]
      },
      {
        options: [
          { id: "dungeoneer", name: "Набор исследователя подземелий", items: ["Набор исследователя подземелий"] },
          { id: "explorer", name: "Набор путешественника", items: ["Набор путешественника"] },
        ]
      },
    ]
  },
  "Колдун": {
    choices: [
      {
        options: [
          { id: "crossbow", name: "Лёгкий арбалет и 20 болтов", items: ["Лёгкий арбалет", "20 болтов"] },
          { id: "simple", name: "Любое простое оружие", items: ["Кинжал"] },
        ]
      },
      {
        options: [
          { id: "component", name: "Мешочек с компонентами", items: ["Мешочек с компонентами"] },
          { id: "focus", name: "Магический фокус", items: ["Магический фокус"] },
        ]
      },
      {
        options: [
          { id: "scholar", name: "Набор учёного", items: ["Набор учёного"] },
          { id: "dungeoneer", name: "Набор исследователя подземелий", items: ["Набор исследователя подземелий"] },
        ]
      },
    ]
  },
  "Чародей": {
    choices: [
      {
        options: [
          { id: "crossbow", name: "Лёгкий арбалет и 20 болтов", items: ["Лёгкий арбалет", "20 болтов"] },
          { id: "simple", name: "Любое простое оружие", items: ["Кинжал"] },
        ]
      },
      {
        options: [
          { id: "component", name: "Мешочек с компонентами", items: ["Мешочек с компонентами"] },
          { id: "focus", name: "Магический фокус", items: ["Магический фокус"] },
        ]
      },
      {
        options: [
          { id: "dungeoneer", name: "Набор исследователя подземелий", items: ["Набор исследователя подземелий"] },
          { id: "explorer", name: "Набор путешественника", items: ["Набор путешественника"] },
        ]
      },
    ]
  },
};

// Default equipment all classes get
const DEFAULT_EQUIPMENT: Record<string, string[]> = {
  "Воин": [],
  "Плут": ["Кожаный доспех", "Два кинжала", "Воровские инструменты"],
  "Волшебник": ["Книга заклинаний"],
  "Жрец": ["Щит", "Священный символ"],
  "Бард": ["Кожаный доспех", "Кинжал"],
  "Варвар": ["Набор путешественника", "4 метательных копья"],
  "Друид": ["Кожаный доспех", "Набор путешественника", "Фокус друида"],
  "Монах": ["10 дротиков"],
  "Паладин": ["Кольчуга", "Священный символ"],
  "Следопыт": ["Длинный лук", "Колчан с 20 стрелами"],
  "Колдун": ["Кожаный доспех", "Любое простое оружие", "Два кинжала"],
  "Чародей": ["Два кинжала"],
};

export function EquipmentStep({ character, updateCharacter }: EquipmentStepProps) {
  const [skipEquipment, setSkipEquipment] = useState(false);
  const [selectedChoices, setSelectedChoices] = useState<Record<number, string>>({});

  const classEquipment = CLASS_EQUIPMENT[character.class];
  const defaultItems = DEFAULT_EQUIPMENT[character.class] || [];

  const selectedEquipment = useMemo(() => {
    if (skipEquipment) return [];
    
    const items: string[] = [...defaultItems];
    
    if (classEquipment) {
      classEquipment.choices.forEach((choice, index) => {
        const selectedId = selectedChoices[index];
        const selectedOption = choice.options.find(opt => opt.id === selectedId);
        if (selectedOption) {
          items.push(...selectedOption.items);
        }
      });
    }
    
    return items;
  }, [skipEquipment, selectedChoices, classEquipment, defaultItems]);

  // Update character equipment when selection changes
  const handleChoiceChange = (choiceIndex: number, optionId: string) => {
    const newChoices = { ...selectedChoices, [choiceIndex]: optionId };
    setSelectedChoices(newChoices);
    
    // Recalculate equipment
    const items: string[] = [...defaultItems];
    if (classEquipment) {
      classEquipment.choices.forEach((choice, index) => {
        const selectedId = newChoices[index];
        const selectedOption = choice.options.find(opt => opt.id === selectedId);
        if (selectedOption) {
          items.push(...selectedOption.items);
        }
      });
    }
    
    // Merge with background equipment
    const bgEquipment = character.equipment.filter(e => 
      !defaultItems.includes(e) && 
      !Object.values(CLASS_EQUIPMENT[character.class]?.choices || {}).some(choice => 
        (choice as { options: EquipmentSet[] }).options.some(opt => opt.items.includes(e))
      )
    );
    
    updateCharacter({ equipment: [...bgEquipment, ...items] });
  };

  const handleSkipToggle = (skip: boolean) => {
    setSkipEquipment(skip);
    
    if (skip) {
      // Keep only background equipment
      const bgEquipment = character.equipment.filter(e => 
        !defaultItems.includes(e)
      );
      updateCharacter({ equipment: bgEquipment });
    } else {
      // Restore with current selections
      handleChoiceChange(-1, "");
    }
  };

  if (!classEquipment) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Снаряжение</h2>
          <p className="text-muted-foreground">
            Стандартные наборы снаряжения для класса {character.class} не найдены.
          </p>
        </div>
        <Card className="p-8 text-center">
          <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Вы можете добавить снаряжение вручную после создания персонажа.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Начальное снаряжение</h2>
        <p className="text-muted-foreground">
          Выберите снаряжение для вашего {character.class} на основе правил Книги игрока.
        </p>
      </div>

      {/* Skip option */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Checkbox
            id="skip-equipment"
            checked={skipEquipment}
            onCheckedChange={(checked) => handleSkipToggle(checked as boolean)}
          />
          <Label htmlFor="skip-equipment" className="cursor-pointer">
            <span className="font-medium">Начать без снаряжения</span>
            <p className="text-sm text-muted-foreground">
              Выберите эту опцию, если хотите начать игру без стандартного набора
            </p>
          </Label>
        </div>
      </Card>

      {!skipEquipment && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Equipment choices */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Sword className="h-4 w-4" />
              Выбор снаряжения
            </h3>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {classEquipment.choices.map((choice, index) => (
                  <Card key={index} className="p-4">
                    <h4 className="text-sm font-medium mb-3">Выбор {index + 1}</h4>
                    <RadioGroup
                      value={selectedChoices[index] || ""}
                      onValueChange={(value) => handleChoiceChange(index, value)}
                      className="space-y-2"
                    >
                      {choice.options.map((option) => (
                        <Label
                          key={option.id}
                          htmlFor={`${index}-${option.id}`}
                          className={cn(
                            "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                            selectedChoices[index] === option.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <RadioGroupItem
                            value={option.id}
                            id={`${index}-${option.id}`}
                            className="mt-0.5"
                          />
                          <div>
                            <div className="font-medium text-sm">{option.name}</div>
                            <div className="flex gap-1 flex-wrap mt-1">
                              {option.items.map((item, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </Label>
                      ))}
                    </RadioGroup>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Equipment summary */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Backpack className="h-4 w-4" />
              Ваше снаряжение
            </h3>
            <Card className="p-4">
              {defaultItems.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs text-muted-foreground mb-2">Стандартное снаряжение класса:</h4>
                  <div className="flex gap-1 flex-wrap">
                    {defaultItems.map((item, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs text-muted-foreground mb-2">Выбранное снаряжение:</h4>
                {selectedEquipment.length > 0 ? (
                  <div className="flex gap-1 flex-wrap">
                    {selectedEquipment.map((item, i) => (
                      <Badge key={i} className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Выберите опции слева для добавления снаряжения
                  </p>
                )}
              </div>

              {/* Background equipment */}
              {character.equipment.filter(e => !selectedEquipment.includes(e) && !defaultItems.includes(e)).length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-xs text-muted-foreground mb-2">От предыстории:</h4>
                  <div className="flex gap-1 flex-wrap">
                    {character.equipment
                      .filter(e => !selectedEquipment.includes(e) && !defaultItems.includes(e))
                      .map((item, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {skipEquipment && (
        <Card className="p-8 text-center bg-muted/50">
          <Backpack className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Вы начнёте игру без стандартного снаряжения класса.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Снаряжение от предыстории будет сохранено.
          </p>
        </Card>
      )}
    </div>
  );
}
