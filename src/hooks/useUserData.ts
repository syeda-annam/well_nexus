
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserData = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    recentWorkouts: [],
    recentNutrition: [],
    bodyMeasurements: [],
    goals: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const [workoutsRes, nutritionRes, measurementsRes, goalsRes] = await Promise.all([
          supabase
            .from('workouts')
            .select('*')
            .eq('user_id', user.id)
            .order('workout_date', { ascending: false })
            .limit(10),
          
          supabase
            .from('nutrition_entries')
            .select('*')
            .eq('user_id', user.id)
            .order('entry_date', { ascending: false })
            .limit(20),
          
          supabase
            .from('body_measurements')
            .select('*')
            .eq('user_id', user.id)
            .order('measurement_date', { ascending: false })
            .limit(10),
          
          supabase
            .from('goals')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
        ]);

        setData({
          recentWorkouts: workoutsRes.data || [],
          recentNutrition: nutritionRes.data || [],
          bodyMeasurements: measurementsRes.data || [],
          goals: goalsRes.data || [],
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setData(prev => ({ ...prev, loading: false, error: error.message }));
      }
    };

    fetchUserData();
  }, [user]);

  return data;
};
