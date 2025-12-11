import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Equipment } from "@/hooks/useRulebook";

export function EquipmentTable({ equipment }: { equipment: Equipment[] }) {
  const weapons = equipment.filter((e) => e.category === "Оружие");
  const armor = equipment.filter((e) => e.category === "Доспех");

  return (
    <div className="space-y-8">
      {weapons.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Оружие</h3>
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
                {weapons.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.name}
                      <span className="text-xs text-muted-foreground ml-1">({item.name_en})</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {item.subcategory}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.cost}</TableCell>
                    <TableCell>
                      {item.damage && (
                        <>
                          {item.damage} {item.damage_type}
                        </>
                      )}
                    </TableCell>
                    <TableCell>{item.weight} фнт.</TableCell>
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
        </div>
      )}

      {armor.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Доспехи</h3>
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
                {armor.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.name}
                      <span className="text-xs text-muted-foreground ml-1">({item.name_en})</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {item.subcategory}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.cost}</TableCell>
                    <TableCell className="font-medium">{item.armor_class}</TableCell>
                    <TableCell>{item.weight} фнт.</TableCell>
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
        </div>
      )}
    </div>
  );
}
