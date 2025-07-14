import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Activity, Utensils, TrendingUp, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parseISO, isValid, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const InteractiveHistoryViewer = ({ userData, onDataUpdate }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState('workouts');
  const { toast } = useToast();

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    try {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Workout deleted successfully",
      });

      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast({
        title: "Error",
        description: "Failed to delete workout",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNutrition = async (nutritionId) => {
    try {
      const { error } = await supabase
        .from('nutrition_entries')
        .delete()
        .eq('id', nutritionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meal deleted successfully",
      });

      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      console.error('Error deleting nutrition entry:', error);
      toast({
        title: "Error",
        description: "Failed to delete meal",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMeasurement = async (measurementId) => {
    try {
      const { error } = await supabase
        .from('body_measurements')
        .delete()
        .eq('id', measurementId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Measurement deleted successfully",
      });

      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      console.error('Error deleting measurement:', error);
      toast({
        title: "Error",
        description: "Failed to delete measurement",
        variant: "destructive",
      });
    }
  };

  // Get unique dates from data
  const getUniqueDates = () => {
    const dates = new Set<string>();
    
    userData.recentWorkouts.forEach(workout => {
      if (workout.workout_date) {
        dates.add(workout.workout_date);
      }
    });
    
    userData.recentNutrition.forEach(entry => {
      if (entry.entry_date) {
        dates.add(entry.entry_date);
      }
    });
    
    userData.bodyMeasurements.forEach(measurement => {
      if (measurement.measurement_date) {
        dates.add(measurement.measurement_date);
      }
    });
    
    return Array.from(dates).sort((a, b) => {
      const dateA = new Date(a).getTime();
      const dateB = new Date(b).getTime();
      return dateB - dateA;
    });
  };

  // Get data for selected date
  const getDataForDate = (date) => {
    const workouts = userData.recentWorkouts.filter(w => w.workout_date === date);
    const nutrition = userData.recentNutrition.filter(n => n.entry_date === date);
    const measurements = userData.bodyMeasurements.filter(m => m.measurement_date === date);
    
    return { workouts, nutrition, measurements };
  };

  // Calendar helpers
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const uniqueDates = getUniqueDates();

  const hasDataForDate = (date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return uniqueDates.includes(dateString);
  };

  const renderCalendar = () => {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              {format(currentMonth, 'MMMM yyyy')}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>Click on dates with activity to see details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {monthDays.map(day => {
              const hasData = hasDataForDate(day);
              const isSelected = selectedDate && isSameDay(day, parseISO(selectedDate));
              const isCurrentMonth = isSameMonth(day, currentMonth);
              
              return (
                <Button
                  key={day.toISOString()}
                  variant={isSelected ? "default" : hasData ? "secondary" : "ghost"}
                  className={`h-10 w-10 p-0 text-sm ${
                    !isCurrentMonth ? 'text-gray-300' : ''
                  } ${hasData ? 'ring-2 ring-blue-200' : ''}`}
                  onClick={() => {
                    if (hasData) {
                      setSelectedDate(format(day, 'yyyy-MM-dd'));
                    }
                  }}
                  disabled={!hasData}
                >
                  {format(day, 'd')}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSelectedDateData = () => {
    if (!selectedDate) {
      return (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Select a date from the calendar to see your activities</p>
          </CardContent>
        </Card>
      );
    }

    const dateData = getDataForDate(selectedDate);
    const formattedDate = formatDate(selectedDate);

    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold">{formattedDate}</h3>
        
        {/* Workouts for selected date */}
        {dateData.workouts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Workouts ({dateData.workouts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dateData.workouts.map((workout) => (
                <div key={workout.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{workout.name}</h4>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary">{workout.type}</Badge>
                        {workout.intensity && (
                          <Badge variant="outline">{workout.intensity}</Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteWorkout(workout.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Nutrition for selected date */}
        {dateData.nutrition.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Utensils className="h-5 w-5 mr-2 text-green-600" />
                Meals ({dateData.nutrition.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dateData.nutrition.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{entry.food_name}</h4>
                      <div className="flex gap-2 mt-1">
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteNutrition(entry.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Measurements for selected date */}
        {dateData.measurements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                Body Measurements ({dateData.measurements.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dateData.measurements.map((measurement) => (
                <div key={measurement.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-lg">Body Measurements</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMeasurement(measurement.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {dateData.workouts.length === 0 && dateData.nutrition.length === 0 && dateData.measurements.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No activities recorded for this date</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold flex items-center">
        <Calendar className="h-6 w-6 mr-2 text-blue-600" />
        Interactive Activity History
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {renderCalendar()}
        </div>
        
        <div className="space-y-4">
          {renderSelectedDateData()}
        </div>
      </div>
    </div>
  );
};

export default InteractiveHistoryViewer;
