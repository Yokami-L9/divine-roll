import { CharacterData } from "@/hooks/useCharacterCreator";
import { useRaceNames } from "@/hooks/useCharacterCreator";
import { useRaces } from "@/hooks/useRulebook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dices, User } from "lucide-react";
import { FigureGenerator } from "../FigureGenerator";

interface DetailsStepProps {
  character: CharacterData;
  updateCharacter: (updates: Partial<CharacterData>) => void;
}

export function DetailsStep({ character, updateCharacter }: DetailsStepProps) {
  const { data: races } = useRaces();
  const selectedRace = races?.find(r => r.name === character.race);
  const raceNameEn = selectedRace?.name_en || null;
  
  const { data: names } = useRaceNames(raceNameEn, character.gender);

  const generateRandomName = () => {
    if (!names) return;
    
    const firstNames = names.firstNames;
    const lastNames = names.lastNames;
    
    if (firstNames.length === 0) return;
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames.length > 0 
      ? lastNames[Math.floor(Math.random() * lastNames.length)]
      : "";
    
    const fullName = lastName ? `${firstName} ${lastName}` : firstName;
    updateCharacter({ name: fullName });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Детали персонажа</h2>
        <p className="text-muted-foreground">
          Добавьте имя, пол и предысторию вашего персонажа.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Name and Gender */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Имя и пол
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Пол</Label>
              <RadioGroup
                value={character.gender}
                onValueChange={(value: "male" | "female") => updateCharacter({ gender: value })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="cursor-pointer">Мужской</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="cursor-pointer">Женский</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Имя персонажа</Label>
              <div className="flex gap-2">
                <Input
                  value={character.name}
                  onChange={(e) => updateCharacter({ name: e.target.value })}
                  placeholder="Введите имя..."
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={generateRandomName}
                  disabled={!names || names.firstNames.length === 0}
                  title="Сгенерировать имя"
                >
                  <Dices className="h-4 w-4" />
                </Button>
              </div>
              {raceNameEn && names && names.firstNames.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Нажмите на кубик для случайного имени расы {character.race}
                </p>
              )}
            </div>

            {/* Quick name suggestions */}
            {names && names.firstNames.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Примеры имён:</Label>
                <div className="flex gap-1 flex-wrap">
                  {names.firstNames.slice(0, 6).map((name) => (
                    <Button
                      key={name}
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        const lastName = names.lastNames.length > 0 
                          ? names.lastNames[Math.floor(Math.random() * names.lastNames.length)]
                          : "";
                        updateCharacter({ name: lastName ? `${name} ${lastName}` : name });
                      }}
                    >
                      {name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Figure Generator */}
        <FigureGenerator character={character} updateCharacter={updateCharacter} />

        {/* Backstory */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Предыстория</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>История персонажа</Label>
              <Textarea
                value={character.backstory}
                onChange={(e) => updateCharacter({ backstory: e.target.value })}
                placeholder="Расскажите историю вашего персонажа... Откуда они? Что привело их к приключениям? Какие цели преследуют?"
                rows={12}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      {character.name && (
        <Card className="bg-primary/10">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border-2 border-primary">
                <span className="text-2xl font-bold text-primary">
                  {character.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{character.name}</h3>
                <p className="text-muted-foreground">
                  {character.race} {character.subrace ? `(${character.subrace})` : ""} • {character.class} • Уровень {character.level}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
