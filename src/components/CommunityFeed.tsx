import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Eye,
  Download,
  Crown
} from "lucide-react";

interface Post {
  id: number;
  author: string;
  avatar: string;
  title: string;
  description: string;
  type: string;
  likes: number;
  comments: number;
  views: number;
  isLiked: boolean;
  isSaved: boolean;
  isFeatured: boolean;
  image?: string;
}

const CommunityFeed = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "Мастер Элрон",
      avatar: "ME",
      title: "Карта затерянного храма Тиамат",
      description: "Детализированная карта древнего храма с ловушками, секретными комнатами и логовом дракона.",
      type: "Карта",
      likes: 127,
      comments: 23,
      views: 1420,
      isLiked: false,
      isSaved: true,
      isFeatured: true,
    },
    {
      id: 2,
      author: "Ариэль Тёмный",
      avatar: "АТ",
      title: "Класс: Хранитель Теней",
      description: "Полностью сбалансированный homebrew класс с тремя подклассами и уникальной механикой теневой магии.",
      type: "Homebrew",
      likes: 89,
      comments: 45,
      views: 890,
      isLiked: true,
      isSaved: false,
      isFeatured: false,
    },
    {
      id: 3,
      author: "Торгрим Кузнец",
      avatar: "ТК",
      title: "50 уникальных магических предметов",
      description: "Коллекция необычных и редких предметов для ваших кампаний с полным описанием механик.",
      type: "Предметы",
      likes: 234,
      comments: 67,
      views: 2100,
      isLiked: false,
      isSaved: false,
      isFeatured: true,
    },
    {
      id: 4,
      author: "Зарик Мудрый",
      avatar: "ЗМ",
      title: "Генератор имён для всех рас",
      description: "Более 10,000 имён для эльфов, дварфов, людей, тифлингов и других рас.",
      type: "Инструмент",
      likes: 156,
      comments: 12,
      views: 1650,
      isLiked: false,
      isSaved: true,
      isFeatured: false,
    },
    {
      id: 5,
      author: "Лира Звездопад",
      avatar: "ЛЗ",
      title: "Квестовая цепочка: Проклятие Некроманта",
      description: "Полноценная сюжетная линия на 5-10 сессий с NPC, картами и handouts.",
      type: "Квест",
      likes: 312,
      comments: 89,
      views: 3400,
      isLiked: true,
      isSaved: true,
      isFeatured: true,
    },
    {
      id: 6,
      author: "Гримальд Тёмный",
      avatar: "ГТ",
      title: "Босс-файт: Архидемон Малгорот",
      description: "Статблок, тактика и окружение для эпической битвы с демоническим лордом.",
      type: "Монстр",
      likes: 198,
      comments: 34,
      views: 1890,
      isLiked: false,
      isSaved: false,
      isFeatured: false,
    },
  ]);

  const toggleLike = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const toggleSave = (id: number) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Карта": return "bg-primary/20 text-primary";
      case "Homebrew": return "bg-accent/20 text-accent";
      case "Предметы": return "bg-secondary/20 text-secondary-foreground";
      case "Квест": return "bg-primary/20 text-primary";
      case "Монстр": return "bg-accent/20 text-accent";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card
          key={post.id}
          className="overflow-hidden bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 group"
        >
          <div className="h-40 bg-gradient-arcane relative overflow-hidden">
            {post.isFeatured && (
              <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-primary/90 rounded text-xs font-semibold">
                <Crown className="w-3 h-3" />
                Избранное
              </div>
            )}
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-3 right-3 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center text-sm font-bold">
                {post.avatar}
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium">{post.author}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  {post.views}
                </div>
              </div>
              <Badge className={getTypeColor(post.type)}>{post.type}</Badge>
            </div>
            
            <h3 className="text-lg font-serif font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {post.description}
            </p>
            
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className={`h-8 px-2 gap-1 ${post.isLiked ? "text-accent" : ""}`}
                  onClick={() => toggleLike(post.id)}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                  <span className="text-xs">{post.likes}</span>
                </Button>
                <Button size="sm" variant="ghost" className="h-8 px-2 gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">{post.comments}</span>
                </Button>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`h-8 w-8 p-0 ${post.isSaved ? "text-primary" : ""}`}
                  onClick={() => toggleSave(post.id)}
                >
                  <Bookmark className={`w-4 h-4 ${post.isSaved ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CommunityFeed;
