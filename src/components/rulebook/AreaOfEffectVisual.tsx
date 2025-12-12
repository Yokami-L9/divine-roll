import { cn } from "@/lib/utils";

interface AreaOfEffectVisualProps {
  type: "cone" | "cube" | "cylinder" | "line" | "sphere";
  size?: string;
  className?: string;
}

export function AreaOfEffectVisual({ type, size, className }: AreaOfEffectVisualProps) {
  const baseClasses = "relative flex items-center justify-center";
  
  const renderShape = () => {
    switch (type) {
      case "cone":
        return (
          <div className={cn(baseClasses, "w-32 h-32", className)}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="coneGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <polygon 
                points="50,95 10,20 90,20" 
                fill="url(#coneGradient)" 
                stroke="hsl(var(--primary))" 
                strokeWidth="2"
              />
              <circle cx="50" cy="95" r="4" fill="hsl(var(--chart-1))" />
              <text x="50" y="10" textAnchor="middle" className="fill-foreground text-[8px] font-medium">
                {size || "Ширина"}
              </text>
            </svg>
            <div className="absolute bottom-0 text-xs text-muted-foreground">Конус</div>
          </div>
        );
      
      case "cube":
        return (
          <div className={cn(baseClasses, "w-32 h-32", className)}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="cubeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {/* Front face */}
              <polygon 
                points="20,35 60,35 60,80 20,80" 
                fill="url(#cubeGradient)" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth="2"
              />
              {/* Top face */}
              <polygon 
                points="20,35 60,35 85,15 45,15" 
                fill="hsl(var(--chart-2))" 
                fillOpacity="0.4"
                stroke="hsl(var(--chart-2))" 
                strokeWidth="2"
              />
              {/* Right face */}
              <polygon 
                points="60,35 85,15 85,60 60,80" 
                fill="hsl(var(--chart-2))" 
                fillOpacity="0.3"
                stroke="hsl(var(--chart-2))" 
                strokeWidth="2"
              />
              <circle cx="20" cy="80" r="4" fill="hsl(var(--chart-1))" />
            </svg>
            <div className="absolute bottom-0 text-xs text-muted-foreground">Куб</div>
          </div>
        );
      
      case "cylinder":
        return (
          <div className={cn(baseClasses, "w-32 h-32", className)}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="cylinderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--chart-3))" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="hsl(var(--chart-3))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--chart-3))" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              {/* Body */}
              <rect 
                x="20" y="25" width="60" height="50" 
                fill="url(#cylinderGradient)" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth="2"
              />
              {/* Top ellipse */}
              <ellipse 
                cx="50" cy="25" rx="30" ry="10" 
                fill="hsl(var(--chart-3))" 
                fillOpacity="0.5"
                stroke="hsl(var(--chart-3))" 
                strokeWidth="2"
              />
              {/* Bottom ellipse */}
              <ellipse 
                cx="50" cy="75" rx="30" ry="10" 
                fill="hsl(var(--chart-3))" 
                fillOpacity="0.3"
                stroke="hsl(var(--chart-3))" 
                strokeWidth="2"
              />
              <circle cx="50" cy="75" r="4" fill="hsl(var(--chart-1))" />
            </svg>
            <div className="absolute bottom-0 text-xs text-muted-foreground">Цилиндр</div>
          </div>
        );
      
      case "line":
        return (
          <div className={cn(baseClasses, "w-40 h-24", className)}>
            <svg viewBox="0 0 140 60" className="w-full h-full">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--chart-4))" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="hsl(var(--chart-4))" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <rect 
                x="15" y="22" width="110" height="16" 
                fill="url(#lineGradient)" 
                stroke="hsl(var(--chart-4))" 
                strokeWidth="2"
                rx="2"
              />
              <circle cx="15" cy="30" r="4" fill="hsl(var(--chart-1))" />
              {/* Arrow */}
              <polygon 
                points="125,30 115,22 115,38" 
                fill="hsl(var(--chart-4))"
              />
              <text x="70" y="55" textAnchor="middle" className="fill-muted-foreground text-[8px]">
                Длина
              </text>
            </svg>
            <div className="absolute bottom-0 text-xs text-muted-foreground">Линия</div>
          </div>
        );
      
      case "sphere":
        return (
          <div className={cn(baseClasses, "w-32 h-32", className)}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <radialGradient id="sphereGradient" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="hsl(var(--chart-5))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--chart-5))" stopOpacity="0.7" />
                </radialGradient>
              </defs>
              <circle 
                cx="50" cy="50" r="35" 
                fill="url(#sphereGradient)" 
                stroke="hsl(var(--chart-5))" 
                strokeWidth="2"
              />
              {/* Center point */}
              <circle cx="50" cy="50" r="4" fill="hsl(var(--chart-1))" />
              {/* Radius line */}
              <line 
                x1="50" y1="50" x2="85" y2="50" 
                stroke="hsl(var(--muted-foreground))" 
                strokeWidth="1" 
                strokeDasharray="3,2"
              />
              <text x="68" y="45" className="fill-muted-foreground text-[7px]">
                Радиус
              </text>
            </svg>
            <div className="absolute bottom-0 text-xs text-muted-foreground">Сфера</div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center p-2 bg-muted/30 rounded-lg border border-border/50">
      {renderShape()}
    </div>
  );
}

export function AreasOfEffectGrid() {
  const areas: Array<{ type: "cone" | "cube" | "cylinder" | "line" | "sphere"; description: string }> = [
    { type: "cone", description: "Расширяется от точки происхождения" },
    { type: "cube", description: "Точка на одной грани куба" },
    { type: "cylinder", description: "Точка в центре основания или вершины" },
    { type: "line", description: "Простирается от заклинателя" },
    { type: "sphere", description: "Расширяется от центральной точки" },
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-lg">Области эффекта заклинаний</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {areas.map((area) => (
          <div key={area.type} className="flex flex-col items-center gap-2">
            <AreaOfEffectVisual type={area.type} />
            <p className="text-xs text-center text-muted-foreground max-w-24">
              {area.description}
            </p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
        <div className="w-3 h-3 rounded-full bg-chart-1" />
        <span>Точка происхождения (не входит в область эффекта)</span>
      </div>
    </div>
  );
}
