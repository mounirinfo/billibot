// app/api/auth/logout/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Créer le client Supabase
    const supabase = await createClient();

    // Déconnexion Supabase côté serveur
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Erreur lors de la déconnexion Supabase:', error);
      // On continue même en cas d'erreur pour nettoyer les cookies
    }

    // Créer la réponse
    const response = NextResponse.json(
      { message: 'Déconnexion réussie' },
      { status: 200 }
    );

    // Récupérer tous les cookies
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    // Supprimer TOUS les cookies existants
    allCookies.forEach((cookie) => {
      response.cookies.set(cookie.name, '', {
        path: '/',
        maxAge: 0,
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    });

    // 🔐 Supprimer explicitement les cookies Supabase (par sécurité)
    const supabaseCookies = [
      'sb-access-token',
      'sb-refresh-token',
      'sb-auth-token',
      'sb-provider-token',
      'sb-provider-refresh-token',
    ];

    supabaseCookies.forEach((cookieName) => {
      response.cookies.set(cookieName, '', {
        path: '/',
        maxAge: 0,
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    });

    // 🔐 Supprimer les cookies avec le préfixe de votre projet Supabase
    // Format: sb-<project-ref>-auth-token
    // Exemple: sb-abcdefghijklmnop-auth-token
    const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0];
    
    if (projectRef) {
      const projectSpecificCookies = [
        `sb-${projectRef}-auth-token`,
        `sb-${projectRef}-auth-token-code-verifier`,
      ];

      projectSpecificCookies.forEach((cookieName) => {
        response.cookies.set(cookieName, '', {
          path: '/',
          maxAge: 0,
          expires: new Date(0),
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
      });
    }

    // 🔐 Supprimer les cookies de session Next.js (si utilisés)
    response.cookies.set('next-auth.session-token', '', {
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });

    // 🔐 Headers de sécurité additionnels
    response.headers.set('Clear-Site-Data', '"cache", "cookies", "storage"');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    return response;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    
    // Même en cas d'erreur, on tente de nettoyer les cookies
    const response = NextResponse.json(
      { error: 'Une erreur est survenue lors de la déconnexion' },
      { status: 500 }
    );

    // Nettoyage de secours
    try {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();
      
      allCookies.forEach((cookie) => {
        response.cookies.set(cookie.name, '', {
          path: '/',
          maxAge: 0,
          expires: new Date(0),
        });
      });
    } catch (cookieError) {
      console.error('Erreur lors du nettoyage des cookies:', cookieError);
    }

    return response;
  }
}