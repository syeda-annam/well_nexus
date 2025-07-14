import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Award, Target, Flame, Calendar } from 'lucide-react';

const AchievementSystem = ({ userData, profile }) => {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    calculateAchievements();
  }, [userData, profile]);

  const calculateAchievements = () => {
    const newAchievements = [];

    // Workout streak achievements
    const workoutStreak = calculateWorkoutStreak(userData.recentWorkouts);
    newAchievements.push({
      id: 'workout_streak',
      title: 'Workout Warrior',
      description: 'Maintain a workout streak',
      icon: <Flame className="h-6 w-6" />,
      progress: Math.min(workoutStreak, 7),
      target: 7,
      unlocked: workoutStreak >= 7,
      category: 'consistency'
    });

    // Total workouts
    const totalWorkouts = userData.recentWorkouts?.length || 0;
    newAchievements.push({
      id: 'total_workouts',
      title: 'Fitness Enthusiast',
      description: 'Complete 25 workouts',
      icon: <Trophy className="h-6 w-6" />,
      progress: Math.min(totalWorkouts, 25),
      target: 25,
      unlocked: totalWorkouts >= 25,
      category: 'milestone'
    });

    // Nutrition logging
    const nutritionEntries = userData.recentNutrition?.length || 0;
    newAchievements.push({
      id: 'nutrition_tracker',
      title: 'Nutrition Master',
      description: 'Log 50 meals',
      icon: <Target className="h-6 w-6" />,
      progress: Math.min(nutritionEntries, 50),
      target: 50,
      unlocked: nutritionEntries >= 50,
      category: 'tracking'
    });

    // Weight progress (if applicable)
    if (userData.bodyMeasurements?.length >= 2) {
      const weightChange = calculateWeightProgress(userData.bodyMeasurements);
      if (Math.abs(weightChange) >= 2) {
        newAchievements.push({
          id: 'weight_progress',
          title: 'Transformation',
          description: 'Achieve significant weight change',
          icon: <Star className="h-6 w-6" />,
          progress: Math.abs(weightChange),
          target: 2,
          unlocked: true,
          category: 'progress'
        });
      }
    }

    // Profile completion
    const profileCompletion = calculateProfileCompletion(profile);
    newAchievements.push({
      id: 'profile_complete',
      title: 'Profile Pro',
      description: 'Complete your fitness profile',
      icon: <Award className="h-6 w-6" />,
      progress: profileCompletion,
      target: 100,
      unlocked: profileCompletion >= 100,
      category: 'setup'
    });

    setAchievements(newAchievements);
  };

  const calculateWorkoutStreak = (workouts) => {
    if (!workouts || workouts.length === 0) return 0;
    
    const sortedWorkouts = workouts.sort((a, b) => new Date(b.workout_date).getTime() - new Date(a.workout_date).getTime());
    let streak = 0;
    let currentDate = new Date();
    
    for (const workout of sortedWorkouts) {
      const workoutDate = new Date(workout.workout_date);
      const daysDiff = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= streak + 1) {
        streak++;
        currentDate = workoutDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateWeightProgress = (measurements) => {
    if (!measurements || measurements.length < 2) return 0;
    
    const sorted = measurements
      .filter(m => m.weight_kg && !isNaN(Number(m.weight_kg)))
      .sort((a, b) => new Date(a.measurement_date).getTime() - new Date(b.measurement_date).getTime());
    
    if (sorted.length < 2) return 0;
    
    const firstWeight = Number(sorted[0].weight_kg);
    const lastWeight = Number(sorted[sorted.length - 1].weight_kg);
    
    return firstWeight - lastWeight; // Positive = weight loss, Negative = weight gain
  };

  const calculateProfileCompletion = (profile) => {
    if (!profile) return 0;
    
    const fields = [
      'first_name', 'height_cm', 'weight_kg', 'primary_fitness_goal',
      'activity_level', 'fitness_experience', 'daily_calorie_goal'
    ];
    
    const completedFields = fields.filter(field => profile[field] && profile[field] !== '');
    return Math.round((completedFields.length / fields.length) * 100);
  };

  const getCategoryColor = (category) => {
    const colors = {
      consistency: 'bg-orange-100 text-orange-800',
      milestone: 'bg-blue-100 text-blue-800',
      tracking: 'bg-green-100 text-green-800',
      progress: 'bg-purple-100 text-purple-800',
      setup: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.setup;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-yellow-600" />
          Achievements & Progress
        </CardTitle>
        <CardDescription>
          Track your fitness milestones and unlock achievements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border ${
                achievement.unlocked 
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${
                    achievement.unlocked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
                <Badge className={getCategoryColor(achievement.category)}>
                  {achievement.category}
                </Badge>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{achievement.progress}/{achievement.target}</span>
                </div>
                <Progress 
                  value={(achievement.progress / achievement.target) * 100} 
                  className="h-2"
                />
              </div>
              
              {achievement.unlocked && (
                <div className="mt-2 flex items-center text-sm text-yellow-600">
                  <Star className="h-4 w-4 mr-1" />
                  Unlocked!
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              {achievements.filter(a => a.unlocked).length} of {achievements.length} achievements unlocked
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementSystem;
