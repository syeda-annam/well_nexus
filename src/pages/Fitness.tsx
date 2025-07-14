
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Plus, Dumbbell, Clock, Target, TrendingUp, ArrowLeft } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Fitness = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [workoutData, setWorkoutData] = useState({
    name: '',
    type: '',
    intensity: '',
    duration_minutes: '',
    calories_burned: '',
    notes: ''
  });

  const [measurementData, setMeasurementData] = useState({
    weight_kg: '',
    body_fat_percentage: '',
    chest_cm: '',
    waist_cm: '',
    arm_cm: '',
    thigh_cm: '',
    notes: ''
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleWorkoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('workouts')
        .insert([{
          user_id: user.id,
          name: workoutData.name || 'Workout',
          type: workoutData.type || 'general',
          intensity: workoutData.intensity || null,
          duration_minutes: workoutData.duration_minutes ? parseInt(workoutData.duration_minutes) : null,
          calories_burned: workoutData.calories_burned ? parseInt(workoutData.calories_burned) : null,
          notes: workoutData.notes || null,
          workout_date: new Date().toISOString().split('T')[0]
        }]);

      if (error) throw error;

      toast.success('Workout logged successfully!');
      setWorkoutData({
        name: '',
        type: '',
        intensity: '',
        duration_minutes: '',
        calories_burned: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error logging workout:', error);
      toast.error('Failed to log workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMeasurementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('body_measurements')
        .insert([{
          user_id: user.id,
          weight_kg: measurementData.weight_kg ? parseFloat(measurementData.weight_kg) : null,
          body_fat_percentage: measurementData.body_fat_percentage ? parseFloat(measurementData.body_fat_percentage) : null,
          chest_cm: measurementData.chest_cm ? parseFloat(measurementData.chest_cm) : null,
          waist_cm: measurementData.waist_cm ? parseFloat(measurementData.waist_cm) : null,
          arm_cm: measurementData.arm_cm ? parseFloat(measurementData.arm_cm) : null,
          thigh_cm: measurementData.thigh_cm ? parseFloat(measurementData.thigh_cm) : null,
          notes: measurementData.notes || null,
          measurement_date: new Date().toISOString().split('T')[0]
        }]);

      if (error) throw error;

      toast.success('Measurements recorded successfully!');
      setMeasurementData({
        weight_kg: '',
        body_fat_percentage: '',
        chest_cm: '',
        waist_cm: '',
        arm_cm: '',
        thigh_cm: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error recording measurements:', error);
      toast.error('Failed to record measurements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <Activity className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Fitness Tracking</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Track Your Fitness
          </h2>
          <p className="text-gray-600">
            Log workouts and record body measurements to monitor your progress
          </p>
        </div>

        <Tabs defaultValue="workout" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="workout" className="flex items-center">
              <Dumbbell className="h-4 w-4 mr-2" />
              Log Workout
            </TabsTrigger>
            <TabsTrigger value="measurements" className="flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Body Measurements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workout">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Dumbbell className="h-5 w-5 mr-2" />
                  Log New Workout
                </CardTitle>
                <CardDescription>
                  Record your workout details and track your progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWorkoutSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="workout-name">Workout Name</Label>
                      <Input
                        id="workout-name"
                        placeholder="e.g., Morning Run, Chest Day"
                        value={workoutData.name}
                        onChange={(e) => setWorkoutData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="workout-type">Workout Type</Label>
                      <Select value={workoutData.type} onValueChange={(value) => setWorkoutData(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select workout type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cardio">Cardio</SelectItem>
                          <SelectItem value="strength">Strength Training</SelectItem>
                          <SelectItem value="flexibility">Flexibility</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="yoga">Yoga</SelectItem>
                          <SelectItem value="pilates">Pilates</SelectItem>
                          <SelectItem value="hiit">HIIT</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="workout-intensity">Intensity</Label>
                      <Select value={workoutData.intensity} onValueChange={(value) => setWorkoutData(prev => ({ ...prev, intensity: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select intensity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="intense">Intense</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="workout-duration">Duration (minutes)</Label>
                      <Input
                        id="workout-duration"
                        type="number"
                        placeholder="30"
                        value={workoutData.duration_minutes}
                        onChange={(e) => setWorkoutData(prev => ({ ...prev, duration_minutes: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="workout-calories">Calories Burned</Label>
                      <Input
                        id="workout-calories"
                        type="number"
                        placeholder="300"
                        value={workoutData.calories_burned}
                        onChange={(e) => setWorkoutData(prev => ({ ...prev, calories_burned: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="workout-notes">Notes (Optional)</Label>
                    <Textarea
                      id="workout-notes"
                      placeholder="How did the workout feel? Any observations?"
                      value={workoutData.notes}
                      onChange={(e) => setWorkoutData(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Logging...' : 'Log Workout'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="measurements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Record Body Measurements
                </CardTitle>
                <CardDescription>
                  Track your physical progress with body measurements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMeasurementSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        placeholder="70.5"
                        value={measurementData.weight_kg}
                        onChange={(e) => setMeasurementData(prev => ({ ...prev, weight_kg: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="body-fat">Body Fat Percentage (%)</Label>
                      <Input
                        id="body-fat"
                        type="number"
                        step="0.1"
                        placeholder="15.0"
                        value={measurementData.body_fat_percentage}
                        onChange={(e) => setMeasurementData(prev => ({ ...prev, body_fat_percentage: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="chest">Chest (cm)</Label>
                      <Input
                        id="chest"
                        type="number"
                        step="0.1"
                        placeholder="95.0"
                        value={measurementData.chest_cm}
                        onChange={(e) => setMeasurementData(prev => ({ ...prev, chest_cm: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="waist">Waist (cm)</Label>
                      <Input
                        id="waist"
                        type="number"
                        step="0.1"
                        placeholder="80.0"
                        value={measurementData.waist_cm}
                        onChange={(e) => setMeasurementData(prev => ({ ...prev, waist_cm: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="arm">Arm (cm)</Label>
                      <Input
                        id="arm"
                        type="number"
                        step="0.1"
                        placeholder="35.0"
                        value={measurementData.arm_cm}
                        onChange={(e) => setMeasurementData(prev => ({ ...prev, arm_cm: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="thigh">Thigh (cm)</Label>
                      <Input
                        id="thigh"
                        type="number"
                        step="0.1"
                        placeholder="55.0"
                        value={measurementData.thigh_cm}
                        onChange={(e) => setMeasurementData(prev => ({ ...prev, thigh_cm: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="measurement-notes">Notes (Optional)</Label>
                    <Textarea
                      id="measurement-notes"
                      placeholder="Any observations about your measurements?"
                      value={measurementData.notes}
                      onChange={(e) => setMeasurementData(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Recording...' : 'Record Measurements'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Fitness;
