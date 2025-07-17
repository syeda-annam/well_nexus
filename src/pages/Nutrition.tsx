
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Apple, ArrowLeft, Target } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import SmartNutritionEntry from '@/components/SmartNutritionEntry';

const Nutrition = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

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
              <Apple className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Smart Nutrition Tracking</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Nutrition Tracking
          </h2>
          <p className="text-gray-600">
            Simply enter the food name and quantity - we will estimate all nutrition values automatically!
          </p>
        </div>

        <div className="space-y-8">
          <SmartNutritionEntry />

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Smart Tracking Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Automatic calorie estimation</li>
                    <li>• Smart macro breakdown (protein, carbs, fat)</li>
                    <li>• Micronutrient analysis (fiber, sugar, sodium)</li>
                    <li>• Portion size intelligence</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Best Practices:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Be specific with food names</li>
                    <li>• Include cooking methods (grilled, fried, etc.)</li>
                    <li>• Use standard measurements (cups, grams, pieces)</li>
                    <li>• Log meals consistently for better recommendations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
