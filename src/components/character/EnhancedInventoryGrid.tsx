import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, X, Package, GripVertical, Weight, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export interface InventoryItem {
  name: string;
  quantity: number;
  weight?: number;
}

interface EnhancedInventoryGridProps {
  items: InventoryItem[];
  onUpdate?: (items: InventoryItem[]) => void;
  readonly?: boolean;
  columns?: number;
  rows?: number;
  strength: number; // Character's strength score
}

// PHB carrying capacity: Strength × 15
const calculateCarryingCapacity = (strength: number) => strength * 15;

// Encumbrance rules (optional variant)
const calculateEncumbrance = (strength: number) => ({
  light: strength * 5, // Speed not affected
  heavy: strength * 10, // -10 speed, disadvantage on physical checks
  max: strength * 15, // Can't move
});

export function EnhancedInventoryGrid({
  items,
  onUpdate,
  readonly = false,
  columns = 6,
  rows = 4,
  strength,
}: EnhancedInventoryGridProps) {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("1");
  const [itemWeight, setItemWeight] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  const totalSlots = columns * rows;
  const carryingCapacity = calculateCarryingCapacity(strength);
  const encumbrance = calculateEncumbrance(strength);
  
  // Calculate total weight
  const totalWeight = items.reduce((sum, item) => {
    return sum + (item.weight || 0) * item.quantity;
  }, 0);
  
  const weightPercentage = Math.min((totalWeight / carryingCapacity) * 100, 100);
  const isOverencumbered = totalWeight > carryingCapacity;
  const isHeavilyEncumbered = totalWeight > encumbrance.heavy;
  const isLightlyEncumbered = totalWeight > encumbrance.light;

  const handleSlotClick = (index: number) => {
    if (readonly) return;
    setSelectedSlot(index);
    const item = items[index];
    if (item) {
      setItemName(item.name);
      setItemQuantity(item.quantity.toString());
      setItemWeight(item.weight?.toString() || "");
    } else {
      setItemName("");
      setItemQuantity("1");
      setItemWeight("");
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!onUpdate || selectedSlot === null || !itemName.trim()) return;

    const newItems = [...items];
    const quantity = Math.max(1, parseInt(itemQuantity, 10) || 1);
    const weight = parseFloat(itemWeight) || undefined;
    
    if (selectedSlot < newItems.length) {
      newItems[selectedSlot] = { name: itemName.trim(), quantity, weight };
    } else {
      // Fill empty slots if needed
      while (newItems.length < selectedSlot) {
        newItems.push({ name: "", quantity: 0 });
      }
      newItems[selectedSlot] = { name: itemName.trim(), quantity, weight };
    }
    
    // Filter out empty items
    const filtered = newItems.filter(item => item.name.trim() !== "");
    
    onUpdate(filtered);
    setDialogOpen(false);
    resetForm();
  };

  const handleRemove = () => {
    if (!onUpdate || selectedSlot === null) return;
    
    const newItems = items.filter((_, i) => i !== selectedSlot);
    onUpdate(newItems);
    setDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setItemName("");
    setItemQuantity("1");
    setItemWeight("");
    setSelectedSlot(null);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (readonly) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!onUpdate || draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    const dropItem = newItems[dropIndex];

    // Swap items
    if (draggedItem && dropIndex < items.length) {
      newItems[draggedIndex] = dropItem || { name: "", quantity: 0 };
      newItems[dropIndex] = draggedItem;
    } else if (draggedItem) {
      // Move to empty slot
      newItems.splice(draggedIndex, 1);
      newItems.splice(dropIndex, 0, draggedItem);
    }

    // Filter out empty items
    const filtered = newItems.filter(item => item.name.trim() !== "");
    onUpdate(filtered);
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5" />
            Инвентарь
          </CardTitle>
          <Badge variant="secondary">
            {items.length} / {totalSlots} слотов
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weight tracker */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Weight className="h-4 w-4 text-muted-foreground" />
              <span>Переносимый вес</span>
            </div>
            <span className={cn(
              "font-medium",
              isOverencumbered && "text-destructive",
              isHeavilyEncumbered && !isOverencumbered && "text-orange-500",
              isLightlyEncumbered && !isHeavilyEncumbered && "text-yellow-500"
            )}>
              {totalWeight.toFixed(1)} / {carryingCapacity} фунтов
            </span>
          </div>
          
          <Progress 
            value={weightPercentage} 
            className={cn(
              "h-2",
              isOverencumbered && "[&>div]:bg-destructive",
              isHeavilyEncumbered && !isOverencumbered && "[&>div]:bg-orange-500",
              isLightlyEncumbered && !isHeavilyEncumbered && "[&>div]:bg-yellow-500"
            )}
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Легкая ({encumbrance.light} фунтов)</span>
            <span>Тяжелая ({encumbrance.heavy} фунтов)</span>
            <span>Макс ({encumbrance.max} фунтов)</span>
          </div>
          
          {isOverencumbered && (
            <div className="flex items-center gap-2 p-2 rounded bg-destructive/10 text-destructive text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>Перегрузка! Вы не можете двигаться.</span>
            </div>
          )}
          {isHeavilyEncumbered && !isOverencumbered && (
            <div className="flex items-center gap-2 p-2 rounded bg-orange-500/10 text-orange-500 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>Тяжелая нагрузка: -10 футов к скорости, помеха на проверки.</span>
            </div>
          )}
        </div>

        {/* Inventory grid */}
        <div 
          className="grid gap-1 p-2 bg-muted/30 rounded-lg border border-border/50"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: totalSlots }).map((_, index) => {
            const item = items[index];
            const isEmpty = !item || !item.name;
            const isDragging = draggedIndex === index;
            const isDragOver = dragOverIndex === index;

            return (
              <div
                key={index}
                draggable={!readonly && !isEmpty}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => handleSlotClick(index)}
                className={cn(
                  "aspect-square rounded border-2 flex flex-col items-center justify-center p-1 transition-all relative",
                  isEmpty 
                    ? "border-dashed border-border/30 bg-background/30" 
                    : "border-border/50 bg-card hover:border-primary/50",
                  !readonly && "cursor-pointer hover:bg-accent/50",
                  !readonly && isEmpty && "hover:border-primary/30",
                  isDragging && "opacity-50 scale-95",
                  isDragOver && "border-primary bg-primary/10",
                  !readonly && !isEmpty && "cursor-grab active:cursor-grabbing"
                )}
              >
                {item && item.name ? (
                  <>
                    {/* Drag handle indicator */}
                    {!readonly && (
                      <GripVertical className="absolute top-0.5 right-0.5 h-3 w-3 text-muted-foreground/30" />
                    )}
                    
                    {/* Item name */}
                    <span className="text-[9px] leading-tight line-clamp-2 text-center text-foreground/80">
                      {item.name}
                    </span>
                    
                    {/* Quantity badge */}
                    {item.quantity > 1 && (
                      <Badge 
                        variant="secondary" 
                        className="absolute bottom-0.5 right-0.5 h-4 min-w-4 px-1 text-[8px] flex items-center justify-center"
                      >
                        ×{item.quantity}
                      </Badge>
                    )}
                    
                    {/* Weight indicator */}
                    {item.weight && (
                      <span className="absolute bottom-0.5 left-0.5 text-[7px] text-muted-foreground">
                        {(item.weight * item.quantity).toFixed(1)}lb
                      </span>
                    )}
                  </>
                ) : (
                  !readonly && (
                    <Plus className="h-3 w-3 text-muted-foreground/30" />
                  )
                )}
              </div>
            );
          })}
        </div>

        {/* Quick stats */}
        <div className="flex gap-2 flex-wrap text-xs text-muted-foreground">
          <span>Сила: {strength}</span>
          <span>•</span>
          <span>Грузоподъёмность: {carryingCapacity} фунтов</span>
        </div>
      </CardContent>

      {/* Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {selectedSlot !== null && items[selectedSlot]?.name 
                ? "Редактировать предмет" 
                : "Добавить предмет"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Название</label>
              <Input
                placeholder="Название предмета..."
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Количество</label>
                <Input
                  type="number"
                  min={1}
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(e.target.value)}
                  placeholder="1"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Вес (фунты)</label>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={itemWeight}
                  onChange={(e) => setItemWeight(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            {selectedSlot !== null && items[selectedSlot]?.name && (
              <Button variant="destructive" onClick={handleRemove}>
                <X className="h-4 w-4 mr-2" />
                Удалить
              </Button>
            )}
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSave} disabled={!itemName.trim()}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
