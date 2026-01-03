export const niveaux = [
    { id: '2nde', label: 'Seconde Générale et Technologique', emoji: '🌱' },
    { id: '1ere', label: 'Première Générale', emoji: '🌿' },
    { id: 'term', label: 'Terminale Générale', emoji: '🎓' },
];

export const specialites = [
    { id: 'maths', label: 'Mathématiques', emoji: '📐', icon: 'Calculate' },
    { id: 'physique', label: 'Physique-Chimie', emoji: '🧪', icon: 'Science' },
    { id: 'svt', label: 'SVT', emoji: '🧬', icon: 'Biotech' },
    { id: 'ses', label: 'Sc. Éco. & Sociales', emoji: '📊', icon: 'Leaderboard' },
    { id: 'hggsp', label: 'Hist-Géo, Géopolitique', emoji: '🌍', icon: 'Public' },
    { id: 'llce', label: 'LLCE Anglais', emoji: '🇬🇧', icon: 'Language' },
    { id: 'nsi', label: 'Numérique & Si. Info.', emoji: '💻', icon: 'Computer' },
    { id: 'si', label: 'Sc. de l\'Ingénieur', emoji: '⚙️', icon: 'Engineering' },
];

export const programmes: Record<string, Record<string, string[]>> = {
    '2nde': {
        'maths': [
            'Nombres et calculs',
            'Géométrie (Vecteurs, Droites)',
            'Fonctions de référence',
            'Statistiques et probabilités',
            'Algorithmique et programmation'
        ],
        'physique': [
            'Constitution et transformations de la matière',
            'Mouvement et interactions',
            'Ondes et signaux',
            'L\'énergie : conversions et transferts'
        ],
        'svt': [
            'La Terre, la vie et l\'organisation du vivant',
            'Les enjeux contemporains de la planète',
            'Le corps humain et la santé'
        ]
    },
    '1ere': {
        'maths': [
            'Dérivation',
            'Suites numériques',
            'Fonction exponentielle',
            'Trigonométrie',
            'Produit scalaire',
            'Géométrie repérée',
            'Probabilités conditionnelles',
            'Variables aléatoires'
        ],
        'physique': [
            'Constitution et transformations de la matière',
            'Mouvement et interactions',
            'L\'énergie : conversions et transferts',
            'Ondes et signaux'
        ],
        'ses': [
            'Le fonctionnement des marchés',
            'Le financement de l\'économie',
            'La monnaie et le financement',
            'Socialisation et construction des identités',
            'Les liens sociaux',
            'Voter : une affaire individuelle ou collective ?'
        ]
    },
    'term': {
        'maths': [
            'Limites de fonctions',
            'Continuité',
            'Dérivation et convexité',
            'Fonction logarithme népérien',
            'Primitives et équations différentielles',
            'Intégration',
            'Combinatoire et dénombrement',
            'Loi binomiale et grands nombres',
            'Géométrie dans l\'espace'
        ],
        'physique': [
            'Constitution et transformations de la matière',
            'Mouvement et interactions',
            'L\'énergie',
            'Ondes et signaux'
        ],
        'ses': [
            'Croissance économique',
            'Commerce international',
            'Lutte contre le chômage',
            'Engagement politique',
            'Structure sociale et inégalités',
            'Action publique et environnement'
        ]
    }
};

export const etablissements = [
    { id: 'lyc-louis-le-grand', name: 'Lycée Louis-le-Grand', city: 'Paris' },
    { id: 'lyc-henri-4', name: 'Lycée Henri IV', city: 'Paris' },
    { id: 'lyc-saint-louis', name: 'Lycée Saint-Louis', city: 'Paris' },
    { id: 'lyc-fénelon', name: 'Lycée Fénelon', city: 'Paris' },
    { id: 'lyc-condorcet', name: 'Lycée Condorcet', city: 'Paris' },
    { id: 'lyc-charlemagne', name: 'Lycée Charlemagne', city: 'Paris' },
    { id: 'lyc-janson', name: 'Lycée Janson-de-Sailly', city: 'Paris' },
    { id: 'lyc-hoche', name: 'Lycée Hoche', city: 'Versailles' },
    { id: 'lyc-lakanal', name: 'Lycée Lakanal', city: 'Sceaux' },
    { id: 'lyc-pasteur', name: 'Lycée Pasteur', city: 'Neuilly-sur-Seine' },
    { id: 'lyc-fermat', name: 'Lycée Pierre de Fermat', city: 'Toulouse' },
    { id: 'lyc-bellevue', name: 'Lycée Bellevue', city: 'Toulouse' },
    { id: 'lyc-du-parc', name: 'Lycée du Parc', city: 'Lyon' },
    { id: 'lyc-ampere', name: 'Lycée Ampère', city: 'Lyon' },
    { id: 'lyc-lazaristes', name: 'Lycée Aux Lazaristes', city: 'Lyon' },
    { id: 'lyc-thiers', name: 'Lycée Thiers', city: 'Marseille' },
    { id: 'lyc-perier', name: 'Lycée Périer', city: 'Marseille' },
    { id: 'lyc-massena', name: 'Lycée Masséna', city: 'Nice' },
    { id: 'lyc-chateaubriand', name: 'Lycée Chateaubriand', city: 'Rennes' },
    { id: 'lyc-clemenceau', name: 'Lycée Clemenceau', city: 'Nantes' },
    { id: 'lyc-guisthau', name: 'Lycée Guist\'hau', city: 'Nantes' },
    { id: 'lyc-montaigne', name: 'Lycée Montaigne', city: 'Bordeaux' },
    { id: 'lyc-magendie', name: 'Lycée Magendie', city: 'Bordeaux' },
    { id: 'lyc-champollion', name: 'Lycée Champollion', city: 'Grenoble' },
    { id: 'lyc-kleber', name: 'Lycée Kléber', city: 'Strasbourg' },
    { id: 'lyc-fustel', name: 'Lycée Fustel de Coulanges', city: 'Strasbourg' },
    { id: 'lyc-fabert', name: 'Lycée Fabert', city: 'Metz' },
    { id: 'lyc-poincare', name: 'Lycée Henri Poincaré', city: 'Nancy' },
    { id: 'lyc-carnot-dijon', name: 'Lycée Carnot', city: 'Dijon' },
    { id: 'lyc-pothier', name: 'Lycée Pothier', city: 'Orléans' },
    { id: 'lyc-faidherbe', name: 'Lycée Faidherbe', city: 'Lille' },
    { id: 'lyc-wallon', name: 'Lycée Henri Wallon', city: 'Valenciennes' },
    { id: 'lyc-corneille', name: 'Lycée Pierre Corneille', city: 'Rouen' },
    { id: 'lyc-malherbe', name: 'Lycée Malherbe', city: 'Caen' },
    { id: 'lyc-joffre', name: 'Lycée Joffre', city: 'Montpellier' },
    { id: 'lyc-cezanne', name: 'Lycée Paul Cézanne', city: 'Aix-en-Provence' },
    { id: 'lyc-daudet', name: 'Lycée Alphonse Daudet', city: 'Nîmes' },
    { id: 'lyc-berthelot', name: 'Lycée Marcelin Berthelot', city: 'Saint-Maur-des-Fossés' },
    { id: 'lyc-michelet', name: 'Lycée Michelet', city: 'Vanves' },
    { id: 'lyc-dumont', name: 'Lycée Dumont d\'Urville', city: 'Toulon' },
    { id: 'lyc-international', name: 'Lycée International', city: 'Saint-Germain-en-Laye' },
    { id: 'lyc-centre-international', name: 'Centre International de Valbonne', city: 'Valbonne' }
];
