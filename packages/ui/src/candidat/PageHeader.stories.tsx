import type { Meta, StoryObj } from '@storybook/react';
import PageHeader from './PageHeader';

const meta: Meta<typeof PageHeader> = {
  title: 'Candidat/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: 'Prépare ton entretien',
    subtitle: 'Quelques conseils pour réussir ton échange.',
    showBackButton: false,
  },
};
