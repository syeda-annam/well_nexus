export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      body_measurements: {
        Row: {
          arm_cm: number | null
          body_fat_percentage: number | null
          chest_cm: number | null
          created_at: string
          id: string
          measurement_date: string
          muscle_mass_kg: number | null
          notes: string | null
          thigh_cm: number | null
          user_id: string
          waist_cm: number | null
          weight_kg: number | null
        }
        Insert: {
          arm_cm?: number | null
          body_fat_percentage?: number | null
          chest_cm?: number | null
          created_at?: string
          id?: string
          measurement_date?: string
          muscle_mass_kg?: number | null
          notes?: string | null
          thigh_cm?: number | null
          user_id: string
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Update: {
          arm_cm?: number | null
          body_fat_percentage?: number | null
          chest_cm?: number | null
          created_at?: string
          id?: string
          measurement_date?: string
          muscle_mass_kg?: number | null
          notes?: string | null
          thigh_cm?: number | null
          user_id?: string
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      exercises: {
        Row: {
          category: string
          created_at: string
          difficulty: string | null
          equipment_needed: string[] | null
          id: string
          instructions: string | null
          muscle_groups: string[] | null
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          difficulty?: string | null
          equipment_needed?: string[] | null
          id?: string
          instructions?: string | null
          muscle_groups?: string[] | null
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          difficulty?: string | null
          equipment_needed?: string[] | null
          id?: string
          instructions?: string | null
          muscle_groups?: string[] | null
          name?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string
          current_value: number | null
          description: string | null
          goal_type: string
          id: string
          is_achieved: boolean | null
          target_date: string | null
          target_value: number | null
          title: string
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_value?: number | null
          description?: string | null
          goal_type: string
          id?: string
          is_achieved?: boolean | null
          target_date?: string | null
          target_value?: number | null
          title: string
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_value?: number | null
          description?: string | null
          goal_type?: string
          id?: string
          is_achieved?: boolean | null
          target_date?: string | null
          target_value?: number | null
          title?: string
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      nutrition_entries: {
        Row: {
          brand: string | null
          calories: number | null
          carbs_grams: number | null
          created_at: string
          entry_date: string
          fat_grams: number | null
          fiber_grams: number | null
          food_name: string
          id: string
          meal_type: string | null
          protein_grams: number | null
          serving_size: string | null
          sodium_mg: number | null
          sugar_grams: number | null
          user_id: string
        }
        Insert: {
          brand?: string | null
          calories?: number | null
          carbs_grams?: number | null
          created_at?: string
          entry_date?: string
          fat_grams?: number | null
          fiber_grams?: number | null
          food_name: string
          id?: string
          meal_type?: string | null
          protein_grams?: number | null
          serving_size?: string | null
          sodium_mg?: number | null
          sugar_grams?: number | null
          user_id: string
        }
        Update: {
          brand?: string | null
          calories?: number | null
          carbs_grams?: number | null
          created_at?: string
          entry_date?: string
          fat_grams?: number | null
          fiber_grams?: number | null
          food_name?: string
          id?: string
          meal_type?: string | null
          protein_grams?: number | null
          serving_size?: string | null
          sodium_mg?: number | null
          sugar_grams?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          allergies: string[] | null
          body_fat_percentage: number | null
          carb_goal_grams: number | null
          created_at: string
          daily_calorie_goal: number | null
          date_of_birth: string | null
          dietary_restrictions: string[] | null
          email: string | null
          fat_goal_grams: number | null
          first_name: string | null
          fitness_experience: string | null
          gender: string | null
          height_cm: number | null
          id: string
          injuries_limitations: string[] | null
          last_name: string | null
          medical_conditions: string[] | null
          medications: string[] | null
          notification_preferences: Json | null
          onboarding_completed: boolean | null
          preferred_workout_duration: number | null
          preferred_workout_types: string[] | null
          primary_fitness_goal: string | null
          privacy_settings: Json | null
          protein_goal_grams: number | null
          target_weight_kg: number | null
          units_system: string | null
          updated_at: string
          user_id: string
          weekly_workout_frequency: number | null
          weight_kg: number | null
        }
        Insert: {
          activity_level?: string | null
          allergies?: string[] | null
          body_fat_percentage?: number | null
          carb_goal_grams?: number | null
          created_at?: string
          daily_calorie_goal?: number | null
          date_of_birth?: string | null
          dietary_restrictions?: string[] | null
          email?: string | null
          fat_goal_grams?: number | null
          first_name?: string | null
          fitness_experience?: string | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          injuries_limitations?: string[] | null
          last_name?: string | null
          medical_conditions?: string[] | null
          medications?: string[] | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          preferred_workout_duration?: number | null
          preferred_workout_types?: string[] | null
          primary_fitness_goal?: string | null
          privacy_settings?: Json | null
          protein_goal_grams?: number | null
          target_weight_kg?: number | null
          units_system?: string | null
          updated_at?: string
          user_id: string
          weekly_workout_frequency?: number | null
          weight_kg?: number | null
        }
        Update: {
          activity_level?: string | null
          allergies?: string[] | null
          body_fat_percentage?: number | null
          carb_goal_grams?: number | null
          created_at?: string
          daily_calorie_goal?: number | null
          date_of_birth?: string | null
          dietary_restrictions?: string[] | null
          email?: string | null
          fat_goal_grams?: number | null
          first_name?: string | null
          fitness_experience?: string | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          injuries_limitations?: string[] | null
          last_name?: string | null
          medical_conditions?: string[] | null
          medications?: string[] | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          preferred_workout_duration?: number | null
          preferred_workout_types?: string[] | null
          primary_fitness_goal?: string | null
          privacy_settings?: Json | null
          protein_goal_grams?: number | null
          target_weight_kg?: number | null
          units_system?: string | null
          updated_at?: string
          user_id?: string
          weekly_workout_frequency?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      workout_exercises: {
        Row: {
          duration_seconds: number | null
          exercise_id: string | null
          id: string
          notes: string | null
          reps: number | null
          rest_seconds: number | null
          sets: number | null
          weight_kg: number | null
          workout_id: string | null
        }
        Insert: {
          duration_seconds?: number | null
          exercise_id?: string | null
          id?: string
          notes?: string | null
          reps?: number | null
          rest_seconds?: number | null
          sets?: number | null
          weight_kg?: number | null
          workout_id?: string | null
        }
        Update: {
          duration_seconds?: number | null
          exercise_id?: string | null
          id?: string
          notes?: string | null
          reps?: number | null
          rest_seconds?: number | null
          sets?: number | null
          weight_kg?: number | null
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          calories_burned: number | null
          created_at: string
          duration_minutes: number | null
          id: string
          intensity: string | null
          name: string
          notes: string | null
          type: string
          user_id: string
          workout_date: string
        }
        Insert: {
          calories_burned?: number | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          intensity?: string | null
          name: string
          notes?: string | null
          type: string
          user_id: string
          workout_date?: string
        }
        Update: {
          calories_burned?: number | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          intensity?: string | null
          name?: string
          notes?: string | null
          type?: string
          user_id?: string
          workout_date?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
