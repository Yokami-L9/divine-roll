import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface InventoryGridProps {
  items: string[];
  onUpdate?: (items: string[]) => void;
  readonly?: boolean;
  columns?: number;
  rows?: number;
}

export function InventoryGrid({ 
  items, 
  onUpdate, 
  readonly = false,
  columns = 6,
  rows = 4
}: InventoryGridProps) {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  const totalSlots = columns * rows;
  const filteredItems = items.filter(item => item !== "__NO_EQUIPMENT__");

  const handleSlotClick = (index: number) => {
    if (readonly) return;
    setSelectedSlot(index);
    setNewItemName(filteredItems[index] || "");
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!onUpdate || selectedSlot === null) return;

    const newItems = [...filteredItems];
    if (newItemName.trim()) {
      newItems[selectedSlot] = newItemName.trim();
    } else if (selectedSlot < newItems.length) {
      newItems.splice(selectedSlot, 1);
    }
    
    onUpdate(newItems);
    setDialogOpen(false);
    setNewItemName("");
    setSelectedSlot(null);
  };

  const handleRemove = () => {
    if (!onUpdate || selectedSlot === null) return;
    
    const newItems = filteredItems.filter((_, i) => i !== selectedSlot);
    onUpdate(newItems);
    setDialogOpen(false);
    setNewItemName("");
    setSelectedSlot(null);
  };

  return (
    <>
      <div 
        className="grid gap-1 p-2 bg-muted/30 rounded-lg border border-border/50"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: totalSlots }).map((_, index) => {
          const item = filteredItems[index];
          const isEmpty = !item;

          return (
            <div
              key={index}
              onClick={() => handleSlotClick(index)}
              className={cn(
                "aspect-square rounded border-2 flex items-center justify-center p-1 transition-all",
                isEmpty 
                  ? "border-dashed border-border/30 bg-background/30" 
                  : "border-border/50 bg-card hover:border-primary/50",
                !readonly && "cursor-pointer hover:bg-accent/50",
                !readonly && isEmpty && "hover:border-primary/30"
              )}
            >
              {item ? (
                <div className="w-full h-full flex items-center justify-center text-center">
                  <span className="text-[10px] leading-tight line-clamp-3 text-foreground/80">
                    {item}
                  </span>
                </div>
              ) : (
                !readonly && (
                  <Plus className="h-3 w-3 text-muted-foreground/30" />
                )
              )}
            </div>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {selectedSlot !== null && filteredItems[selectedSlot] 
                ? "Редактировать предмет" 
                : "Добавить предмет"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              placeholder="Название предмета..."
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
          </div>

          <DialogFooter className="flex gap-2">
            {selectedSlot !== null && filteredItems[selectedSlot] && (
              <Button variant="destructive" onClick={handleRemove}>
                <X className="h-4 w-4 mr-2" />
                Удалить
              </Button>
            )}
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSave}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
