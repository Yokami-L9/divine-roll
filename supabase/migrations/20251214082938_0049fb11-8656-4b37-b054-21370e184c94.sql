-- Add class_levels column to store multiclass data (JSON: { "Воин": 3, "Волшебник": 2 })
ALTER TABLE public.characters 
ADD COLUMN class_levels jsonb DEFAULT '{}';

-- Migrate existing data: set class_levels based on current class and level
UPDATE public.characters 
SET class_levels = jsonb_build_object(class, level)
WHERE class_levels = '{}' OR class_levels IS NULL;