import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Scroll, Skull, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookPart {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
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
      {
        id: "part1",
        title: "Часть 1: Создание персонажа",
        description: "Расы, классы, предыстории и характеристики",
        content: <PlayerHandbookPart1 />,
      },
      {
        id: "part2",
        title: "Часть 2: Игра",
        description: "Правила игры, сражения и приключения",
        content: <PlayerHandbookPart2 />,
      },
      {
        id: "part3",
        title: "Часть 3: Магия",
        description: "Заклинания и магические предметы",
        content: <PlayerHandbookPart3 />,
      },
    ],
  },
  {
    id: "master",
    title: "Книга Мастера",
    icon: <Scroll className="h-5 w-5" />,
    description: "Руководство для Мастера Подземелий по созданию миров и проведению игр",
    parts: [
      {
        id: "part1",
        title: "Часть 1: Мастер Миров",
        description: "Создание миров, пантеонов и цивилизаций",
        content: <ComingSoon title="Книга Мастера: Часть 1" />,
      },
      {
        id: "part2",
        title: "Часть 2: Мастер Приключений",
        description: "Создание приключений и сюжетов",
        content: <ComingSoon title="Книга Мастера: Часть 2" />,
      },
      {
        id: "part3",
        title: "Часть 3: Правила Мастера",
        description: "Дополнительные правила и варианты",
        content: <ComingSoon title="Книга Мастера: Часть 3" />,
      },
    ],
  },
  {
    id: "bestiary",
    title: "Бестиарий",
    icon: <Skull className="h-5 w-5" />,
    description: "Монстры, существа и NPC для ваших приключений",
    parts: [
      {
        id: "part1",
        title: "Часть 1: Монстры A-G",
        description: "Аболеты, Драконы, Гоблины и другие",
        content: <ComingSoon title="Бестиарий: Часть 1" />,
      },
      {
        id: "part2",
        title: "Часть 2: Монстры H-O",
        description: "Химеры, Личи, Орки и другие",
        content: <ComingSoon title="Бестиарий: Часть 2" />,
      },
      {
        id: "part3",
        title: "Часть 3: Монстры P-Z",
        description: "Призраки, Тролли, Зомби и другие",
        content: <ComingSoon title="Бестиарий: Часть 3" />,
      },
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

function PlayerHandbookPart1() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Загрузите распакованный PDF файл Книги Игрока для отображения полного содержимого.
      </p>
      <ComingSoon title="Книга Игрока: Часть 1" />
    </div>
  );
}

function PlayerHandbookPart2() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Загрузите распакованный PDF файл Книги Игрока для отображения полного содержимого.
      </p>
      <ComingSoon title="Книга Игрока: Часть 2" />
    </div>
  );
}

function PlayerHandbookPart3() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Загрузите распакованный PDF файл Книги Игрока для отображения полного содержимого.
      </p>
      <ComingSoon title="Книга Игрока: Часть 3" />
    </div>
  );
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
          <Button variant="link" className="p-0 h-auto" onClick={() => { setSelectedBook(null); setSelectedPart(null); }}>
            База знаний
          </Button>
          <ChevronRight className="h-4 w-4" />
          <Button variant="link" className="p-0 h-auto" onClick={() => setSelectedPart(null)}>
            {currentBook.title}
          </Button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{currentPart.title}</span>
        </div>

        <h1 className="text-3xl font-bold mb-2">{currentPart.title}</h1>
        <p className="text-muted-foreground mb-8">{currentPart.description}</p>

        {currentPart.content}
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

        <div className="grid gap-4 mt-8">
          {currentBook.parts.map((part) => (
            <Card
              key={part.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => setSelectedPart(part.id)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {part.title}
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>{part.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
              <div className="text-sm text-muted-foreground">
                {book.parts.length} части
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
