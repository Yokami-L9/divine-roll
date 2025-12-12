import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface ConditionDetailModalProps {
  condition: Condition | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConditionDetailModal({ condition, open, onOpenChange }: ConditionDetailModalProps) {
  if (!condition) return null;

  const iconKey = getConditionIconKey(condition.name_en);
  const conditionIcon = conditionIcons[iconKey];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <DialogDescription className="sr-only">
          Подробная информация о состоянии {condition.name}
        </DialogDescription>
        <ScrollArea className="max-h-[90vh]">
          {/* Header with Icon */}
          <div className="relative bg-gradient-to-br from-orange-500/30 to-transparent p-6">
            <div className="flex gap-4">
              {/* Condition Icon */}
              <div className="w-20 h-20 rounded-lg overflow-hidden shadow-lg border border-border/50 flex-shrink-0">
                {conditionIcon ? (
                  <img 
                    src={conditionIcon} 
                    alt={condition.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              {/* Title and Basic Info */}
              <div className="flex-1 min-w-0">
                <DialogHeader className="text-left">
                  <DialogTitle className="text-2xl mb-1">{condition.name}</DialogTitle>
                  {condition.name_en && (
                    <Badge variant="secondary" className="w-fit">
                      {condition.name_en}
                    </Badge>
                  )}
                </DialogHeader>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-primary" />
                Описание
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                {condition.description}
              </p>
            </div>

            {/* Effects */}
            {condition.effects && condition.effects.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Эффекты</h4>
                <ul className="space-y-2">
                  {condition.effects.map((effect, i) => (
                    <li key={i} className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
                      <span className="text-primary font-bold">{i + 1}.</span>
                      <span className="text-sm">{effect}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
