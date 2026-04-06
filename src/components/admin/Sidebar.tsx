import { Link, useLocation, useNavigate } from 'react-router-dom';
import useUserStore from '../../stores/userStore';
import { ROUTES } from '../../constants/routes';

interface SidebarItem {
    name: string;
    path: string;
    icon: string;
}

const sidebarItems: SidebarItem[] = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: '📊' },
    { name: 'Analytics', path: '/analytics', icon: '📈' },
    { name: 'Landing Page', path: '/landing-page', icon: '🏠' },
    { name: 'Products', path: '/products', icon: '📦' },
];

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useUserStore();

    const handleLogout = () => {
        logout();
        navigate(ROUTES.LOGIN);
    };

    return (
        <aside
            style={{
                width: 'var(--sidebar-width)',
                height: '100vh',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                position: 'fixed',
                left: 0,
                top: 0,
                display: 'flex',
                flexDirection: 'column',
                padding: '20px 0',
            }}
        >
            {/* Logo/Brand */}
            <div
                style={{
                    padding: '0 20px',
                    marginBottom: '40px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                }}
            >
                Altuva Admin
            </div>

            {/* Navigation Items */}
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sidebarItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 20px',
                                textDecoration: 'none',
                                color: 'white',
                                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                borderLeft: isActive ? '3px solid white' : '3px solid transparent',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            <span style={{ fontSize: '14px', fontWeight: isActive ? '600' : '400' }}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Info at Bottom */}
            {user && (
                <div
                    style={{
                        padding: '20px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        marginTop: 'auto',
                    }}
                >
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
                        Logged in as
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>{user.email}</div>
                    {!user.approved && (
                        <div
                            style={{
                                marginTop: '8px',
                                padding: '4px 8px',
                                backgroundColor: 'rgba(255, 193, 7, 0.2)',
                                color: '#ffc107',
                                fontSize: '11px',
                                borderRadius: '4px',
                            }}
                        >
                            Pending Approval
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        style={{
                            marginTop: '12px',
                            width: '100%',
                            padding: '8px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            textAlign: 'left',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                    >
                        Logout
                    </button>
                </div>
            )}
        </aside>
    );
}

export default Sidebar;
