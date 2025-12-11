-- Добавляем поле для хранения URL изображения расы
ALTER TABLE public.races ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Добавляем поле для хранения изображений подрас в JSON
-- Subraces уже хранятся как JSONB, изображения будут добавлены в каждый объект подрасы