import { NextResponse } from 'next/server';

// API Route pour gérer les soumissions de formulaire
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prenom, nom, email, date, message } = body;

    // Validation
    if (!prenom || !nom || !email || !date) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    // TODO: Envoyer un email via service (SendGrid, Mailgun, etc.)
    // TODO: Enregistrer dans la base de données
    // TODO: Envoyer une notification

    console.log('Nouvelle demande de visite:', {
      prenom,
      nom,
      email,
      date,
      message
    });

    // Simuler un délai
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      { 
        success: true,
        message: 'Demande enregistrée avec succès'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}