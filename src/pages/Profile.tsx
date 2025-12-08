import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Save, Loader2, LogIn, LogOut, Sword, Users, Map, ScrollText, BookOpen, Shield, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useUserRole } from "@/hooks/useUserRole";
import { useCharacters } from "@/hooks/useCharacters";
import { useNPCs } from "@/hooks/useNPCs";
import { useMaps } from "@/hooks/useMaps";
import { useQuests } from "@/hooks/useQuests";
import { useHomebrew } from "@/hooks/useHomebrew";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { roles, isAdmin, isModerator } = useUserRole();
  const { characters } = useCharacters();
  const { npcs } = useNPCs();
  const { maps } = useMaps();
  const { quests } = useQuests();
  const { items: homebrewItems } = useHomebrew();
  const { toast } = useToast();

  const [username, setUsername] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile?.username) {
      setUsername(profile.username);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!username.trim()) return;
    setIsSaving(true);
    await updateProfile({ username: username.trim() });
    setIsSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из аккаунта",
    });
    navigate("/");
  };

  const getRoleBadge = () => {
    if (isAdmin) {
      return (
        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black gap-1">
          <Crown className="w-3 h-3" />
          Администратор
        </Badge>
      );
    }
    if (isModerator) {
      return (
        <Badge className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white gap-1">
          <Shield className="w-3 h-3" />
          Модератор
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1">
        <User className="w-3 h-3" />
        Пользователь
      </Badge>
    );
  };

  const stats = [
    { label: "Персонажи", value: characters.length, icon: Sword, color: "text-primary" },
    { label: "NPC", value: npcs.length, icon: Users, color: "text-secondary" },
    { label: "Карты", value: maps.length, icon: Map, color: "text-accent" },
    { label: "Квесты", value: quests.length, icon: ScrollText, color: "text-primary" },
    { label: "Хомбрю", value: homebrewItems.length, icon: BookOpen, color: "text-secondary" },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <Card className="p-12 text-center bg-card border-border">
            <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-serif font-bold mb-2">Войдите в аккаунт</h2>
            <p className="text-muted-foreground mb-6">
              Для доступа к профилю необходимо авторизоваться
            </p>
            <Link to="/auth">
              <Button className="bg-gradient-gold hover:opacity-90 gap-2">
                <LogIn className="w-4 h-4" />
                Войти
              </Button>
            </Link>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">Профиль</h1>
          <p className="text-muted-foreground">Управляйте своим аккаунтом и просматривайте статистику</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <Card className="p-6 bg-card border-border lg:col-span-1">
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-arcane text-2xl font-serif">
                  {username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-serif font-semibold">
                {username || user.email?.split("@")[0]}
              </h2>
              <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
              {getRoleBadge()}
            </div>

            {profileLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Имя пользователя</Label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Введите имя"
                    className="bg-background border-border"
                  />
                </div>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !username.trim()}
                  className="w-full bg-gradient-gold hover:opacity-90 gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Сохранить
                </Button>
                
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full mt-4 gap-2 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти из аккаунта
                </Button>
              </div>
            )}
          </Card>

          {/* Stats */}
          <Card className="p-6 bg-card border-border lg:col-span-2">
            <h3 className="text-xl font-serif font-semibold mb-6">Статистика контента</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 bg-background rounded-lg border border-border text-center hover:border-primary/50 transition-colors"
                >
                  <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-background/50 rounded-lg border border-border">
              <h4 className="font-semibold mb-2">Информация об аккаунте</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Дата регистрации:</span>
                  <p className="font-medium">
                    {new Date(user.created_at).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
