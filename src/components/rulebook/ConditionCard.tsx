import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Condition } from "@/hooks/useRulebook";

export function ConditionCard({ condition }: { condition: Condition }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{condition.name}</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {condition.name_en}
          </Badge>
        </div>
        <CardDescription>{condition.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {condition.effects && condition.effects.length > 0 && (
          <ul className="space-y-1 text-sm">
            {condition.effects.map((effect, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{effect}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
