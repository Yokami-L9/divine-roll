import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CharacterClass, Subclass } from "@/hooks/useRulebook";
import { Axe, Music, Cross, Leaf, Sword, Hand, Sun, Trees, Skull, Flame, Moon, BookOpen, ChevronRight, User } from "lucide-react";

// Import class images
import barbarianImg from "@/assets/classes/barbarian.png";
import bardImg from "@/assets/classes/bard.png";
import clericImg from "@/assets/classes/cleric.png";
import druidImg from "@/assets/classes/druid.png";
import fighterImg from "@/assets/classes/fighter.png";
import monkImg from "@/assets/classes/monk.png";
import paladinImg from "@/assets/classes/paladin.png";
import rangerImg from "@/assets/classes/ranger.png";
import rogueImg from "@/assets/classes/rogue.png";
import sorcererImg from "@/assets/classes/sorcerer.png";
import warlockImg from "@/assets/classes/warlock.png";
import wizardImg from "@/assets/classes/wizard.png";

// Import subclass images - Bard
import bardCollegeOfLore from "@/assets/subclasses/bard-college-of-lore.png";
import bardCollegeOfValor from "@/assets/subclasses/bard-college-of-valor.png";
import bardCollegeOfSwords from "@/assets/subclasses/bard-college-of-swords.png";
import bardCollegeOfEloquence from "@/assets/subclasses/bard-college-of-eloquence.png";

// Import subclass images - Barbarian
import barbarianBerserker from "@/assets/subclasses/barbarian-path-of-berserker.png";
import barbarianTotemWarrior from "@/assets/subclasses/barbarian-path-of-totem-warrior.png";
import barbarianAncestralGuardian from "@/assets/subclasses/barbarian-path-of-ancestral-guardian.png";
import barbarianStormHerald from "@/assets/subclasses/barbarian-path-of-storm-herald.png";
import barbarianZealot from "@/assets/subclasses/barbarian-path-of-zealot.png";

// Import subclass images - Wizard
import wizardAbjuration from "@/assets/subclasses/wizard-school-of-abjuration.png";
import wizardConjuration from "@/assets/subclasses/wizard-school-of-conjuration.png";
import wizardDivination from "@/assets/subclasses/wizard-school-of-divination.png";
import wizardEnchantment from "@/assets/subclasses/wizard-school-of-enchantment.png";
import wizardEvocation from "@/assets/subclasses/wizard-school-of-evocation.png";
import wizardIllusion from "@/assets/subclasses/wizard-school-of-illusion.png";
import wizardNecromancy from "@/assets/subclasses/wizard-school-of-necromancy.png";
import wizardTransmutation from "@/assets/subclasses/wizard-school-of-transmutation.png";
import wizardWarMagic from "@/assets/subclasses/wizard-school-of-war-magic.png";

// Import subclass images - Cleric
import clericLifeDomain from "@/assets/subclasses/cleric-life-domain.png";
import clericLightDomain from "@/assets/subclasses/cleric-light-domain.png";
import clericNatureDomain from "@/assets/subclasses/cleric-nature-domain.png";
import clericTempestDomain from "@/assets/subclasses/cleric-tempest-domain.png";
import clericTrickeryDomain from "@/assets/subclasses/cleric-trickery-domain.png";
import clericWarDomain from "@/assets/subclasses/cleric-war-domain.png";
import clericKnowledgeDomain from "@/assets/subclasses/cleric-knowledge-domain.png";
import clericDeathDomain from "@/assets/subclasses/cleric-death-domain.png";
import clericGraveDomain from "@/assets/subclasses/cleric-grave-domain.png";
import clericForgeDomain from "@/assets/subclasses/cleric-forge-domain.png";

// Import subclass images - Druid
import druidCircleLand from "@/assets/subclasses/druid-circle-of-the-land.png";
import druidCircleMoon from "@/assets/subclasses/druid-circle-of-the-moon.png";
import druidCircleDreams from "@/assets/subclasses/druid-circle-of-dreams.png";
import druidCircleShepherd from "@/assets/subclasses/druid-circle-of-the-shepherd.png";
import druidCircleSpores from "@/assets/subclasses/druid-circle-of-spores.png";

