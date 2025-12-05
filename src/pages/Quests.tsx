import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scroll, Plus, Clock, CheckCircle2, AlertCircle, List, GitBranch, Trash2, Loader2 } from "lucide-react";
import QuestTree from "@/components/QuestTree";
import { useQuests } from "@/hooks/useQuests";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const Quests = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuest, setNewQuest] = useState({
    title: "",
    description: "",
    status: "active",
    priority: "Основной",
    reward: "",
  });
  
  const { quests, loading, createQuest, updateQuest, deleteQuest } = useQuests();
  const { user } = useAuth();

  const handleCreate = async () => {
    if (!newQuest.title) return;
    await createQuest(newQuest);
    setNewQuest({ title: "", description: "", status: "active", priority: "Основной", reward: "" });
    setIsDialogOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Clock className="w-4 h-4" />;
      case "completed": return <CheckCircle2 className="w-4 h-4" />;
      case "hidden": return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-primary/20 text-primary";
      case "completed": return "bg-green-500/20 text-green-400";
      case "hidden": return "bg-accent/20 text-accent";
      default: return "bg-muted";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Активный";
      case "completed": return "Завершён";
      case "hidden": return "Скрытый";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">Квесты и сюжетные ветки</h1>
            <p className="text-muted-foreground">Отслеживайте основные и побочные задания</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-gold hover:opacity-90 gap-2">
                <Plus className="w-4 h-4" />
                Создать квест
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="font-serif">Новый квест</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Название</Label>
                  <Input
                    value={newQuest.title}
                    onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
                    placeholder="Название квеста"
                    className="bg-background border-border mt-1"
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea
                    value={newQuest.description}
                    onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
                    placeholder="Описание задания..."
                    className="bg-background border-border mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Тип</Label>
                    <Select value={newQuest.priority} onValueChange={(v) => setNewQuest({ ...newQuest, priority: v })}>
                      <SelectTrigger className="bg-background border-border mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Основной">Основной</SelectItem>
                        <SelectItem value="Побочный">Побочный</SelectItem>
                        <SelectItem value="Скрытый">Скрытый</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Награда</Label>
                    <Input
                      value={newQuest.reward}
                      onChange={(e) => setNewQuest({ ...newQuest, reward: e.target.value })}
                      placeholder="100 зм, меч..."
                      className="bg-background border-border mt-1"
                    />
                  </div>
                </div>
                <Button onClick={handleCreate} className="w-full bg-gradient-gold hover:opacity-90">
                  Создать квест
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="list" className="mb-8">
          <TabsList className="bg-card border border-border mb-6">
            <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-primary/20">
              <List className="w-4 h-4" />
              Список
            </TabsTrigger>
            <TabsTrigger value="tree" className="gap-2 data-[state=active]:bg-primary/20">
              <GitBranch className="w-4 h-4" />
              Древо сюжета
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            {!user ? (
              <Card className="p-8 bg-card border-border text-center">
                <Scroll className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-serif font-semibold mb-2">Войдите в аккаунт</h3>
                <p className="text-muted-foreground mb-4">Авторизуйтесь для управления квестами</p>
                <Link to="/auth">
                  <Button className="bg-gradient-gold hover:opacity-90">Войти</Button>
                </Link>
              </Card>
            ) : loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : quests.length === 0 ? (
              <Card className="p-8 bg-card border-border text-center">
                <Scroll className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-serif font-semibold mb-2">Нет квестов</h3>
                <p className="text-muted-foreground">Создайте первое задание</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {quests.map((quest) => (
                  <Card
                    key={quest.id}
                    className={`p-6 bg-card border-border hover:border-primary/50 transition-all group ${
                      quest.status === "hidden" ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-xl font-serif font-semibold group-hover:text-primary transition-colors">
                            {quest.title}
                          </h3>
                          <Badge variant="outline" className={getStatusColor(quest.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(quest.status)}
                              {getStatusLabel(quest.status)}
                            </span>
                          </Badge>
                          <Badge variant="outline" className="border-primary/50">{quest.priority}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{quest.description}</p>
                        {quest.reward && (
                          <p className="text-sm text-primary">Награда: {quest.reward}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {quest.status === "active" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuest(quest.id, { status: "completed" })}
                            className="text-green-400 hover:text-green-400"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                          onClick={() => deleteQuest(quest.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Scroll className="w-8 h-8 text-primary/50" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tree">
            <QuestTree />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Quests;
