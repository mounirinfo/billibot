import type { Meta, StoryObj } from '@storybook/react';
import QuizOption from './QuizOption';

const meta: Meta<typeof QuizOption> = {
  title: 'Candidat/QuizOption',
  component: QuizOption,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof QuizOption>;

export const Selected: Story = {
  args: {
    emoji: '📚',
    label: 'J\'aime apprendre avec des livres',
    isSelected: true,
    onClick: () => undefined,
  },
};

export const Unselected: Story = {
  args: {
    emoji: '🎧',
    label: 'Je préfère écouter des podcasts',
    isSelected: false,
    onClick: () => undefined,
  },
};
