import { useState, useEffect } from "react";
import { useClasses, CharacterClass } from "@/hooks/useRulebook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Sparkles, ChevronDown, ChevronRight, Flame, 
  Zap, Shield, Sword, Moon, RefreshCw 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassFeature {
  name: string;
  description: string;
  level: number;
}

interface SubclassFeature {
  name: string;
  description: string;
  level: number;
}

interface Subclass {
  name: string;
  name_en?: string;
  description?: string;
  level: number;
  features?: SubclassFeature[];
}

export interface ClassResource {
  name: string;
  max: number;
  current: number;
  recoversOn: "short" | "long";
}

// Resource definitions by class
const CLASS_RESOURCES: Record<string, (level: number) => ClassResource[]> = {
  "Варвар": (level) => [{
    name: "Ярость",
    max: level < 3 ? 2 : level < 6 ? 3 : level < 12 ? 4 : level < 17 ? 5 : level < 20 ? 6 : Infinity,
    current: level < 3 ? 2 : level < 6 ? 3 : level < 12 ? 4 : level < 17 ? 5 : level < 20 ? 6 : Infinity,
    recoversOn: "long"
  }],
  "Бард": (level) => [{
    name: "Бардовское вдохновение",
    max: Math.max(1, Math.floor((level >= 1 ? 10 : 8) / 2)), // Simplified, uses Charisma mod
    current: Math.max(1, 3),
    recoversOn: level >= 5 ? "short" : "long"
  }],
  "Монах": (level) => level >= 2 ? [{
    name: "Ки",
    max: level,
    current: level,
    recoversOn: "short"
  }] : [],
  "Паладин": (level) => [{
    name: "Божественное чувство",
    max: 3, // 1 + Charisma mod
    current: 3,
    recoversOn: "long"
  }, {
    name: "Возложение рук",
    max: level * 5,
    current: level * 5,
    recoversOn: "long"
  }],
  "Воин": (level) => {
    const resources: ClassResource[] = [{
      name: "Второе дыхание",
      max: 1,
      current: 1,
      recoversOn: "short" as const
    }];
    if (level >= 2) {
      resources.push({
        name: "Всплеск действия",
        max: level >= 17 ? 2 : 1,
        current: level >= 17 ? 2 : 1,
        recoversOn: "short" as const
      });
    }
    if (level >= 9) {
      resources.push({
        name: "Неукротимый",
        max: level >= 17 ? 3 : level >= 13 ? 2 : 1,
        current: level >= 17 ? 3 : level >= 13 ? 2 : 1,
        recoversOn: "long" as const
      });
    }
    return resources;
  },
  "Плут": (level) => level >= 20 ? [{
    name: "Удача",
    max: 1,
    current: 1,
    recoversOn: "short" as const
  }] : [],
  "Жрец": (level) => [{
    name: "Божественный канал",
    max: level >= 18 ? 3 : level >= 6 ? 2 : 1,
    current: level >= 18 ? 3 : level >= 6 ? 2 : 1,
    recoversOn: "short"
  }],
  "Друид": (level) => level >= 2 ? [{
    name: "Дикий облик",
    max: 2,
    current: 2,
    recoversOn: "short"
  }] : [],
  "Чародей": (level) => level >= 2 ? [{
    name: "Очки чародейства",
    max: level,
    current: level,
    recoversOn: "long"
  }] : [],
  "Колдун": (level) => [],
};

export interface ClassFeaturesTabProps {
  characterClass: string;
  classLevels: Record<string, number>;
  subclasses: Record<string, string>;
  characterId: string;
  initialResources?: Record<string, ClassResource[]>;
  onResourceChange?: (resources: Record<string, ClassResource[]>) => void;
}

