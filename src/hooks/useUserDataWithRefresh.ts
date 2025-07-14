
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserDataWithRefresh = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    recentWorkouts: [],
    recentNutrition: [],
    bodyMeasurements: [],
    goals: [],
    loading: true,
    error: null
  });

  const fetchUserData = useCallback(async () => {
    if (!user) return;

    try {
      setData(prev => ({ ...prev, loading: true }));
      
      const [workoutsRes, nutritionRes, measurementsRes, goalsRes] = await Promise.all([
        supabase
          .from('workouts')
          .select('*')
          .eq('user_id', user.id)
          .order('workout_date', { ascending: false })
          .limit(50),
        
        supabase
          .from('nutrition_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('entry_date', { ascending: false })
          .limit(100),
        
        supabase
          .from('body_measurements')
          .select('*')
          .eq('user_id', user.id)
          .order('measurement_date', { ascending: false })
          .limit(50),
        
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
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return { ...data, refetch: fetchUserData };
};