// Import subclass images - Fighter
import fighterChampion from "@/assets/subclasses/fighter-champion.png";
import fighterBattleMaster from "@/assets/subclasses/fighter-battle-master.png";
import fighterEldritchKnight from "@/assets/subclasses/fighter-eldritch-knight.png";
import fighterSamurai from "@/assets/subclasses/fighter-samurai.png";
import fighterCavalier from "@/assets/subclasses/fighter-cavalier.png";
import fighterArcaneArcher from "@/assets/subclasses/fighter-arcane-archer.png";

// Import subclass images - Monk
import monkOpenHand from "@/assets/subclasses/monk-way-of-the-open-hand.png";
import monkShadow from "@/assets/subclasses/monk-way-of-shadow.png";
import monkFourElements from "@/assets/subclasses/monk-way-of-the-four-elements.png";
import monkSunSoul from "@/assets/subclasses/monk-way-of-the-sun-soul.png";
import monkDrunkenMaster from "@/assets/subclasses/monk-way-of-the-drunken-master.png";
import monkKensei from "@/assets/subclasses/monk-way-of-the-kensei.png";

// Import subclass images - Paladin
import paladinDevotion from "@/assets/subclasses/paladin-oath-of-devotion.png";
import paladinAncients from "@/assets/subclasses/paladin-oath-of-the-ancients.png";
import paladinVengeance from "@/assets/subclasses/paladin-oath-of-vengeance.png";
import paladinConquest from "@/assets/subclasses/paladin-oath-of-conquest.png";
import paladinRedemption from "@/assets/subclasses/paladin-oath-of-redemption.png";
import paladinOathbreaker from "@/assets/subclasses/paladin-oathbreaker.png";

// Import subclass images - Ranger
import rangerHunter from "@/assets/subclasses/ranger-hunter.png";
import rangerBeastMaster from "@/assets/subclasses/ranger-beast-master.png";
import rangerGloomStalker from "@/assets/subclasses/ranger-gloom-stalker.png";
import rangerHorizonWalker from "@/assets/subclasses/ranger-horizon-walker.png";
import rangerMonsterSlayer from "@/assets/subclasses/ranger-monster-slayer.png";

// Import subclass images - Rogue
import rogueThief from "@/assets/subclasses/rogue-thief.png";
import rogueAssassin from "@/assets/subclasses/rogue-assassin.png";
import rogueArcaneTrickster from "@/assets/subclasses/rogue-arcane-trickster.png";
import rogueSwashbuckler from "@/assets/subclasses/rogue-swashbuckler.png";
import rogueInquisitive from "@/assets/subclasses/rogue-inquisitive.png";
import rogueScout from "@/assets/subclasses/rogue-scout.png";

// Import subclass images - Sorcerer
import sorcererDraconicBloodline from "@/assets/subclasses/sorcerer-draconic-bloodline.png";
import sorcererWildMagic from "@/assets/subclasses/sorcerer-wild-magic.png";
import sorcererDivineSoul from "@/assets/subclasses/sorcerer-divine-soul.png";
import sorcererShadowMagic from "@/assets/subclasses/sorcerer-shadow-magic.png";
import sorcererStormSorcery from "@/assets/subclasses/sorcerer-storm-sorcery.png";

// Import subclass images - Warlock
import warlockFiend from "@/assets/subclasses/warlock-the-fiend.png";
import warlockArchfey from "@/assets/subclasses/warlock-the-archfey.png";
import warlockGreatOldOne from "@/assets/subclasses/warlock-the-great-old-one.png";
import warlockHexblade from "@/assets/subclasses/warlock-the-hexblade.png";
import warlockCelestial from "@/assets/subclasses/warlock-the-celestial.png";
import warlockUndying from "@/assets/subclasses/warlock-the-undying.png";

const classImages: Record<string, string> = {
  "Barbarian": barbarianImg,
  "Bard": bardImg,
  "Cleric": clericImg,
  "Druid": druidImg,
  "Fighter": fighterImg,
  "Monk": monkImg,
  "Paladin": paladinImg,
  "Ranger": rangerImg,
  "Rogue": rogueImg,
  "Sorcerer": sorcererImg,
  "Warlock": warlockImg,
  "Wizard": wizardImg,
};

