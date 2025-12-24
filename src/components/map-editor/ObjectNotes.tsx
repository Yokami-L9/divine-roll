import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import type { ObjectNote } from "./types";

interface ObjectNotesProps {
  notes: ObjectNote[];
  selectedObjectId: string | null;
  onAddNote: (objectId: string, text: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export const ObjectNotes = ({
  notes,
  selectedObjectId,
  onAddNote,
  onDeleteNote,
}: ObjectNotesProps) => {
  const [newNote, setNewNote] = useState("");

  const selectedNotes = selectedObjectId
    ? notes.filter((n) => n.objectId === selectedObjectId)
    : [];

  const handleAdd = () => {
    if (selectedObjectId && newNote.trim()) {
      onAddNote(selectedObjectId, newNote.trim());
      setNewNote("");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <h4 className="text-sm font-medium text-muted-foreground">Заметки</h4>
      </div>

      {selectedObjectId ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Добавить заметку..."
              className="min-h-[60px] text-sm resize-none"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAdd}
            disabled={!newNote.trim()}
            className="w-full"
          >
            <Plus className="h-3 w-3 mr-1" />
            Добавить
          </Button>

          {selectedNotes.length > 0 && (
            <ScrollArea className="h-[120px]">
              <div className="space-y-2 pr-2">
                {selectedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-muted/50 rounded-md p-2 text-xs relative group"
                  >
                    <p className="pr-6">{note.text}</p>
                    <span className="text-muted-foreground text-[10px]">
                      {new Date(note.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteNote(note.id)}
                      className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Выберите объект для просмотра заметок
        </p>
      )}
    </div>
  );
};
