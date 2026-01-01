'use client';

import React from 'react';
import { Box, TextField, IconButton, Paper, CircularProgress } from '@mui/material';
import { Send } from '@mui/icons-material';

interface MessageInputProps {
  message: string;
  sending: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

export default function MessageInput({
  message,
  sending,
  onMessageChange,
  onSendMessage,
}: MessageInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        bgcolor: 'white',
        borderTop: '2px solid #E0F2F1',
        boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
      }}
    >
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 1.5,
            p: 1.5,
            border: '2px solid',
            borderColor: message ? '#2D9B94' : '#E0F2F1',
            borderRadius: 4,
            bgcolor: '#FAFAFA',
            transition: 'all 0.3s ease',
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Pose-moi une question..."
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            disabled={sending}
            onKeyPress={handleKeyPress}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'transparent',
                '& fieldset': { border: 'none' },
              },
            }}
          />
          <IconButton
            onClick={onSendMessage}
            disabled={!message.trim() || sending}
            sx={{
              bgcolor: message.trim() ? '#2D9B94' : '#E0E0E0',
              color: 'white',
              width: 48,
              height: 48,
              '&:hover': {
                bgcolor: message.trim() ? '#26857E' : '#BDBDBD',
                transform: 'scale(1.05)',
              },
              '&.Mui-disabled': {
                bgcolor: '#E0E0E0',
                color: '#9E9E9E',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {sending ? <CircularProgress size={24} color="inherit" /> : <Send />}
          </IconButton>
        </Paper>
      </Box>
    </Box>
  );
}