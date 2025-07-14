
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Activity, Utensils, TrendingUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const HistoryViewer = ({ userData }) => {
  const [selectedTab, setSelectedTab] = useState('workouts');

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold flex items-center">
        <Calendar className="h-6 w-6 mr-2 text-blue-600" />
        Activity History
      </h3>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workouts" className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Workouts
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center">
            <Utensils className="h-4 w-4 mr-2" />
            Nutrition
          </TabsTrigger>
          <TabsTrigger value="measurements" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Measurements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workouts" className="space-y-4">
          {userData.recentWorkouts.length > 0 ? (
            userData.recentWorkouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{workout.name}</CardTitle>
                      <CardDescription>{formatDate(workout.workout_date)}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{workout.type}</Badge>
                      {workout.intensity && (
                        <Badge variant="outline">{workout.intensity}</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {workout.duration_minutes && (
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <p className="font-medium">{workout.duration_minutes} min</p>
                      </div>
                    )}
                    {workout.calories_burned && (
                      <div>
                        <span className="text-gray-500">Calories:</span>
                        <p className="font-medium">{workout.calories_burned}</p>
                      </div>
                    )}
                  </div>
                  {workout.notes && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-md">
                      <span className="text-gray-500 text-sm">Notes:</span>
                      <p className="text-sm">{workout.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No workout history found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4">
          {userData.recentNutrition.length > 0 ? (
            userData.recentNutrition.map((entry) => (
              <Card key={entry.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{entry.food_name}</CardTitle>
                      <CardDescription>{formatDate(entry.entry_date)}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {entry.meal_type && (
                        <Badge variant="secondary" className="capitalize">
                          {entry.meal_type}
                        </Badge>
                      )}
                      {entry.calories && (
                        <Badge variant="outline">{Math.round(entry.calories)} cal</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {entry.protein_grams && (
                      <div>
                        <span className="text-gray-500">Protein:</span>
                        <p className="font-medium">{entry.protein_grams}g</p>
                      </div>
                    )}
                    {entry.carbs_grams && (
                      <div>
                        <span className="text-gray-500">Carbs:</span>
                        <p className="font-medium">{entry.carbs_grams}g</p>
                      </div>
                    )}
                    {entry.fat_grams && (
                      <div>
                        <span className="text-gray-500">Fat:</span>
                        <p className="font-medium">{entry.fat_grams}g</p>
                      </div>
                    )}
                    {entry.fiber_grams && (
                      <div>
                        <span className="text-gray-500">Fiber:</span>
                        <p className="font-medium">{entry.fiber_grams}g</p>
                      </div>
                    )}
                  </div>
                  {entry.serving_size && (
                    <div className="mt-2">
                      <span className="text-gray-500 text-sm">Serving:</span>
                      <span className="text-sm ml-2">{entry.serving_size}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Utensils className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No nutrition history found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="measurements" className="space-y-4">
          {userData.bodyMeasurements.length > 0 ? (
            userData.bodyMeasurements.map((measurement) => (
              <Card key={measurement.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Body Measurements</CardTitle>
                      <CardDescription>{formatDate(measurement.measurement_date)}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {measurement.weight_kg && (
                      <div>
                        <span className="text-gray-500">Weight:</span>
                        <p className="font-medium">{measurement.weight_kg} kg</p>
                      </div>
                    )}
                    {measurement.body_fat_percentage && (
                      <div>
                        <span className="text-gray-500">Body Fat:</span>
                        <p className="font-medium">{measurement.body_fat_percentage}%</p>
                      </div>
                    )}
                    {measurement.waist_cm && (
                      <div>
                        <span className="text-gray-500">Waist:</span>
                        <p className="font-medium">{measurement.waist_cm} cm</p>
                      </div>
                    )}
                    {measurement.chest_cm && (
                      <div>
                        <span className="text-gray-500">Chest:</span>
                        <p className="font-medium">{measurement.chest_cm} cm</p>
                      </div>
                    )}
                  </div>
                  {measurement.notes && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-md">
                      <span className="text-gray-500 text-sm">Notes:</span>
                      <p className="text-sm">{measurement.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No measurement history found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HistoryViewer;
