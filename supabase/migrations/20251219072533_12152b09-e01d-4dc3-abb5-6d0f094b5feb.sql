-- Step 1: Add new jsonb column
ALTER TABLE public.characters 
ADD COLUMN equipment_new jsonb DEFAULT '[]'::jsonb;

-- Step 2: Create function to convert equipment
CREATE OR REPLACE FUNCTION convert_equipment_array(arr text[])
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb := '[]'::jsonb;
  item text;
BEGIN
  IF arr IS NULL THEN
    RETURN '[]'::jsonb;
  END IF;
  
  FOREACH item IN ARRAY arr
  LOOP
    IF item IS NOT NULL AND item != '' AND item != '__NO_EQUIPMENT__' THEN
      result := result || jsonb_build_object('name', item, 'quantity', 1, 'weight', 0);
    END IF;
  END LOOP;
  
  RETURN result;
END;
$$;

-- Step 3: Update all rows with converted data
UPDATE public.characters 
SET equipment_new = convert_equipment_array(equipment);

-- Step 4: Drop old column
ALTER TABLE public.characters DROP COLUMN equipment;

-- Step 5: Rename new column
ALTER TABLE public.characters RENAME COLUMN equipment_new TO equipment;

-- Step 6: Clean up function
DROP FUNCTION convert_equipment_array(text[]);