import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Quest {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  reward?: string;
  parent_id?: string;
  created_at: string;
}

export const useQuests = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchQuests = async () => {
    if (!user) {
      setQuests([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuests(data || []);
    } catch (error) {
      console.error('Error fetching quests:', error);
    } finally {
      setLoading(false);
    }
  };

  const createQuest = async (quest: Omit<Quest, 'id' | 'created_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('quests')
        .insert({
          ...quest,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      setQuests(prev => [data, ...prev]);
      toast({ title: 'Квест создан' });
      return data;
    } catch (error) {
      console.error('Error creating quest:', error);
      toast({ title: 'Ошибка', description: 'Не удалось создать квест', variant: 'destructive' });
      return null;
    }
  };

  const updateQuest = async (id: string, updates: Partial<Quest>) => {
    try {
      const { data, error } = await supabase
        .from('quests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setQuests(prev => prev.map(q => q.id === id ? data : q));
      return data;
    } catch (error) {
      console.error('Error updating quest:', error);
      return null;
    }
  };

  const deleteQuest = async (id: string) => {
    try {
      const { error } = await supabase.from('quests').delete().eq('id', id);
      if (error) throw error;
      setQuests(prev => prev.filter(q => q.id !== id));
      toast({ title: 'Квест удалён' });
      return true;
    } catch (error) {
      console.error('Error deleting quest:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchQuests();
  }, [user]);

  return { quests, loading, createQuest, updateQuest, deleteQuest, refetch: fetchQuests };
};
