
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userData, profile, requestType } = await req.json()

    console.log('Generating recommendations for user:', profile?.first_name)

    // Analyze user data for patterns
    const workoutFrequency = userData.recentWorkouts?.length || 0
    const avgCalories = userData.recentNutrition?.length > 0 
      ? userData.recentNutrition.reduce((sum, entry) => sum + (parseFloat(entry.calories) || 0), 0) / userData.recentNutrition.length
      : profile?.daily_calorie_goal || 2000

    const lastWorkoutType = userData.recentWorkouts?.[0]?.type || 'cardio'
    const fitnessGoal = profile?.primary_fitness_goal || 'general_health'
    const activityLevel = profile?.activity_level || 'moderately_active'
    const experience = profile?.fitness_experience || 'beginner'

    // Generate workout recommendations
    const workoutRecommendations = generateWorkoutRecommendations(
      fitnessGoal, 
      activityLevel, 
      experience, 
      lastWorkoutType,
      workoutFrequency
    )

    // Generate nutrition recommendations
    const nutritionRecommendations = generateNutritionRecommendations(
      fitnessGoal,
      avgCalories,
      profile?.daily_calorie_goal || 2000,
      userData.recentNutrition || []
    )

    // Generate habit recommendations
    const habitRecommendations = generateHabitRecommendations(
      workoutFrequency,
      fitnessGoal,
      activityLevel
    )

    const recommendations = {
      workouts: workoutRecommendations,
      nutrition: nutritionRecommendations,
      habits: habitRecommendations
    }

    console.log('Generated recommendations:', recommendations)

    return new Response(
      JSON.stringify(recommendations),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating recommendations:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate recommendations' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function generateWorkoutRecommendations(goal, activityLevel, experience, lastWorkoutType, frequency) {
  const workoutLibrary = {
    weight_loss: [
      { name: "HIIT Circuit", description: "High-intensity intervals to burn maximum calories", duration: 25, difficulty: "moderate" },
      { name: "Cardio + Strength", description: "Combine cardio with resistance training", duration: 40, difficulty: "moderate" },
      { name: "Morning Walk", description: "Low-impact steady-state cardio", duration: 30, difficulty: "beginner" }
    ],
    muscle_gain: [
      { name: "Upper Body Push", description: "Focus on chest, shoulders, and triceps", duration: 45, difficulty: "intermediate" },
      { name: "Lower Body Power", description: "Squats, deadlifts, and leg exercises", duration: 50, difficulty: "intermediate" },
      { name: "Full Body Strength", description: "Compound movements for muscle building", duration: 60, difficulty: "advanced" }
    ],
    strength: [
      { name: "Powerlifting Focus", description: "Heavy compound lifts with progressive overload", duration: 60, difficulty: "advanced" },
      { name: "Functional Strength", description: "Multi-joint movements for real-world strength", duration: 45, difficulty: "intermediate" },
      { name: "Bodyweight Strength", description: "Build strength using your own body weight", duration: 35, difficulty: "beginner" }
    ],
    endurance: [
      { name: "Long Distance Run", description: "Build cardiovascular endurance", duration: 45, difficulty: "moderate" },
      { name: "Interval Training", description: "Mix of high and low intensity periods", duration: 35, difficulty: "moderate" },
      { name: "Circuit Training", description: "Multiple exercises with minimal rest", duration: 40, difficulty: "intermediate" }
    ],
    general_health: [
      { name: "Balanced Workout", description: "Mix of cardio and strength training", duration: 40, difficulty: "beginner" },
      { name: "Yoga Flow", description: "Flexibility and mindfulness practice", duration: 30, difficulty: "beginner" },
      { name: "Active Recovery", description: "Light movement and stretching", duration: 20, difficulty: "beginner" }
    ]
  }

  const goalWorkouts = workoutLibrary[goal] || workoutLibrary.general_health
  
  // Filter by experience level
  const filteredWorkouts = goalWorkouts.filter(workout => {
    if (experience === 'beginner') return workout.difficulty === 'beginner' || workout.difficulty === 'moderate'
    if (experience === 'intermediate') return workout.difficulty !== 'advanced'
    return true // Advanced users can do all workouts
  })

  // Add variety based on last workout
  return filteredWorkouts.slice(0, 3).map(workout => ({
    ...workout,
    reason: frequency < 3 ? "Perfect for building consistency" : "Great for your current fitness level"
  }))
}

