// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, role, full_name, email, avatar_url, phone, bio, grade_level, subjects, account_status, created_at')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // ✅ Response complète avec le rôle ET le statut
    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,                    
        account_status: profile.account_status, 
        avatar_url: profile.avatar_url,
        phone: profile.phone,
        bio: profile.bio,
        grade_level: profile.grade_level,
        subjects: profile.subjects,
        created_at: profile.created_at,
      },
    });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}