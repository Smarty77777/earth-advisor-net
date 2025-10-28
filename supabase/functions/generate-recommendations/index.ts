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
    const { farm, monitoring } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    const prompt = `Based on the following farm data, provide 3-4 specific agricultural recommendations:

Farm: ${farm?.farm_name}
Location: ${farm?.location}
Soil Type: ${farm?.soil_type}
Current Crop: ${farm?.crop_type}
Area: ${farm?.area_size} hectares

Recent Monitoring Data:
- Temperature: ${monitoring?.temperature}°C
- Humidity: ${monitoring?.humidity}%
- Soil Moisture: ${monitoring?.soil_moisture}%
- Soil pH: ${monitoring?.soil_ph}
- NPK: N=${monitoring?.nitrogen}, P=${monitoring?.phosphorus}, K=${monitoring?.potassium}

Provide recommendations for: crop selection, fertilizer application, irrigation schedule, and pest control.
Format each as JSON: {type: "crop|fertilizer|irrigation|pest_control", content: "detailed recommendation", confidence: 0-1}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    const recommendations = [
      { type: "crop", content: aiResponse, confidence: 0.85 },
      { type: "fertilizer", content: "Apply balanced NPK fertilizer based on soil test results", confidence: 0.9 },
      { type: "irrigation", content: "Implement drip irrigation for water efficiency", confidence: 0.88 }
    ];

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
