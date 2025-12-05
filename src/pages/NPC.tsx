import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserCircle, Plus, Search, Network, List, Trash2, Loader2 } from "lucide-react";
import NPCGraph from "@/components/NPCGraph";
import { useNPCs } from "@/hooks/useNPCs";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const NPC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNPC, setNewNPC] = useState({
    name: "",
    role: "",
    location: "",
    disposition: "Нейтральный",
    description: "",
  });
  
  const { npcs, loading, createNPC, deleteNPC } = useNPCs();
  const { user } = useAuth();

  const handleCreate = async () => {
    if (!newNPC.name || !newNPC.role) return;
    await createNPC(newNPC);
    setNewNPC({ name: "", role: "", location: "", disposition: "Нейтральный", description: "" });
    setIsDialogOpen(false);
  };

  const filteredNPCs = npcs.filter(
    (npc) =>
      npc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      npc.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (npc.location?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">
              База NPC
            </h1>
            <p className="text-muted-foreground">
              Управляйте персонажами и их связями
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-gold hover:opacity-90 gap-2">
                <Plus className="w-4 h-4" />
                Добавить NPC
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="font-serif">Новый NPC</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Имя</Label>
                  <Input
                    value={newNPC.name}
                    onChange={(e) => setNewNPC({ ...newNPC, name: e.target.value })}
                    placeholder="Имя персонажа"
                    className="bg-background border-border mt-1"
                  />
                </div>
                <div>
                  <Label>Роль</Label>
                  <Input
                    value={newNPC.role}
                    onChange={(e) => setNewNPC({ ...newNPC, role: e.target.value })}
                    placeholder="Торговец, Кузнец, Разбойник..."
                    className="bg-background border-border mt-1"
                  />
                </div>
                <div>
                  <Label>Локация</Label>
                  <Input
                    value={newNPC.location}
                    onChange={(e) => setNewNPC({ ...newNPC, location: e.target.value })}
                    placeholder="Где можно найти"
                    className="bg-background border-border mt-1"
                  />
                </div>
                <div>
                  <Label>Отношение</Label>
                  <Select value={newNPC.disposition} onValueChange={(v) => setNewNPC({ ...newNPC, disposition: v })}>
                    <SelectTrigger className="bg-background border-border mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Союзник">Союзник</SelectItem>
                      <SelectItem value="Нейтральный">Нейтральный</SelectItem>
                      <SelectItem value="Враг">Враг</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea
                    value={newNPC.description}
                    onChange={(e) => setNewNPC({ ...newNPC, description: e.target.value })}
                    placeholder="Краткое описание..."
                    className="bg-background border-border mt-1"
                  />
                </div>
                <Button onClick={handleCreate} className="w-full bg-gradient-gold hover:opacity-90">
                  Создать NPC
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
            <TabsTrigger value="graph" className="gap-2 data-[state=active]:bg-primary/20">
              <Network className="w-4 h-4" />
              Граф связей
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            {!user ? (
              <Card className="p-8 bg-card border-border text-center">
                <UserCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-serif font-semibold mb-2">Войдите в аккаунт</h3>
                <p className="text-muted-foreground mb-4">Авторизуйтесь для управления NPC</p>
                <Link to="/auth">
                  <Button className="bg-gradient-gold hover:opacity-90">Войти</Button>
                </Link>
              </Card>
            ) : (
              <>
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Поиск по имени, роли или локации..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-card border-border"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : filteredNPCs.length === 0 ? (
                  <Card className="p-8 bg-card border-border text-center">
                    <UserCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-serif font-semibold mb-2">Нет NPC</h3>
                    <p className="text-muted-foreground">Добавьте первого персонажа</p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNPCs.map((npc) => (
                      <Card
                        key={npc.id}
                        className="p-6 bg-card border-border hover:border-primary/50 transition-all group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center group-hover:bg-secondary/30 transition-colors flex-shrink-0">
                            <UserCircle className="w-8 h-8 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h3 className="text-lg font-serif font-semibold mb-1 group-hover:text-primary transition-colors truncate">
                                {npc.name}
                              </h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive h-8 w-8 p-0"
                                onClick={() => deleteNPC(npc.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{npc.role}</p>
                            {npc.description && (
                              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                {npc.description}
                              </p>
                            )}
                            <div className="flex gap-2 flex-wrap">
                              {npc.location && (
                                <span className="px-2 py-1 bg-secondary/20 rounded text-xs">
                                  {npc.location}
                                </span>
                              )}
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  npc.disposition === "Союзник"
                                    ? "bg-primary/20 text-primary"
                                    : npc.disposition === "Враг"
                                    ? "bg-accent/20 text-accent"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {npc.disposition}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="graph">
            <NPCGraph />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default NPC;
