'use client';

import { Breadcrumbs as MUIBreadcrumbs, Link, Typography, Box, Container } from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

export default function Breadcrumbs() {
    const router = useRouter();
    const pathname = usePathname();

    // Generate breadcrumbs from pathname
    // Example: /candidat/orientation -> [Home, Candidat, Orientation]
    const pathnames = pathname.split('/').filter((x) => x);

    const getLabel = (path: string) => {
        const labels: Record<string, string> = {
            candidat: 'Espace Candidat',
            orientation: 'Orientation Express+',
            admission: 'Admission',
            entretien: 'Entretien',
            contact: 'Contact',
        };
        return labels[path] || path.charAt(0).toUpperCase() + path.slice(1);
    };

    return (
        <Box sx={{ py: 2, bgcolor: 'rgba(250, 251, 255, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 1100 }}>
            <Container maxWidth="lg">
                <MUIBreadcrumbs
                    separator={<NavigateNext fontSize="small" />}
                    aria-label="breadcrumb"
                >
                    <Link
                        underline="hover"
                        sx={{ display: 'flex', alignItems: 'center', color: 'inherit', cursor: 'pointer' }}
                        onClick={() => router.push('/candidat')}
                    >
                        <Home sx={{ mr: 0.5 }} fontSize="inherit" />
                        Accueil
                    </Link>
                    {pathnames.map((value, index) => {
                        const last = index === pathnames.length - 1;
                        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                        return last ? (
                            <Typography color="text.primary" key={to} sx={{ fontWeight: 700 }}>
                                {getLabel(value)}
                            </Typography>
                        ) : (
                            <Link
                                underline="hover"
                                color="inherit"
                                key={to}
                                onClick={() => router.push(to)}
                                sx={{ cursor: 'pointer' }}
                            >
                                {getLabel(value)}
                            </Link>
                        );
                    })}
                </MUIBreadcrumbs>
            </Container>
        </Box>
    );
}
