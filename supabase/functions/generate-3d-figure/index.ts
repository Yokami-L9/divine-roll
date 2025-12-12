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
    const { action, taskId, race, subrace, characterClass, equipment, customDescription, mode } = await req.json();
    const MESHY_API_KEY = Deno.env.get("MESHY_API_KEY");
    
    if (!MESHY_API_KEY) {
      throw new Error("MESHY_API_KEY is not configured");
    }

    const headers = {
      "Authorization": `Bearer ${MESHY_API_KEY}`,
      "Content-Type": "application/json",
    };

    // Check task status
    if (action === "status") {
      console.log(`Checking status for task: ${taskId}`);
      
      const response = await fetch(`https://api.meshy.ai/openapi/v2/text-to-3d/${taskId}`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Meshy API error:", response.status, errorText);
        throw new Error(`Meshy API error: ${response.status}`);
      }

      const task = await response.json();
      console.log("Task status:", task.status, "Progress:", task.progress);

      return new Response(JSON.stringify({
        status: task.status,
        progress: task.progress,
        modelUrl: task.model_urls?.glb || null,
        thumbnailUrl: task.thumbnail_url || null,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate new 3D model
    console.log(`Generating 3D figure for: ${race} ${characterClass}, mode: ${mode}`);

    let characterDescription = "";

    if (mode === "auto") {
      const equipmentList = equipment && equipment.length > 0 
        ? equipment.filter((e: string) => e !== "__NO_EQUIPMENT__").join(", ")
        : "adventurer gear";
      
      characterDescription = `A fantasy ${race}${subrace ? ` ${subrace}` : ""} ${characterClass} miniature figurine. ${equipmentList}. Heroic pose, standing on a round display base. Tabletop RPG miniature style, highly detailed, collectible figurine.`;
    } else {
      characterDescription = `${customDescription || `A fantasy ${race} ${characterClass}`}. Miniature figurine on a round display base. Tabletop RPG miniature style, highly detailed, collectible figurine.`;
    }

    console.log("Prompt:", characterDescription);

    const generateRequest = {
      mode: "preview",
      prompt: characterDescription,
      negative_prompt: "low quality, low resolution, blurry, deformed, ugly, bad anatomy, extra limbs",
      art_style: "realistic",
      should_remesh: true,
    };

    const response = await fetch("https://api.meshy.ai/openapi/v2/text-to-3d", {
      method: "POST",
      headers,
      body: JSON.stringify(generateRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Meshy API error:", response.status, errorText);
      
      if (response.status === 401) {
        throw new Error("Неверный API ключ Meshy");
      }
      if (response.status === 402) {
        throw new Error("Недостаточно кредитов Meshy");
      }
      if (response.status === 429) {
        throw new Error("Превышен лимит запросов Meshy");
      }
      
      throw new Error(`Meshy API error: ${response.status}`);
    }

    const data = await response.json();
    const newTaskId = data.result;
    
    console.log("Task created:", newTaskId);

    return new Response(JSON.stringify({ 
      taskId: newTaskId,
      status: "PENDING",
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in generate-3d-figure:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
