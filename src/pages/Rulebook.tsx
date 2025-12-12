import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Scroll, Skull, ChevronRight, Users, Swords, Sparkles, Shield, AlertTriangle, BookText, Loader2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useRaces, useClasses, useBackgrounds, useSpells, useEquipment, useConditions, useRules, Race, CharacterClass, Spell, Condition, Rule } from "@/hooks/useRulebook";
import { RaceCard } from "@/components/rulebook/RaceCard";
import { RaceDetailModal } from "@/components/rulebook/RaceDetailModal";
import { ClassCard } from "@/components/rulebook/ClassCard";
import { ClassDetailModal } from "@/components/rulebook/ClassDetailModal";
import { SpellCard } from "@/components/rulebook/SpellCard";
import { SpellDetailModal } from "@/components/rulebook/SpellDetailModal";
import { EquipmentTable } from "@/components/rulebook/EquipmentTable";
import { ConditionCard } from "@/components/rulebook/ConditionCard";
import { ConditionDetailModal } from "@/components/rulebook/ConditionDetailModal";
import { RuleSection } from "@/components/rulebook/RuleSection";
import { RuleDetailModal } from "@/components/rulebook/RuleDetailModal";
import { Badge } from "@/components/ui/badge";
interface BookPart {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Book {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  parts: BookPart[];
}

const books: Book[] = [
  {
    id: "player",
    title: "Книга Игрока",
    icon: <BookOpen className="h-5 w-5" />,
    description: "Основные правила для игроков, создание персонажей, расы, классы, заклинания и снаряжение",
    parts: [
      { id: "races", title: "Расы", description: "Играбельные расы и их особенности", icon: <Users className="h-4 w-4" /> },
      { id: "classes", title: "Классы", description: "Классы персонажей и их умения", icon: <Swords className="h-4 w-4" /> },
      { id: "spells", title: "Заклинания", description: "Список заклинаний всех школ магии", icon: <Sparkles className="h-4 w-4" /> },
      { id: "equipment", title: "Снаряжение", description: "Оружие, доспехи и предметы", icon: <Shield className="h-4 w-4" /> },
      { id: "conditions", title: "Состояния", description: "Боевые состояния и их эффекты", icon: <AlertTriangle className="h-4 w-4" /> },
      { id: "rules", title: "Правила", description: "Основные правила игры", icon: <BookText className="h-4 w-4" /> },
    ],
  },
  {
    id: "master",
    title: "Книга Мастера",
    icon: <Scroll className="h-5 w-5" />,
    description: "Руководство для Мастера Подземелий по созданию миров и проведению игр",
    parts: [
      { id: "part1", title: "Часть 1: Мастер Миров", description: "Создание миров, пантеонов и цивилизаций", icon: <BookOpen className="h-4 w-4" /> },
      { id: "part2", title: "Часть 2: Мастер Приключений", description: "Создание приключений и сюжетов", icon: <BookOpen className="h-4 w-4" /> },
      { id: "part3", title: "Часть 3: Правила Мастера", description: "Дополнительные правила и варианты", icon: <BookOpen className="h-4 w-4" /> },
    ],
  },
  {
    id: "bestiary",
    title: "Бестиарий",
    icon: <Skull className="h-5 w-5" />,
    description: "Монстры, существа и NPC для ваших приключений",
    parts: [
      { id: "part1", title: "Часть 1: Монстры A-G", description: "Аболеты, Драконы, Гоблины и другие", icon: <Skull className="h-4 w-4" /> },
      { id: "part2", title: "Часть 2: Монстры H-O", description: "Химеры, Личи, Орки и другие", icon: <Skull className="h-4 w-4" /> },
      { id: "part3", title: "Часть 3: Монстры P-Z", description: "Призраки, Тролли, Зомби и другие", icon: <Skull className="h-4 w-4" /> },
    ],
  },
];

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
        <BookOpen className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">Контент будет добавлен в ближайшее время</p>
    </div>
  );
}

function RacesSection() {
  const { data: races, isLoading } = useRaces();
  const [search, setSearch] = useState("");
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredRaces = races?.filter(
    (race) =>
      race.name.toLowerCase().includes(search.toLowerCase()) ||
      race.name_en?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRaceClick = (race: Race) => {
    setSelectedRace(race);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Input
        placeholder="Поиск расы..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRaces?.map((race) => (
          <RaceCard key={race.id} race={race} onClick={() => handleRaceClick(race)} />
        ))}
      </div>
      <RaceDetailModal 
        race={selectedRace} 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
    </div>
  );
}

function ClassesSection() {
  const { data: classes, isLoading } = useClasses();
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredClasses = classes?.filter(
    (cls) =>
      cls.name.toLowerCase().includes(search.toLowerCase()) ||
      cls.name_en?.toLowerCase().includes(search.toLowerCase())
  );

  const handleClassClick = (cls: CharacterClass) => {
    setSelectedClass(cls);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Input
        placeholder="Поиск класса..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses?.map((cls) => (
          <ClassCard key={cls.id} characterClass={cls} onClick={() => handleClassClick(cls)} />
        ))}
      </div>
      <ClassDetailModal 
        characterClass={selectedClass} 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
    </div>
  );
}

