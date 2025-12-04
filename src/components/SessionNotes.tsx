import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  ChevronDown, 
  ChevronUp,
  Edit,
  Trash2,
  Save
} from "lucide-react";

interface Session {
  id: number;
  number: number;
  date: string;
  duration: string;
  title: string;
  summary: string;
  highlights: string[];
  players: string[];
  isExpanded: boolean;
}

const SessionNotes = () => {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 1,
      number: 12,
      date: "2024-01-15",
      duration: "4ч 30м",
      title: "Штурм башни некроманта",
      summary: "Группа проникла в башню Малкора, сразилась со скелетами-стражами и обнаружила секретный проход в подземелье. Элара получила проклятие от артефакта.",
      highlights: ["Победа над костяным голем", "Нашли карту подземелья", "Элара проклята"],
      players: ["Торин", "Элара", "Занн", "Мира"],
      isExpanded: true,
    },
    {
      id: 2,
      number: 11,
      date: "2024-01-08",
      duration: "3ч 45м",
      title: "Переговоры с гильдией",
      summary: "Партия встретилась с главой Гильдии Теней. Переговоры прошли успешно - гильдия предоставит информацию о Малкоре в обмен на услугу.",
      highlights: ["Союз с гильдией", "Получили карту", "Торин обзавёлся контактом"],
      players: ["Торин", "Элара", "Занн"],
      isExpanded: false,
    },
    {
      id: 3,
      number: 10,
      date: "2024-01-01",
      duration: "4ч 00м",
      title: "Засада на тракте",
      summary: "По пути в город группу атаковали культисты. После боя нашли письмо с упоминанием некроманта Малкора и его планов.",
      highlights: ["Бой с культистами", "Письмо Малкора", "Мира повысила уровень"],
      players: ["Торин", "Элара", "Занн", "Мира"],
      isExpanded: false,
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newSession, setNewSession] = useState({
    title: "",
    summary: "",
    highlights: "",
  });

  const toggleExpand = (id: number) => {
    setSessions(sessions.map(s => 
      s.id === id ? { ...s, isExpanded: !s.isExpanded } : s
    ));
  };

  const addSession = () => {
    if (!newSession.title.trim()) return;
    
    const session: Session = {
      id: Date.now(),
      number: sessions.length > 0 ? Math.max(...sessions.map(s => s.number)) + 1 : 1,
      date: new Date().toISOString().split('T')[0],
      duration: "0ч 00м",
      title: newSession.title,
      summary: newSession.summary,
      highlights: newSession.highlights.split(',').map(h => h.trim()).filter(h => h),
      players: [],
      isExpanded: true,
    };
    
    setSessions([session, ...sessions]);
    setNewSession({ title: "", summary: "", highlights: "" });
    setIsCreating(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif font-semibold">Журнал сессий</h3>
        <Button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-gradient-gold hover:opacity-90 gap-2"
        >
          <Plus className="w-4 h-4" />
          Новая сессия
        </Button>
      </div>

      {isCreating && (
        <Card className="p-4 bg-card border-primary/50 mb-4">
          <h4 className="font-semibold mb-3">Создать запись о сессии</h4>
          <div className="space-y-3">
            <Input
              placeholder="Название сессии..."
              value={newSession.title}
              onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
              className="bg-background border-border"
            />
            <Textarea
              placeholder="Краткое описание событий..."
              value={newSession.summary}
              onChange={(e) => setNewSession({ ...newSession, summary: e.target.value })}
              className="bg-background border-border min-h-[100px]"
            />
            <Input
              placeholder="Ключевые моменты (через запятую)..."
              value={newSession.highlights}
              onChange={(e) => setNewSession({ ...newSession, highlights: e.target.value })}
              className="bg-background border-border"
            />
            <div className="flex gap-2">
              <Button onClick={addSession} className="gap-2">
                <Save className="w-4 h-4" />
                Сохранить
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Отмена
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {sessions.map((session) => (
          <Card 
            key={session.id} 
            className="bg-card border-border hover:border-primary/30 transition-all"
          >
            <div 
              className="p-4 cursor-pointer"
              onClick={() => toggleExpand(session.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold">#{session.number}</span>
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold">{session.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {session.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {session.players.length}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  {session.isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {session.isExpanded && (
              <div className="px-4 pb-4 pt-2 border-t border-border">
                <p className="text-muted-foreground mb-3">{session.summary}</p>
                
                {session.highlights.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium mb-2 block">Ключевые моменты:</span>
                    <div className="flex flex-wrap gap-2">
                      {session.highlights.map((h, i) => (
                        <Badge key={i} variant="secondary" className="bg-primary/20">
                          {h}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {session.players.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium mb-2 block">Игроки:</span>
                    <div className="flex gap-2">
                      {session.players.map((p, i) => (
                        <Badge key={i} variant="outline">{p}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Edit className="w-3 h-3" />
                    Редактировать
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-destructive hover:text-destructive">
                    <Trash2 className="w-3 h-3" />
                    Удалить
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SessionNotes;
