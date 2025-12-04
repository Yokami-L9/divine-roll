import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  TrendingUp, 
  Clock, 
  Bookmark, 
  Filter,
  Crown,
  Map,
  Wand2,
  Sword,
  Scroll
} from "lucide-react";
import CommunityFeed from "@/components/CommunityFeed";

const Community = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filters = [
    { icon: Map, label: "Карты", value: "maps" },
    { icon: Wand2, label: "Homebrew", value: "homebrew" },
    { icon: Sword, label: "Предметы", value: "items" },
    { icon: Scroll, label: "Квесты", value: "quests" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">
              Сообщество
            </h1>
            <p className="text-muted-foreground">
              Делитесь контентом, находите вдохновение и общайтесь с другими мастерами
            </p>
          </div>
          <Button className="bg-gradient-gold hover:opacity-90 gap-2 w-fit">
            <Plus className="w-4 h-4" />
            Опубликовать
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск контента..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map((filter) => (
              <Button
                key={filter.value}
                variant={activeFilter === filter.value ? "default" : "outline"}
                size="sm"
                className={`gap-2 ${activeFilter === filter.value ? "bg-primary" : "border-border"}`}
                onClick={() => setActiveFilter(activeFilter === filter.value ? null : filter.value)}
              >
                <filter.icon className="w-4 h-4" />
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="featured" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="featured" className="gap-2 data-[state=active]:bg-primary/20">
              <Crown className="w-4 h-4" />
              Избранное
            </TabsTrigger>
            <TabsTrigger value="trending" className="gap-2 data-[state=active]:bg-primary/20">
              <TrendingUp className="w-4 h-4" />
              Популярное
            </TabsTrigger>
            <TabsTrigger value="recent" className="gap-2 data-[state=active]:bg-primary/20">
              <Clock className="w-4 h-4" />
              Новое
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2 data-[state=active]:bg-primary/20">
              <Bookmark className="w-4 h-4" />
              Сохранённое
            </TabsTrigger>
          </TabsList>

          <TabsContent value="featured">
            <CommunityFeed />
          </TabsContent>

          <TabsContent value="trending">
            <CommunityFeed />
          </TabsContent>

          <TabsContent value="recent">
            <CommunityFeed />
          </TabsContent>

          <TabsContent value="saved">
            <CommunityFeed />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Community;
