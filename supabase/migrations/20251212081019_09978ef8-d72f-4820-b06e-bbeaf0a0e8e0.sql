-- Create race_names table for name generation
CREATE TABLE public.race_names (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  race_name_en TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'neutral')),
  name_type TEXT NOT NULL CHECK (name_type IN ('first', 'last', 'clan')),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.race_names ENABLE ROW LEVEL SECURITY;

-- Anyone can view race names
CREATE POLICY "Anyone can view race names" 
ON public.race_names 
FOR SELECT 
USING (true);

-- Admins can manage race names
CREATE POLICY "Admins can manage race names" 
ON public.race_names 
FOR ALL 
USING (is_admin(auth.uid()));

-- Add new columns to characters table for full character data
ALTER TABLE public.characters 
ADD COLUMN IF NOT EXISTS subrace TEXT,
ADD COLUMN IF NOT EXISTS background TEXT,
ADD COLUMN IF NOT EXISTS alignment TEXT,
ADD COLUMN IF NOT EXISTS proficiency_bonus INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS armor_class INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS initiative INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS speed INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS skill_proficiencies TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS saving_throw_proficiencies TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT ARRAY['Общий'],
ADD COLUMN IF NOT EXISTS equipment TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS traits TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS known_spells TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS prepared_spells TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS personality_trait TEXT,
ADD COLUMN IF NOT EXISTS ideal TEXT,
ADD COLUMN IF NOT EXISTS bond TEXT,
ADD COLUMN IF NOT EXISTS flaw TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create index for race_names lookup
CREATE INDEX idx_race_names_race ON public.race_names(race_name_en, gender, name_type);

