import type { Meta, StoryObj } from '@storybook/react';
import TimerCircle from './TimerCircle';

const meta: Meta<typeof TimerCircle> = {
  title: 'Candidat/TimerCircle',
  component: TimerCircle,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof TimerCircle>;

export const Default: Story = {
  args: {
    duration: 60,
    title: 'Minute Express',
    description: 'Prépare ta réponse en une minute.',
    color: '#2D9B94',
  },
};
