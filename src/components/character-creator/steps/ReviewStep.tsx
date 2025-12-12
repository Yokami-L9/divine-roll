import { useState } from "react";
import { CharacterData, ABILITY_NAMES, SKILLS } from "@/hooks/useCharacterCreator";
import { useSpells, Spell } from "@/hooks/useRulebook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Heart, 
  Shield, 
  Footprints, 
  Swords, 
  Sparkles, 
  User, 
  BookOpen,
  Scroll,
  Languages,
  Backpack,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SpellDescriptionDialog } from "../SpellDescriptionDialog";

// Dynamically import all spell icons
const spellIconsContext = import.meta.glob('@/assets/spells/*.png', { eager: true, import: 'default' });

const spellIcons: Record<string, string> = {};
Object.entries(spellIconsContext).forEach(([path, module]) => {
  const fileName = path.split('/').pop()?.replace('.png', '') || '';
  spellIcons[fileName] = module as string;
});

// Helper function to convert spell name to file name format
function getSpellIconKey(nameEn: string | null): string {
  if (!nameEn) return '';
  return nameEn
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Fallback school icons
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

interface ReviewStepProps {
  character: CharacterData;
  getModifier: (score: number) => number;
}

type AbilityKey = keyof typeof ABILITY_NAMES;

export function ReviewStep({ character, getModifier }: ReviewStepProps) {
  const { data: allSpells } = useSpells();
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const abilities: AbilityKey[] = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];

  // Get spell by ID
  const getSpell = (spellId: string) => {
    return allSpells?.find(s => s.id === spellId);
  };

  const openSpellDetails = (spell: Spell) => {
    setSelectedSpell(spell);
    setDialogOpen(true);
  };

  const formatModifier = (mod: number) => {
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const getSkillModifier = (skillAbility: string) => {
    const abilityMod = getModifier(character[skillAbility as AbilityKey]);
    const isProficient = character.skill_proficiencies.some(
      s => SKILLS.find(sk => sk.name === s)?.ability === skillAbility
    );
    return isProficient ? abilityMod + character.proficiency_bonus : abilityMod;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Обзор персонажа</h2>
        <p className="text-muted-foreground">
          Проверьте данные персонажа перед сохранением.
        </p>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        {/* Character Sheet Preview */}
        <div className="space-y-4">
          {/* Header */}
          <Card className="bg-gradient-to-br from-primary/20 to-transparent">
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center border-4 border-primary shadow-lg">
                  <span className="text-3xl font-bold text-primary">
                    {character.name?.charAt(0) || "?"}
                  </span>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{character.name || "Без имени"}</h1>
                  <p className="text-lg text-muted-foreground">
                    {character.race} {character.subrace ? `(${character.subrace})` : ""} • {character.class}
                  </p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge>Уровень {character.level}</Badge>
                    <Badge variant="outline">{character.alignment}</Badge>
                    {character.background && (
                      <Badge variant="secondary">{character.background}</Badge>
                    )}
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
                <div className="text-2xl font-bold">{character.max_hp}</div>
                <div className="text-xs text-muted-foreground">Хиты</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="py-4">
                <Shield className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{character.armor_class}</div>
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
                <div className="text-2xl font-bold">{character.speed}</div>
                <div className="text-xs text-muted-foreground">Скорость (фт)</div>
              </CardContent>
            </Card>
          </div>

          {/* Abilities with Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {abilities.map((ability) => {
              const value = character[ability];
              const mod = getModifier(value);
              const isSaveProficient = character.saving_throw_proficiencies?.includes(
                ABILITY_NAMES[ability]
              );
              const saveMod = isSaveProficient ? mod + character.proficiency_bonus : mod;
              
              // Get skills for this ability
              const abilitySkills = SKILLS.filter(s => s.ability === ability);
              
              return (
                <Card key={ability} className="overflow-hidden">
                  {/* Ability Header */}
                  <CardHeader className="pb-2 bg-primary/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{ABILITY_NAMES[ability]}</CardTitle>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{value}</div>
                        <div className={cn(
                          "text-sm font-medium",
                          mod > 0 && "text-green-500",
                          mod < 0 && "text-red-500"
                        )}>
                          {formatModifier(mod)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 space-y-2">
                    {/* Saving Throw */}
                    <div className={cn(
                      "flex items-center justify-between py-1.5 px-2 rounded text-sm",
                      isSaveProficient ? "bg-primary/10 border border-primary/30" : "bg-muted/50"
                    )}>
                      <span className={cn(
                        "flex items-center gap-1",
                        isSaveProficient && "font-medium"
                      )}>
                        <Shield className="h-3 w-3" />
                        Спасбросок
                      </span>
                      <Badge variant={isSaveProficient ? "default" : "outline"} className="text-xs">
                        {formatModifier(saveMod)}
                      </Badge>
                    </div>
                    
                    {/* Skills */}
                    {abilitySkills.map((skill) => {
                      const isProficient = character.skill_proficiencies.includes(skill.name);
                      const skillMod = isProficient ? mod + character.proficiency_bonus : mod;
                      
                      return (
                        <div 
                          key={skill.name}
                          className={cn(
                            "flex items-center justify-between py-1.5 px-2 rounded text-sm",
                            isProficient ? "bg-primary/10" : "bg-muted/30"
                          )}
                        >
                          <span className={isProficient ? "font-medium" : "text-muted-foreground"}>
                            {skill.name}
                          </span>
                          <Badge variant={isProficient ? "default" : "outline"} className="text-xs">
                            {formatModifier(skillMod)}
                          </Badge>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Languages & Traits */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Языки и черты
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Языки:</div>
                <div className="flex gap-1 flex-wrap">
                  {character.languages.map((lang) => (
                    <Badge key={lang} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
              {character.traits.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Расовые черты:</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {character.traits.slice(0, 6).map((trait, i) => (
                      <li key={i}>• {trait}</li>
                    ))}
                    {character.traits.length > 6 && (
                      <li className="text-primary">+{character.traits.length - 6} ещё...</li>
                    )}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Spells (if any) */}
          {character.known_spells.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Заклинания ({character.known_spells.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                        {/* Spell Icon */}
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
                            {spell.level === 0 ? "Заговор" : `${spell.level} уровень`} • {spell.school}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                          <Info className="h-3 w-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Spell Description Dialog */}
          <SpellDescriptionDialog
            spell={selectedSpell}
            open={dialogOpen}
            onOpenChange={setDialogOpen}
          />

          {/* Equipment */}
          {character.equipment.filter(e => e !== "__NO_EQUIPMENT__").length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Backpack className="h-4 w-4" />
                  Снаряжение
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-1 flex-wrap">
                  {character.equipment
                    .filter(e => e !== "__NO_EQUIPMENT__")
                    .map((item, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Personality */}
          {(character.personality_trait || character.ideal || character.bond || character.flaw) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Характер
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {character.personality_trait && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Черта характера</div>
                    <p className="text-sm">{character.personality_trait}</p>
                  </div>
                )}
                {character.ideal && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Идеал</div>
                    <p className="text-sm">{character.ideal}</p>
                  </div>
                )}
                {character.bond && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Привязанность</div>
                    <p className="text-sm">{character.bond}</p>
                  </div>
                )}
                {character.flaw && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Слабость</div>
                    <p className="text-sm">{character.flaw}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Backstory */}
          {character.backstory && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Scroll className="h-4 w-4" />
                  Предыстория
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {character.backstory}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
