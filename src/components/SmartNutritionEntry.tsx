
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Apple } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const SmartNutritionEntry = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [nutritionData, setNutritionData] = useState({
    food_name: '',
    serving_size: '',
    meal_type: '',
    calories: '',
    protein_grams: '',
    carbs_grams: '',
    fat_grams: '',
    fiber_grams: '',
    sugar_grams: '',
    sodium_mg: ''
  });

  const estimateNutrition = async () => {
    if (!nutritionData.food_name || !nutritionData.serving_size) {
      toast.error('Please enter both food name and serving size');
      return;
    }

    setEstimating(true);
    try {
      const { data, error } = await supabase.functions.invoke('estimate-nutrition', {
        body: {
          foodName: nutritionData.food_name,
          servingSize: nutritionData.serving_size
        }
      });

      if (error) throw error;

      setNutritionData(prev => ({
        ...prev,
        calories: data.calories?.toString() || '',
        protein_grams: data.protein?.toString() || '',
        carbs_grams: data.carbs?.toString() || '',
        fat_grams: data.fat?.toString() || '',
        fiber_grams: data.fiber?.toString() || '',
        sugar_grams: data.sugar?.toString() || '',
        sodium_mg: data.sodium?.toString() || ''
      }));

      toast.success('Nutrition estimated successfully!');
    } catch (error) {
      console.error('Error estimating nutrition:', error);
      toast.error('Failed to estimate nutrition values');
    } finally {
      setEstimating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nutritionData.food_name.trim()) {
      toast.error('Please enter a food name');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('nutrition_entries')
        .insert([{
          user_id: user.id,
          food_name: nutritionData.food_name,
          serving_size: nutritionData.serving_size || null,
          meal_type: nutritionData.meal_type || null,
          calories: nutritionData.calories ? parseFloat(nutritionData.calories) : null,
          protein_grams: nutritionData.protein_grams ? parseFloat(nutritionData.protein_grams) : null,
          carbs_grams: nutritionData.carbs_grams ? parseFloat(nutritionData.carbs_grams) : null,
          fat_grams: nutritionData.fat_grams ? parseFloat(nutritionData.fat_grams) : null,
          fiber_grams: nutritionData.fiber_grams ? parseFloat(nutritionData.fiber_grams) : null,
          sugar_grams: nutritionData.sugar_grams ? parseFloat(nutritionData.sugar_grams) : null,
          sodium_mg: nutritionData.sodium_mg ? parseFloat(nutritionData.sodium_mg) : null,
          entry_date: new Date().toISOString().split('T')[0]
        }]);

      if (error) throw error;

      toast.success('Nutrition entry added successfully!');
      setNutritionData({
        food_name: '',
        serving_size: '',
        meal_type: '',
        calories: '',
        protein_grams: '',
        carbs_grams: '',
        fat_grams: '',
        fiber_grams: '',
        sugar_grams: '',
        sodium_mg: ''
      });
    } catch (error) {
      console.error('Error adding nutrition entry:', error);
      toast.error('Failed to add nutrition entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Apple className="h-5 w-5 mr-2 text-green-600" />
          Smart Nutrition Entry
        </CardTitle>
        <CardDescription>
          AI-powered nutrition estimation - just enter the food and quantity!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="food-name">Food Name *</Label>
              <Input
                id="food-name"
                placeholder="e.g., Grilled Chicken Breast"
                value={nutritionData.food_name}
                onChange={(e) => setNutritionData(prev => ({ ...prev, food_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="serving-size">Serving Size *</Label>
              <Input
                id="serving-size"
                placeholder="e.g., 100g, 1 cup, 1 piece"
                value={nutritionData.serving_size}
                onChange={(e) => setNutritionData(prev => ({ ...prev, serving_size: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="meal-type">Meal Type</Label>
              <Select value={nutritionData.meal_type} onValueChange={(value) => setNutritionData(prev => ({ ...prev, meal_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <Button 
              type="button" 
              onClick={estimateNutrition}
              disabled={estimating || !nutritionData.food_name || !nutritionData.serving_size}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {estimating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              {estimating ? 'Estimating...' : 'AI Estimate Nutrition'}
            </Button>
          </div>

          {/* Estimated nutrition values */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                step="0.1"
                value={nutritionData.calories}
                onChange={(e) => setNutritionData(prev => ({ ...prev, calories: e.target.value }))}
                className={nutritionData.calories ? 'bg-green-50 border-green-200' : ''}
              />
            </div>
            <div>
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                step="0.1"
                value={nutritionData.protein_grams}
                onChange={(e) => setNutritionData(prev => ({ ...prev, protein_grams: e.target.value }))}
                className={nutritionData.protein_grams ? 'bg-green-50 border-green-200' : ''}
              />
            </div>
            <div>
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                step="0.1"
                value={nutritionData.carbs_grams}
                onChange={(e) => setNutritionData(prev => ({ ...prev, carbs_grams: e.target.value }))}
                className={nutritionData.carbs_grams ? 'bg-green-50 border-green-200' : ''}
              />
            </div>
            <div>
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                step="0.1"
                value={nutritionData.fat_grams}
                onChange={(e) => setNutritionData(prev => ({ ...prev, fat_grams: e.target.value }))}
                className={nutritionData.fat_grams ? 'bg-green-50 border-green-200' : ''}
              />
            </div>
            <div>
              <Label htmlFor="fiber">Fiber (g)</Label>
              <Input
                id="fiber"
                type="number"
                step="0.1"
                value={nutritionData.fiber_grams}
                onChange={(e) => setNutritionData(prev => ({ ...prev, fiber_grams: e.target.value }))}
                className={nutritionData.fiber_grams ? 'bg-green-50 border-green-200' : ''}
              />
            </div>
            <div>
              <Label htmlFor="sugar">Sugar (g)</Label>
              <Input
                id="sugar"
                type="number"
                step="0.1"
                value={nutritionData.sugar_grams}
                onChange={(e) => setNutritionData(prev => ({ ...prev, sugar_grams: e.target.value }))}
                className={nutritionData.sugar_grams ? 'bg-green-50 border-green-200' : ''}
              />
            </div>
            <div>
              <Label htmlFor="sodium">Sodium (mg)</Label>
              <Input
                id="sodium"
                type="number"
                step="0.1"
                value={nutritionData.sodium_mg}
                onChange={(e) => setNutritionData(prev => ({ ...prev, sodium_mg: e.target.value }))}
                className={nutritionData.sodium_mg ? 'bg-green-50 border-green-200' : ''}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Adding Entry...' : 'Add Food Entry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SmartNutritionEntry;
