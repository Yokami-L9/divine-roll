import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Plus, Backpack, BookText, Users, Sparkles, Calendar, Trash2, Loader2 } from "lucide-react";
import CharacterGenerator from "@/components/CharacterGenerator";
import SessionNotes from "@/components/SessionNotes";
import { useCharacters } from "@/hooks/useCharacters";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const Characters = () => {
  const { characters, loading, deleteCharacter } = useCharacters();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">Персонажи игроков</h1>
            <p className="text-muted-foreground">Управляйте персонажами, их биографиями и развитием</p>
          </div>
          <Button className="bg-gradient-gold hover:opacity-90 gap-2">
            <Plus className="w-4 h-4" />
            Создать персонажа
          </Button>
        </div>

        <Tabs defaultValue="list" className="mb-8">
          <TabsList className="bg-card border border-border mb-6">
            <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-primary/20">
              <Users className="w-4 h-4" />
              Мои персонажи
            </TabsTrigger>
            <TabsTrigger value="generator" className="gap-2 data-[state=active]:bg-primary/20">
              <Sparkles className="w-4 h-4" />
              Генератор
            </TabsTrigger>
            <TabsTrigger value="sessions" className="gap-2 data-[state=active]:bg-primary/20">
              <Calendar className="w-4 h-4" />
              Сессии
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            {!user ? (
              <Card className="p-8 bg-card border-border text-center">
                <UserCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-serif font-semibold mb-2">Войдите в аккаунт</h3>
                <p className="text-muted-foreground mb-4">
                  Авторизуйтесь, чтобы сохранять и управлять персонажами
                </p>
                <Link to="/auth">
                  <Button className="bg-gradient-gold hover:opacity-90">Войти</Button>
                </Link>
              </Card>
            ) : loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : characters.length === 0 ? (
              <Card className="p-8 bg-card border-border text-center">
                <UserCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-serif font-semibold mb-2">Нет персонажей</h3>
                <p className="text-muted-foreground mb-4">
                  Создайте своего первого персонажа в генераторе
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {characters.map((char) => (
                  <Card key={char.id} className="p-6 bg-card border-border hover:border-primary/50 transition-all group">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-gold rounded-full flex items-center justify-center">
                        <UserCircle className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-serif font-semibold group-hover:text-primary">{char.name}</h3>
                        <p className="text-sm text-muted-foreground">{char.race} • {char.class}</p>
                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded">Ур. {char.level}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                        onClick={() => deleteCharacter(char.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-gold" style={{ width: `${(char.hp / char.max_hp) * 100}%` }}></div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">HP: {char.hp}/{char.max_hp}</div>
                  </Card>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
                    <UserCircle className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold mb-1">Портрет и био</h3>
                    <p className="text-sm text-muted-foreground">Добавьте изображение и историю персонажа</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
                    <Backpack className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold mb-1">Инвентарь</h3>
                    <p className="text-sm text-muted-foreground">Отслеживайте снаряжение и ресурсы</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
                    <BookText className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold mb-1">Дневник</h3>
                    <p className="text-sm text-muted-foreground">Записывайте приключения и открытия</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="generator">
            <CharacterGenerator />
          </TabsContent>

          <TabsContent value="sessions">
            <SessionNotes />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Characters;
