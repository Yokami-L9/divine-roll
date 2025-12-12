import { cn } from "@/lib/utils";
import { Check, User, Users, Swords, BookOpen, Brain, Sparkles, FileText } from "lucide-react";

const STEPS = [
  { id: 0, name: "Раса", icon: Users },
  { id: 1, name: "Класс", icon: Swords },
  { id: 2, name: "Характеристики", icon: Brain },
  { id: 3, name: "Предыстория", icon: BookOpen },
  { id: 4, name: "Заклинания", icon: Sparkles },
  { id: 5, name: "Детали", icon: User },
  { id: 6, name: "Обзор", icon: FileText },
];

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  completedSteps?: number[];
}

export function StepIndicator({ currentStep, onStepClick, completedSteps = [] }: StepIndicatorProps) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id) || step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => onStepClick(step.id)}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all",
                  isCurrent && "scale-110",
                  !isCurrent && !isCompleted && "opacity-50"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    isCurrent && "border-primary bg-primary text-primary-foreground",
                    isCompleted && !isCurrent && "border-primary bg-primary/20 text-primary",
                    !isCurrent && !isCompleted && "border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className={cn(
                  "text-xs font-medium hidden sm:block",
                  isCurrent && "text-primary",
                  !isCurrent && "text-muted-foreground"
                )}>
                  {step.name}
                </span>
              </button>
              
              {index < STEPS.length - 1 && (
                <div className={cn(
                  "h-0.5 flex-1 mx-2",
                  isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
