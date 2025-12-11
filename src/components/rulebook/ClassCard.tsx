import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CharacterClass } from "@/hooks/useRulebook";
import { Sword, Wand2, Shield, Heart } from "lucide-react";

const classIcons: Record<string, React.ReactNode> = {
  Воин: <Sword className="h-5 w-5" />,
  Волшебник: <Wand2 className="h-5 w-5" />,
  Жрец: <Heart className="h-5 w-5" />,
  Паладин: <Shield className="h-5 w-5" />,
};

export function ClassCard({ characterClass }: { characterClass: CharacterClass }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {classIcons[characterClass.name] || <Sword className="h-5 w-5" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle>{characterClass.name}</CardTitle>
              <Badge variant="secondary">{characterClass.name_en}</Badge>
            </div>
            <CardDescription className="line-clamp-2">{characterClass.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Кость хитов:</span>{" "}
            <span className="font-medium">d{characterClass.hit_die}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Основная:</span>{" "}
            <span className="font-medium text-xs">{characterClass.primary_ability}</span>
          </div>
        </div>

        {characterClass.saving_throws && characterClass.saving_throws.length > 0 && (
          <div>
            <span className="text-sm text-muted-foreground">Спасброски:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {characterClass.saving_throws.map((st) => (
                <Badge key={st} variant="outline" className="text-xs">
                  {st}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {characterClass.armor_proficiencies && characterClass.armor_proficiencies.length > 0 && (
          <div>
            <span className="text-sm text-muted-foreground">Доспехи:</span>
            <p className="text-xs">{characterClass.armor_proficiencies.join(", ")}</p>
          </div>
        )}

        {characterClass.weapon_proficiencies && characterClass.weapon_proficiencies.length > 0 && (
          <div>
            <span className="text-sm text-muted-foreground">Оружие:</span>
            <p className="text-xs">{characterClass.weapon_proficiencies.join(", ")}</p>
          </div>
        )}

        {characterClass.features && characterClass.features.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="features" className="border-none">
              <AccordionTrigger className="py-2 text-sm">
                Умения ({characterClass.features.length})
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                {characterClass.features.map((feature, i) => (
                  <div key={i} className="border-l-2 border-primary/30 pl-3">
                    <p className="font-medium text-sm">
                      <Badge variant="secondary" className="mr-2 text-xs">
                        Ур. {feature.level}
                      </Badge>
                      {feature.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {characterClass.spellcasting && (
          <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
            Заклинатель
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