export function ClassFeaturesTab({ 
  characterClass, 
  classLevels, 
  subclasses,
  characterId,
  initialResources,
  onResourceChange 
}: ClassFeaturesTabProps) {
  const { data: classes } = useClasses();
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());
  const [resources, setResources] = useState<Record<string, ClassResource[]>>({});
  const [initialized, setInitialized] = useState(false);

  // Initialize resources based on classes or from saved state
  useEffect(() => {
    // If we have initial resources from DB, use them
    if (initialResources && Object.keys(initialResources).length > 0 && !initialized) {
      setResources(initialResources);
      setInitialized(true);
      return;
    }

    // Otherwise calculate from class levels
    if (!initialized) {
      const newResources: Record<string, ClassResource[]> = {};
      
      Object.entries(classLevels).forEach(([className, level]) => {
        if (level > 0 && CLASS_RESOURCES[className]) {
          newResources[className] = CLASS_RESOURCES[className](level);
        }
      });
      
      setResources(newResources);
      setInitialized(true);
    }
  }, [classLevels, initialResources, initialized]);

  const toggleFeature = (featureId: string) => {
    setExpandedFeatures(prev => {
      const next = new Set(prev);
      if (next.has(featureId)) {
        next.delete(featureId);
      } else {
        next.add(featureId);
      }
      return next;
    });
  };

  const useResource = (className: string, resourceName: string) => {
    setResources(prev => {
      const classResources = prev[className] || [];
      const updated = classResources.map(r => 
        r.name === resourceName && r.current > 0 
          ? { ...r, current: r.current - 1 }
          : r
      );
      const newResources = { ...prev, [className]: updated };
      onResourceChange?.(newResources);
      return newResources;
    });
  };

  const restoreResource = (className: string, resourceName: string, restType: "short" | "long") => {
    setResources(prev => {
      const classResources = prev[className] || [];
      const updated = classResources.map(r => {
        if (r.name === resourceName) {
          if (restType === "long" || r.recoversOn === "short") {
            return { ...r, current: r.max };
          }
        }
        return r;
      });
      const newResources = { ...prev, [className]: updated };
      onResourceChange?.(newResources);
      return newResources;
    });
  };

  const restAll = (restType: "short" | "long") => {
    setResources(prev => {
      const newResources: Record<string, ClassResource[]> = {};
      Object.entries(prev).forEach(([className, classResources]) => {
        newResources[className] = classResources.map(r => {
          if (restType === "long" || r.recoversOn === "short") {
            return { ...r, current: r.max };
          }
          return r;
        });
      });
      onResourceChange?.(newResources);
      return newResources;
    });
  };

  const getClassFeatures = (className: string, level: number): ClassFeature[] => {
    const cls = classes?.find(c => c.name === className);
    if (!cls?.features) return [];
    
    const features = cls.features as ClassFeature[];
    return features
      .filter(f => f.level <= level)
      .sort((a, b) => a.level - b.level);
  };

  const getSubclassFeatures = (className: string, subclassName: string, level: number): SubclassFeature[] => {
    const cls = classes?.find(c => c.name === className);
    if (!cls?.subclasses) return [];
    
    const subclassesList = cls.subclasses as Subclass[];
    const subclass = subclassesList.find(s => s.name === subclassName);
    if (!subclass?.features) return [];
    
    return subclass.features
      .filter(f => f.level <= level)
      .sort((a, b) => a.level - b.level);
  };

  const getResourceIcon = (name: string) => {
    if (name.includes("Ярость")) return <Flame className="h-4 w-4 text-red-500" />;
    if (name.includes("Ки")) return <Zap className="h-4 w-4 text-yellow-500" />;
    if (name.includes("Божественн")) return <Sparkles className="h-4 w-4 text-yellow-400" />;
    if (name.includes("чародейства")) return <Moon className="h-4 w-4 text-purple-500" />;
    if (name.includes("дыхание") || name.includes("Неукротим")) return <Shield className="h-4 w-4 text-blue-500" />;
    if (name.includes("Всплеск")) return <Sword className="h-4 w-4 text-orange-500" />;
    return <Sparkles className="h-4 w-4 text-primary" />;
  };

  return (
    <div className="space-y-6">
      {/* Resources Section */}
      {Object.entries(resources).some(([_, r]) => r.length > 0) && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Ресурсы
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => restAll("short")}
                  className="text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Короткий отдых
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => restAll("long")}
                  className="text-xs"
                >
                  <Moon className="h-3 w-3 mr-1" />
                  Длинный отдых
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(resources).map(([className, classResources]) => 
                classResources.map((resource) => (
                  <div
                    key={`${className}-${resource.name}`}
                    className="p-3 rounded-lg bg-muted/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(resource.name)}
                        <span className="font-medium text-sm">{resource.name}</span>
                      </div>
                      <Badge variant={resource.current > 0 ? "default" : "secondary"}>
                        {resource.max === Infinity ? "∞" : `${resource.current}/${resource.max}`}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => useResource(className, resource.name)}
                        disabled={resource.current <= 0 || resource.max === Infinity}
                      >
                        Использовать
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => restoreResource(className, resource.name, resource.recoversOn)}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Восст.: {resource.recoversOn === "short" ? "короткий отдых" : "длинный отдых"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Class Features */}
      {Object.entries(classLevels)
        .filter(([_, level]) => level > 0)
        .map(([className, level]) => {
          const features = getClassFeatures(className, level);
          const subclassName = subclasses[className];
          const subclassFeatures = subclassName 
            ? getSubclassFeatures(className, subclassName, level)
            : [];

          return (
            <Card key={className}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {className}
                  <Badge variant="outline" className="ml-2">Ур. {level}</Badge>
                  {subclassName && (
                    <Badge variant="secondary" className="ml-1">{subclassName}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {/* Class Features */}
                    {features.map((feature, idx) => {
                      const featureId = `${className}-${feature.name}-${idx}`;
                      const isExpanded = expandedFeatures.has(featureId);
                      
                      return (
                        <Collapsible
                          key={featureId}
                          open={isExpanded}
                          onOpenChange={() => toggleFeature(featureId)}
                        >
                          <CollapsibleTrigger asChild>
                            <div className={cn(
                              "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                              "hover:bg-muted/80 bg-muted/50"
                            )}>
                              <div className="flex items-center gap-2">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="font-medium">{feature.name}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                Ур. {feature.level}
                              </Badge>
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="px-9 py-3 text-sm text-muted-foreground whitespace-pre-wrap">
                              {feature.description}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    })}

                    {/* Subclass Features */}
                    {subclassFeatures.length > 0 && (
                      <>
                        <div className="pt-4 pb-2">
                          <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            Способности архетипа: {subclassName}
                          </h4>
                        </div>
                        {subclassFeatures.map((feature, idx) => {
                          const featureId = `${className}-sub-${feature.name}-${idx}`;
                          const isExpanded = expandedFeatures.has(featureId);
                          
                          return (
                            <Collapsible
                              key={featureId}
                              open={isExpanded}
                              onOpenChange={() => toggleFeature(featureId)}
                            >
                              <CollapsibleTrigger asChild>
                                <div className={cn(
                                  "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                                  "hover:bg-primary/20 bg-primary/10 border border-primary/20"
                                )}>
                                  <div className="flex items-center gap-2">
                                    {isExpanded ? (
                                      <ChevronDown className="h-4 w-4 text-primary" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-primary" />
                                    )}
                                    <span className="font-medium">{feature.name}</span>
                                  </div>
                                  <Badge className="text-xs">
                                    Ур. {feature.level}
                                  </Badge>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="px-9 py-3 text-sm text-muted-foreground whitespace-pre-wrap">
                                  {feature.description}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          );
                        })}
                      </>
                    )}

                    {features.length === 0 && subclassFeatures.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Нет доступных способностей на этом уровне</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
