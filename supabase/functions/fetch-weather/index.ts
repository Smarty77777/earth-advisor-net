import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location } = await req.json();
    const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY');

    if (!OPENWEATHER_API_KEY) {
      throw new Error('OpenWeatherMap API key not configured');
    }

    console.log('Fetching weather data for location:', location);

    // Fetch weather data from OpenWeatherMap
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text();
      console.error('OpenWeatherMap API error:', errorText);
      throw new Error('Failed to fetch weather data');
    }

    const weatherData = await weatherResponse.json();
    console.log('Weather data received:', weatherData);

    // Extract relevant data
    const result = {
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      weather_condition: weatherData.weather[0].main,
      description: weatherData.weather[0].description,
      // Generate reasonable soil data based on weather conditions
      soil_moisture: calculateSoilMoisture(weatherData.main.humidity, weatherData.weather[0].main),
      soil_ph: 6.5 + (Math.random() * 1.0 - 0.5), // Random between 6.0-7.0
      nitrogen: Math.floor(25 + Math.random() * 15), // Random between 25-40
      phosphorus: Math.floor(12 + Math.random() * 8), // Random between 12-20
      potassium: Math.floor(15 + Math.random() * 10), // Random between 15-25
    };

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in fetch-weather function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function calculateSoilMoisture(humidity: number, weatherCondition: string): number {
  let baseMoisture = humidity * 0.7; // Base moisture correlates with humidity
  
  // Adjust based on weather conditions
  if (weatherCondition.includes('Rain')) {
    baseMoisture += 15;
  } else if (weatherCondition.includes('Clear')) {
    baseMoisture -= 10;
  }
  
  // Keep within realistic range (30-90%)
  return Math.max(30, Math.min(90, baseMoisture));
}
