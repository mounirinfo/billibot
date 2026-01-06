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
          Tu es BilliBot, un expert en orientation. Voici le profil de l'étudiant :
          - Ce qu'il aime : ${answers.step1.freeText} (Tags: ${answers.step1.tags.join(', ')})
          - Style : Créa(${answers.step2.crea}), Social(${answers.step2.social}), Data(${answers.step2.data}), Intl(${answers.step2.intl})
          - Souhaits : ${answers.step3.join(', ')}
          - Niveau : ${answers.step4}
          - Contraintes : ${answers.step5.join(', ')}
          - Boosts : ${answers.step6.join(', ')}
          
          Propose une analyse personnalisée et encourageante.
        `.trim();
            }
        }),
        {
            name: 'orientation-storage'
        }
    )
);
