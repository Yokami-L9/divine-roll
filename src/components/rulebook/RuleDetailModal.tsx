import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Rule } from "@/hooks/useRulebook";
import { BookOpen, ChevronRight, Scroll } from "lucide-react";
import { AreasOfEffectGrid } from "./AreaOfEffectVisual";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface RuleDetailModalProps {
  rule: Rule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mapping of rule titles to special visualizations
const VISUAL_RULES: Record<string, React.ReactNode> = {
  "Цели заклинаний": <AreasOfEffectGrid />,
};

// Category colors
const categoryColors: Record<string, string> = {
  "Использование заклинаний": "from-purple-500/30",
  "Боевые правила": "from-red-500/30",
  "Движение": "from-blue-500/30",
  "Отдых": "from-green-500/30",
  "Действия": "from-orange-500/30",
};

export function RuleDetailModal({ rule, open, onOpenChange }: RuleDetailModalProps) {
  if (!rule) return null;

  const gradientColor = categoryColors[rule.category] || "from-primary/30";
  const specialVisual = VISUAL_RULES[rule.title];
  const subsections = rule.subsections || [];

  // Enhanced markdown rendering
  const renderContent = (content: string) => {
    return content.split("\n\n").map((paragraph, i) => {
      // Handle bold text
      const boldProcessed = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>');
      
      // Handle headers
      if (paragraph.startsWith("**") && paragraph.endsWith(":**")) {
        return (
          <h4 key={i} className="font-semibold mt-4 mb-2 text-base text-primary">
            {paragraph.replace(/\*\*/g, "").replace(/:$/, "")}
          </h4>
        );
      }
      
      // Handle list items
      if (paragraph.startsWith("- ")) {
        const items = paragraph.split("\n").filter(line => line.startsWith("- "));
        return (
          <ul key={i} className="space-y-2 my-3">
            {items.map((item, j) => (
              <li key={j} className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
                <ChevronRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span 
                  className="text-sm" 
                  dangerouslySetInnerHTML={{ 
                    __html: item.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') 
                  }} 
                />
              </li>
            ))}
          </ul>
        );
      }
      
      // Handle numbered lists
      if (/^\d+\./.test(paragraph)) {
        const items = paragraph.split("\n").filter(line => /^\d+\./.test(line));
        return (
          <ol key={i} className="space-y-2 my-3">
            {items.map((item, j) => {
              const match = item.match(/^(\d+)\.\s*(.*)$/);
              if (!match) return null;
              return (
                <li key={j} className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {match[1]}
                  </span>
                  <span 
                    className="text-sm" 
                    dangerouslySetInnerHTML={{ 
                      __html: match[2].replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') 
                    }} 
                  />
                </li>
              );
            })}
          </ol>
        );
      }
      
      return (
        <p 
          key={i} 
          className="text-sm text-muted-foreground leading-relaxed mb-3" 
          dangerouslySetInnerHTML={{ __html: boldProcessed }} 
        />
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden">
        <DialogDescription className="sr-only">
          Подробная информация о правиле: {rule.title}
        </DialogDescription>
        <ScrollArea className="max-h-[90vh]">
          {/* Header */}
          <div className={`relative bg-gradient-to-br ${gradientColor} to-transparent p-6`}>
            <div className="flex gap-4">
              {/* Icon */}
              <div className="w-16 h-16 rounded-lg bg-background/50 backdrop-blur shadow-lg border border-border/50 flex items-center justify-center flex-shrink-0">
                <Scroll className="h-8 w-8 text-primary" />
              </div>
              
              {/* Title and Category */}
              <div className="flex-1 min-w-0">
                <DialogHeader className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {rule.category}
                    </Badge>
                    {rule.chapter && (
                      <Badge variant="outline" className="text-xs">
                        Глава {rule.chapter}
                      </Badge>
                    )}
                  </div>
                  <DialogTitle className="text-2xl">{rule.title}</DialogTitle>
                </DialogHeader>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Special Visualization */}
            {specialVisual && (
              <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                {specialVisual}
              </div>
            )}

            {/* Main Content */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Описание
              </h4>
              <div className="prose prose-sm max-w-none">
                {renderContent(rule.content)}
              </div>
            </div>

            {/* Subsections */}
            {subsections.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Scroll className="h-4 w-4 text-primary" />
                  Подразделы
                </h4>
                <Accordion type="multiple" className="space-y-2">
                  {subsections.map((subsection, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`subsection-${index}`}
                      className="border border-border/50 rounded-lg overflow-hidden bg-card"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 text-left">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="font-medium">{subsection.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="pl-9 prose prose-sm max-w-none">
                          {renderContent(subsection.content)}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
