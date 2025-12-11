import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Loader2, ImageIcon, Sparkles } from "lucide-react";
import { Race } from "@/hooks/useRulebook";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const abilityNames: Record<string, string> = {
  strength: "Сила",
  dexterity: "Ловкость",
  constitution: "Телосложение",
  intelligence: "Интеллект",
  wisdom: "Мудрость",
  charisma: "Харизма",
};

export function RaceCard({ race }: { race: Race }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [raceImage, setRaceImage] = useState<string | null>(null);
  const [hoveredSubrace, setHoveredSubrace] = useState<string | null>(null);
  const [subraceImages, setSubraceImages] = useState<Record<string, string>>({});

  const bonuses = Object.entries(race.ability_bonuses || {})
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => `${abilityNames[key] || key} +${value}`)
    .join(", ");

  const generateImage = async (subraceName?: string) => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-race-image', {
        body: {
          raceName: race.name,
          subraceNname: subraceName,
          raceNameEn: race.name_en
        }
      });

      if (error) throw error;

      if (data.imageUrl) {
        if (subraceName) {
          setSubraceImages(prev => ({ ...prev, [subraceName]: data.imageUrl }));
        } else {
          setRaceImage(data.imageUrl);
        }
        toast.success(`Изображение ${subraceName || race.name} создано!`);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Ошибка генерации изображения");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentImage = hoveredSubrace 
    ? subraceImages[hoveredSubrace] 
    : raceImage;

  return (
    <Card className="h-full overflow-hidden">
      <div className="relative">
        {currentImage ? (
          <div className="h-48 overflow-hidden">
            <img 
              src={currentImage} 
              alt={hoveredSubrace || race.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => generateImage()}
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Сгенерировать изображение
            </Button>
          </div>
        )}
        
        {hoveredSubrace && (
          <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
            {hoveredSubrace}
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{race.name}</CardTitle>
          <Badge variant="secondary" className="text-xs">{race.name_en}</Badge>
        </div>
        <CardDescription className="text-xs line-clamp-2">{race.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="grid grid-cols-2 gap-2 text-xs">
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
            <span className="text-xs text-muted-foreground">Бонусы:</span>
            <p className="font-medium text-xs">{bonuses}</p>
          </div>
        )}

        {race.languages && race.languages.length > 0 && (
          <div>
            <span className="text-xs text-muted-foreground">Языки:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {race.languages.map((lang) => (
                <Badge key={lang} variant="outline" className="text-[10px] px-1.5 py-0">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {race.traits && race.traits.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="traits" className="border-none">
              <AccordionTrigger className="py-1.5 text-xs hover:no-underline">
                Особенности ({race.traits.length})
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-0.5 text-xs">
                  {race.traits.map((trait, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-primary">•</span>
                      <span className="text-muted-foreground">{trait}</span>
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
              <AccordionTrigger className="py-1.5 text-xs hover:no-underline">
                Подрасы ({race.subraces.length})
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                {race.subraces.map((subrace, i) => (
                  <div 
                    key={i} 
                    className="border-l-2 border-primary/30 pl-2 py-1 cursor-pointer hover:bg-accent/50 rounded-r transition-colors"
                    onMouseEnter={() => setHoveredSubrace(subrace.name)}
                    onMouseLeave={() => setHoveredSubrace(null)}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-xs">{subrace.name}</p>
                      {!subraceImages[subrace.name] && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={(e) => {
                            e.stopPropagation();
                            generateImage(subrace.name);
                          }}
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <ImageIcon className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                      {subraceImages[subrace.name] && (
                        <div className="w-6 h-6 rounded overflow-hidden">
                          <img 
                            src={subraceImages[subrace.name]} 
                            alt={subrace.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    {subrace.ability_bonus && Object.keys(subrace.ability_bonus).length > 0 && (
                      <p className="text-[10px] text-muted-foreground">
                        {Object.entries(subrace.ability_bonus)
                          .map(([key, value]) => `${abilityNames[key] || key} +${value}`)
                          .join(", ")}
                      </p>
                    )}
                    {subrace.traits && subrace.traits.length > 0 && (
                      <ul className="text-[10px] mt-0.5 space-y-0">
                        {subrace.traits.slice(0, 2).map((trait, j) => (
                          <li key={j} className="text-muted-foreground truncate">• {trait}</li>
                        ))}
                        {subrace.traits.length > 2 && (
                          <li className="text-muted-foreground">...ещё {subrace.traits.length - 2}</li>
                        )}
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
