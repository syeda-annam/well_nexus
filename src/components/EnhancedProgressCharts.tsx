
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { Calendar, TrendingUp, Target, Activity, Utensils, Clock } from 'lucide-react';

const EnhancedProgressCharts = ({ userData, profile }) => {
  // Process weight data for trend chart
  const weightData = userData.bodyMeasurements
    .filter(m => m.weight_kg && !isNaN(Number(m.weight_kg)))
    .map(m => ({
      date: new Date(m.measurement_date).toLocaleDateString(),
      weight: Number(m.weight_kg)
    }))
    .reverse();

  // Process workout frequency data
  const workoutFrequency = userData.recentWorkouts.reduce((acc, workout) => {
    const week = new Date(workout.workout_date).toLocaleDateString();
    acc[week] = (acc[week] || 0) + 1;
    return acc;
  }, {});

  const workoutData = Object.entries(workoutFrequency).map(([week, count]) => ({
    week,
    workouts: count
  })).slice(-8);

  // Process calorie intake data
  const calorieData = userData.recentNutrition.reduce((acc, entry) => {
    const date = entry.entry_date;
    if (!acc[date]) acc[date] = 0;
    acc[date] += Number(entry.calories || 0);
    return acc;
  }, {});

  const dailyCalories = Object.entries(calorieData).map(([date, calories]) => ({
    date: new Date(date).toLocaleDateString(),
    calories: Math.round(Number(calories))
  })).slice(-7);

  // Workout type distribution
  const workoutTypes = userData.recentWorkouts.reduce((acc, workout) => {
    acc[workout.type] = (acc[workout.type] || 0) + 1;
    return acc;
  }, {});

  const workoutTypeData = Object.entries(workoutTypes).map(([type, count]) => ({
    name: type,
    value: count
  }));

  // Meal type distribution
  const mealTypes = userData.recentNutrition.reduce((acc, entry) => {
    const mealType = entry.meal_type || 'Other';
    acc[mealType] = (acc[mealType] || 0) + 1;
    return acc;
  }, {});

  const mealTypeData = Object.entries(mealTypes).map(([type, count]) => ({
    name: type,
    value: count
  }));

  // Weekly workout goal progress (radial chart) - Use user's goal from profile
  const weeklyGoal = profile?.weekly_workout_frequency || 3; // Default to 3 if not set
  const thisWeekWorkouts = userData.recentWorkouts.filter(w => {
    const workoutDate = new Date(w.workout_date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  }).length;

  const workoutGoalData = [{
    name: 'Workouts',
    value: Math.min((thisWeekWorkouts / weeklyGoal) * 100, 100), // Cap at 100%
    fill: '#3b82f6'
  }];

  // Daily calorie goal progress - Use user's goal from profile
  const dailyCalorieGoal = profile?.daily_calorie_goal || 2000; // Default to 2000 if not set
  const todayCalories = userData.recentNutrition
    .filter(entry => entry.entry_date === new Date().toISOString().split('T')[0])
    .reduce((sum, entry) => sum + Number(entry.calories || 0), 0);

  const calorieGoalData = [{
    name: 'Calories',
    value: Math.min((todayCalories / dailyCalorieGoal) * 100, 100), // Cap at 100%
    fill: '#10b981'
  }];

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  // Custom label function for pie charts to show accurate percentages
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Weight Progress */}
      {weightData.length > 0 && (
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Weight Progress
            </CardTitle>
            <CardDescription>Your weight trend over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                weight: {
                  label: "Weight (kg)",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="weight" stroke="var(--color-weight)" strokeWidth={3} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Weekly Workout Goal - Radial Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Weekly Goal
          </CardTitle>
          <CardDescription>Workouts this week: {thisWeekWorkouts}/{weeklyGoal}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              workouts: {
                label: "Progress",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[200px]"
          >
            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={workoutGoalData}>
              <RadialBar dataKey="value" cornerRadius={10} fill="var(--color-workouts)" />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold">
                {Math.round(workoutGoalData[0].value)}%
              </text>
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Daily Calorie Goal - Radial Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Utensils className="h-5 w-5 mr-2" />
            Daily Calories
          </CardTitle>
          <CardDescription>Today: {Math.round(todayCalories)}/{dailyCalorieGoal} cal</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              calories: {
                label: "Progress",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[200px]"
          >
            <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={calorieGoalData}>
              <RadialBar dataKey="value" cornerRadius={10} fill="var(--color-calories)" />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold">
                {Math.round(calorieGoalData[0].value)}%
              </text>
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Workout Types Distribution - Pie Chart */}
      {workoutTypeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Workout Types
            </CardTitle>
            <CardDescription>Distribution of your workout types</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                distribution: {
                  label: "Workout Distribution",
                },
              }}
              className="h-[250px]"
            >
              <PieChart>
                <Pie
                  data={workoutTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {workoutTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Meal Types Distribution - Pie Chart */}
      {mealTypeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Meal Types
            </CardTitle>
            <CardDescription>Distribution of your meal types</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                distribution: {
                  label: "Meal Distribution",
                },
              }}
              className="h-[250px]"
            >
              <PieChart>
                <Pie
                  data={mealTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {mealTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[(index + 2) % colors.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Workout Frequency Bar Chart */}
      {workoutData.length > 0 && (
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Workout Frequency
            </CardTitle>
            <CardDescription>Weekly workout sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                workouts: {
                  label: "Workouts",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={workoutData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="workouts" fill="var(--color-workouts)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Daily Calories Bar Chart */}
      {dailyCalories.length > 0 && (
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Daily Calories Trend
            </CardTitle>
            <CardDescription>Calorie intake over the last week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                calories: {
                  label: "Calories",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={dailyCalories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="calories" fill="var(--color-calories)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedProgressCharts;
