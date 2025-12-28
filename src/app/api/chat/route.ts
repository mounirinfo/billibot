import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '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',
  baseURL: 'https://openrouter.ai/api/v1',
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Vérifier l'authentification
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

    // 1. Sauvegarder le message utilisateur
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

    // 2. Récupérer l'historique de la conversation (derniers 10 messages)
    const { data: history } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10);

    // 3. Préparer les messages pour OpenRouter
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

    // 4. Appeler OpenRouter avec streaming
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-3.5-turbo', 
      messages: messages as any,
      stream: false, 
      temperature: 0.7,
      max_tokens: 1000,
    });

    const assistantMessage = completion.choices[0].message.content;

    if (!assistantMessage) {
      return NextResponse.json({ error: 'Pas de réponse de l\'IA' }, { status: 500 });
    }

    // 5. Sauvegarder la réponse de l'assistant
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

    // 6. Mettre à jour le titre de la conversation (premier message)
    if (history && history.length <= 2) {
      const title = message.slice(0, 50) + (message.length > 50 ? '...' : '');
      await supabase
        .from('conversations')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', conversationId);
    } else {
      // Juste mettre à jour updated_at
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