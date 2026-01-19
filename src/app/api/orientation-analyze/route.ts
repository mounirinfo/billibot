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
            Ton rôle est de générer 3 recommandations de formations UNIQUEMENT parmi la liste officielle suivante :
            
            BTS MCO : Commerce, Management, Relation Client (Social=3)
            BTS NDRC : Vente, Digital, Négociation (Social=3, Data=2)
            BTS COM : Créativité, Médias, Stratégie (Crea=3, Social=3)
            BTS SAM : RH, Coordination, International (Data=3, Intl=2)
            BTS CI : Commerce International, Langues (Intl=3)
            BTS GPME : Gestion PME, Polyvalence (Data=3, Social=2)
            Bachelor Business : Stratégie, Leadership (Bac+3, Équilibré)

            RÈGLES DE MATCHING CRITIQUES :
            1. Un étudiant qui aime les chiffres/l'organisation (Data=3) doit être orienté vers GPME ou SAM, PAS vers COM.
            2. Un étudiant qui veut de l'international (Intl=3) doit avoir CI en premier choix.
            3. Analyse le texte libre de l'utilisateur pour affiner la description.

            Tu DOIS répondre UNIQUEMENT avec un objet JSON suivant ce format :
            {
              "formations": [
                {
                  "id": "string (ex: bts_mco)",
                  "name": "Nom court",
                  "fullName": "Nom complet",
                  "emoji": "Emoji",
                  "description": "Explique pourquoi cette formation matche spécifiquement avec son profil (ex: 'Ta passion pour X et ton talent pour Y font de toi un candidat idéal pour...')",
                  "match": nombre_entre_70_et_99,
                  "color": "code_hex_couleur",
                  "badges": ["3 points forts"]
                }
              ],
              "globalAdvice": "Analyse BilliBot du profil (ex: 'Tu es un profil fonceur et créatif...') et encouragement."
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
