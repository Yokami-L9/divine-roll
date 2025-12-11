-- Добавляем уникальное ограничение на имя снаряжения
ALTER TABLE public.equipment ADD CONSTRAINT equipment_name_unique UNIQUE (name);