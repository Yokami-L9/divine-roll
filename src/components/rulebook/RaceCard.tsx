import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Race } from "@/hooks/useRulebook";

const abilityNames: Record<string, string> = {
  strength: "Сила",
  dexterity: "Ловкость",
  constitution: "Телосложение",
  intelligence: "Интеллект",
  wisdom: "Мудрость",
  charisma: "Харизма",
};

export function RaceCard({ race }: { race: Race }) {
  const bonuses = Object.entries(race.ability_bonuses || {})
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => `${abilityNames[key] || key} +${value}`)
    .join(", ");

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{race.name}</CardTitle>
          <Badge variant="secondary">{race.name_en}</Badge>
        </div>
        <CardDescription>{race.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Скорость:</span>{" "}
            <span className="font-medium">{race.speed} фт.</span>
          </div>
          <div>
            <span className="text-muted-foreground">Размер:</span>{" "}
            <span className="font-medium">{race.size}</span>
          </div>
        </div>

        {bonuses && (
          <div>
            <span className="text-sm text-muted-foreground">Бонусы характеристик:</span>
            <p className="font-medium text-sm">{bonuses}</p>
          </div>
        )}

        {race.languages && race.languages.length > 0 && (
          <div>
            <span className="text-sm text-muted-foreground">Языки:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {race.languages.map((lang) => (
                <Badge key={lang} variant="outline" className="text-xs">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {race.traits && race.traits.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="traits" className="border-none">
              <AccordionTrigger className="py-2 text-sm">
                Особенности ({race.traits.length})
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1 text-sm">
                  {race.traits.map((trait, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {trait}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {race.subraces && race.subraces.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="subraces" className="border-none">
              <AccordionTrigger className="py-2 text-sm">
                Подрасы ({race.subraces.length})
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                {race.subraces.map((subrace, i) => (
                  <div key={i} className="border-l-2 border-primary/30 pl-3">
                    <p className="font-medium text-sm">{subrace.name}</p>
                    {subrace.ability_bonus && (
                      <p className="text-xs text-muted-foreground">
                        {Object.entries(subrace.ability_bonus)
                          .map(([key, value]) => `${abilityNames[key] || key} +${value}`)
                          .join(", ")}
                      </p>
                    )}
                    {subrace.traits && subrace.traits.length > 0 && (
                      <ul className="text-xs mt-1 space-y-0.5">
                        {subrace.traits.map((trait, j) => (
                          <li key={j}>• {trait}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
