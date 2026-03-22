import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Wand2, LogIn, UserPlus, Loader2, Eye, EyeOff } from "lucide-react";
import { z } from "zod";

// Only allow Latin characters, numbers, and basic symbols for username
const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
// Only allow Latin characters, numbers, and symbols for password
const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]+$/;

const emailSchema = z.string().trim().email({ message: "Некорректный email адрес" }).max(255);
const usernameSchema = z.string().trim()
  .min(3, { message: "Имя должно быть не менее 3 символов" })
  .max(30, { message: "Имя должно быть не более 30 символов" })
  .regex(usernameRegex, { message: "Только латинские буквы, цифры, _ . -" });
const passwordSchema = z.string()
  .min(6, { message: "Пароль должен быть не менее 6 символов" })
  .max(100, { message: "Пароль должен быть не более 100 символов" })
  .regex(passwordRegex, { message: "Только латинские буквы, цифры и символы" });

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  // Filter input to only allow Latin characters for username
  const handleUsernameChange = (value: string) => {
    // Remove any non-Latin characters
    const filtered = value.replace(/[^a-zA-Z0-9_.-]/g, '');
    setUsername(filtered);
    // Clear error when typing
    if (errors.username) {
      setErrors(prev => ({ ...prev, username: '' }));
    }
  };

  // Filter input to only allow Latin characters and symbols for password
  const handlePasswordChange = (value: string, field: 'password' | 'confirmPassword') => {
    const filtered = value.replace(/[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/g, '');
    if (field === 'password') {
      setPassword(filtered);
      if (errors.password) {
        setErrors(prev => ({ ...prev, password: '' }));
      }
    } else {
      setConfirmPassword(filtered);
      if (errors.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const validateLoginForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    if (!password) {
      newErrors.password = "Введите пароль";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    const usernameResult = usernameSchema.safeParse(username);
    if (!usernameResult.success) {
      newErrors.username = usernameResult.error.errors[0].message;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLoginForm()) return;

    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);

    if (error) {
      let message = "Неизвестная ошибка";
      if (error.message.includes("Invalid login credentials")) {
        message = "Неверный email или пароль";
      } else if (error.message.includes("Email not confirmed")) {
        message = "Email не подтверждён";
      }
      toast({
        title: "Ошибка входа",
        description: message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Добро пожаловать!",
        description: "Вы успешно вошли в аккаунт",
      });
      navigate("/");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) return;

    setIsSubmitting(true);
    const { error } = await signUp(email, password, username);
    setIsSubmitting(false);

    if (error) {
      let message = "Неизвестная ошибка";
      if (error.message.includes("already registered")) {
        message = "Пользователь с таким email уже существует";
      } else if (error.message.includes("invalid")) {
        message = "Некорректный email";
      }
      toast({
        title: "Ошибка регистрации",
        description: message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Аккаунт создан!",
        description: "Вы успешно зарегистрировались",
      });
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center gold-glow">
              <Wand2 className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-primary">Divine Roll</h1>
          <p className="text-muted-foreground mt-2">Войдите, чтобы сохранять свои приключения</p>
        </div>

        <Card className="p-6 bg-card border-border">
          <Tabs defaultValue="login">
            <TabsList className="w-full bg-secondary/20 mb-6">
              <TabsTrigger value="login" className="flex-1 gap-2 data-[state=active]:bg-primary/20">
                <LogIn className="w-4 h-4" />
                Вход
              </TabsTrigger>
              <TabsTrigger value="register" className="flex-1 gap-2 data-[state=active]:bg-primary/20">
                <UserPlus className="w-4 h-4" />
                Регистрация
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    className={`bg-background border-border ${errors.email ? 'border-destructive' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Пароль</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value, 'password')}
                      className={`bg-background border-border pr-10 ${errors.password ? 'border-destructive' : ''}`}
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-gold hover:opacity-90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <LogIn className="w-4 h-4 mr-2" />
                  )}
                  Войти
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username">Имя пользователя</Label>
                  <Input
                    id="register-username"
                    type="text"
                    placeholder="DungeonMaster"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className={`bg-background border-border ${errors.username ? 'border-destructive' : ''}`}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">Только латинские буквы, цифры, _ . -</p>
                  {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    className={`bg-background border-border ${errors.email ? 'border-destructive' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Пароль</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Минимум 6 символов"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value, 'password')}
                      className={`bg-background border-border pr-10 ${errors.password ? 'border-destructive' : ''}`}
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Только латинские буквы, цифры и символы</p>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">Подтверждение пароля</Label>
                  <div className="relative">
                    <Input
                      id="register-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Повторите пароль"
                      value={confirmPassword}
                      onChange={(e) => handlePasswordChange(e.target.value, 'confirmPassword')}
                      className={`bg-background border-border pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                      disabled={isSubmitting}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-gold hover:opacity-90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <UserPlus className="w-4 h-4 mr-2" />
                  )}
                  Создать аккаунт
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Создавая аккаунт, вы соглашаетесь с условиями использования
        </p>
      </div>
    </div>
  );
};

export default Auth;
