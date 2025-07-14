import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Target, Activity } from 'lucide-react';

const ProgressCharts = ({ userData }) => {
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

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weight Progress */}
      {weightData.length > 0 && (
        <Card>
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
                <Line type="monotone" dataKey="weight" stroke="var(--color-weight)" strokeWidth={2} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Workout Frequency */}
      {workoutData.length > 0 && (
        <Card>
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
                <Bar dataKey="workouts" fill="var(--color-workouts)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Daily Calories */}
      {dailyCalories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Daily Calories
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
                <Bar dataKey="calories" fill="var(--color-calories)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Workout Types Distribution */}
      {workoutTypeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
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
              className="h-[300px]"
            >
              <PieChart>
                <Pie
                  data={workoutTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
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
    </div>
  );
};

export default ProgressCharts;
