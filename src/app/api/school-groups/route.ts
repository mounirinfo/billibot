import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('school_groups')
      .select('id, name, description')
      .order('name', { ascending: true });

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      schoolGroups: data || [],
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des groupes scolaires:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}