import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rule } from "@/hooks/useRulebook";

export function RuleSection({ rule }: { rule: Rule }) {
  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split("\n\n").map((paragraph, i) => {
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
        const items = paragraph.split("\n").filter(line => line.startsWith("- "));
        return (
          <ul key={i} className="list-disc list-inside space-y-0.5 text-sm">
            {items.map((item, j) => (
              <li key={j} dangerouslySetInnerHTML={{ __html: item.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            ))}
          </ul>
        );
      }
      
      return (
        <p key={i} className="text-sm mb-2" dangerouslySetInnerHTML={{ __html: boldProcessed }} />
      );
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg">{rule.title}</CardTitle>
          <Badge variant="secondary">{rule.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {renderContent(rule.content)}
        </div>
      </CardContent>
    </Card>
  );
}
