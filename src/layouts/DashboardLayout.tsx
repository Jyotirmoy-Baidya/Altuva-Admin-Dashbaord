import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import useUserStore from '../stores/userStore';
import { ROUTES } from '../constants/routes';
import { getCurrentUser } from '../apis/adminApi';

type VerifyState = 'pending' | 'ok' | 'fail';

function DashboardLayout() {
    const token = useUserStore((s) => s.token);
    const logout = useUserStore((s) => s.logout);
    const setUser = useUserStore((s) => s.setUser);
    const [verify, setVerify] = useState<VerifyState>(() => (token ? 'pending' : 'fail'));

    useEffect(() => {
        if (!token) return;

        getCurrentUser(token)
            .then((res) => {
                setUser(res.data ?? null);
                setVerify('ok');
            })
            .catch(() => {
                logout();
                setVerify('fail');
            });
    }, [token, logout, setUser]);

    if (verify === 'pending') {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--background-color)' }}>
                <span style={{ color: '#888', fontSize: 14, fontFamily: 'sans-serif' }}>Verifying session...</span>
            </div>
        );
    }

    if (verify === 'fail') {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main
                style={{
                    marginLeft: 'var(--sidebar-width)',
                    flex: 1,
                    padding: '40px',
                    backgroundColor: 'var(--background-color)',
                    minHeight: '100vh',
                }}
            >
                <Outlet />
            </main>
        </div>
    );
}

export default DashboardLayout;
