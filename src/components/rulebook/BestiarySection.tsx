import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Loader2, Bug, ChevronRight } from "lucide-react";
import { useMonsters, type Monster } from "@/hooks/useRulebook";
import { MonsterDetailModal } from "./MonsterDetailModal";

function MonsterListItem({ monster, onClick }: { monster: Monster; onClick: () => void }) {
  return (
    <Card
      className="p-4 bg-card border-border hover:border-primary/50 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Bug className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-serif font-semibold group-hover:text-primary transition-colors">{monster.name}</h3>
            <p className="text-xs text-muted-foreground">
              {monster.size} {monster.type}, {monster.alignment || "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">CR {monster.challenge_rating}</Badge>
          <Badge variant="outline">{monster.experience_points} XP</Badge>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </div>
    </Card>
  );
}

export function BestiarySection() {
  const { data: monsters, isLoading } = useMonsters();
  const [search, setSearch] = useState("");
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filtered = (monsters || []).filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleMonsterClick = (monster: Monster) => {
    setSelectedMonster(monster);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <Input
        placeholder="Поиск монстра..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />
      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Монстры не найдены</p>
      ) : (
        <div className="space-y-3">
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
