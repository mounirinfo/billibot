import type { Meta, StoryObj } from '@storybook/react';
import type { User } from '@supabase/supabase-js';
import Sidebar from './Sidebar';

const mockUser = {
  id: 'user-1',
  email: 'eleve@billibot.fr',
  user_metadata: { full_name: 'Camille Dupont' },
} as User;

const meta: Meta<typeof Sidebar> = {
  title: 'Chat/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      if (typeof window !== 'undefined') {
        window.fetch = async () =>
          new Response(
            JSON.stringify({
              profile: {
                role: 'student',
                full_name: 'Camille Dupont',
                email: 'eleve@billibot.fr',
                avatar_url: null,
              },
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          );
      }
      return <Story />;
    },
  ],
};

export default meta;

type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {
    user: mockUser,
    currentConversation: '1',
    loading: false,
    conversations: [
      {
        id: '1',
        title: 'Devoirs de maths',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Cours d\'histoire',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    onCreateConversation: () => undefined,
    onSelectConversation: () => undefined,
    onDeleteConversation: () => undefined,
  },
};
