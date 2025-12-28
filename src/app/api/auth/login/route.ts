// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    // ✅ Créer le client Supabase avec gestion automatique des cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              console.error('Error setting cookie:', error);
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              console.error('Error removing cookie:', error);
            }
          },
        },
      }
    );

    // ✅ Connexion avec Supabase
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
        { status: 401 }
      );
    }

    if (!data.session || !data.user) {
      return NextResponse.json(
        { error: 'Session non créée' },
        { status: 401 }
      );
    }

    // 🔍 Récupérer le profil utilisateur pour vérifier le statut et le rôle
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, account_status')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Erreur lors de la récupération du profil:', profileError);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du profil' },
        { status: 500 }
      );
    }

    // ✅ Déterminer la page de redirection selon le rôle et le statut
    let redirectTo = '/chat'; // Par défaut

    if (profile.account_status === 'rejected') {
      redirectTo = '/rejected';
    } else if (profile.account_status === 'pending') {
      redirectTo = '/pending';
    } else if (profile.account_status === 'approved') {
      // Redirection selon le rôle
      if (profile.role === 'super_admin') {
        redirectTo = '/superadmin/pending-users';
      } else if (profile.role === 'admin') {
        redirectTo = '/admin/dashboard';
      } else {
        // student, teacher et autres → /chat
        redirectTo = '/chat';
      }
    }

    return NextResponse.json(
      {
        message: 'Connexion réussie',
        user: data.user,
        profile: {
          role: profile.role,
          account_status: profile.account_status,
        },
        redirectTo,
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