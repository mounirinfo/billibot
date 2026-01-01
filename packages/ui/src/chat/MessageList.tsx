'use client';

import React, { useRef, useEffect } from 'react';
import {
  Box,
  Avatar,
  Paper,
  Typography,
  Chip,
  Stack,
  Fade,
} from '@mui/material';
import {
  SmartToy,
  Person,
  MenuBook,
  EmojiObjects,
  TrendingUp,
} from '@mui/icons-material';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface MessageListProps {
  messages: Message[];
  sending: boolean;
}

export default function MessageList({ messages, sending }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <Fade in>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
          }}
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: '#FFD93D',
              mb: 3,
              boxShadow: '0 8px 24px rgba(255,217,61,0.3)',
              animation: 'bounce 2s infinite',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-10px)' },
              },
            }}
          >
            <SmartToy sx={{ fontSize: 64, color: '#2D9B94' }} />
          </Avatar>

          <Typography variant="h3" fontWeight={800} color="#2D9B94" gutterBottom>
            Salut ! 👋
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
            Je suis là pour t'aider avec tes devoirs, répondre à tes questions et t'accompagner dans ton
            apprentissage !
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
            {[
              { icon: <MenuBook />, text: 'Aide aux devoirs', color: '#2D9B94' },
              { icon: <EmojiObjects />, text: 'Explications', color: '#FFB300' },
              { icon: <TrendingUp />, text: 'Progresser', color: '#7E57C2' },
            ].map((item, idx) => (
              <Chip
                key={idx}
                icon={item.icon}
                label={item.text}
                sx={{
                  py: 3,
                  px: 2,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  bgcolor: 'white',
                  border: '2px solid #E0F2F1',
                  color: item.color,
                  '&:hover': {
                    borderColor: item.color,
                    bgcolor: `${item.color}08`,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </Stack>
        </Box>
      </Fade>
    );
  }

  return (
    <Box>
      {messages.map((msg) => (
        <Fade in key={msg.id}>
          <Box
            sx={{
              display: 'flex',
              mb: 3,
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {msg.role === 'assistant' && (
              <Avatar
                sx={{
                  bgcolor: '#FFD93D',
                  mr: 2,
                  width: 40,
                  height: 40,
                  boxShadow: '0 2px 8px rgba(255,217,61,0.3)',
                }}
              >
                <SmartToy sx={{ color: '#2D9B94' }} />
              </Avatar>
            )}

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                maxWidth: '75%',
                bgcolor: msg.role === 'user' ? '#2D9B94' : 'white',
                color: msg.role === 'user' ? 'white' : '#1A202C',
                borderRadius: 4,
                boxShadow:
                  msg.role === 'user'
                    ? '0 4px 12px rgba(45,155,148,0.3)'
                    : '0 2px 8px rgba(0,0,0,0.08)',
                border: msg.role === 'assistant' ? '2px solid #E0F2F1' : 'none',
              }}
            >
              <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, fontWeight: 500 }}>
                {msg.content}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
                {new Date(msg.created_at).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            </Paper>

            {msg.role === 'user' && (
              <Avatar sx={{ bgcolor: '#7E57C2', ml: 2, width: 40, height: 40 }}>
                <Person />
              </Avatar>
            )}
          </Box>
        </Fade>
      ))}

      {sending && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: '#FFD93D', mr: 2, width: 40, height: 40 }}>
            <SmartToy sx={{ color: '#2D9B94' }} />
          </Avatar>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              bgcolor: 'white',
              borderRadius: 4,
              border: '2px solid #E0F2F1',
            }}
          >
            <Stack direction="row" spacing={0.5}>
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  sx={{
                    width: 8,
                    height: 8,
                    bgcolor: '#2D9B94',
                    borderRadius: '50%',
                    animation: 'bounce 1.4s infinite ease-in-out',
                    animationDelay: `${i * 0.16}s`,
                    '@keyframes bounce': {
                      '0%, 80%, 100%': { transform: 'scale(0)' },
                      '40%': { transform: 'scale(1)' },
                    },
                  }}
                />
              ))}
            </Stack>
          </Paper>
        </Box>
      )}

      <div ref={messagesEndRef} />
    </Box>
  );
}