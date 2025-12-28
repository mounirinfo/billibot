import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
console.log(" 000000000 ")
    const { data, error } = await supabase
      .from('schools')
      .select('id, name, type, city, school_group_id')
      .order('name', { ascending: true });
      console.log("11111111111 ", JSON.stringify(data))
      console.log("22222222222 ", JSON.stringify(error))

    if (error) {
      console.error('Erreur Supabase:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ schools: data ?? [] });
  } catch (error) {
    console.error('Erreur lors de la récupération des écoles:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
