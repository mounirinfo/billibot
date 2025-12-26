import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server'; // ← Changement ici

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const supabase = await createClient(); // ← await ajouté

    // Connexion
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Erreur Supabase login:', error);
      
      if (error.message.includes('Invalid login credentials')) {
        return NextResponse.json(
          { error: 'Email ou mot de passe incorrect' },
          { status: 401 }
        );
      }

      if (error.message.includes('Email not confirmed')) {
        return NextResponse.json(
          { error: 'Veuillez confirmer votre email avant de vous connecter' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: 'Connexion réussie',
        user: data.user,
        session: data.session,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la connexion' },
      { status: 500 }
    );
  }
}