
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Target, Utensils, Activity, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AIRecommendations = ({ userData, profile }) => {
  const [recommendations, setRecommendations] = useState({
    workouts: [],
    nutrition: [],
    habits: [],
    loading: false
  });

  const generateRecommendations = async () => {
    setRecommendations(prev => ({ ...prev, loading: true }));
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-recommendations', {
        body: {
          userData,
          profile,
          requestType: 'comprehensive'
        }
      });

      if (error) throw error;

      setRecommendations({
        workouts: data.workouts || [],
        nutrition: data.nutrition || [],
        habits: data.habits || [],
        loading: false
      });
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Failed to generate recommendations');
      setRecommendations(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (userData && profile) {
      generateRecommendations();
    }
  }, [userData, profile]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold flex items-center">
          <Brain className="h-6 w-6 mr-2 text-purple-600" />
          AI Recommendations
        </h3>
        <Button onClick={generateRecommendations} disabled={recommendations.loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${recommendations.loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Workout Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Workout Suggestions
            </CardTitle>
            <CardDescription>Personalized workout recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.workouts.length > 0 ? (
              recommendations.workouts.map((workout, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">{workout.name}</h4>
                  <p className="text-sm text-blue-700 mt-1">{workout.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {workout.duration} min
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {workout.difficulty}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Loading workout recommendations...</p>
            )}
          </CardContent>
        </Card>

        {/* Nutrition Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Utensils className="h-5 w-5 mr-2 text-green-600" />
              Nutrition Tips
            </CardTitle>
            <CardDescription>Meal and nutrition suggestions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.nutrition.length > 0 ? (
              recommendations.nutrition.map((tip, index) => (
                <div key={index} className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900">{tip.title}</h4>
                  <p className="text-sm text-green-700 mt-1">{tip.suggestion}</p>
                  {tip.calories && (
                    <Badge variant="secondary" className="text-xs mt-2">
                      ~{tip.calories} cal
                    </Badge>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Loading nutrition recommendations...</p>
            )}
          </CardContent>
        </Card>

        {/* Habit Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-purple-600" />
              Habit Building
            </CardTitle>
            <CardDescription>Behavioral insights and tips</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.habits.length > 0 ? (
              recommendations.habits.map((habit, index) => (
                <div key={index} className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900">{habit.title}</h4>
                  <p className="text-sm text-purple-700 mt-1">{habit.advice}</p>
                  {habit.frequency && (
                    <Badge variant="secondary" className="text-xs mt-2">
                      {habit.frequency}
                    </Badge>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Loading habit recommendations...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIRecommendations;
