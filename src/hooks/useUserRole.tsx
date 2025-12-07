import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type AppRole = 'admin' | 'moderator' | 'user';

export const useUserRole = () => {
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRoles = async () => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) throw error;
      setRoles((data || []).map(r => r.role as AppRole));
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = roles.includes('admin');
  const isModerator = roles.includes('moderator') || isAdmin;

  useEffect(() => {
    fetchRoles();
  }, [user]);

  return {
    roles,
    loading,
    isAdmin,
    isModerator,
    refetch: fetchRoles,
  };
};
