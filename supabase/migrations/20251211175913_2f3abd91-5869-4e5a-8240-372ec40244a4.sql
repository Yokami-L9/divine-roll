
-- Add unique constraint on spells name
ALTER TABLE public.spells ADD CONSTRAINT spells_name_unique UNIQUE (name);
