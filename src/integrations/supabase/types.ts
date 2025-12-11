export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      backgrounds: {
        Row: {
          bonds: string[] | null
          created_at: string
          description: string | null
          equipment: string[] | null
          feature_description: string | null
          feature_name: string | null
          flaws: string[] | null
          id: string
          ideals: string[] | null
          languages_count: number | null
          name: string
          name_en: string | null
          personality_traits: string[] | null
          skill_proficiencies: string[] | null
          tool_proficiencies: string[] | null
        }
        Insert: {
          bonds?: string[] | null
          created_at?: string
          description?: string | null
          equipment?: string[] | null
          feature_description?: string | null
          feature_name?: string | null
          flaws?: string[] | null
          id?: string
          ideals?: string[] | null
          languages_count?: number | null
          name: string
          name_en?: string | null
          personality_traits?: string[] | null
          skill_proficiencies?: string[] | null
          tool_proficiencies?: string[] | null
        }
        Update: {
          bonds?: string[] | null
          created_at?: string
          description?: string | null
          equipment?: string[] | null
          feature_description?: string | null
          feature_name?: string | null
          flaws?: string[] | null
          id?: string
          ideals?: string[] | null
          languages_count?: number | null
          name?: string
          name_en?: string | null
          personality_traits?: string[] | null
          skill_proficiencies?: string[] | null
          tool_proficiencies?: string[] | null
        }
        Relationships: []
      }
      characters: {
        Row: {
          backstory: string | null
          charisma: number
          class: string
          constitution: number
          created_at: string
          dexterity: number
          hp: number
          id: string
          intelligence: number
          level: number
          max_hp: number
          name: string
          race: string
          strength: number
          updated_at: string
          user_id: string
          wisdom: number
        }
        Insert: {
          backstory?: string | null
          charisma?: number
          class: string
          constitution?: number
          created_at?: string
          dexterity?: number
          hp?: number
          id?: string
          intelligence?: number
          level?: number
          max_hp?: number
          name: string
          race: string
          strength?: number
          updated_at?: string
          user_id: string
          wisdom?: number
        }
        Update: {
          backstory?: string | null
          charisma?: number
          class?: string
          constitution?: number
          created_at?: string
          dexterity?: number
          hp?: number
          id?: string
          intelligence?: number
          level?: number
          max_hp?: number
          name?: string
          race?: string
          strength?: number
          updated_at?: string
          user_id?: string
          wisdom?: number
        }
        Relationships: []
      }
      classes: {
        Row: {
          armor_proficiencies: string[] | null
          created_at: string
          description: string | null
          features: Json | null
          hit_die: number
          id: string
          name: string
          name_en: string | null
          primary_ability: string | null
          saving_throws: string[] | null
          skill_choices: Json | null
          spellcasting: Json | null
          weapon_proficiencies: string[] | null
        }
        Insert: {
          armor_proficiencies?: string[] | null
          created_at?: string
          description?: string | null
          features?: Json | null
          hit_die: number
          id?: string
          name: string
          name_en?: string | null
          primary_ability?: string | null
          saving_throws?: string[] | null
          skill_choices?: Json | null
          spellcasting?: Json | null
          weapon_proficiencies?: string[] | null
        }
        Update: {
          armor_proficiencies?: string[] | null
          created_at?: string
          description?: string | null
          features?: Json | null
          hit_die?: number
          id?: string
          name?: string
          name_en?: string | null
          primary_ability?: string | null
          saving_throws?: string[] | null
          skill_choices?: Json | null
          spellcasting?: Json | null
          weapon_proficiencies?: string[] | null
        }
        Relationships: []
      }
      conditions: {
        Row: {
          created_at: string
          description: string
          effects: string[] | null
          id: string
          name: string
          name_en: string | null
        }
        Insert: {
          created_at?: string
          description: string
          effects?: string[] | null
          id?: string
          name: string
          name_en?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          effects?: string[] | null
          id?: string
          name?: string
          name_en?: string | null
        }
        Relationships: []
      }
      equipment: {
        Row: {
          armor_class: string | null
          category: string
          cost: string | null
          created_at: string
          damage: string | null
          damage_type: string | null
          description: string | null
          id: string
          name: string
          name_en: string | null
          properties: string[] | null
          stealth_disadvantage: boolean | null
          strength_requirement: number | null
          subcategory: string | null
          weight: number | null
        }
        Insert: {
          armor_class?: string | null
          category: string
          cost?: string | null
          created_at?: string
          damage?: string | null
          damage_type?: string | null
          description?: string | null
          id?: string
          name: string
          name_en?: string | null
          properties?: string[] | null
          stealth_disadvantage?: boolean | null
          strength_requirement?: number | null
          subcategory?: string | null
          weight?: number | null
        }
        Update: {
          armor_class?: string | null
          category?: string
          cost?: string | null
          created_at?: string
          damage?: string | null
          damage_type?: string | null
          description?: string | null
          id?: string
          name?: string
          name_en?: string | null
          properties?: string[] | null
          stealth_disadvantage?: boolean | null
          strength_requirement?: number | null
          subcategory?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      feats: {
        Row: {
          benefits: Json | null
          created_at: string
          description: string
          id: string
          name: string
          name_en: string | null
          prerequisite: string | null
        }
        Insert: {
          benefits?: Json | null
          created_at?: string
          description: string
          id?: string
          name: string
          name_en?: string | null
          prerequisite?: string | null
        }
        Update: {
          benefits?: Json | null
          created_at?: string
          description?: string
          id?: string
          name?: string
          name_en?: string | null
          prerequisite?: string | null
        }
        Relationships: []
      }
      homebrew_items: {
        Row: {
          created_at: string
          damage: string | null
          description: string | null
          effect: string | null
          id: string
          is_public: boolean | null
          name: string
          rarity: string | null
          requirements: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          damage?: string | null
          description?: string | null
          effect?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          rarity?: string | null
          requirements?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          damage?: string | null
          description?: string | null
          effect?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          rarity?: string | null
          requirements?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      maps: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          name: string
          thumbnail_url: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          name: string
          thumbnail_url?: string | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          name?: string
          thumbnail_url?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      npcs: {
        Row: {
          created_at: string
          description: string | null
          disposition: string | null
          id: string
          location: string | null
          name: string
          role: string
          secrets: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          disposition?: string | null
          id?: string
          location?: string | null
          name: string
          role: string
          secrets?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          disposition?: string | null
          id?: string
          location?: string | null
          name?: string
          role?: string
          secrets?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      quests: {
        Row: {
          created_at: string
          description: string | null
          id: string
          parent_id: string | null
          priority: string | null
          reward: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          parent_id?: string | null
          priority?: string | null
          reward?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          parent_id?: string | null
          priority?: string | null
          reward?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quests_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      races: {
        Row: {
          ability_bonuses: Json | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          languages: string[] | null
          name: string
          name_en: string | null
          size: string | null
          speed: number | null
          subraces: Json | null
          traits: Json | null
        }
        Insert: {
          ability_bonuses?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          languages?: string[] | null
          name: string
          name_en?: string | null
          size?: string | null
          speed?: number | null
          subraces?: Json | null
          traits?: Json | null
        }
        Update: {
          ability_bonuses?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          languages?: string[] | null
          name?: string
          name_en?: string | null
          size?: string | null
          speed?: number | null
          subraces?: Json | null
          traits?: Json | null
        }
        Relationships: []
      }
      rules: {
        Row: {
          book: string | null
          category: string
          chapter: number | null
          content: string
          created_at: string
          id: string
          subsections: Json | null
          title: string
        }
        Insert: {
          book?: string | null
          category: string
          chapter?: number | null
          content: string
          created_at?: string
          id?: string
          subsections?: Json | null
          title: string
        }
        Update: {
          book?: string | null
          category?: string
          chapter?: number | null
          content?: string
          created_at?: string
          id?: string
          subsections?: Json | null
          title?: string
        }
        Relationships: []
      }
      session_notes: {
        Row: {
          created_at: string
          date: string
          duration: string | null
          highlights: string[] | null
          id: string
          players: string[] | null
          session_number: number
          summary: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          duration?: string | null
          highlights?: string[] | null
          id?: string
          players?: string[] | null
          session_number: number
          summary?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          duration?: string | null
          highlights?: string[] | null
          id?: string
          players?: string[] | null
          session_number?: number
          summary?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      spells: {
        Row: {
          casting_time: string
          classes: string[] | null
          components: string
          concentration: boolean | null
          created_at: string
          description: string
          duration: string
          higher_levels: string | null
          id: string
          level: number
          name: string
          name_en: string | null
          range: string
          ritual: boolean | null
          school: string
        }
        Insert: {
          casting_time: string
          classes?: string[] | null
          components: string
          concentration?: boolean | null
          created_at?: string
          description: string
          duration: string
          higher_levels?: string | null
          id?: string
          level?: number
          name: string
          name_en?: string | null
          range: string
          ritual?: boolean | null
          school: string
        }
        Update: {
          casting_time?: string
          classes?: string[] | null
          components?: string
          concentration?: boolean | null
          created_at?: string
          description?: string
          duration?: string
          higher_levels?: string | null
          id?: string
          level?: number
          name?: string
          name_en?: string | null
          range?: string
          ritual?: boolean | null
          school?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
