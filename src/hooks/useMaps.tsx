import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Json } from '@/integrations/supabase/types';

export interface MapData {
  id: string;
  name: string;
  type: string;
  data: Json;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

export const useMaps = () => {
  const [maps, setMaps] = useState<MapData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMaps = async () => {
    if (!user) {
      setMaps([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('maps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaps(data || []);
    } catch (error) {
      console.error('Error fetching maps:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить карты',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createMap = async (map: Omit<MapData, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('maps')
        .insert({
          ...map,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      setMaps(prev => [data, ...prev]);
      toast({
        title: 'Успех',
        description: 'Карта создана',
      });
      return data;
    } catch (error) {
      console.error('Error creating map:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать карту',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateMap = async (id: string, updates: Partial<MapData>) => {
    try {
      const { data, error } = await supabase
        .from('maps')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setMaps(prev => prev.map(m => m.id === id ? data : m));
      toast({
        title: 'Успех',
        description: 'Карта обновлена',
      });
      return data;
    } catch (error) {
      console.error('Error updating map:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить карту',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteMap = async (id: string) => {
    try {
      const { error } = await supabase
        .from('maps')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMaps(prev => prev.filter(m => m.id !== id));
      toast({
        title: 'Удалено',
        description: 'Карта удалена',
      });
      return true;
    } catch (error) {
      console.error('Error deleting map:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchMaps();
  }, [user]);

  return {
    maps,
    loading,
    createMap,
    updateMap,
    deleteMap,
    refetch: fetchMaps,
  };
};