function generateNutritionRecommendations(goal, avgCalories, targetCalories, recentNutrition) {
  const nutritionTips = {
    weight_loss: [
      { title: "Protein Power Bowl", suggestion: "High protein, low carb meal to maintain muscle while losing fat", calories: 450 },
      { title: "Fiber Focus", suggestion: "Add more vegetables and legumes to feel full longer", calories: 200 },
      { title: "Hydration Helper", suggestion: "Drink water before meals to reduce overall calorie intake", calories: 0 }
    ],
    muscle_gain: [
      { title: "Post-Workout Smoothie", suggestion: "Protein and carbs within 30 minutes of training", calories: 350 },
      { title: "Lean Protein Meal", suggestion: "Include 25-30g protein in each main meal", calories: 500 },
      { title: "Healthy Fats", suggestion: "Add nuts, avocado, or olive oil for extra calories", calories: 200 }
    ],
    strength: [
      { title: "Pre-Workout Fuel", suggestion: "Carbs 1-2 hours before training for energy", calories: 300 },
      { title: "Recovery Meal", suggestion: "Balanced protein and carbs after intense training", calories: 600 },
      { title: "Creatine Support", suggestion: "Foods rich in creatine like red meat and fish", calories: 400 }
    ],
    general_health: [
      { title: "Balanced Plate", suggestion: "1/2 vegetables, 1/4 protein, 1/4 whole grains", calories: 500 },
      { title: "Colorful Vegetables", suggestion: "Eat a rainbow of vegetables for diverse nutrients", calories: 100 },
      { title: "Whole Food Focus", suggestion: "Choose minimally processed foods when possible", calories: 300 }
    ]
  }

  const goalTips = nutritionTips[goal] || nutritionTips.general_health

  // Add personalized suggestions based on current intake
  if (avgCalories < targetCalories - 200) {
    goalTips.push({
      title: "Calorie Boost",
      suggestion: "You're eating below your target. Try healthy calorie-dense foods",
      calories: 400
    })
  } else if (avgCalories > targetCalories + 200) {
    goalTips.push({
      title: "Portion Control",
      suggestion: "Consider smaller portions or lower-calorie alternatives",
      calories: 300
    })
  }

  return goalTips.slice(0, 3)
}

function generateHabitRecommendations(workoutFrequency, goal, activityLevel) {
  const habits = []

  if (workoutFrequency < 3) {
    habits.push({
      title: "Consistency Building",
      advice: "Start with 3 workouts per week. Schedule them like important appointments.",
      frequency: "3x per week"
    })
  } else {
    habits.push({
      title: "Active Recovery",
      advice: "Include 1-2 active recovery days with light walking or stretching.",
      frequency: "2x per week"
    })
  }

  if (goal === 'weight_loss') {
    habits.push({
      title: "Meal Prep Sunday",
      advice: "Prepare healthy meals in advance to avoid impulsive food choices.",
      frequency: "Weekly"
    })
  } else if (goal === 'muscle_gain') {
    habits.push({
      title: "Sleep Optimization",
      advice: "Aim for 7-9 hours of sleep for optimal muscle recovery and growth.",
      frequency: "Daily"
    })
  }

  habits.push({
    title: "Progress Tracking",
    advice: "Take weekly photos and measurements to track non-scale victories.",
    frequency: "Weekly"
  })

  return habits.slice(0, 3)
}
