import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2, Bug, ChevronRight } from "lucide-react";
import { useMonsters, type Monster } from "@/hooks/useRulebook";
import { MonsterDetailModal } from "./MonsterDetailModal";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function MonsterListItem({ monster, onClick }: { monster: Monster; onClick: () => void }) {
  return (
    <Card
      className="p-3 bg-card border-border hover:border-primary/50 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-accent/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
          <Bug className="w-4 h-4 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-semibold text-sm group-hover:text-primary transition-colors truncate">
            {monster.name}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {monster.name_en || monster.type}
          </p>
        </div>
        <Badge variant="secondary" className="text-xs flex-shrink-0">CR {monster.challenge_rating}</Badge>
      </div>
    </Card>
  );
}

export function BestiarySection() {
  const { data: monsters, isLoading } = useMonsters();
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Sort alphabetically by English name, fallback to Russian name
  const sorted = [...(monsters || [])].sort((a, b) => {
    const nameA = (a.name_en || a.name).toLowerCase();
    const nameB = (b.name_en || b.name).toLowerCase();
    return nameA.localeCompare(nameB, "en");
  });

  const filtered = sorted.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.name_en || "").toLowerCase().includes(search.toLowerCase()) ||
      m.type.toLowerCase().includes(search.toLowerCase());

    const matchesLetter = !activeLetter || (m.name_en || m.name).toUpperCase().startsWith(activeLetter);

    return matchesSearch && matchesLetter;
  });

  // Figure out which letters have monsters
  const availableLetters = new Set(
    sorted.map((m) => (m.name_en || m.name).charAt(0).toUpperCase())
  );

  const handleMonsterClick = (monster: Monster) => {
    setSelectedMonster(monster);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <Input
        placeholder="Поиск монстра..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      {/* Alphabet filter */}
      <div className="flex flex-wrap gap-1">
        <Badge
          variant={activeLetter === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setActiveLetter(null)}
        >
          Все
        </Badge>
        {ALPHABET.map((letter) => {
          const hasMonsters = availableLetters.has(letter);
          return (
            <Badge
              key={letter}
              variant={activeLetter === letter ? "default" : "outline"}
              className={`cursor-pointer ${!hasMonsters ? "opacity-30 pointer-events-none" : ""}`}
              onClick={() => hasMonsters && setActiveLetter(letter)}
            >
              {letter}
            </Badge>
          );
        })}
      </div>

      {/* Monster count */}
      <p className="text-sm text-muted-foreground">
        Найдено: {filtered.length} {filtered.length === 1 ? "монстр" : "монстров"}
      </p>

      {/* Grid of monsters */}
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Монстры не найдены</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((monster) => (
            <MonsterListItem
              key={monster.id}
              monster={monster}
              onClick={() => handleMonsterClick(monster)}
            />
          ))}
        </div>
      )}

      <MonsterDetailModal
        monster={selectedMonster}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