-- Insert sample names for common races
INSERT INTO public.race_names (race_name_en, gender, name_type, name) VALUES
-- Human names
('Human', 'male', 'first', 'Альдрик'),
('Human', 'male', 'first', 'Бранден'),
('Human', 'male', 'first', 'Кормак'),
('Human', 'male', 'first', 'Дариан'),
('Human', 'male', 'first', 'Эрик'),
('Human', 'male', 'first', 'Фелиан'),
('Human', 'male', 'first', 'Гарет'),
('Human', 'male', 'first', 'Хендрик'),
('Human', 'female', 'first', 'Аэлин'),
('Human', 'female', 'first', 'Бриана'),
('Human', 'female', 'first', 'Селена'),
('Human', 'female', 'first', 'Делиа'),
('Human', 'female', 'first', 'Элена'),
('Human', 'female', 'first', 'Фиона'),
('Human', 'female', 'first', 'Гвендолин'),
('Human', 'female', 'first', 'Хелена'),
('Human', 'neutral', 'last', 'Железная Рука'),
('Human', 'neutral', 'last', 'Громовой'),
('Human', 'neutral', 'last', 'Светлый'),
('Human', 'neutral', 'last', 'Ястреб'),
-- Elf names
('Elf', 'male', 'first', 'Аэлендил'),
('Elf', 'male', 'first', 'Галадриэль'),
('Elf', 'male', 'first', 'Леголас'),
('Elf', 'male', 'first', 'Эарендил'),
('Elf', 'male', 'first', 'Финрод'),
('Elf', 'female', 'first', 'Арвен'),
('Elf', 'female', 'first', 'Лутиэн'),
('Elf', 'female', 'first', 'Нимродель'),
('Elf', 'female', 'first', 'Идриль'),
('Elf', 'female', 'first', 'Мелиан'),
('Elf', 'neutral', 'last', 'Лунный Свет'),
('Elf', 'neutral', 'last', 'Звёздная Песнь'),
('Elf', 'neutral', 'last', 'Серебряный Лист'),
-- Dwarf names
('Dwarf', 'male', 'first', 'Торин'),
('Dwarf', 'male', 'first', 'Балин'),
('Dwarf', 'male', 'first', 'Гимли'),
('Dwarf', 'male', 'first', 'Дурин'),
('Dwarf', 'male', 'first', 'Брогин'),
('Dwarf', 'female', 'first', 'Дис'),
('Dwarf', 'female', 'first', 'Хельга'),
('Dwarf', 'female', 'first', 'Брунхильда'),
('Dwarf', 'female', 'first', 'Торга'),
('Dwarf', 'neutral', 'clan', 'Железная Кузня'),
('Dwarf', 'neutral', 'clan', 'Каменный Щит'),
('Dwarf', 'neutral', 'clan', 'Золотая Жила'),
-- Halfling names
('Halfling', 'male', 'first', 'Бильбо'),
('Halfling', 'male', 'first', 'Фродо'),
('Halfling', 'male', 'first', 'Сэм'),
('Halfling', 'male', 'first', 'Пиппин'),
('Halfling', 'male', 'first', 'Мерри'),
('Halfling', 'female', 'first', 'Роза'),
('Halfling', 'female', 'first', 'Примула'),
('Halfling', 'female', 'first', 'Лобелия'),
('Halfling', 'female', 'first', 'Камелия'),
('Halfling', 'neutral', 'last', 'Торбинс'),
('Halfling', 'neutral', 'last', 'Брендибак'),
('Halfling', 'neutral', 'last', 'Тук'),
-- Dragonborn names
('Dragonborn', 'male', 'first', 'Аргон'),
('Dragonborn', 'male', 'first', 'Балазар'),
('Dragonborn', 'male', 'first', 'Гиксанат'),
('Dragonborn', 'male', 'first', 'Крив'),
('Dragonborn', 'female', 'first', 'Акра'),
('Dragonborn', 'female', 'first', 'Бири'),
('Dragonborn', 'female', 'first', 'Кора'),
('Dragonborn', 'female', 'first', 'Мишань'),
('Dragonborn', 'neutral', 'clan', 'Кланлессар'),
('Dragonborn', 'neutral', 'clan', 'Драгонбейн'),
('Dragonborn', 'neutral', 'clan', 'Вёртвинг'),
-- Tiefling names
('Tiefling', 'male', 'first', 'Акменос'),
('Tiefling', 'male', 'first', 'Дамиан'),
('Tiefling', 'male', 'first', 'Экемон'),
('Tiefling', 'male', 'first', 'Мордай'),
('Tiefling', 'female', 'first', 'Акта'),
('Tiefling', 'female', 'first', 'Брисейс'),
('Tiefling', 'female', 'first', 'Каллиста'),
('Tiefling', 'female', 'first', 'Дамайа'),
('Tiefling', 'neutral', 'last', 'Отчаяние'),
('Tiefling', 'neutral', 'last', 'Надежда'),
('Tiefling', 'neutral', 'last', 'Пепел'),
-- Half-Orc names
('Half-Orc', 'male', 'first', 'Грок'),
('Half-Orc', 'male', 'first', 'Круск'),
('Half-Orc', 'male', 'first', 'Горум'),
('Half-Orc', 'male', 'first', 'Тарак'),
('Half-Orc', 'female', 'first', 'Багги'),
('Half-Orc', 'female', 'first', 'Голка'),
('Half-Orc', 'female', 'first', 'Шаута'),
('Half-Orc', 'female', 'first', 'Вола'),
('Half-Orc', 'neutral', 'last', 'Кровавый Клык'),
('Half-Orc', 'neutral', 'last', 'Раздробитель'),
('Half-Orc', 'neutral', 'last', 'Громовой Кулак'),
-- Gnome names
('Gnome', 'male', 'first', 'Бодрик'),
('Gnome', 'male', 'first', 'Финбус'),
('Gnome', 'male', 'first', 'Зук'),
('Gnome', 'male', 'first', 'Гимбл'),
('Gnome', 'female', 'first', 'Берена'),
('Gnome', 'female', 'first', 'Донелла'),
('Gnome', 'female', 'first', 'Лилли'),
('Gnome', 'female', 'first', 'Орла'),
('Gnome', 'neutral', 'last', 'Ховик'),
('Gnome', 'neutral', 'last', 'Гирнстен'),
('Gnome', 'neutral', 'last', 'Шеппен'),
-- Half-Elf names (use both human and elf)
('Half-Elf', 'male', 'first', 'Кайлен'),
('Half-Elf', 'male', 'first', 'Тариэль'),
('Half-Elf', 'male', 'first', 'Ривален'),
('Half-Elf', 'female', 'first', 'Аэлья'),
('Half-Elf', 'female', 'first', 'Лиринда'),
('Half-Elf', 'female', 'first', 'Сильвана'),
('Half-Elf', 'neutral', 'last', 'Полуэльф'),
('Half-Elf', 'neutral', 'last', 'Двумирье');