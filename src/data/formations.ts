export interface Formation {
    id: string;
    name: string;
    fullName: string;
    emoji: string;
    description: string;
    weights: {
        crea: number; // 1-3
        social: number; // 1-3
        data: number; // 1-3
        intl: number; // 1-3
    };
    tags: string[];
    badges: string[];
    color: string;
}

export const allFormations: Formation[] = [
    {
        id: 'bts_mco',
        name: 'BTS MCO',
        fullName: 'Management Commercial Opérationnel',
        emoji: '🏪',
        description: "Expert de la relation client et du management d'unité commerciale.",
        weights: { crea: 1, social: 3, data: 1, intl: 1 },
        tags: ['convaincre', 'organiser'],
        badges: ['Management', 'Relation Client', 'Commerce'],
        color: '#2D9B94'
    },
    {
        id: 'bts_ndrc',
        name: 'BTS NDRC',
        fullName: 'Négociation et Digitalisation de la Relation Client',
        emoji: '💼',
        description: 'Le futur de la vente : digital, réseaux sociaux et négociation terrain.',
        weights: { crea: 2, social: 3, data: 2, intl: 1 },
        tags: ['convaincre', 'analyser'],
        badges: ['Digital', 'Négociation', 'Vente'],
        color: '#4A90E2'
    },
    {
        id: 'bts_com',
        name: 'BTS COM',
        fullName: 'Communication',
        emoji: '📱',
        description: 'Création de campagnes, réseaux sociaux et stratégie événementielle.',
        weights: { crea: 3, social: 3, data: 1, intl: 1 },
        tags: ['creer', 'organiser'],
        badges: ['Créativité', 'Médias', 'Événementiel'],
        color: '#FF6B9D'
    },
    {
        id: 'bts_sam',
        name: 'BTS SAM',
        fullName: "Support à l'Action Managériale",
        emoji: '🎯',
        description: 'Le bras droit du manager : coordination, RH et projets internationaux.',
        weights: { crea: 1, social: 2, data: 3, intl: 2 },
        tags: ['organiser', 'analyser'],
        badges: ['RH', 'Coordination', 'International'],
        color: '#9C27B0'
    },
    {
        id: 'bts_ci',
        name: 'BTS CI',
        fullName: 'Commerce International',
        emoji: '🌍',
        description: 'Import-export, marketing mondial et négociation en langues étrangères.',
        weights: { crea: 1, social: 2, data: 2, intl: 3 },
        tags: ['international', 'convaincre'],
        badges: ['Langues', 'Export', 'Geopolitique'],
        color: '#E91E63'
    },
    {
        id: 'bts_gpme',
        name: 'BTS GPME',
        fullName: 'Gestion de la PME',
        emoji: '📊',
        description: 'Gérer tous les aspects d\'une petite entreprise : administratif, compta, RH.',
        weights: { crea: 1, social: 2, data: 3, intl: 1 },
        tags: ['organiser', 'analyser'],
        badges: ['Polyvalence', 'Gestion', 'Finance'],
        color: '#607D8B'
    },
    {
        id: 'bachelor_business',
        name: 'Bachelor Business',
        fullName: 'Bachelor in Business & Management',
        emoji: '🎓',
        description: 'Une vision 360 du monde des affaires avec une forte dimension stratégie.',
        weights: { crea: 2, social: 2, data: 2, intl: 2 },
        tags: ['organiser', 'convaincre', 'analyser'],
        badges: ['Strategie', 'Leadership', 'Bac+3'],
        color: '#FFD93D'
    }
];
