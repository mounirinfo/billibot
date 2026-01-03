import type { Meta, StoryObj } from '@storybook/react';
import SchoolIcon from '@mui/icons-material/School';
import ModuleCard from './ModuleCard';

const meta: Meta<typeof ModuleCard> = {
  title: 'Candidat/ModuleCard',
  component: ModuleCard,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ModuleCard>;

export const Default: Story = {
  args: {
    icon: SchoolIcon,
    title: 'Orientation',
    description: 'Découvre des parcours adaptés à ton profil.',
    color: '#2D9B94',
    gradient: 'linear-gradient(135deg, #2D9B94 0%, #34B3A8 100%)',
    onClick: () => undefined,
  },
};
