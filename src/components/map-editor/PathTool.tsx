import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Route, Trash2 } from "lucide-react";

export interface PathPoint {
  x: number;
  y: number;
}

export interface MapPath {
  id: string;
  points: PathPoint[];
  color: string;
  totalDistance: number;
}

interface PathToolProps {
  isDrawingPath: boolean;
  currentPath: PathPoint[];
  paths: MapPath[];
  pathColor: string;
  setPathColor: (color: string) => void;
  pixelsPerUnit: number;
  measureUnit: string;
  onStartPath: () => void;
  onFinishPath: () => void;
  onCancelPath: () => void;
  onDeletePath: (pathId: string) => void;
  onClearAllPaths: () => void;
}

export const PathTool = ({
  isDrawingPath,
  currentPath,
  paths,
  pathColor,
  setPathColor,
  pixelsPerUnit,
  measureUnit,
  onStartPath,
  onFinishPath,
  onCancelPath,
  onDeletePath,
  onClearAllPaths,
}: PathToolProps) => {
  const calculatePathDistance = (points: PathPoint[]) => {
    let distance = 0;
    for (let i = 1; i < points.length; i++) {
      distance += Math.sqrt(
        Math.pow(points[i].x - points[i - 1].x, 2) +
        Math.pow(points[i].y - points[i - 1].y, 2)
      );
    }
    return distance;
  };

  const formatDistance = (pixels: number) => {
    const units = pixels / pixelsPerUnit;
    return `${units.toFixed(1)} ${measureUnit}`;
  };

  const currentDistance = calculatePathDistance(currentPath);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Route className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-medium">Маршруты</h4>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Цвет маршрута</Label>
        <Input
          type="color"
          value={pathColor}
          onChange={(e) => setPathColor(e.target.value)}
          className="w-full h-8 cursor-pointer"
        />
      </div>

      {!isDrawingPath ? (
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={onStartPath}
        >
          <Route className="w-4 h-4" />
          Начать маршрут
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="bg-muted/50 rounded-md p-2 text-center">
            <p className="text-xs text-muted-foreground">Точек: {currentPath.length}</p>
            <p className="text-sm font-medium">{formatDistance(currentDistance)}</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={onFinishPath}
              disabled={currentPath.length < 2}
            >
              Завершить
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onCancelPath}
            >
              Отмена
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            Кликайте для добавления точек
          </p>
        </div>
      )}

      {paths.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Сохранённые маршруты</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAllPaths}
                className="h-6 px-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {paths.map((path, index) => (
                <div
                  key={path.id}
                  className="flex items-center justify-between p-2 bg-muted/30 rounded-md text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: path.color }}
                    />
                    <span>Маршрут {index + 1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {formatDistance(path.totalDistance)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeletePath(path.id)}
                      className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
