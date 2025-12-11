import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Equipment } from "@/hooks/useRulebook";
import { Sword, Shield, Wrench, Package, Car } from "lucide-react";

export function EquipmentTable({ equipment }: { equipment: Equipment[] }) {
  const [search, setSearch] = useState("");

  const weapons = equipment.filter((e) => e.category === "Оружие");
  const armor = equipment.filter((e) => e.category === "Доспехи");
  const tools = equipment.filter((e) => e.category === "Инструменты");
  const gear = equipment.filter((e) => e.category === "Снаряжение");
  const transport = equipment.filter((e) => e.category === "Транспорт");

  const filterBySearch = (items: Equipment[]) =>
    items.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.name_en?.toLowerCase().includes(search.toLowerCase())
    );

  const categories = [
    { id: "weapons", label: "Оружие", icon: <Sword className="h-4 w-4" />, items: filterBySearch(weapons) },
    { id: "armor", label: "Доспехи", icon: <Shield className="h-4 w-4" />, items: filterBySearch(armor) },
    { id: "gear", label: "Снаряжение", icon: <Package className="h-4 w-4" />, items: filterBySearch(gear) },
    { id: "tools", label: "Инструменты", icon: <Wrench className="h-4 w-4" />, items: filterBySearch(tools) },
    { id: "transport", label: "Транспорт", icon: <Car className="h-4 w-4" />, items: filterBySearch(transport) },
  ];

  return (
    <div className="space-y-6">
      <Input
        placeholder="Поиск снаряжения..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <Tabs defaultValue="weapons" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 mb-4">
          {categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-2">
              {cat.icon}
              {cat.label}
              <Badge variant="secondary" className="ml-1">
                {cat.items.length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="weapons">
          <WeaponsTable items={categories[0].items} />
        </TabsContent>

        <TabsContent value="armor">
          <ArmorTable items={categories[1].items} />
        </TabsContent>

        <TabsContent value="gear">
          <GearTable items={categories[2].items} />
        </TabsContent>

        <TabsContent value="tools">
          <ToolsTable items={categories[3].items} />
        </TabsContent>

        <TabsContent value="transport">
          <TransportTable items={categories[4].items} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function WeaponsTable({ items }: { items: Equipment[] }) {
  if (items.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Оружие не найдено</p>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead>Стоимость</TableHead>
            <TableHead>Урон</TableHead>
            <TableHead>Вес</TableHead>
            <TableHead>Свойства</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {item.name}
                {item.name_en && (
                  <span className="text-xs text-muted-foreground ml-1">({item.name_en})</span>
                )}
              </TableCell>
              <TableCell>
                {item.subcategory && (
                  <Badge variant="secondary" className="text-xs">
                    {item.subcategory}
                  </Badge>
                )}
              </TableCell>
              <TableCell>{item.cost || "—"}</TableCell>
              <TableCell>
                {item.damage ? (
                  <>
                    {item.damage} {item.damage_type}
                  </>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell>{item.weight ? `${item.weight} фнт.` : "—"}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {item.properties?.map((prop) => (
                    <Badge key={prop} variant="outline" className="text-xs">
                      {prop}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ArmorTable({ items }: { items: Equipment[] }) {
  if (items.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Доспехи не найдены</p>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead>Стоимость</TableHead>
            <TableHead>Класс Доспеха</TableHead>
            <TableHead>Вес</TableHead>
            <TableHead>Скрытность</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {item.name}
                {item.name_en && (
                  <span className="text-xs text-muted-foreground ml-1">({item.name_en})</span>
                )}
              </TableCell>
              <TableCell>
                {item.subcategory && (
                  <Badge variant="secondary" className="text-xs">
                    {item.subcategory}
                  </Badge>
                )}
              </TableCell>
              <TableCell>{item.cost || "—"}</TableCell>
              <TableCell className="font-medium">{item.armor_class || "—"}</TableCell>
              <TableCell>{item.weight ? `${item.weight} фнт.` : "—"}</TableCell>
              <TableCell>
                {item.stealth_disadvantage && (
                  <Badge variant="destructive" className="text-xs">
                    Помеха
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function GearTable({ items }: { items: Equipment[] }) {
  if (items.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Снаряжение не найдено</p>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead>Стоимость</TableHead>
            <TableHead>Вес</TableHead>
            <TableHead>Описание</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {item.name}
                {item.name_en && (
                  <span className="text-xs text-muted-foreground ml-1">({item.name_en})</span>
                )}
              </TableCell>
              <TableCell>
                {item.subcategory && (
                  <Badge variant="secondary" className="text-xs">
                    {item.subcategory}
                  </Badge>
                )}
              </TableCell>
              <TableCell>{item.cost || "—"}</TableCell>
              <TableCell>{item.weight ? `${item.weight} фнт.` : "—"}</TableCell>
              <TableCell className="max-w-xs truncate">{item.description || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ToolsTable({ items }: { items: Equipment[] }) {
  if (items.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Инструменты не найдены</p>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead>Стоимость</TableHead>
            <TableHead>Вес</TableHead>
            <TableHead>Описание</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {item.name}
                {item.name_en && (
                  <span className="text-xs text-muted-foreground ml-1">({item.name_en})</span>
                )}
              </TableCell>
              <TableCell>
                {item.subcategory && (
                  <Badge variant="secondary" className="text-xs">
                    {item.subcategory}
                  </Badge>
                )}
              </TableCell>
              <TableCell>{item.cost || "—"}</TableCell>
              <TableCell>{item.weight ? `${item.weight} фнт.` : "—"}</TableCell>
              <TableCell className="max-w-xs truncate">{item.description || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function TransportTable({ items }: { items: Equipment[] }) {
  if (items.length === 0) {
    return <p className="text-muted-foreground text-center py-8">Транспорт не найден</p>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead>Стоимость</TableHead>
            <TableHead>Вес/Скорость</TableHead>
            <TableHead>Описание</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {item.name}
                {item.name_en && (
                  <span className="text-xs text-muted-foreground ml-1">({item.name_en})</span>
                )}
              </TableCell>
              <TableCell>
                {item.subcategory && (
                  <Badge variant="secondary" className="text-xs">
                    {item.subcategory}
                  </Badge>
                )}
              </TableCell>
              <TableCell>{item.cost || "—"}</TableCell>
              <TableCell>{item.weight ? `${item.weight} фнт.` : "—"}</TableCell>
              <TableCell className="max-w-xs truncate">{item.description || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