function SpellsSection() {
  const { data: spells, isLoading } = useSpells();
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<number | null>(null);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredSpells = spells?.filter((spell) => {
    const matchesSearch =
      spell.name.toLowerCase().includes(search.toLowerCase()) ||
      spell.name_en?.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === null || spell.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const levels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleSpellClick = (spell: Spell) => {
    setSelectedSpell(spell);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Поиск заклинания..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <div className="flex flex-wrap gap-1">
          <Badge
            variant={levelFilter === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setLevelFilter(null)}
          >
            Все
          </Badge>
          {levels.map((level) => (
            <Badge
              key={level}
              variant={levelFilter === level ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setLevelFilter(level)}
            >
              {level === 0 ? "Заговоры" : `${level} ур.`}
            </Badge>
          ))}
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSpells?.map((spell) => (
          <SpellCard key={spell.id} spell={spell} onClick={() => handleSpellClick(spell)} />
        ))}
      </div>
      <SpellDetailModal 
        spell={selectedSpell} 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
    </div>
  );
}

function EquipmentSection() {
  const { data: equipment, isLoading } = useEquipment();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <EquipmentTable equipment={equipment || []} />;
}

function ConditionsSection() {
  const { data: conditions, isLoading } = useConditions();
  const [search, setSearch] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredConditions = conditions?.filter(
    (condition) =>
      condition.name.toLowerCase().includes(search.toLowerCase()) ||
      condition.name_en?.toLowerCase().includes(search.toLowerCase())
  );

  const handleConditionClick = (condition: Condition) => {
    setSelectedCondition(condition);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Input
        placeholder="Поиск состояния..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConditions?.map((condition) => (
          <ConditionCard 
            key={condition.id} 
            condition={condition} 
            onClick={() => handleConditionClick(condition)}
          />
        ))}
      </div>
      <ConditionDetailModal 
        condition={selectedCondition} 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
    </div>
  );
}

function RulesSection() {
  const { data: rules, isLoading } = useRules();
  const [search, setSearch] = useState("");
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredRules = rules?.filter(
    (rule) =>
      rule.title.toLowerCase().includes(search.toLowerCase()) ||
      rule.category.toLowerCase().includes(search.toLowerCase()) ||
      rule.content.toLowerCase().includes(search.toLowerCase())
  );

  const groupedRules = filteredRules?.reduce((acc, rule) => {
    if (!acc[rule.category]) acc[rule.category] = [];
    acc[rule.category].push(rule);
    return acc;
  }, {} as Record<string, typeof rules>);

  const handleRuleClick = (rule: Rule) => {
    setSelectedRule(rule);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Input
        placeholder="Поиск правила..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />
      <div className="space-y-8">
        {groupedRules &&
          Object.entries(groupedRules).map(([category, categoryRules]) => (
            <div key={category}>
              <h3 className="text-xl font-semibold mb-4">{category}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {categoryRules?.map((rule) => (
                  <RuleSection 
                    key={rule.id} 
                    rule={rule} 
                    onClick={() => handleRuleClick(rule)}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
      <RuleDetailModal 
        rule={selectedRule} 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
    </div>
  );
}

function PlayerHandbookContent({ partId }: { partId: string }) {
  switch (partId) {
    case "races":
      return <RacesSection />;
    case "classes":
      return <ClassesSection />;
    case "spells":
      return <SpellsSection />;
    case "equipment":
      return <EquipmentSection />;
    case "conditions":
      return <ConditionsSection />;
    case "rules":
      return <RulesSection />;
    default:
      return <ComingSoon title="Раздел" />;
  }
}

export default function Rulebook() {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  const currentBook = books.find((b) => b.id === selectedBook);
  const currentPart = currentBook?.parts.find((p) => p.id === selectedPart);

  if (currentPart && currentBook) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={() => {
              setSelectedBook(null);
              setSelectedPart(null);
            }}
          >
            База знаний
          </Button>
          <ChevronRight className="h-4 w-4" />
          <Button variant="link" className="p-0 h-auto" onClick={() => setSelectedPart(null)}>
            {currentBook.title}
          </Button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{currentPart.title}</span>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {currentPart.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{currentPart.title}</h1>
            <p className="text-muted-foreground">{currentPart.description}</p>
          </div>
        </div>

        {currentBook.id === "player" ? (
          <PlayerHandbookContent partId={currentPart.id} />
        ) : (
          <ComingSoon title={currentPart.title} />
        )}
      </div>
    );
  }

  if (currentBook) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Button variant="link" className="p-0 h-auto" onClick={() => setSelectedBook(null)}>
            База знаний
          </Button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{currentBook.title}</span>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {currentBook.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{currentBook.title}</h1>
            <p className="text-muted-foreground">{currentBook.description}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {currentBook.parts.map((part) => (
            <Card
              key={part.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => setSelectedPart(part.id)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {part.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="flex items-center justify-between">
                      {part.title}
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </CardTitle>
                    <CardDescription>{part.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            На главную
          </Link>
        </Button>
      </div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">База Знаний</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Полное собрание правил D&D 5e на русском языке. Выберите книгу для изучения.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {books.map((book) => (
          <Card
            key={book.id}
            className="cursor-pointer hover:bg-accent/50 transition-colors group"
            onClick={() => setSelectedBook(book.id)}
          >
            <CardHeader>
              <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {book.icon}
              </div>
              <CardTitle className="flex items-center justify-between">
                {book.title}
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </CardTitle>
              <CardDescription>{book.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">{book.parts.length} разделов</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
