import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Network, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface NPCNode {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  faction: string;
}

interface Connection {
  from: string;
  to: string;
  relation: "ally" | "enemy" | "neutral" | "family";
}

const NPCGraph = () => {
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodes: NPCNode[] = [
    { id: "1", name: "Элара", role: "Торговка", x: 200, y: 150, faction: "Гильдия" },
    { id: "2", name: "Торгрим", role: "Кузнец", x: 400, y: 100, faction: "Клан" },
    { id: "3", name: "Лорд Валериан", role: "Злодей", x: 350, y: 250, faction: "Двор" },
    { id: "4", name: "Зарик", role: "Разбойник", x: 150, y: 300, faction: "Тени" },
    { id: "5", name: "Миранда", role: "Жрица", x: 500, y: 200, faction: "Храм" },
  ];

  const connections: Connection[] = [
    { from: "1", to: "2", relation: "ally" },
    { from: "1", to: "3", relation: "enemy" },
    { from: "3", to: "4", relation: "ally" },
    { from: "2", to: "5", relation: "neutral" },
    { from: "4", to: "1", relation: "enemy" },
  ];

  const getConnectionColor = (relation: string) => {
    switch (relation) {
      case "ally":
        return "stroke-primary";
      case "enemy":
        return "stroke-accent";
      case "family":
        return "stroke-purple-500";
      default:
        return "stroke-muted-foreground";
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
          <Network className="w-6 h-6 text-primary arcane-glow" />
          <h2 className="text-2xl font-serif font-bold">Граф связей</h2>
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
            onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-primary"></div>
          <span className="text-muted-foreground">Союзник</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-accent"></div>
          <span className="text-muted-foreground">Враг</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-muted-foreground"></div>
          <span className="text-muted-foreground">Нейтральный</span>
        </div>
      </div>

      {/* Graph Canvas */}
      <div
        className="relative bg-background/50 rounded-lg border border-border overflow-hidden"
        style={{ height: "400px" }}
      >
        <svg
          width="100%"
          height="100%"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
        >
          {/* Connections */}
          {connections.map((conn, index) => {
            const from = getNodePosition(conn.from);
            const to = getNodePosition(conn.to);
            return (
              <line
                key={index}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className={`${getConnectionColor(conn.relation)} opacity-50`}
                strokeWidth="2"
                strokeDasharray={conn.relation === "neutral" ? "5,5" : "none"}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer"
              onClick={() => setSelectedNode(node.id)}
            >
              {/* Glow effect for selected */}
              {selectedNode === node.id && (
                <circle r="35" className="fill-primary/20 animate-pulse" />
              )}
              {/* Node circle */}
              <circle
                r="25"
                className={`fill-card stroke-2 transition-all ${
                  selectedNode === node.id
                    ? "stroke-primary"
                    : "stroke-border hover:stroke-primary/50"
                }`}
              />
              {/* Node text */}
              <text
                textAnchor="middle"
                dy="-35"
                className="fill-foreground text-sm font-semibold"
              >
                {node.name}
              </text>
              <text
                textAnchor="middle"
                dy="5"
                className="fill-muted-foreground text-xs"
              >
                {node.role.charAt(0)}
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
            const nodeConnections = connections.filter(
              (c) => c.from === selectedNode || c.to === selectedNode
            );
            return (
              <div>
                <h3 className="text-lg font-serif font-semibold text-primary">
                  {node.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {node.role} • {node.faction}
                </p>
                <div className="text-sm">
                  <span className="text-muted-foreground">Связи: </span>
                  {nodeConnections.map((conn, i) => {
                    const otherId =
                      conn.from === selectedNode ? conn.to : conn.from;
                    const other = nodes.find((n) => n.id === otherId);
                    return (
                      <span key={i} className="mr-2">
                        <span
                          className={
                            conn.relation === "ally"
                              ? "text-primary"
                              : conn.relation === "enemy"
                              ? "text-accent"
                              : "text-muted-foreground"
                          }
                        >
                          {other?.name}
                        </span>
                        {i < nodeConnections.length - 1 && ", "}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </Card>
  );
};

export default NPCGraph;
