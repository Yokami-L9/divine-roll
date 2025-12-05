import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface SessionNote {
  id: string;
  session_number: number;
  title: string;
  date: string;
  duration?: string;
  summary?: string;
  highlights: string[];
  players: string[];
  created_at: string;
}

export const useSessionNotes = () => {
  const [sessions, setSessions] = useState<SessionNote[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSessions = async () => {
    if (!user) {
      setSessions([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('session_notes')
        .select('*')
        .order('session_number', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (session: Omit<SessionNote, 'id' | 'created_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('session_notes')
        .insert({
          ...session,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      setSessions(prev => [data, ...prev]);
      toast({
        title: 'Успех',
        description: 'Запись о сессии создана',
      });
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать запись',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteSession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('session_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSessions(prev => prev.filter(s => s.id !== id));
      toast({
        title: 'Удалено',
        description: 'Запись удалена',
      });
      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  return {
    sessions,
    loading,
    createSession,
    deleteSession,
    refetch: fetchSessions,
  };
};
