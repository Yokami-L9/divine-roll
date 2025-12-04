-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create characters table
CREATE TABLE public.characters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  race TEXT NOT NULL,
  class TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  hp INTEGER NOT NULL DEFAULT 10,
  max_hp INTEGER NOT NULL DEFAULT 10,
  strength INTEGER NOT NULL DEFAULT 10,
  dexterity INTEGER NOT NULL DEFAULT 10,
  constitution INTEGER NOT NULL DEFAULT 10,
  intelligence INTEGER NOT NULL DEFAULT 10,
  wisdom INTEGER NOT NULL DEFAULT 10,
  charisma INTEGER NOT NULL DEFAULT 10,
  backstory TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create NPCs table
CREATE TABLE public.npcs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT,
  disposition TEXT DEFAULT 'Нейтральный',
  description TEXT,
  secrets TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quests table
CREATE TABLE public.quests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  priority TEXT DEFAULT 'Основной',
  reward TEXT,
  parent_id UUID REFERENCES public.quests(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create maps table
CREATE TABLE public.maps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'world',
  data JSONB DEFAULT '{}',
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create homebrew items table
CREATE TABLE public.homebrew_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  rarity TEXT,
  description TEXT,
  effect TEXT,
  damage TEXT,
  requirements TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create session notes table
CREATE TABLE public.session_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration TEXT,
  summary TEXT,
  highlights TEXT[],
  players TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.npcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homebrew_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for characters
CREATE POLICY "Users can view their own characters" ON public.characters FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own characters" ON public.characters FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own characters" ON public.characters FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own characters" ON public.characters FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for NPCs
CREATE POLICY "Users can view their own NPCs" ON public.npcs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own NPCs" ON public.npcs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own NPCs" ON public.npcs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own NPCs" ON public.npcs FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for quests
CREATE POLICY "Users can view their own quests" ON public.quests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own quests" ON public.quests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own quests" ON public.quests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own quests" ON public.quests FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for maps
CREATE POLICY "Users can view their own maps" ON public.maps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own maps" ON public.maps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own maps" ON public.maps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own maps" ON public.maps FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for homebrew_items
CREATE POLICY "Users can view their own homebrew" ON public.homebrew_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view public homebrew" ON public.homebrew_items FOR SELECT USING (is_public = true);
CREATE POLICY "Users can create homebrew" ON public.homebrew_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own homebrew" ON public.homebrew_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own homebrew" ON public.homebrew_items FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for session_notes
CREATE POLICY "Users can view their own sessions" ON public.session_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own sessions" ON public.session_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sessions" ON public.session_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sessions" ON public.session_notes FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON public.characters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_npcs_updated_at BEFORE UPDATE ON public.npcs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_quests_updated_at BEFORE UPDATE ON public.quests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_maps_updated_at BEFORE UPDATE ON public.maps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_homebrew_updated_at BEFORE UPDATE ON public.homebrew_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON public.session_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'username');
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();