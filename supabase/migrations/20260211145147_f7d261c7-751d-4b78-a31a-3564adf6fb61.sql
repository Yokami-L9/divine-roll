
CREATE TABLE public.monsters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  size TEXT NOT NULL DEFAULT 'Средний',
  type TEXT NOT NULL,
  alignment TEXT,
  armor_class INTEGER NOT NULL DEFAULT 10,
  hit_points TEXT NOT NULL,
  speed TEXT,
  strength INTEGER NOT NULL DEFAULT 10,
  dexterity INTEGER NOT NULL DEFAULT 10,
  constitution INTEGER NOT NULL DEFAULT 10,
  intelligence INTEGER NOT NULL DEFAULT 10,
  wisdom INTEGER NOT NULL DEFAULT 10,
  charisma INTEGER NOT NULL DEFAULT 10,
  challenge_rating TEXT NOT NULL DEFAULT '0',
  experience_points INTEGER NOT NULL DEFAULT 0,
  abilities JSONB DEFAULT '[]'::jsonb,
  actions JSONB DEFAULT '[]'::jsonb,
  legendary_actions JSONB DEFAULT '[]'::jsonb,
  damage_resistances TEXT[],
  damage_immunities TEXT[],
  condition_immunities TEXT[],
  senses TEXT,
  languages TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.monsters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view monsters" ON public.monsters FOR SELECT USING (true);
CREATE POLICY "Admins can manage monsters" ON public.monsters FOR ALL USING (is_admin(auth.uid()));
