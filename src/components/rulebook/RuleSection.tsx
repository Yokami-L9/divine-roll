import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rule } from "@/hooks/useRulebook";
import { ChevronRight } from "lucide-react";

interface RuleSectionProps {
  rule: Rule;
  onClick?: () => void;
}

export function RuleSection({ rule, onClick }: RuleSectionProps) {
  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const paragraphs = content.split("\n\n").slice(0, 2); // Only first 2 paragraphs for preview
    
    return paragraphs.map((paragraph, i) => {
      // Handle bold text
      const boldProcessed = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Handle headers
      if (paragraph.startsWith("**") && paragraph.endsWith(":**")) {
        return (
          <h4 key={i} className="font-semibold mt-3 mb-1 text-sm">
            {paragraph.replace(/\*\*/g, "").replace(/:$/, "")}
          </h4>
        );
      }
      
      // Handle list items
      if (paragraph.startsWith("- ")) {
        const items = paragraph.split("\n").filter(line => line.startsWith("- ")).slice(0, 2);
        return (
          <ul key={i} className="list-disc list-inside space-y-0.5 text-sm">
            {items.map((item, j) => (
              <li key={j} className="line-clamp-1" dangerouslySetInnerHTML={{ __html: item.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            ))}
          </ul>
        );
      }
      
      return (
        <p key={i} className="text-sm mb-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: boldProcessed }} />
      );
    });
  };

  const hasSubsections = rule.subsections && rule.subsections.length > 0;

  return (
    <Card 
      className="h-full cursor-pointer hover:bg-accent/50 transition-colors group"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg">{rule.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{rule.category}</Badge>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-muted-foreground">
          {renderContent(rule.content)}
          {hasSubsections && (
            <p className="text-xs text-primary mt-2">
              +{rule.subsections!.length} подразделов
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
