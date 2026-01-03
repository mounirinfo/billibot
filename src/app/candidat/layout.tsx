import UserHeader from '../../components/UserHeader';

export default function CandidatLayout({
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
