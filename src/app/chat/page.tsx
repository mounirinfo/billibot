'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Alert,
  Snackbar,
} from '@mui/material';
import { Menu as MenuIcon, SmartToy } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/chat/Sidebar';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import EmptyState from '@/components/chat/EmptyState';

const drawerWidth = 320;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth(); // ✅ Retirer signOut
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirection si non connecté
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Charger les conversations au démarrage
  useEffect(() => {
    if (user) loadConversations();
  }, [user]);

  // Charger les messages quand une conversation change
  useEffect(() => {
    if (currentConversation) loadMessages(currentConversation);
  }, [currentConversation]);

  // Fonctions API
  const loadConversations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/conversations');
      const data = await res.json();
      if (res.ok) {
        setConversations(data.conversations || []);
        if (data.conversations?.length > 0 && !currentConversation) {
          setCurrentConversation(data.conversations[0].id);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`);
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const createConversation = async () => {
    try {
      const res = await fetch('/api/conversations', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setConversations([data.conversation, ...conversations]);
        setCurrentConversation(data.conversation.id);
        setMessages([]);
        if (isMobile) setMobileOpen(false);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/conversations?id=${conversationId}`, { method: 'DELETE' });
      if (res.ok) {
        setConversations(conversations.filter((c) => c.id !== conversationId));
        if (currentConversation === conversationId) {
          const remaining = conversations.filter((c) => c.id !== conversationId);
          setCurrentConversation(remaining.length > 0 ? remaining[0].id : null);
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !currentConversation) return;

    const userMessage = message.trim();
    setMessage('');
    setSending(true);
    setError(null);

    try {
      // Appeler la nouvelle API /api/chat qui gère tout
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: currentConversation,
          message: userMessage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi du message');
      }

      // Ajouter les deux messages (user + assistant) à l'état
      setMessages([...messages, data.userMessage, data.assistantMessage]);

      // Recharger les conversations pour mettre à jour le titre
      loadConversations();
    } catch (error: any) {
      console.error('Erreur:', error);
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setSending(false);
    }
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversation(id);
    if (isMobile) setMobileOpen(false);
  };

  // Loading state
  if (authLoading || !user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2D9B94 0%, #FFD93D 100%)',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: 'white', mb: 2 }} size={60} />
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Chargement...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#FAFAFA' }}>
      {/* Snackbar pour les erreurs */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* AppBar mobile */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: { md: 'none' },
          background: 'linear-gradient(135deg, #2D9B94 0%, #34B3A8 100%)',
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)}>
            <MenuIcon />
          </IconButton>
          <SmartToy sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight={700}>
            EduBot
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          <Sidebar
            user={user}
            conversations={conversations}
            currentConversation={currentConversation}
            loading={loading}
            onCreateConversation={createConversation}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={deleteConversation}
            // ✅ Retirer onSignOut - la Sidebar gère maintenant le logout directement
          />
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { width: drawerWidth, border: 'none' },
          }}
          open
        >
          <Sidebar
            user={user}
            conversations={conversations}
            currentConversation={currentConversation}
            loading={loading}
            onCreateConversation={createConversation}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={deleteConversation}
          />
        </Drawer>
      </Box>

      {/* Zone de chat */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {currentConversation ? (
          <>
            {/* Messages */}
            <Box
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                p: { xs: 2, md: 4 },
                pt: { xs: 10, md: 4 },
                background: 'linear-gradient(180deg, #FAFAFA 0%, #FFFFFF 100%)',
              }}
            >
              <Box sx={{ maxWidth: 900, mx: 'auto' }}>
                <MessageList messages={messages} sending={sending} />
              </Box>
            </Box>

            {/* Input */}
            <MessageInput
              message={message}
              sending={sending}
              onMessageChange={setMessage}
              onSendMessage={sendMessage}
            />
          </>
        ) : (
          <EmptyState onCreateConversation={createConversation} />
        )}
      </Box>
    </Box>
  );
}