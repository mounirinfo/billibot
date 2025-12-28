'use client';
import { Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect } from 'react';


export default function Home() {
   const router = useRouter();
  useEffect(() => {
      const fetchProfile = async () => {
        const supabase = createClient();
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/login');
          return;
        }
  
        const { data: profile } = await supabase
          .from('profiles')
          .select('account_status, rejection_reason, email')
          .eq('id', user.id)
          .single();
  
        if (!profile) {
          router.push('/login');
          return;
        }
  
        // Si le compte n'est pas rejeté, rediriger
        if (profile.account_status !== 'rejected') {
          if (profile.account_status === 'approved') {
            router.push('/chat');
          } else {
            router.push('/pending');
          }
          return;
        }
  
      };
  
      fetchProfile();
    }, [router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2D9B94 0%, #1F7872 100%)',
      }}
    >
      <CircularProgress sx={{ color: 'white' }} />
    </Box>
  );
}