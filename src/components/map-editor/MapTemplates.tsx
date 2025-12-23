import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileStack, Trees, Building2, Castle, Waves, Mountain, Map } from "lucide-react";

export interface MapTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  backgroundColor: string;
  objects: TemplateObject[];
}

export interface TemplateObject {
  type: 'rect' | 'circle' | 'text';
  props: Record<string, any>;
}

const TEMPLATES: MapTemplate[] = [
  {
    id: 'empty',
    name: 'Пустая карта',
    description: 'Чистый холст для свободного творчества',
    icon: Map,
    backgroundColor: '#1a1a2e',
    objects: [],
  },
  {
    id: 'forest',
    name: 'Лесная местность',
    description: 'Зелёная территория с деревьями',
    icon: Trees,
    backgroundColor: '#1a3d1f',
    objects: [
      { type: 'rect', props: { left: 0, top: 0, width: 1200, height: 800, fill: '#2d5a3d' } },
    ],
  },
  {
    id: 'dungeon',
    name: 'Подземелье',
    description: 'Тёмные коридоры и комнаты',
    icon: Castle,
    backgroundColor: '#0f0f1a',
    objects: [
      { type: 'rect', props: { left: 0, top: 0, width: 1200, height: 800, fill: '#1a1a2e' } },
      { type: 'rect', props: { left: 100, top: 100, width: 200, height: 300, fill: '#2d2d44', stroke: '#4a4a6a', strokeWidth: 3 } },
      { type: 'rect', props: { left: 300, top: 200, width: 400, height: 200, fill: '#2d2d44', stroke: '#4a4a6a', strokeWidth: 3 } },
      { type: 'rect', props: { left: 700, top: 150, width: 250, height: 350, fill: '#2d2d44', stroke: '#4a4a6a', strokeWidth: 3 } },
      { type: 'rect', props: { left: 200, top: 400, width: 100, height: 200, fill: '#2d2d44', stroke: '#4a4a6a', strokeWidth: 3 } },
    ],
  },
  {
    id: 'city',
    name: 'Город',
    description: 'Улицы и здания средневекового города',
    icon: Building2,
    backgroundColor: '#1c1c28',
    objects: [
      { type: 'rect', props: { left: 0, top: 0, width: 1200, height: 800, fill: '#d4a373' } },
      { type: 'rect', props: { left: 100, top: 350, width: 1000, height: 100, fill: '#a3a3a3' } },
      { type: 'rect', props: { left: 550, top: 100, width: 100, height: 600, fill: '#a3a3a3' } },
    ],
  },
  {
    id: 'coast',
    name: 'Побережье',
    description: 'Морское побережье с песчаным пляжем',
    icon: Waves,
    backgroundColor: '#1e3a5f',
    objects: [
      { type: 'rect', props: { left: 0, top: 0, width: 600, height: 800, fill: '#3b82f6' } },
      { type: 'rect', props: { left: 600, top: 0, width: 600, height: 800, fill: '#fde68a' } },
    ],
  },
  {
    id: 'mountain',
    name: 'Горная местность',
    description: 'Скалистые горы и ущелья',
    icon: Mountain,
    backgroundColor: '#1a1f2e',
    objects: [
      { type: 'rect', props: { left: 0, top: 0, width: 1200, height: 800, fill: '#4a7c59' } },
      { type: 'rect', props: { left: 200, top: 100, width: 300, height: 250, fill: '#78716c' } },
      { type: 'rect', props: { left: 700, top: 200, width: 350, height: 300, fill: '#78716c' } },
      { type: 'rect', props: { left: 400, top: 500, width: 400, height: 200, fill: '#78716c' } },
    ],
  },
];

interface MapTemplatesProps {
  onSelectTemplate: (template: MapTemplate) => void;
}

export const MapTemplates = ({ onSelectTemplate }: MapTemplatesProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-2">
          <FileStack className="w-4 h-4" />
          Шаблоны карт
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileStack className="w-5 h-5" />
            Выберите шаблон карты
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="grid grid-cols-2 gap-4 p-1">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="group p-4 rounded-lg border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center border border-border"
                    style={{ backgroundColor: template.backgroundColor }}
                  >
                    <template.icon className="w-6 h-6 text-white/80" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                      {template.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>
                </div>
                {/* Preview */}
                <div
                  className="mt-3 h-20 rounded-md border border-border/50 relative overflow-hidden"
                  style={{ backgroundColor: template.backgroundColor }}
                >
                  {template.objects.slice(0, 5).map((obj, i) => (
                    <div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${(obj.props.left / 1200) * 100}%`,
                        top: `${(obj.props.top / 800) * 100}%`,
                        width: `${(obj.props.width / 1200) * 100}%`,
                        height: `${(obj.props.height / 800) * 100}%`,
                        backgroundColor: obj.props.fill,
                        border: obj.props.stroke ? `1px solid ${obj.props.stroke}` : undefined,
                        borderRadius: obj.type === 'circle' ? '50%' : '2px',
                      }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export { TEMPLATES };
