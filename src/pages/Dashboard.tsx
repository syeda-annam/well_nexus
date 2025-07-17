import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useUserDataWithRefresh } from '@/hooks/useUserDataWithRefresh';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Target, Calendar, TrendingUp, User, Settings, BarChart3, Brain, History, Trophy } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import EnhancedProgressCharts from '@/components/EnhancedProgressCharts';
import AIRecommendations from '@/components/AIRecommendations';
import InteractiveHistoryViewer from '@/components/InteractiveHistoryViewer';
import AchievementSystem from '@/components/AchievementSystem';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { profile, loading } = useProfile();
  const userData = useUserDataWithRefresh();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!loading && profile && !profile.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading || userData.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Use user's weekly workout frequency from profile, with fallback
  const weeklyWorkoutGoal = profile?.weekly_workout_frequency || 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Well Nexus</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {profile?.first_name || user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h2>
          <p className="text-gray-600">
            
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile?.weight_kg ? `${profile.weight_kg} kg` : 'Not set'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Target Weight</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile?.target_weight_kg ? `${profile.target_weight_kg} kg` : 'Not set'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week's Workouts</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userData.recentWorkouts.filter(w => {
                  const workoutDate = new Date(w.workout_date);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return workoutDate >= weekAgo;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Goal: {weeklyWorkoutGoal}/week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Calories Goal</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile?.daily_calorie_goal || 'Not set'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="ai-recommendations" className="flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              Tips
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center">
              <Trophy className="h-4 w-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link to="/fitness">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-blue-600" />
                      Log Workout
                    </CardTitle>
                    <CardDescription>
                      Record your fitness activities and track progress
                    </CardDescription>
                  </CardHeader>
                </Link>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link to="/nutrition">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2 text-green-600" />
                      Smart Nutrition Entry
                    </CardTitle>
                    <CardDescription>
                      Food logging with automatic nutrition estimation
                    </CardDescription>
                  </CardHeader>
                </Link>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link to="/onboarding">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-purple-600" />
                      Update Goals
                    </CardTitle>
                    <CardDescription>
                      Adjust your fitness goals and preferences
                    </CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            </div>

            {/* Recent Activity Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Workouts</CardTitle>
                </CardHeader>
                <CardContent>
                  {userData.recentWorkouts.slice(0, 3).map((workout) => (
                    <div key={workout.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{workout.name}</p>
                        <p className="text-sm text-gray-500">{new Date(workout.workout_date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {workout.duration_minutes && `${workout.duration_minutes}min`}
                      </div>
                    </div>
                  ))}
                  {userData.recentWorkouts.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No workouts logged yet</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Meals</CardTitle>
                </CardHeader>
                <CardContent>
                  {userData.recentNutrition.slice(0, 3).map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{entry.food_name}</p>
                        <p className="text-sm text-gray-500">{new Date(entry.entry_date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {entry.calories && `${Math.round(entry.calories)} cal`}
                      </div>
                    </div>
                  ))}
                  {userData.recentNutrition.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No meals logged yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <EnhancedProgressCharts userData={userData} profile={profile} />
          </TabsContent>

          <TabsContent value="ai-recommendations">
            <AIRecommendations userData={userData} profile={profile} />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementSystem userData={userData} profile={profile} />
          </TabsContent>

          <TabsContent value="history">
            <InteractiveHistoryViewer userData={userData} onDataUpdate={userData.refetch} />
          </TabsContent>

          <TabsContent value="profile">
            {/* Profile Summary */}
            {profile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Primary Goal</p>
                      <p className="text-lg capitalize">
                        {profile.primary_fitness_goal?.replace('_', ' ') || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Activity Level</p>
                      <p className="text-lg capitalize">
                        {profile.activity_level?.replace('_', ' ') || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Experience</p>
                      <p className="text-lg capitalize">
                        {profile.fitness_experience || 'Not set'}
                      </p>
                    </div>
                    {profile.preferred_workout_types && profile.preferred_workout_types.length > 0 && (
                      <div className="md:col-span-2 lg:col-span-3">
                        <p className="text-sm font-medium text-gray-500 mb-2">Preferred Workouts</p>
                        <div className="flex flex-wrap gap-2">
                          {profile.preferred_workout_types.map((type, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
