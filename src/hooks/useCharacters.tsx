import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  hp: number;
  max_hp: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  backstory?: string;
  avatar_url?: string | null;
  created_at: string;
}

export const useCharacters = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCharacters = async () => {
    if (!user) {
      setCharacters([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCharacters(data || []);
    } catch (error) {
      console.error('Error fetching characters:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить персонажей',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createCharacter = async (character: Omit<Character, 'id' | 'created_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('characters')
        .insert({
          ...character,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      setCharacters(prev => [data, ...prev]);
      toast({
        title: 'Успех',
        description: 'Персонаж создан',
      });
      return data;
    } catch (error) {
      console.error('Error creating character:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать персонажа',
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateCharacter = async (id: string, updates: Partial<Character>) => {
    try {
      const { data, error } = await supabase
        .from('characters')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setCharacters(prev => prev.map(c => c.id === id ? data : c));
      return data;
    } catch (error) {
      console.error('Error updating character:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить персонажа',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteCharacter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCharacters(prev => prev.filter(c => c.id !== id));
      toast({
        title: 'Удалено',
        description: 'Персонаж удалён',
      });
      return true;
    } catch (error) {
      console.error('Error deleting character:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить персонажа',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchCharacters();
    } else {
      setCharacters([]);
      setLoading(false);
    }
  }, [user]);

  // Refetch when component mounts to get fresh data
  useEffect(() => {
    if (user) {
      fetchCharacters();
    }
  }, []);

  return {
    characters,
    loading,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    refetch: fetchCharacters,
  };
};
