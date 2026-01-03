import UserHeader from '../../components/UserHeader';

export default function EtudiantLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <UserHeader />
            {children}
        </>
    );
}
