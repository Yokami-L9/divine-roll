-- Add subclasses storage to characters
ALTER TABLE public.characters 
ADD COLUMN IF NOT EXISTS subclasses jsonb DEFAULT '{}'::jsonb;

-- Comment for clarity
COMMENT ON COLUMN public.characters.subclasses IS 'Stores selected subclass for each class, e.g. {"Волшебник": "Школа Воплощения"}';