const subclassImages: Record<string, string> = {
  // Bard
  "College of Lore": bardCollegeOfLore,
  "College of Valor": bardCollegeOfValor,
  "College of Swords": bardCollegeOfSwords,
  "College of Eloquence": bardCollegeOfEloquence,
  // Barbarian
  "Path of the Berserker": barbarianBerserker,
  "Path of the Totem Warrior": barbarianTotemWarrior,
  "Path of the Ancestral Guardian": barbarianAncestralGuardian,
  "Path of the Storm Herald": barbarianStormHerald,
  "Path of the Zealot": barbarianZealot,
  // Wizard
  "School of Abjuration": wizardAbjuration,
  "School of Conjuration": wizardConjuration,
  "School of Divination": wizardDivination,
  "School of Enchantment": wizardEnchantment,
  "School of Evocation": wizardEvocation,
  "School of Illusion": wizardIllusion,
  "School of Necromancy": wizardNecromancy,
  "School of Transmutation": wizardTransmutation,
  "School of War Magic": wizardWarMagic,
  // Cleric
  "Life Domain": clericLifeDomain,
  "Light Domain": clericLightDomain,
  "Nature Domain": clericNatureDomain,
  "Tempest Domain": clericTempestDomain,
  "Trickery Domain": clericTrickeryDomain,
  "War Domain": clericWarDomain,
  "Knowledge Domain": clericKnowledgeDomain,
  "Death Domain": clericDeathDomain,
  "Grave Domain": clericGraveDomain,
  "Forge Domain": clericForgeDomain,
  // Druid
  "Circle of the Land": druidCircleLand,
  "Circle of the Moon": druidCircleMoon,
  "Circle of Dreams": druidCircleDreams,
  "Circle of the Shepherd": druidCircleShepherd,
  "Circle of Spores": druidCircleSpores,
  // Fighter
  "Champion": fighterChampion,
  "Battle Master": fighterBattleMaster,
  "Eldritch Knight": fighterEldritchKnight,
  "Samurai": fighterSamurai,
  "Cavalier": fighterCavalier,
  "Arcane Archer": fighterArcaneArcher,
  // Monk
  "Way of the Open Hand": monkOpenHand,
  "Way of Shadow": monkShadow,
  "Way of the Four Elements": monkFourElements,
  "Way of the Sun Soul": monkSunSoul,
  "Way of the Drunken Master": monkDrunkenMaster,
  "Way of the Kensei": monkKensei,
  // Paladin
  "Oath of Devotion": paladinDevotion,
  "Oath of the Ancients": paladinAncients,
  "Oath of Vengeance": paladinVengeance,
  "Oath of Conquest": paladinConquest,
  "Oath of Redemption": paladinRedemption,
  "Oathbreaker": paladinOathbreaker,
  // Ranger
  "Hunter": rangerHunter,
  "Beast Master": rangerBeastMaster,
  "Gloom Stalker": rangerGloomStalker,
  "Horizon Walker": rangerHorizonWalker,
  "Monster Slayer": rangerMonsterSlayer,
  // Rogue
  "Thief": rogueThief,
  "Assassin": rogueAssassin,
  "Arcane Trickster": rogueArcaneTrickster,
  "Swashbuckler": rogueSwashbuckler,
  "Inquisitive": rogueInquisitive,
  "Scout": rogueScout,
  // Sorcerer
  "Draconic Bloodline": sorcererDraconicBloodline,
  "Wild Magic": sorcererWildMagic,
  "Divine Soul": sorcererDivineSoul,
  "Shadow Magic": sorcererShadowMagic,
  "Storm Sorcery": sorcererStormSorcery,
  // Warlock
  "The Fiend": warlockFiend,
  "The Archfey": warlockArchfey,
  "The Great Old One": warlockGreatOldOne,
  "The Hexblade": warlockHexblade,
  "The Celestial": warlockCelestial,
  "The Undying": warlockUndying,
};

