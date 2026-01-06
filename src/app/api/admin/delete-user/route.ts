// app/api/admin/delete-user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // 1. Vérifier l'authentification
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        // 2. Vérifier le rôle de l'administrateur
        const { data: adminProfile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (adminProfile?.role !== 'super_admin') {
            return NextResponse.json({ error: 'Accès refusé. Droits Super Admin requis.' }, { status: 403 });
        }

        // 3. Récupérer l'ID de l'utilisateur à supprimer
        const { userId } = await request.json();
        if (!userId) {
            return NextResponse.json({ error: 'ID utilisateur requis' }, { status: 400 });
        }

        // 4. Supprimer le profil
        // Note: Dans une vraie app, il faudrait aussi supprimer l'utilisateur dans Auth (via Service Role)
        // Ici on se concentre sur la gestion de la base de données métiers.
        const { error: deleteError } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);

        if (deleteError) {
            console.error('Erreur Supabase lors de la suppression:', deleteError);
            return NextResponse.json({ error: deleteError.message }, { status: 400 });
        }

        return NextResponse.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error: any) {
        console.error('Erreur serveur lors de la suppression:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
