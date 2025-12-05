import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface HomebrewItem {
  id: string;
  name: string;
  type: string;
  rarity?: string;
  description?: string;
  effect?: string;
  damage?: string;
  requirements?: string;
  is_public: boolean;
  created_at: string;
}

export const useHomebrew = () => {
  const [items, setItems] = useState<HomebrewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchItems = async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('homebrew_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching homebrew:', error);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (item: Omit<HomebrewItem, 'id' | 'created_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('homebrew_items')
        .insert({
          ...item,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      setItems(prev => [data, ...prev]);
      toast({ title: 'Контент создан' });
      return data;
    } catch (error) {
      console.error('Error creating homebrew:', error);
      toast({ title: 'Ошибка', variant: 'destructive' });
      return null;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase.from('homebrew_items').delete().eq('id', id);
      if (error) throw error;
      setItems(prev => prev.filter(i => i.id !== id));
      toast({ title: 'Удалено' });
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  return { items, loading, createItem, deleteItem, refetch: fetchItems };
};
