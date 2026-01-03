import type { Meta, StoryObj } from '@storybook/react';
import MessageList from './MessageList';

const meta: Meta<typeof MessageList> = {
  title: 'Chat/MessageList',
  component: MessageList,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof MessageList>;

export const WithMessages: Story = {
  args: {
    sending: false,
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: 'Salut ! Je suis BilliBot. Comment puis-je t\'aider ?',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        role: 'user',
        content: 'J\'ai besoin d\'aide en maths.',
        created_at: new Date().toISOString(),
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    sending: false,
    messages: [],
  },
};

export const Sending: Story = {
  args: {
    sending: true,
    messages: [
      {
        id: '1',
        role: 'user',
        content: 'Peux-tu m\'expliquer les fractions ?',
        created_at: new Date().toISOString(),
      },
    ],
  },
};
