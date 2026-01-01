import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import MessageInput from './MessageInput';

const meta: Meta<typeof MessageInput> = {
  title: 'Chat/MessageInput',
  component: MessageInput,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof MessageInput>;

export const Default: Story = {
  render: () => {
    const [message, setMessage] = useState('Bonjour, peux-tu m\'aider ?');
    return (
      <MessageInput
        message={message}
        sending={false}
        onMessageChange={setMessage}
        onSendMessage={() => undefined}
      />
    );
  },
};

export const Sending: Story = {
  render: () => (
    <MessageInput
      message="Un instant..."
      sending
      onMessageChange={() => undefined}
      onSendMessage={() => undefined}
    />
  ),
};
