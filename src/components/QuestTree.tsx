import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, ZoomIn, ZoomOut, CheckCircle2, Clock, AlertCircle, Lock } from "lucide-react";

interface QuestNode {
  id: string;
  title: string;
  status: "active" | "completed" | "hidden" | "locked";
  x: number;
  y: number;
  children: string[];
}

const QuestTree = () => {
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodes: QuestNode[] = [
    { id: "1", title: "Начало пути", status: "completed", x: 300, y: 50, children: ["2", "3"] },
    { id: "2", title: "Тайна торговцев", status: "active", x: 150, y: 150, children: ["4", "5"] },
    { id: "3", title: "Реликвия Древних", status: "active", x: 450, y: 150, children: ["6"] },
    { id: "4", title: "Допросить свидетеля", status: "completed", x: 80, y: 250, children: ["7"] },
    { id: "5", title: "Засада на тракте", status: "active", x: 220, y: 250, children: ["7"] },
    { id: "6", title: "Руины Элдарона", status: "locked", x: 450, y: 250, children: ["8"] },
    { id: "7", title: "Логово разбойников", status: "locked", x: 150, y: 350, children: ["9"] },
    { id: "8", title: "???", status: "hidden", x: 450, y: 350, children: [] },
    { id: "9", title: "Развязка", status: "locked", x: 300, y: 450, children: [] },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "fill-green-500 stroke-green-400";
      case "active": return "fill-primary stroke-primary";
      case "locked": return "fill-muted stroke-muted-foreground";
      case "hidden": return "fill-accent/50 stroke-accent";
      default: return "fill-muted stroke-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "active": return <Clock className="w-4 h-4 text-primary" />;
      case "locked": return <Lock className="w-4 h-4 text-muted-foreground" />;
      case "hidden": return <AlertCircle className="w-4 h-4 text-accent" />;
      default: return null;
    }
  };

  const getNodePosition = (id: string) => {
    const node = nodes.find((n) => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  return (
    <Card className="p-6 bg-card border-border overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <GitBranch className="w-6 h-6 text-primary gold-glow" />
          <h2 className="text-2xl font-serif font-bold">Древо сюжета</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-muted-foreground">Завершено</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-muted-foreground">Активно</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <span className="text-muted-foreground">Заблокировано</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent/50"></div>
          <span className="text-muted-foreground">Скрыто</span>
        </div>
      </div>

      {/* Tree Canvas */}
      <div
        className="relative bg-background/50 rounded-lg border border-border overflow-auto"
        style={{ height: "500px" }}
      >
        <svg
          width="600"
          height="500"
          style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
        >
          {/* Connection Lines */}
          {nodes.map((node) =>
            node.children.map((childId) => {
              const childPos = getNodePosition(childId);
              const childNode = nodes.find((n) => n.id === childId);
              return (
                <line
                  key={`${node.id}-${childId}`}
                  x1={node.x}
                  y1={node.y + 20}
                  x2={childPos.x}
                  y2={childPos.y - 20}
                  className={`stroke-2 ${
                    node.status === "completed" && childNode?.status !== "locked"
                      ? "stroke-primary/50"
                      : "stroke-border"
                  }`}
                  strokeDasharray={childNode?.status === "locked" ? "5,5" : "none"}
                />
              );
            })
          )}

          {/* Nodes */}
          {nodes.map((node) => (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer"
              onClick={() => setSelectedNode(node.id)}
            >
              {/* Node Background */}
              <rect
                x="-60"
                y="-20"
                width="120"
                height="40"
                rx="8"
                className={`${getStatusColor(node.status)} stroke-2 transition-all ${
                  selectedNode === node.id ? "stroke-[3]" : ""
                }`}
                style={{ fillOpacity: node.status === "hidden" ? 0.3 : 0.2 }}
              />
              {/* Node Text */}
              <text
                textAnchor="middle"
                dy="5"
                className={`text-xs font-medium ${
                  node.status === "hidden"
                    ? "fill-accent"
                    : node.status === "locked"
                    ? "fill-muted-foreground"
                    : "fill-foreground"
                }`}
              >
                {node.title.length > 15 ? node.title.slice(0, 15) + "..." : node.title}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Selected Node Info */}
      {selectedNode && (
        <div className="mt-4 p-4 bg-background/50 rounded-lg border border-primary/30">
          {(() => {
            const node = nodes.find((n) => n.id === selectedNode);
            if (!node) return null;
            return (
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(node.status)}
                    <h3 className="text-lg font-serif font-semibold">{node.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Статус:{" "}
                    {node.status === "completed"
                      ? "Завершено"
                      : node.status === "active"
                      ? "Активно"
                      : node.status === "locked"
                      ? "Заблокировано"
                      : "Скрыто"}
                  </p>
                  {node.children.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Ведёт к: {node.children.length} квест(ам)
                    </p>
                  )}
                </div>
                <Button variant="outline" size="sm" className="border-primary/50">
                  Подробнее
                </Button>
              </div>
            );
          })()}
        </div>
      )}
    </Card>
  );
};

export default QuestTree;
