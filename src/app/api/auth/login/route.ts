// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // ✅ Log pour debug
    console.log('📥 Body reçu:', body);

    const { email, password } = body;

    // ✅ Validation
    if (!email || !password) {
      console.log('❌ Champs manquants:', { email: !!email, password: !!password });
      return NextResponse.json(
        { 
          success: false,
          error: 'Email et mot de passe requis',
          details: {
            email: !email ? 'Email requis' : null,
            password: !password ? 'Mot de passe requis' : null,
          }
        },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

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

    // Connexion
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Erreur Supabase login:', error);

      if (error.message.includes('Invalid login credentials')) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Email ou mot de passe incorrect',
            details: {
              general: 'Vérifiez vos identifiants'
            }
          },
          { status: 401 }
        );
      }

      if (error.message.includes('Email not confirmed')) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Email non confirmé',
            details: {
              general: 'Veuillez confirmer votre email avant de vous connecter'
            }
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { 
          success: false,
          error: error.message,
          details: {
            general: error.message
          }
        },
        { status: 401 }
      );
    }

    if (!data.session || !data.user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Session non créée',
          details: {
            general: 'Impossible de créer la session'
          }
        },
        { status: 401 }
      );
    }

    // Récupérer le profil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, account_status, full_name, avatar_url')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('❌ Erreur profil:', profileError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Erreur lors de la récupération du profil',
          details: {
            general: 'Impossible de charger votre profil'
          }
        },
        { status: 500 }
      );
    }

    // Déterminer la redirection
    let redirectTo = '/chat';

    if (profile.account_status === 'rejected') {
      redirectTo = '/rejected';
    } else if (profile.account_status === 'pending') {
      redirectTo = '/pending';
    } else if (profile.account_status === 'approved') {
      if (profile.role === 'super_admin') {
        redirectTo = '/superadmin/pending-users';
      } else if (profile.role === 'admin') {
        redirectTo = '/admin/dashboard';
      } else {
        redirectTo = '/chat';
      }
    }

    console.log('✅ Connexion réussie:', { 
      user_id: data.user.id, 
      role: profile.role, 
      status: profile.account_status,
      redirectTo 
    });

    // Response sécurisée
    return NextResponse.json(
      {
        success: true,
        message: 'Connexion réussie',
        user: {
          id: data.user.id,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
        },
        profile: {
          role: profile.role,
          account_status: profile.account_status,
        },
        redirectTo,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Erreur lors de la connexion:', error);
    
    // Erreur de parsing JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Données invalides',
          details: {
            general: 'Le format des données envoyées est invalide'
          }
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Une erreur est survenue lors de la connexion',
        details: {
          general: error.message || 'Erreur serveur'
        }
      },
      { status: 500 }
    );
  }
}