export const classIcons: Record<string, React.ReactNode> = {
  Варвар: <Axe className="h-5 w-5" />,
  Бард: <Music className="h-5 w-5" />,
  Жрец: <Cross className="h-5 w-5" />,
  Друид: <Leaf className="h-5 w-5" />,
  Воин: <Sword className="h-5 w-5" />,
  Монах: <Hand className="h-5 w-5" />,
  Паладин: <Sun className="h-5 w-5" />,
  Следопыт: <Trees className="h-5 w-5" />,
  Плут: <Skull className="h-5 w-5" />,
  Чародей: <Flame className="h-5 w-5" />,
  Колдун: <Moon className="h-5 w-5" />,
  Волшебник: <BookOpen className="h-5 w-5" />,
};

interface ClassDetailModalProps {
  characterClass: CharacterClass | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SubclassCard({ subclass, onClick }: { subclass: Subclass; onClick: () => void }) {
  const subclassImage = subclass.name_en ? subclassImages[subclass.name_en] : null;
  
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border/50 hover:border-primary/30 group overflow-hidden"
    >
      <div className="flex">
        {/* Image */}
        <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-primary/20 to-transparent">
          {subclassImage ? (
            <img 
              src={subclassImage} 
              alt={subclass.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 p-3 flex flex-col justify-center min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {subclass.name}
              </h4>
              {subclass.name_en && (
                <p className="text-xs text-muted-foreground truncate">{subclass.name_en}</p>
              )}
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
          </div>
          <Badge variant="secondary" className="mt-1 text-xs w-fit">
            Ур. {subclass.level}
          </Badge>
        </div>
      </div>
    </button>
  );
}

function SubclassDetail({ subclass, onBack }: { subclass: Subclass; onBack: () => void }) {
  const subclassImage = subclass.name_en ? subclassImages[subclass.name_en] : null;
  
  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight className="h-4 w-4 rotate-180" />
        Назад к списку
      </button>

      <div className="relative rounded-lg overflow-hidden">
        {subclassImage ? (
          <div className="relative h-40">
            <img 
              src={subclassImage} 
              alt={subclass.name}
              className="w-full h-full object-cover object-[center_25%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-xl font-bold text-foreground">{subclass.name}</h3>
              {subclass.name_en && (
                <p className="text-sm text-muted-foreground">{subclass.name_en}</p>
              )}
              <Badge variant="secondary" className="mt-2">
                Выбор на {subclass.level} уровне
              </Badge>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-primary/10 to-transparent p-4">
            <h3 className="text-xl font-bold text-foreground">{subclass.name}</h3>
            {subclass.name_en && (
              <p className="text-sm text-muted-foreground">{subclass.name_en}</p>
            )}
            <Badge variant="secondary" className="mt-2">
              Выбор на {subclass.level} уровне
            </Badge>
          </div>
        )}
      </div>

      <p className="text-muted-foreground">{subclass.description}</p>

      <div>
        <h4 className="text-sm font-semibold mb-3">Умения подкласса</h4>
        <div className="space-y-3">
          {subclass.features?.map((feature, i) => (
            <div key={i} className="border-l-2 border-primary/30 pl-3">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">
                  Ур. {feature.level}
                </Badge>
                <p className="font-medium text-sm">{feature.name}</p>
              </div>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ClassDetailModal({ characterClass, open, onOpenChange }: ClassDetailModalProps) {
  const [selectedSubclass, setSelectedSubclass] = useState<Subclass | null>(null);

  if (!characterClass) return null;

  const classImage = characterClass.name_en ? classImages[characterClass.name_en] : null;
  const subclasses = characterClass.subclasses || [];

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedSubclass(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* Image Section */}
          <div className="relative w-full md:w-2/5 h-64 md:h-auto bg-gradient-to-b from-background to-muted">
            {classImage && (
              <img 
                src={classImage} 
                alt={characterClass.name}
                className="w-full h-full object-cover object-[center_25%] transition-all duration-300"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-8 w-8 rounded-lg bg-primary/20 backdrop-blur flex items-center justify-center text-primary">
                  {classIcons[characterClass.name] || <Sword className="h-4 w-4" />}
                </div>
                <h2 className="text-2xl font-bold text-foreground">{characterClass.name}</h2>
              </div>
              {characterClass.name_en && (
                <p className="text-sm text-muted-foreground">{characterClass.name_en}</p>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <DialogHeader className="p-4 pb-2 border-b">
              <DialogTitle className="sr-only">{characterClass.name}</DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">d{characterClass.hit_die}</Badge>
                {characterClass.spellcasting && (
                  <Badge className="bg-purple-500/20 text-purple-400">Заклинатель</Badge>
                )}
                {subclasses.length > 0 && (
                  <Badge variant="outline">{subclasses.length} подклассов</Badge>
                )}
              </div>
            </DialogHeader>

            <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="mx-4 mt-2 w-fit">
                <TabsTrigger value="overview">Обзор</TabsTrigger>
                <TabsTrigger value="features">Умения</TabsTrigger>
                <TabsTrigger value="subclasses" disabled={subclasses.length === 0}>
                  Подклассы ({subclasses.length})
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 overflow-auto">
                <TabsContent value="overview" className="p-4 m-0 space-y-4">
                  <p className="text-muted-foreground">{characterClass.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <span className="text-xs text-muted-foreground block">Кость хитов</span>
                      <span className="text-lg font-semibold">d{characterClass.hit_die}</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <span className="text-xs text-muted-foreground block">Основная характеристика</span>
                      <span className="text-sm font-semibold">{characterClass.primary_ability || "—"}</span>
                    </div>
                  </div>

                  {characterClass.saving_throws && characterClass.saving_throws.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Спасброски</h4>
                      <div className="flex flex-wrap gap-1">
                        {characterClass.saving_throws.map((st) => (
                          <Badge key={st} variant="outline">{st}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {characterClass.armor_proficiencies && characterClass.armor_proficiencies.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Владение доспехами</h4>
                      <p className="text-sm text-muted-foreground">
                        {characterClass.armor_proficiencies.join(", ")}
                      </p>
                    </div>
                  )}

                  {characterClass.weapon_proficiencies && characterClass.weapon_proficiencies.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Владение оружием</h4>
                      <p className="text-sm text-muted-foreground">
                        {characterClass.weapon_proficiencies.join(", ")}
                      </p>
                    </div>
                  )}

                  {characterClass.spellcasting && (
                    <div className="bg-purple-500/10 rounded-lg p-4">
                      <h4 className="text-sm font-semibold mb-2 text-purple-400">Заклинательство</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {(characterClass.spellcasting as { ability?: string }).ability && (
                          <p><span className="font-medium">Базовая характеристика:</span> {(characterClass.spellcasting as { ability?: string }).ability}</p>
                        )}
                        {(characterClass.spellcasting as { cantrips_known?: number }).cantrips_known && (
                          <p><span className="font-medium">Заговоров на 1 уровне:</span> {(characterClass.spellcasting as { cantrips_known?: number }).cantrips_known}</p>
                        )}
                        {(characterClass.spellcasting as { spells_known?: number }).spells_known && (
                          <p><span className="font-medium">Заклинаний на 1 уровне:</span> {(characterClass.spellcasting as { spells_known?: number }).spells_known}</p>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="features" className="p-4 m-0 space-y-4">
                  {characterClass.features && characterClass.features.length > 0 && (
                    <div className="space-y-3">
                      {characterClass.features.map((feature, i) => (
                        <div key={i} className="border-l-2 border-primary/30 pl-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              Ур. {feature.level}
                            </Badge>
                            <p className="font-medium text-sm">{feature.name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{feature.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="subclasses" className="p-4 m-0">
                  {selectedSubclass ? (
                    <SubclassDetail 
                      subclass={selectedSubclass} 
                      onBack={() => setSelectedSubclass(null)} 
                    />
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground mb-4">
                        Выберите подкласс, чтобы увидеть подробную информацию о его способностях.
                      </p>
                      {subclasses.map((subclass, i) => (
                        <SubclassCard
                          key={i}
                          subclass={subclass}
                          onClick={() => setSelectedSubclass(subclass)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
