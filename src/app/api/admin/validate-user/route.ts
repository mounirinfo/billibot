import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, action, rejectionReason } = await request.json();

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'userId et action sont requis' },
        { status: 400 }
      );
    }

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json(
        { error: 'Action invalide' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer le profil de l'admin
    const { data: adminProfile, error: adminError } = await supabase
      .from('profiles')
      .select('role, school_id')
      .eq('id', user.id)
      .single();

    if (adminError || !adminProfile) {
      return NextResponse.json(
        { error: 'Profil non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier les permissions
    if (adminProfile.role !== 'super_admin' && adminProfile.role !== 'school_admin') {
      return NextResponse.json(
        { error: 'Accès refusé' },
        { status: 403 }
      );
    }

    // Récupérer l'utilisateur à valider
    const { data: targetUser, error: targetError } = await supabase
      .from('profiles')
      .select('school_id, account_status')
      .eq('id', userId)
      .single();

    if (targetError || !targetUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Si admin d'école, vérifier qu'il valide un user de son école
    if (adminProfile.role === 'school_admin' && targetUser.school_id !== adminProfile.school_id) {
      return NextResponse.json(
        { error: 'Vous ne pouvez valider que les utilisateurs de votre école' },
        { status: 403 }
      );
    }

    // Mettre à jour le statut
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        account_status: newStatus,
        validated_by: user.id,
        validated_at: new Date().toISOString(),
        rejection_reason: action === 'reject' ? rejectionReason : null,
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Erreur mise à jour:', updateError);
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      );
    }

    // TODO: Envoyer un email à l'utilisateur
    
    return NextResponse.json({
      message: action === 'approve' 
        ? 'Utilisateur validé avec succès' 
        : 'Inscription rejetée',
    });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}