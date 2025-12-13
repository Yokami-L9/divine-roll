import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  BookOpen, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Loader2,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface JournalEntry {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
}

interface CharacterJournalProps {
  characterId: string;
}

export function CharacterJournal({ characterId }: CharacterJournalProps) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (characterId) {
      fetchEntries();
    }
  }, [characterId]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("character_journal")
        .select("*")
        .eq("character_id", characterId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      toast.error("Не удалось загрузить записи дневника");
    } finally {
      setLoading(false);
    }
  };

  const handleNew = () => {
    setSelectedEntry(null);
    setTitle("");
    setContent("");
    setDialogOpen(true);
  };

  const handleEdit = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setTitle(entry.title);
    setContent(entry.content || "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!user || !title.trim()) return;

    setSaving(true);
    try {
      if (selectedEntry) {
        const { error } = await supabase
          .from("character_journal")
          .update({ title: title.trim(), content: content.trim() || null })
          .eq("id", selectedEntry.id);

        if (error) throw error;
        toast.success("Запись обновлена");
      } else {
        const { error } = await supabase
          .from("character_journal")
          .insert({
            character_id: characterId,
            user_id: user.id,
            title: title.trim(),
            content: content.trim() || null,
          });

        if (error) throw error;
        toast.success("Запись добавлена");
      }

      setDialogOpen(false);
      fetchEntries();
    } catch (error) {
      console.error("Error saving journal entry:", error);
      toast.error("Не удалось сохранить запись");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!entryToDelete) return;

    try {
      const { error } = await supabase
        .from("character_journal")
        .delete()
        .eq("id", entryToDelete);

      if (error) throw error;
      toast.success("Запись удалена");
      fetchEntries();
    } catch (error) {
      console.error("Error deleting journal entry:", error);
      toast.error("Не удалось удалить запись");
    } finally {
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setEntryToDelete(id);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Дневник персонажа
        </h3>
        <Button onClick={handleNew} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Новая запись
        </Button>
      </div>

      {entries.length === 0 ? (
        <Card className="p-8 text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">
            Дневник пуст. Записывайте мысли и события вашего персонажа.
          </p>
          <Button onClick={handleNew} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Создать первую запись
          </Button>
        </Card>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-3 pr-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{entry.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(entry.created_at), "d MMMM yyyy, HH:mm", { locale: ru })}
                    </div>
                    {entry.content && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {entry.content}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(entry)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => confirmDelete(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {selectedEntry ? "Редактировать запись" : "Новая запись"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Input
              placeholder="Заголовок записи..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Содержание записи..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="resize-none"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Отмена
            </Button>
            <Button onClick={handleSave} disabled={saving || !title.trim()}>
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить запись?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Запись будет удалена навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
