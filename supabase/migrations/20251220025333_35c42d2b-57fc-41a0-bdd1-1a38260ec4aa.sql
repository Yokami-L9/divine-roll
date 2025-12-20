-- Add columns for spell slots and class resources state
ALTER TABLE public.characters 
ADD COLUMN spell_slots jsonb DEFAULT NULL,
ADD COLUMN class_resources jsonb DEFAULT NULL;

-- spell_slots format: { max: number[], current: number[], pactSlots?: { max: number, current: number, level: number } }
-- class_resources format: { className: [{ name: string, max: number, current: number, recoversOn: "short" | "long" }] }

COMMENT ON COLUMN public.characters.spell_slots IS 'Spell slot state: { max, current, pactSlots }';
COMMENT ON COLUMN public.characters.class_resources IS 'Class resources state by class name';