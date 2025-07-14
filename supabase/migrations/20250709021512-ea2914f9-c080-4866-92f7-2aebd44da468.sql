
-- Create profiles table with comprehensive user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  
  -- Basic Info
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  
  -- Physical Measurements
  height_cm INTEGER,
  weight_kg DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  
  -- Activity & Fitness Level
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')),
  fitness_experience TEXT CHECK (fitness_experience IN ('beginner', 'intermediate', 'advanced')),
  
  -- Goals & Preferences
  primary_fitness_goal TEXT CHECK (primary_fitness_goal IN ('weight_loss', 'muscle_gain', 'maintenance', 'strength', 'endurance', 'flexibility', 'general_health')),
  target_weight_kg DECIMAL(5,2),
  weekly_workout_frequency INTEGER CHECK (weekly_workout_frequency >= 0 AND weekly_workout_frequency <= 7),
  preferred_workout_duration INTEGER, -- minutes
  preferred_workout_types TEXT[], -- array of workout types
  
  -- Dietary Information
  dietary_restrictions TEXT[], -- array of restrictions
  allergies TEXT[],
  daily_calorie_goal INTEGER,
  protein_goal_grams INTEGER,
  carb_goal_grams INTEGER,
  fat_goal_grams INTEGER,
  
  -- Health & Medical
  medical_conditions TEXT[],
  medications TEXT[],
  injuries_limitations TEXT[],
  
  -- Preferences & Settings
  units_system TEXT DEFAULT 'metric' CHECK (units_system IN ('metric', 'imperial')),
  notification_preferences JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{}',
  
  -- Tracking
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  onboarding_completed BOOLEAN DEFAULT FALSE
);

-- Create workouts table
CREATE TABLE public.workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  duration_minutes INTEGER,
  calories_burned INTEGER,
  intensity TEXT CHECK (intensity IN ('low', 'moderate', 'high')),
  notes TEXT,
  workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exercises table (exercise library)
CREATE TABLE public.exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  muscle_groups TEXT[],
  equipment_needed TEXT[],
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workout_exercises junction table
CREATE TABLE public.workout_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID REFERENCES public.workouts ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises ON DELETE CASCADE,
  sets INTEGER,
  reps INTEGER,
  weight_kg DECIMAL(5,2),
  duration_seconds INTEGER,
  rest_seconds INTEGER,
  notes TEXT
);

-- Create nutrition_entries table
CREATE TABLE public.nutrition_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  food_name TEXT NOT NULL,
  brand TEXT,
  serving_size TEXT,
  calories DECIMAL(7,2),
  protein_grams DECIMAL(6,2),
  carbs_grams DECIMAL(6,2),
  fat_grams DECIMAL(6,2),
  fiber_grams DECIMAL(6,2),
  sugar_grams DECIMAL(6,2),
  sodium_mg DECIMAL(8,2),
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create goals table
CREATE TABLE public.goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  goal_type TEXT NOT NULL CHECK (goal_type IN ('weight', 'body_fat', 'muscle_gain', 'strength', 'endurance', 'habit')),
  title TEXT NOT NULL,
  description TEXT,
  target_value DECIMAL(10,2),
  current_value DECIMAL(10,2) DEFAULT 0,
  unit TEXT,
  target_date DATE,
  is_achieved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create body_measurements table for tracking progress
CREATE TABLE public.body_measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  measurement_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  muscle_mass_kg DECIMAL(5,2),
  waist_cm DECIMAL(5,2),
  chest_cm DECIMAL(5,2),
  arm_cm DECIMAL(5,2),
  thigh_cm DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for workouts
CREATE POLICY "Users can view their own workouts" ON public.workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own workouts" ON public.workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own workouts" ON public.workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own workouts" ON public.workouts FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for exercises (public read, admin write)
CREATE POLICY "Anyone can view exercises" ON public.exercises FOR SELECT TO authenticated USING (true);

-- Create RLS policies for workout_exercises
CREATE POLICY "Users can view their own workout exercises" ON public.workout_exercises FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.workouts WHERE workouts.id = workout_exercises.workout_id AND workouts.user_id = auth.uid())
);
CREATE POLICY "Users can manage their own workout exercises" ON public.workout_exercises FOR ALL USING (
  EXISTS (SELECT 1 FROM public.workouts WHERE workouts.id = workout_exercises.workout_id AND workouts.user_id = auth.uid())
);

-- Create RLS policies for nutrition_entries
CREATE POLICY "Users can view their own nutrition entries" ON public.nutrition_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own nutrition entries" ON public.nutrition_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own nutrition entries" ON public.nutrition_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own nutrition entries" ON public.nutrition_entries FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for goals
CREATE POLICY "Users can view their own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for body_measurements
CREATE POLICY "Users can view their own measurements" ON public.body_measurements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own measurements" ON public.body_measurements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own measurements" ON public.body_measurements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own measurements" ON public.body_measurements FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function when a user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample exercises
INSERT INTO public.exercises (name, category, muscle_groups, equipment_needed, difficulty, instructions) VALUES
('Push-ups', 'Bodyweight', ARRAY['chest', 'shoulders', 'triceps'], ARRAY['none'], 'beginner', 'Start in plank position, lower body until chest nearly touches floor, push back up'),
('Squats', 'Bodyweight', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['none'], 'beginner', 'Stand with feet shoulder-width apart, lower body as if sitting back into chair, return to standing'),
('Plank', 'Core', ARRAY['core', 'shoulders'], ARRAY['none'], 'beginner', 'Hold body in straight line from head to heels, engaging core muscles'),
('Deadlift', 'Strength', ARRAY['hamstrings', 'glutes', 'back'], ARRAY['barbell'], 'intermediate', 'Lift barbell from floor by extending hips and knees simultaneously'),
('Bench Press', 'Strength', ARRAY['chest', 'shoulders', 'triceps'], ARRAY['barbell', 'bench'], 'intermediate', 'Lie on bench, lower barbell to chest, press back to starting position'),
('Pull-ups', 'Bodyweight', ARRAY['back', 'biceps'], ARRAY['pull-up bar'], 'intermediate', 'Hang from bar, pull body up until chin clears bar, lower with control');
