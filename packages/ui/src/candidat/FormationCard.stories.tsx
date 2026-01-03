import type { Meta, StoryObj } from '@storybook/react';
import FormationCard from './FormationCard';

const meta: Meta<typeof FormationCard> = {
  title: 'Candidat/FormationCard',
  component: FormationCard,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof FormationCard>;

export const Default: Story = {
  args: {
    name: 'BUT INFO',
    fullName: 'Bachelor Universitaire de Technologie Informatique',
    emoji: '💻',
    description: 'Une formation orientée pratique pour maîtriser le développement web.',
    color: '#2D9B94',
    matchPercentage: 92,
  },
};
