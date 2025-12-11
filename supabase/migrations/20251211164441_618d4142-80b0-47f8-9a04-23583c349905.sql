-- Create races table
CREATE TABLE public.races (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  speed INTEGER DEFAULT 30,
  size TEXT DEFAULT 'Средний',
  ability_bonuses JSONB DEFAULT '{}',
  traits JSONB DEFAULT '[]',
  languages TEXT[] DEFAULT ARRAY['Общий'],
  subraces JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create classes table
CREATE TABLE public.classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  hit_die INTEGER NOT NULL,
  primary_ability TEXT,
  saving_throws TEXT[],
  armor_proficiencies TEXT[],
  weapon_proficiencies TEXT[],
  skill_choices JSONB DEFAULT '{}',
  features JSONB DEFAULT '[]',
  spellcasting JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create backgrounds table
CREATE TABLE public.backgrounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  skill_proficiencies TEXT[],
  tool_proficiencies TEXT[],
  languages_count INTEGER DEFAULT 0,
  equipment TEXT[],
  feature_name TEXT,
  feature_description TEXT,
  personality_traits TEXT[],
  ideals TEXT[],
  bonds TEXT[],
  flaws TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create spells table
CREATE TABLE public.spells (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  level INTEGER NOT NULL DEFAULT 0,
  school TEXT NOT NULL,
  casting_time TEXT NOT NULL,
  range TEXT NOT NULL,
  components TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT NOT NULL,
  higher_levels TEXT,
  classes TEXT[],
  ritual BOOLEAN DEFAULT false,
  concentration BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create equipment table
CREATE TABLE public.equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  cost TEXT,
  weight DECIMAL,
  description TEXT,
  damage TEXT,
  damage_type TEXT,
  properties TEXT[],
  armor_class TEXT,
  strength_requirement INTEGER,
  stealth_disadvantage BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create feats table
CREATE TABLE public.feats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT NOT NULL,
  prerequisite TEXT,
  benefits JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conditions table
CREATE TABLE public.conditions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT NOT NULL,
  effects TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rules table for game mechanics
CREATE TABLE public.rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  subsections JSONB DEFAULT '[]',
  book TEXT DEFAULT 'Книга Игрока',
  chapter INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public read access for all rulebook tables
ALTER TABLE public.races ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backgrounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spells ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;

-- Create public read policies
CREATE POLICY "Anyone can view races" ON public.races FOR SELECT USING (true);
CREATE POLICY "Anyone can view classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Anyone can view backgrounds" ON public.backgrounds FOR SELECT USING (true);
CREATE POLICY "Anyone can view spells" ON public.spells FOR SELECT USING (true);
CREATE POLICY "Anyone can view equipment" ON public.equipment FOR SELECT USING (true);
CREATE POLICY "Anyone can view feats" ON public.feats FOR SELECT USING (true);
CREATE POLICY "Anyone can view conditions" ON public.conditions FOR SELECT USING (true);
CREATE POLICY "Anyone can view rules" ON public.rules FOR SELECT USING (true);

-- Create admin policies for modifications
CREATE POLICY "Admins can manage races" ON public.races FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage classes" ON public.classes FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage backgrounds" ON public.backgrounds FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage spells" ON public.spells FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage equipment" ON public.equipment FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage feats" ON public.feats FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage conditions" ON public.conditions FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage rules" ON public.rules FOR ALL USING (is_admin(auth.uid()));