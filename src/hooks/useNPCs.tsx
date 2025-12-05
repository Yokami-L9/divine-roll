import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface NPC {
  id: string;
  name: string;
  role: string;
  location?: string;
  disposition: string;
  description?: string;
  secrets?: string;
  created_at: string;
}

export const useNPCs = () => {
  const [npcs, setNPCs] = useState<NPC[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNPCs = async () => {
    if (!user) {
      setNPCs([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('npcs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNPCs(data || []);
    } catch (error) {
      console.error('Error fetching NPCs:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить NPC',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createNPC = async (npc: Omit<NPC, 'id' | 'created_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('npcs')
        .insert({
          ...npc,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      setNPCs(prev => [data, ...prev]);
      toast({
        title: 'Успех',
        description: 'NPC создан',
      });
      return data;
    } catch (error) {
      console.error('Error creating NPC:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать NPC',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteNPC = async (id: string) => {
    try {
      const { error } = await supabase
        .from('npcs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setNPCs(prev => prev.filter(n => n.id !== id));
      toast({
        title: 'Удалено',
        description: 'NPC удалён',
      });
      return true;
    } catch (error) {
      console.error('Error deleting NPC:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchNPCs();
  }, [user]);

  return {
    npcs,
    loading,
    createNPC,
    deleteNPC,
    refetch: fetchNPCs,
  };
};
