'use client';

import UserHeader from '../../components/UserHeader';
import Footer from '../../components/layout/Footer';
import { Box } from '@mui/material';

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <UserHeader />
            <Box component="main" sx={{ pt: { xs: 8, md: 10 } }}>
                {children}
            </Box>
            <Footer />
        </>
    );
}
