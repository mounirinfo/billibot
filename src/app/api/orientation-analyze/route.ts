import { NextRequest, NextResponse } from 'next/server';

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

export async function POST(request: NextRequest) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt requis' }, { status: 400 });
        }

        const mistralResponse = await fetch(MISTRAL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MISTRAL_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'mistral-small-latest',
                response_format: { type: 'json_object' },
                messages: [
                    {
                        role: 'system',
                        content: `Tu es BilliBot, l'expert en orientation de l'école Billibot en France. 
            Ton rôle est de générer 3 recommandations de formations (uniquement des BTS français réels comme BTS MCO, NDRC, COM, SAM, CI, GPME, PI, etc.) basées sur le profil de l'étudiant.
            
            Tu DOIS répondre UNIQUEMENT avec un objet JSON suivant ce format :
            {
              "formations": [
                {
                  "id": "string_unique",
                  "name": "Nom court (ex: BTS MCO)",
                  "fullName": "Nom complet du diplôme",
                  "emoji": "Emoji représentatif",
                  "description": "Description punchy et personnalisée pour l'élève",
                  "match": nombre_entre_70_et_99,
                  "color": "code_hex_couleur_vibrante",
                  "badges": ["3 points forts de la formation"]
                }
              ],
              "globalAdvice": "Un message global d'encouragement et une analyse du profil en 3-4 phrases."
            }
            
            Assure-toi que les conseils soient basés sur les envies (tags, freeText) et les contraintes de l'élève.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1200,
            }),
        });

        if (!mistralResponse.ok) {
            throw new Error('Erreur Mistral API');
        }

        const data = await mistralResponse.json();
        const result = JSON.parse(data.choices[0]?.message?.content);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Orientation Analysis Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
