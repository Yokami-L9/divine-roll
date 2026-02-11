const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    if (!text) {
      return new Response(JSON.stringify({ error: 'text required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are a D&D 5e Monster Manual parser. Extract ALL monster stat blocks from the provided Russian text.

For each monster, output a JSON object with these fields:
- name: string (Russian name)
- name_en: string|null (English name if mentioned)
- size: string (Крошечный/Маленький/Средний/Большой/Огромный/Гигантский)
- type: string (Russian type like Гуманоид, Нежить, Зверь, Дракон, etc)
- alignment: string|null
- armor_class: number
- hit_points: string (e.g. "18к10+36 (135)")
- speed: string
- strength: number
- dexterity: number
- constitution: number
- intelligence: number
- wisdom: number
- charisma: number
- challenge_rating: string (e.g. "1/4", "10", "30")
- experience_points: number
- abilities: array of {name, description} - special traits/features
- actions: array of {name, description} - actions section
- legendary_actions: array of {name, description} - if present
- damage_resistances: string[]|null
- damage_immunities: string[]|null
- condition_immunities: string[]|null
- senses: string|null
- languages: string|null
- description: string|null (brief lore description, 1-2 sentences max)

IMPORTANT:
- Output ONLY a JSON array of monster objects, no markdown, no explanation
- Extract EVERY stat block you can find in the text
- Parse the stats table (СИЛ ЛОВ ТЕЛ ИНТ МДР ХАР) carefully
- Parse CR/Опасность and XP correctly
- Include ALL abilities and actions
- If a field is not present, use null or empty array
- Do NOT include variant stat blocks or sub-entries that are not full stat blocks`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Parse all monster stat blocks from this text:\n\n${text}` },
        ],
        temperature: 0.1,
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('AI API error:', errText);
      return new Response(JSON.stringify({ error: 'AI API error', details: errText }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content || '';
    
    // Extract JSON from response (may be wrapped in ```json blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    let monsters;
    try {
      monsters = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', content.substring(0, 500));
      return new Response(JSON.stringify({ error: 'Failed to parse AI response', raw: content.substring(0, 1000) }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!Array.isArray(monsters) || monsters.length === 0) {
      return new Response(JSON.stringify({ error: 'No monsters parsed', raw: content.substring(0, 500) }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert into database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const inserted: string[] = [];
    const errors: string[] = [];

    for (const m of monsters) {
      const body = {
        name: m.name,
        name_en: m.name_en || null,
        size: m.size || 'Средний',
        type: m.type || 'Существо',
        alignment: m.alignment || null,
        armor_class: Number(m.armor_class) || 10,
        hit_points: String(m.hit_points || ''),
        speed: m.speed || '30 фт.',
        strength: Number(m.strength) || 10,
        dexterity: Number(m.dexterity) || 10,
        constitution: Number(m.constitution) || 10,
        intelligence: Number(m.intelligence) || 10,
        wisdom: Number(m.wisdom) || 10,
        charisma: Number(m.charisma) || 10,
        challenge_rating: String(m.challenge_rating ?? '0'),
        experience_points: Number(m.experience_points) || 0,
        abilities: m.abilities || [],
        actions: m.actions || [],
        legendary_actions: m.legendary_actions || [],
        damage_resistances: m.damage_resistances || null,
        damage_immunities: m.damage_immunities || null,
        condition_immunities: m.condition_immunities || null,
        senses: m.senses || null,
        languages: m.languages || null,
        description: m.description || null,
      };

      const res = await fetch(`${supabaseUrl}/rest/v1/monsters`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        inserted.push(m.name);
      } else {
        const errText = await res.text();
        errors.push(`${m.name}: ${errText}`);
      }
    }

    return new Response(
      JSON.stringify({ inserted: inserted.length, names: inserted, errors }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
