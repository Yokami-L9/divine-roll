// History Manager - Undo/Redo with stroke-based tracking

import { HistoryEntry } from '../types';

export interface HistoryManagerOptions {
  maxEntries?: number;
  onChange?: (canUndo: boolean, canRedo: boolean) => void;
}

export class HistoryManager {
  private stack: HistoryEntry[] = [];
  private currentIndex = -1;
  private maxEntries: number;
  private onChange?: (canUndo: boolean, canRedo: boolean) => void;
  private batchMode = false;
  private batchEntries: HistoryEntry[] = [];

  constructor(options: HistoryManagerOptions = {}) {
    this.maxEntries = options.maxEntries ?? 100;
    this.onChange = options.onChange;
  }

  public push(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void {
    const fullEntry: HistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    if (this.batchMode) {
      this.batchEntries.push(fullEntry);
      return;
    }

    // Remove any entries after current index (redo stack)
    this.stack = this.stack.slice(0, this.currentIndex + 1);
    
    // Add new entry
    this.stack.push(fullEntry);
    this.currentIndex = this.stack.length - 1;
    
    // Trim if exceeds max
    if (this.stack.length > this.maxEntries) {
      this.stack.shift();
      this.currentIndex--;
    }
    
    this.notifyChange();
  }

  public startBatch(): void {
    this.batchMode = true;
    this.batchEntries = [];
  }

  public endBatch(type: HistoryEntry['type']): void {
    if (!this.batchMode || this.batchEntries.length === 0) {
      this.batchMode = false;
      return;
    }

    this.batchMode = false;
    
    // Combine batch entries into single entry
    const combinedEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      type,
      data: this.batchEntries.map(e => e.data),
      timestamp: Date.now()
    };

    this.stack = this.stack.slice(0, this.currentIndex + 1);
    this.stack.push(combinedEntry);
    this.currentIndex = this.stack.length - 1;
    
    if (this.stack.length > this.maxEntries) {
      this.stack.shift();
      this.currentIndex--;
    }
    
    this.batchEntries = [];
    this.notifyChange();
  }

  public cancelBatch(): void {
    this.batchMode = false;
    this.batchEntries = [];
  }

  public undo(): HistoryEntry | null {
    if (!this.canUndo()) return null;
    
    const entry = this.stack[this.currentIndex];
    this.currentIndex--;
    this.notifyChange();
    
    return entry;
  }

  public redo(): HistoryEntry | null {
    if (!this.canRedo()) return null;
    
    this.currentIndex++;
    const entry = this.stack[this.currentIndex];
    this.notifyChange();
    
    return entry;
  }

  public canUndo(): boolean {
    return this.currentIndex >= 0;
  }

  public canRedo(): boolean {
    return this.currentIndex < this.stack.length - 1;
  }

  public clear(): void {
    this.stack = [];
    this.currentIndex = -1;
    this.batchMode = false;
    this.batchEntries = [];
    this.notifyChange();
  }

  public getUndoStack(): HistoryEntry[] {
    return this.stack.slice(0, this.currentIndex + 1);
  }

  public getRedoStack(): HistoryEntry[] {
    return this.stack.slice(this.currentIndex + 1);
  }

  public getCurrentEntry(): HistoryEntry | null {
    return this.stack[this.currentIndex] ?? null;
  }

  private notifyChange(): void {
    this.onChange?.(this.canUndo(), this.canRedo());
  }

  public getStats(): { total: number; current: number; canUndo: boolean; canRedo: boolean } {
    return {
      total: this.stack.length,
      current: this.currentIndex + 1,
      canUndo: this.canUndo(),
      canRedo: this.canRedo()
    };
  }
}
