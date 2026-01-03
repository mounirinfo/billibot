import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { conversationId, message } = await request.json();

    if (!conversationId || !message) {
      return NextResponse.json(
        { error: 'conversationId et message requis' },
        { status: 400 }
      );
    }

    const { data: userMessage, error: userError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content: message,
      })
      .select()
      .single();

    if (userError) {
      console.error('Erreur insertion message user:', userError);
      return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 });
    }

    const { data: history } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10);

    const messages = [
      {
        role: 'system',
        content: `Tu es EduBot, un assistant éducatif intelligent et bienveillant. Tu aides les élèves avec leurs devoirs, leurs questions de cours et leur apprentissage. Tu es patient, pédagogue et tu expliques les choses de manière claire et structurée. Tu encourages toujours l'élève à réfléchir par lui-même.`,
      },
      ...(history || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const mistralResponse = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: false,
      }),
    });

    if (!mistralResponse.ok) {
      const errorData = await mistralResponse.json();
      console.error('Erreur Mistral API:', errorData);
      throw new Error(`Erreur Mistral: ${mistralResponse.statusText}`);
    }

    const mistralData = await mistralResponse.json();
    const assistantMessage = mistralData.choices[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json({ error: 'Pas de réponse de l\'IA' }, { status: 500 });
    }

    const { data: savedAssistantMessage, error: assistantError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: assistantMessage,
      })
      .select()
      .single();

    if (assistantError) {
      console.error('Erreur insertion message assistant:', assistantError);
      return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 });
    }

    if (history && history.length <= 2) {
      const title = message.slice(0, 50) + (message.length > 50 ? '...' : '');
      await supabase
        .from('conversations')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', conversationId);
    } else {
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
    }

    return NextResponse.json({
      userMessage,
      assistantMessage: savedAssistantMessage,
    });
  } catch (error: any) {
    console.error('Erreur API chat:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}