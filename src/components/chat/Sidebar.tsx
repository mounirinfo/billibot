'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  Paper,
  CircularProgress,
  InputAdornment,
  IconButton,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  Add,
  Search,
  Close,
  ChatBubbleOutline,
  SmartToy,
  Person,
  MoreVert,
  Delete,
  Logout,
} from '@mui/icons-material';
import { User } from '@supabase/supabase-js';

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface SidebarProps {
  user: User;
  conversations: Conversation[];
  currentConversation: string | null;
  loading: boolean;
  onCreateConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onSignOut: () => void;
}

export default function Sidebar({
  user,
  conversations,
  currentConversation,
  loading,
  onCreateConversation,
  onSelectConversation,
  onDeleteConversation,
  onSignOut,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #F0FDF4 0%, #FFFFFF 100%)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #2D9B94 0%, #34B3A8 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, position: 'relative', zIndex: 1 }}>
          <Avatar
            sx={{
              bgcolor: '#FFD93D',
              width: 56,
              height: 56,
              mr: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <SmartToy sx={{ fontSize: 32, color: '#2D9B94' }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
              EduBot
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.95, fontWeight: 500 }}>
              Ton assistant d'apprentissage 🎓
            </Typography>
          </Box>
        </Box>

        <Button
          fullWidth
          variant="contained"
          startIcon={<Add />}
          onClick={onCreateConversation}
          sx={{
            bgcolor: 'white',
            color: '#2D9B94',
            fontWeight: 700,
            py: 1.5,
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': {
              bgcolor: '#FFD93D',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          Nouvelle discussion
        </Button>
      </Box>

      {/* Barre de recherche */}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Rechercher une conversation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#2D9B94' }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <Close fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'white',
              border: '2px solid #E0F2F1',
              '&:hover': {
                borderColor: '#2D9B94',
              },
              '& fieldset': {
                border: 'none',
              },
              '&.Mui-focused': {
                borderColor: '#2D9B94',
                boxShadow: '0 0 0 3px rgba(45,155,148,0.1)',
              },
            },
          }}
        />
      </Box>

      <Divider />

      {/* Liste des conversations */}
      <List sx={{ flexGrow: 1, overflow: 'auto', px: 2, py: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={30} sx={{ color: '#2D9B94' }} />
          </Box>
        ) : filteredConversations.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <ChatBubbleOutline sx={{ fontSize: 48, color: '#B0BEC5', mb: 2 }} />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {searchQuery ? 'Aucun résultat' : 'Commence une conversation !'}
            </Typography>
          </Box>
        ) : (
          filteredConversations.map((conv) => (
            <Fade in key={conv.id}>
              <ListItem
                disablePadding
                sx={{ mb: 1 }}
                secondaryAction={
                  <Tooltip title="Supprimer">
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                      sx={{
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        '.MuiListItem-root:hover &': { opacity: 1 },
                        color: '#EF5350',
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemButton
                  selected={currentConversation === conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    px: 2,
                    '&:hover': {
                      bgcolor: '#E0F2F1',
                    },
                    '&.Mui-selected': {
                      bgcolor: '#2D9B94',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#26857E',
                      },
                      '& .MuiTypography-root': {
                        color: 'white',
                      },
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', pr: 1 }}>
                    <ChatBubbleOutline sx={{ fontSize: 20, mr: 1.5, opacity: 0.8 }} />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {conv.title}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {new Date(conv.updated_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </ListItemButton>
              </ListItem>
            </Fade>
          ))
        )}
      </List>

      <Divider />

      {/* Profil utilisateur */}
      <Box sx={{ p: 2 }}>
        <Paper
          elevation={0}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: 'white',
            border: '2px solid #E0F2F1',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: '#2D9B94',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(45,155,148,0.1)',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#FFD93D', width: 40, height: 40, mr: 1.5 }}>
              <Person sx={{ color: '#2D9B94' }} />
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={700} noWrap color="#2D9B94">
                {user.user_metadata?.full_name || 'Étudiant'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            </Box>
            <MoreVert sx={{ color: '#2D9B94' }} />
          </Box>
        </Paper>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: 200,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            },
          }}
        >
          <MenuItem
            onClick={() => {
              onSignOut();
              setAnchorEl(null);
            }}
            sx={{ py: 1.5, color: '#EF5350' }}
          >
            <Logout fontSize="small" sx={{ mr: 1.5 }} />
            Déconnexion
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}