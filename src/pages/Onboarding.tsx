
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    // Basic Info
    dateOfBirth: '',
    gender: '',
    
    // Physical Measurements
    heightCm: '',
    weightKg: '',
    bodyFatPercentage: '',
    
    // Activity & Fitness Level
    activityLevel: '',
    fitnessExperience: '',
    
    // Goals & Preferences
    primaryFitnessGoal: '',
    targetWeightKg: '',
    weeklyWorkoutFrequency: '',
    preferredWorkoutDuration: '',
    preferredWorkoutTypes: [] as string[],
    
    // Dietary Information
    dietaryRestrictions: [] as string[],
    allergies: [] as string[],
    dailyCalorieGoal: '',
    proteinGoalGrams: '',
    carbGoalGrams: '',
    fatGoalGrams: '',
    
    // Health & Medical
    medicalConditions: [] as string[],
    medications: [] as string[],
    injuriesLimitations: [] as string[],
    
    // Preferences
    unitsSystem: 'metric',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const submitProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          date_of_birth: formData.dateOfBirth || null,
          gender: formData.gender || null,
          height_cm: formData.heightCm ? parseInt(formData.heightCm) : null,
          weight_kg: formData.weightKg ? parseFloat(formData.weightKg) : null,
          body_fat_percentage: formData.bodyFatPercentage ? parseFloat(formData.bodyFatPercentage) : null,
          activity_level: formData.activityLevel || null,
          fitness_experience: formData.fitnessExperience || null,
          primary_fitness_goal: formData.primaryFitnessGoal || null,
          target_weight_kg: formData.targetWeightKg ? parseFloat(formData.targetWeightKg) : null,
          weekly_workout_frequency: formData.weeklyWorkoutFrequency ? parseInt(formData.weeklyWorkoutFrequency) : null,
          preferred_workout_duration: formData.preferredWorkoutDuration ? parseInt(formData.preferredWorkoutDuration) : null,
          preferred_workout_types: formData.preferredWorkoutTypes.length > 0 ? formData.preferredWorkoutTypes : null,
          dietary_restrictions: formData.dietaryRestrictions.length > 0 ? formData.dietaryRestrictions : null,
          allergies: formData.allergies.length > 0 ? formData.allergies : null,
          daily_calorie_goal: formData.dailyCalorieGoal ? parseInt(formData.dailyCalorieGoal) : null,
          protein_goal_grams: formData.proteinGoalGrams ? parseInt(formData.proteinGoalGrams) : null,
          carb_goal_grams: formData.carbGoalGrams ? parseInt(formData.carbGoalGrams) : null,
          fat_goal_grams: formData.fatGoalGrams ? parseInt(formData.fatGoalGrams) : null,
          medical_conditions: formData.medicalConditions.length > 0 ? formData.medicalConditions : null,
          medications: formData.medications.length > 0 ? formData.medications : null,
          injuries_limitations: formData.injuriesLimitations.length > 0 ? formData.injuriesLimitations : null,
          units_system: formData.unitsSystem,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Profile completed successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <Input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Height (cm)</label>
                <Input
                  type="number"
                  placeholder="170"
                  value={formData.heightCm}
                  onChange={(e) => handleInputChange('heightCm', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="70.0"
                  value={formData.weightKg}
                  onChange={(e) => handleInputChange('weightKg', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Body Fat % (optional)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="15.0"
                  value={formData.bodyFatPercentage}
                  onChange={(e) => handleInputChange('bodyFatPercentage', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Activity & Fitness Level</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Current Activity Level</label>
              <Select value={formData.activityLevel} onValueChange={(value) => handleInputChange('activityLevel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                  <SelectItem value="lightly_active">Lightly Active (light exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="very_active">Very Active (hard exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="extremely_active">Extremely Active (very hard exercise, physical job)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fitness Experience</label>
              <Select value={formData.fitnessExperience} onValueChange={(value) => handleInputChange('fitnessExperience', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                  <SelectItem value="advanced">Advanced (3+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Goals & Preferences</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Primary Fitness Goal</label>
              <Select value={formData.primaryFitnessGoal} onValueChange={(value) => handleInputChange('primaryFitnessGoal', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your main goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight_loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="endurance">Endurance</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                  <SelectItem value="general_health">General Health</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Target Weight (kg)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="65.0"
                  value={formData.targetWeightKg}
                  onChange={(e) => handleInputChange('targetWeightKg', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Workouts/Week</label>
                <Input
                  type="number"
                  min="0"
                  max="7"
                  placeholder="3"
                  value={formData.weeklyWorkoutFrequency}
                  onChange={(e) => handleInputChange('weeklyWorkoutFrequency', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                <Input
                  type="number"
                  placeholder="45"
                  value={formData.preferredWorkoutDuration}
                  onChange={(e) => handleInputChange('preferredWorkoutDuration', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Preferred Workout Types</label>
              <div className="grid grid-cols-2 gap-2">
                {['Cardio', 'Strength Training', 'Yoga', 'Pilates', 'HIIT', 'Swimming', 'Running', 'Cycling'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={formData.preferredWorkoutTypes.includes(type)}
                      onCheckedChange={(checked) => handleArrayChange('preferredWorkoutTypes', type, checked as boolean)}
                    />
                    <label htmlFor={type} className="text-sm">{type}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Nutrition & Diet</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Dietary Restrictions</label>
              <div className="grid grid-cols-2 gap-2">
                {['Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Gluten-Free', 'Dairy-Free', 'Low-Carb', 'Mediterranean'].map((restriction) => (
                  <div key={restriction} className="flex items-center space-x-2">
                    <Checkbox
                      id={restriction}
                      checked={formData.dietaryRestrictions.includes(restriction)}
                      onCheckedChange={(checked) => handleArrayChange('dietaryRestrictions', restriction, checked as boolean)}
                    />
                    <label htmlFor={restriction} className="text-sm">{restriction}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Allergies</label>
              <div className="grid grid-cols-2 gap-2">
                {['Nuts', 'Shellfish', 'Eggs', 'Dairy', 'Soy', 'Wheat', 'Fish', 'Sesame'].map((allergy) => (
                  <div key={allergy} className="flex items-center space-x-2">
                    <Checkbox
                      id={allergy}
                      checked={formData.allergies.includes(allergy)}
                      onCheckedChange={(checked) => handleArrayChange('allergies', allergy, checked as boolean)}
                    />
                    <label htmlFor={allergy} className="text-sm">{allergy}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Daily Calories</label>
                <Input
                  type="number"
                  placeholder="2000"
                  value={formData.dailyCalorieGoal}
                  onChange={(e) => handleInputChange('dailyCalorieGoal', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Protein (g)</label>
                <Input
                  type="number"
                  placeholder="150"
                  value={formData.proteinGoalGrams}
                  onChange={(e) => handleInputChange('proteinGoalGrams', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Carbs (g)</label>
                <Input
                  type="number"
                  placeholder="200"
                  value={formData.carbGoalGrams}
                  onChange={(e) => handleInputChange('carbGoalGrams', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fat (g)</label>
                <Input
                  type="number"
                  placeholder="70"
                  value={formData.fatGoalGrams}
                  onChange={(e) => handleInputChange('fatGoalGrams', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Health & Medical (Optional)</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Medical Conditions</label>
              <div className="grid grid-cols-2 gap-2">
                {['Diabetes', 'Hypertension', 'Heart Disease', 'Arthritis', 'Asthma', 'Thyroid Issues', 'Back Problems', 'Joint Issues'].map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox
                      id={condition}
                      checked={formData.medicalConditions.includes(condition)}
                      onCheckedChange={(checked) => handleArrayChange('medicalConditions', condition, checked as boolean)}
                    />
                    <label htmlFor={condition} className="text-sm">{condition}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Current Medications</label>
              <div className="grid grid-cols-2 gap-2">
                {['Blood Pressure', 'Diabetes', 'Cholesterol', 'Pain Relief', 'Supplements', 'Vitamins', 'Hormones', 'Other'].map((medication) => (
                  <div key={medication} className="flex items-center space-x-2">
                    <Checkbox
                      id={medication}
                      checked={formData.medications.includes(medication)}
                      onCheckedChange={(checked) => handleArrayChange('medications', medication, checked as boolean)}
                    />
                    <label htmlFor={medication} className="text-sm">{medication}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Injuries or Limitations</label>
              <div className="grid grid-cols-2 gap-2">
                {['Knee Problems', 'Back Pain', 'Shoulder Issues', 'Wrist Problems', 'Ankle Issues', 'Hip Problems', 'Neck Pain', 'Recent Surgery'].map((injury) => (
                  <div key={injury} className="flex items-center space-x-2">
                    <Checkbox
                      id={injury}
                      checked={formData.injuriesLimitations.includes(injury)}
                      onCheckedChange={(checked) => handleArrayChange('injuriesLimitations', injury, checked as boolean)}
                    />
                    <label htmlFor={injury} className="text-sm">{injury}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              Help us personalize your fitness and nutrition experience
            </CardDescription>
            <Progress value={(currentStep / totalSteps) * 100} className="mt-4" />
            <p className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</p>
          </CardHeader>
          
          <CardContent>
            {renderStep()}
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                  Next
                </Button>
              ) : (
                <Button onClick={submitProfile} disabled={loading}>
                  {loading ? 'Saving...' : 'Complete Setup'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
