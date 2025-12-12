import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Condition } from "@/hooks/useRulebook";
import { AlertTriangle } from "lucide-react";

// Dynamically import all condition icons
const conditionIconsContext = import.meta.glob('@/assets/conditions/*.png', { eager: true, import: 'default' });

// Convert file paths to usable icon map
const conditionIcons: Record<string, string> = {};
Object.entries(conditionIconsContext).forEach(([path, module]) => {
  const fileName = path.split('/').pop()?.replace('.png', '') || '';
  conditionIcons[fileName] = module as string;
});

// Helper function to convert condition name to file name format
function getConditionIconKey(nameEn: string | null): string {
  if (!nameEn) return '';
  return nameEn.toLowerCase();
}

interface ConditionCardProps {
  condition: Condition;
  onClick?: () => void;
}

export function ConditionCard({ condition, onClick }: ConditionCardProps) {
  const iconKey = getConditionIconKey(condition.name_en);
  const conditionIcon = conditionIcons[iconKey];

  return (
    <Card 
      className="h-full cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          {/* Condition Icon */}
          <div className="w-12 h-12 rounded-lg overflow-hidden shadow border border-border/50 flex-shrink-0">
            {conditionIcon ? (
              <img 
                src={conditionIcon} 
                alt={condition.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-lg truncate">{condition.name}</CardTitle>
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                {condition.name_en}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">{condition.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {condition.effects && condition.effects.length > 0 && (
          <ul className="space-y-1 text-sm">
            {condition.effects.slice(0, 2).map((effect, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span className="line-clamp-1">{effect}</span>
              </li>
            ))}
            {condition.effects.length > 2 && (
              <li className="text-muted-foreground text-xs">
                +{condition.effects.length - 2} ещё...
              </li>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
