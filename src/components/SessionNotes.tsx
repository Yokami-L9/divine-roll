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
  Trash2,
  Save,
  Loader2
} from "lucide-react";
import { useSessionNotes } from "@/hooks/useSessionNotes";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const SessionNotes = () => {
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());
  const [isCreating, setIsCreating] = useState(false);
  const [newSession, setNewSession] = useState({
    title: "",
    summary: "",
    highlights: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  
  const { sessions, loading, createSession, deleteSession } = useSessionNotes();
  const { user } = useAuth();

  const toggleExpand = (id: string) => {
    setExpandedSessions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const addSession = async () => {
    if (!newSession.title.trim()) return;
    
    setIsSaving(true);
    const nextNumber = sessions.length > 0 
      ? Math.max(...sessions.map(s => s.session_number)) + 1 
      : 1;
    
    await createSession({
      session_number: nextNumber,
      title: newSession.title,
      date: new Date().toISOString().split('T')[0],
      duration: "0ч 00м",
      summary: newSession.summary || undefined,
      highlights: newSession.highlights.split(',').map(h => h.trim()).filter(h => h),
      players: [],
    });
    
    setNewSession({ title: "", summary: "", highlights: "" });
    setIsCreating(false);
    setIsSaving(false);
  };

  if (!user) {
    return (
      <Card className="p-8 bg-card border-border text-center">
        <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-serif font-semibold mb-2">Войдите в аккаунт</h3>
        <p className="text-muted-foreground mb-4">Авторизуйтесь для ведения журнала сессий</p>
        <Link to="/auth">
          <Button className="bg-gradient-gold hover:opacity-90">Войти</Button>
        </Link>
      </Card>
    );
  }

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
              <Button onClick={addSession} disabled={isSaving} className="gap-2">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Сохранить
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Отмена
              </Button>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : sessions.length === 0 ? (
        <Card className="p-8 bg-card border-border text-center">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-serif font-semibold mb-2">Нет записей</h3>
          <p className="text-muted-foreground">Создайте первую запись о сессии</p>
        </Card>
      ) : (
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
                      <span className="text-lg font-bold">#{session.session_number}</span>
                    </div>
                    <div>
                      <h4 className="font-serif font-semibold">{session.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {session.date}
                        </span>
                        {session.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {session.duration}
                          </span>
                        )}
                        {session.players && session.players.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {session.players.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {expandedSessions.has(session.id) ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {expandedSessions.has(session.id) && (
                <div className="px-4 pb-4 pt-2 border-t border-border">
                  {session.summary && (
                    <p className="text-muted-foreground mb-3">{session.summary}</p>
                  )}
                  
                  {session.highlights && session.highlights.length > 0 && (
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

                  {session.players && session.players.length > 0 && (
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
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-1 text-destructive hover:text-destructive"
                      onClick={() => deleteSession(session.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                      Удалить
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionNotes;
