import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrientationState {
    answers: {
        step1: { freeText: string; tags: string[] };
        step2: { crea: number; social: number; data: number; intl: number };
        step3: string[];
        step4: string;
        step5: string[];
        step6: string[];
    };
    results: any[];
    aiAnalysis: string | null;
    setAnswers: (step: string, value: any) => void;
    setResults: (results: any[]) => void;
    setAiAnalysis: (analysis: string | null) => void;
    resetQuiz: () => void;
    generateMistralPrompt: () => string;
}

const initialAnswers = {
    step1: { freeText: '', tags: [] },
    step2: { crea: 1, social: 1, data: 1, intl: 1 },
    step3: [],
    step4: '',
    step5: [],
    step6: []
};

export const useOrientationStore = create<OrientationState>()(
    persist(
        (set, get) => ({
            answers: initialAnswers,
            results: [],
            aiAnalysis: null,
            setAnswers: (step, value) =>
                set((state) => ({
                    answers: { ...state.answers, [step]: value }
                })),
            setResults: (results) => set({ results }),
            setAiAnalysis: (aiAnalysis) => set({ aiAnalysis }),
            resetQuiz: () => set({ answers: initialAnswers, results: [], aiAnalysis: null }),
            generateMistralPrompt: () => {
                const { answers } = get();
                return `
FACTEURS DE DÉCISION DU CANDIDAT :
- Passion/Intérêt : "${answers.step1.freeText}"
- Mots-clés identifiés : [${answers.step1.tags.join(', ')}]
- Style préféré : Créativité=${answers.step2.crea}/3, Relationnel=${answers.step2.social}/3, Analyse=${answers.step2.data}/3, International=${answers.step2.intl}/3
- Souhaits spécifiques : ${answers.step3.length > 0 ? answers.step3.join(', ') : 'Aucun'}
- Niveau actuel : ${answers.step4}
- Contraintes fortes : ${answers.step5.length > 0 ? answers.step5.join(', ') : 'Aucune'}
- Critère à favoriser : ${answers.step6.length > 0 ? answers.step6.join(', ') : 'Aucun'}

CONSIGNE :
Analyse ces données pour recommander les 3 formations les plus pertinentes parmi la liste officielle. Explique ton raisonnement pour chaque choix en faisant le lien avec ses passions ou son style de travail.
`.trim();
            }
        }),
        {
            name: 'orientation-storage'
        }
    )
);
