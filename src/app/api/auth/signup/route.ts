import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { 
      email, 
      password, 
      fullName, 
      phone, 
      role, 
      schoolId, 
      schoolGroupId,
      gradeLevel,
      subjects 
    } = await request.json();

    // Validation
    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { error: 'Les champs email, mot de passe, nom et rôle sont requis' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Validation du rôle
    const validRoles = ['student', 'parent', 'teacher', 'school_admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Rôle invalide' },
        { status: 400 }
      );
    }

    // Un établissement est requis (sauf pour super_admin)
    if (!schoolId && role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Veuillez sélectionner un établissement' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Créer le compte Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error('Erreur Supabase signup:', authError);
      
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Erreur lors de la création du compte' },
        { status: 500 }
      );
    }

    // Créer manuellement le profil dans la table profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email,
        full_name: fullName,
        phone: phone || null,
        role: role,
        school_id: schoolId || null,
        school_group_id: schoolGroupId || null,
        grade_level: gradeLevel || null,
        subjects: subjects || [],
        account_status: 'pending',
      });

    if (profileError) {
      console.error('Erreur mise à jour profil:', profileError);
      // On ne bloque pas l'inscription, juste un log
    }

    return NextResponse.json(
      {
        message: 'Compte créé avec succès ! Votre compte est en attente de validation.',
        user: authData.user,
        requiresValidation: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    );
  }
}