import UserHeader from '../../components/UserHeader';
import Footer from '../../components/layout/Footer';

export default function CandidatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <UserHeader />
            <main style={{ minHeight: 'calc(100vh - 400px)' }}>
                {children}
            </main>
            <Footer />
        </>
    );
}
