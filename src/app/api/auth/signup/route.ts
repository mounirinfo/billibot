// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      email, 
      password, 
      full_name, 
      role, 
      phone, 
      school_id, 
      grade_level, 
      subjects, 
      bio 
    } = body;

    // ✅ Validation des champs requis
    if (!email || !password || !full_name || !role) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Champs requis manquants',
          details: {
            email: !email ? 'Email requis' : null,
            password: !password ? 'Mot de passe requis' : null,
            full_name: !full_name ? 'Nom complet requis' : null,
            role: !role ? 'Rôle requis' : null,
          }
        },
        { status: 400 }
      );
    }

    // ✅ Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Format d\'email invalide',
          details: {
            email: 'Veuillez entrer un email valide'
          }
        },
        { status: 400 }
      );
    }

    // ✅ Validation de la longueur du mot de passe
    if (password.length < 6) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Mot de passe trop court',
          details: {
            password: 'Le mot de passe doit contenir au moins 6 caractères'
          }
        },
        { status: 400 }
      );
    }

    // ✅ Validation du rôle
    const validRoles = ['student', 'teacher', 'parent', 'school_admin', 'admin','candidat'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Rôle invalide',
          details: {
            role: `Le rôle doit être l'un des suivants: ${validRoles.join(', ')}`
          }
        },
        { status: 400 }
      );
    }

    // ✅ Validation du téléphone (si fourni)
    if (phone) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Format de téléphone invalide',
            details: {
              phone: 'Le numéro de téléphone doit contenir 10 chiffres'
            }
          },
          { status: 400 }
        );
      }
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

    // ✅ Vérifier si l'email existe déjà
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Cet email est déjà utilisé',
          details: {
            email: 'Un compte existe déjà avec cet email. Veuillez vous connecter ou utiliser un autre email.'
          }
        },
        { status: 409 } // 409 Conflict
      );
    }

    // ✅ Créer l'utilisateur dans auth.users
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    });

    if (authError) {
      console.error('Erreur Supabase signup:', authError);
      
      // Gestion des erreurs spécifiques de Supabase
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Cet email est déjà utilisé',
            details: {
              email: 'Un compte existe déjà avec cet email'
            }
          },
          { status: 409 }
        );
      }

      if (authError.message.includes('Password should be at least')) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Mot de passe trop court',
            details: {
              password: 'Le mot de passe doit contenir au moins 6 caractères'
            }
          },
          { status: 400 }
        );
      }

      if (authError.message.includes('invalid email')) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Email invalide',
            details: {
              email: 'Le format de l\'email est invalide'
            }
          },
          { status: 400 }
        );
      }

      if (authError.message.includes('rate limit')) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Trop de tentatives',
            details: {
              general: 'Vous avez effectué trop de tentatives. Veuillez réessayer dans quelques minutes.'
            }
          },
          { status: 429 } // 429 Too Many Requests
        );
      }

      // Erreur générique
      return NextResponse.json(
        { 
          success: false,
          error: 'Erreur lors de la création du compte',
          details: {
            general: authError.message
          }
        },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Erreur lors de la création du compte',
          details: {
            general: 'Impossible de créer le compte. Veuillez réessayer.'
          }
        },
        { status: 500 }
      );
    }

    // ✅ Créer le profil dans profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name,
        role,
        phone: phone || null,
        school_id: school_id || null,
        grade_level: grade_level || null,
        subjects: subjects || null,
        bio: bio || null,
        account_status: 'pending',
      });

    if (profileError) {
      console.error('Erreur création profil:', profileError);
      
      // ⚠️ Supprimer l'utilisateur auth si le profil échoue
      try {
        await supabase.auth.admin.deleteUser(authData.user.id);
      } catch (deleteError) {
        console.error('Erreur suppression utilisateur:', deleteError);
      }

      // Vérifier si c'est une contrainte unique
      if (profileError.message.includes('unique') || profileError.code === '23505') {
        return NextResponse.json(
          { 
            success: false,
            error: 'Cet email est déjà utilisé',
            details: {
              email: 'Un profil existe déjà avec cet email'
            }
          },
          { status: 409 }
        );
      }

      // Vérifier si c'est une contrainte de clé étrangère
      if (profileError.message.includes('foreign key') || profileError.code === '23503') {
        return NextResponse.json(
          { 
            success: false,
            error: 'Données invalides',
            details: {
              school_id: 'L\'école sélectionnée n\'existe pas'
            }
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Erreur lors de la création du profil',
          details: {
            general: 'Une erreur est survenue lors de la création de votre profil. Veuillez réessayer.'
          }
        },
        { status: 500 }
      );
    }

    // ✅ Succès - Response sécurisée
    return NextResponse.json(
      {
        success: true,
        message: 'Inscription réussie ! Votre compte est en attente de validation par un administrateur.',
        user: {
          id: authData.user.id,
          full_name,
        },
        account_status: 'pending',
        redirectTo: '/pending',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erreur lors de l\'inscription:', error);
    
    // Gestion des erreurs JSON
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
        error: 'Une erreur est survenue',
        details: {
          general: 'Une erreur inattendue s\'est produite. Veuillez réessayer.'
        }
      },
      { status: 500 }
    );
  }
}