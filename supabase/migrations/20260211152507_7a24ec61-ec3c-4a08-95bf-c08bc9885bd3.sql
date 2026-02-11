
-- Drop the restrictive ALL policy and recreate as permissive policies
DROP POLICY "Admins can manage monsters" ON public.monsters;
DROP POLICY "Anyone can view monsters" ON public.monsters;

-- Permissive SELECT for everyone
CREATE POLICY "Anyone can view monsters"
ON public.monsters FOR SELECT
USING (true);

-- Permissive ALL for admins
CREATE POLICY "Admins can manage monsters"
ON public.monsters FOR ALL
USING (is_admin(auth.uid()));
