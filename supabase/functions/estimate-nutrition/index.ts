
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
    const { foodName, servingSize } = await req.json()

    // Enhanced nutrition database with more comprehensive data
    const nutritionDatabase = {
      // Common foods with nutrition per 100g
      'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10, sodium: 1 },
      'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12, sodium: 1 },
      'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 },
      'grilled chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 },
      'salmon': { calories: 208, protein: 25, carbs: 0, fat: 12, fiber: 0, sugar: 0, sodium: 82 },
      'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1, sodium: 1 },
      'brown rice': { calories: 112, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, sugar: 0.4, sodium: 5 },
      'broccoli': { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, sugar: 1.5, sodium: 33 },
      'egg': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1, sodium: 124 },
      'bread': { calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.7, sugar: 5, sodium: 491 },
      'whole wheat bread': { calories: 247, protein: 13, carbs: 41, fat: 4.2, fiber: 6, sugar: 6, sodium: 400 },
      'oats': { calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 11, sugar: 1, sodium: 2 },
      'milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0, sugar: 5, sodium: 44 },
      'yogurt': { calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, sugar: 3.2, sodium: 36 },
      'cheese': { calories: 113, protein: 7, carbs: 1, fat: 9, fiber: 0, sugar: 1, sodium: 621 },
      'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, sugar: 0.6, sodium: 1 },
      'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2, sugar: 0.8, sodium: 6 },
      'sweet potato': { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, sugar: 4.2, sodium: 7 },
      'avocado': { calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, sugar: 0.7, sodium: 7 },
      'spinach': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79 },
      'tomato': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, sugar: 2.6, sodium: 5 },
      'carrot': { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 2.8, sugar: 4.7, sodium: 69 },
      'orange': { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, sugar: 9.4, sodium: 0 },
      'beef': { calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, sugar: 0, sodium: 72 },
      'pork': { calories: 242, protein: 27, carbs: 0, fat: 14, fiber: 0, sugar: 0, sodium: 62 },
      'tuna': { calories: 144, protein: 30, carbs: 0, fat: 1, fiber: 0, sugar: 0, sodium: 247 },
      'almonds': { calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12, sugar: 4.4, sodium: 1 },
      'peanuts': { calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 8.5, sugar: 4.7, sodium: 18 },
      'quinoa': { calories: 120, protein: 4.4, carbs: 22, fat: 1.9, fiber: 2.8, sugar: 0.9, sodium: 7 }
    }

    // Find best match for food name (case insensitive, partial match)
    const foodKey = Object.keys(nutritionDatabase).find(key => 
      foodName.toLowerCase().includes(key) || key.includes(foodName.toLowerCase())
    ) || 'chicken breast' // Default fallback

    const baseNutrition = nutritionDatabase[foodKey]

    // Parse serving size and calculate multiplier
    let multiplier = 1
    const servingSizeStr = servingSize.toLowerCase()
    
    // Extract numbers from serving size
    const numberMatch = servingSizeStr.match(/(\d+(?:\.\d+)?)/);
    const number = numberMatch ? parseFloat(numberMatch[1]) : 1;

    if (servingSizeStr.includes('g') || servingSizeStr.includes('gram')) {
      multiplier = number / 100 // Convert to per 100g base
    } else if (servingSizeStr.includes('kg') || servingSizeStr.includes('kilogram')) {
      multiplier = (number * 1000) / 100
    } else if (servingSizeStr.includes('cup')) {
      // Rough estimates for cups
      if (foodKey.includes('rice')) multiplier = (number * 158) / 100
      else if (foodKey.includes('milk')) multiplier = (number * 240) / 100
      else if (foodKey.includes('oats')) multiplier = (number * 40) / 100
      else multiplier = (number * 100) / 100 // Default cup estimate
    } else if (servingSizeStr.includes('piece') || servingSizeStr.includes('slice')) {
      // Rough estimates for pieces
      if (foodKey.includes('bread')) multiplier = (number * 25) / 100
      else if (foodKey.includes('apple')) multiplier = (number * 150) / 100
      else if (foodKey.includes('banana')) multiplier = (number * 120) / 100
      else if (foodKey.includes('egg')) multiplier = (number * 50) / 100
      else multiplier = (number * 100) / 100 // Default piece estimate
    } else if (servingSizeStr.includes('oz') || servingSizeStr.includes('ounce')) {
      multiplier = (number * 28.35) / 100 // Convert oz to grams
    } else if (servingSizeStr.includes('lb') || servingSizeStr.includes('pound')) {
      multiplier = (number * 453.6) / 100 // Convert lb to grams
    } else {
      // If no unit specified, assume grams
      multiplier = number / 100
    }

    // Calculate final nutrition values
    const nutrition = {
      calories: Math.round(baseNutrition.calories * multiplier),
      protein: Math.round((baseNutrition.protein * multiplier) * 10) / 10,
      carbs: Math.round((baseNutrition.carbs * multiplier) * 10) / 10,
      fat: Math.round((baseNutrition.fat * multiplier) * 10) / 10,
      fiber: Math.round((baseNutrition.fiber * multiplier) * 10) / 10,
      sugar: Math.round((baseNutrition.sugar * multiplier) * 10) / 10,
      sodium: Math.round(baseNutrition.sodium * multiplier)
    }

    console.log(`Estimated nutrition for ${foodName} (${servingSize}):`, nutrition)

    return new Response(
      JSON.stringify(nutrition),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error estimating nutrition:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to estimate nutrition' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
