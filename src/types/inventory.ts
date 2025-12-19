export interface InventoryItem {
  name: string;
  quantity: number;
  weight?: number;
}

// Helper to convert old string[] format to new InventoryItem[] format
export function convertEquipmentToItems(equipment: string[]): InventoryItem[] {
  return equipment
    .filter(item => item && item !== "__NO_EQUIPMENT__")
    .map(name => ({
      name,
      quantity: 1,
      weight: 0,
    }));
}

// Helper to convert InventoryItem[] back to string[] for legacy compatibility
export function convertItemsToEquipment(items: InventoryItem[]): string[] {
  return items.map(item => item.name);
}
