import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Récupérer toutes les conversations de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await (await supabase).auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer les conversations
    const { data, error } = await (await supabase)
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      conversations: data || [],
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle conversation
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await (await supabase).auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Créer la conversation
    const { data, error } = await (await supabase)
      .from('conversations')
      .insert({
        user_id: user.id,
        title: 'Nouvelle conversation',
      })
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      conversation: data,
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la conversation:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PATCH - Mettre à jour le titre d'une conversation
export async function PATCH(request: NextRequest) {
  try {
    const { id, title } = await request.json();

    if (!id || !title) {
      return NextResponse.json(
        { error: 'ID et titre requis' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await (await supabase).auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Mettre à jour la conversation
    const { data, error } = await (await supabase)
      .from('conversations')
      .update({
        title,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      conversation: data,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la conversation:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une conversation
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await (await supabase).auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Supprimer la conversation (les messages seront supprimés en cascade)
    const { error } = await (await supabase)
      .from('conversations')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Conversation supprimée',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la conversation:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}