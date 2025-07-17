import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Target, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

const Index = () => {
  const { user } = useAuth();

  // Redirect authenticated users to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Well Nexus</h1>
            </div>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              {" "}Fitness Journey
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track your workouts, monitor nutrition, and achieve your fitness goals with our comprehensive health and fitness platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="w-full sm:w-auto">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Stay Fit
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools to track, analyze, and improve your health
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-blue-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Workout Tracking</CardTitle>
                <CardDescription>
                  Log your exercises, sets, reps, and track your progress over time
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-green-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Nutrition Monitoring</CardTitle>
                <CardDescription>
                  Track calories, macros, and maintain a balanced diet for optimal results
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-purple-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Progress Analytics</CardTitle>
                <CardDescription>
                  Visualize your fitness journey with detailed charts and insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-orange-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Goal Setting</CardTitle>
                <CardDescription>
                  Set and track personalized fitness goals to stay motivated
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-red-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Personal Profile</CardTitle>
                <CardDescription>
                  Customize your experience with detailed health and fitness profiles
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-indigo-100 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Body Measurements</CardTitle>
                <CardDescription>
                  Track body measurements and monitor physical changes over time
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Be among the first to transform your life with Well Nexus
          </p>
          <Link to="/auth">
            <Button size="lg">
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Activity className="h-6 w-6 text-blue-400 mr-2" />
              <span className="text-lg font-semibold">Well Nexus</span>
            </div>
            <p className="text-gray-400">
              © 2025 Well Nexus. Transform your fitness journey.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
