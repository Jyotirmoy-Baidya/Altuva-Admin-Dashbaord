import { Link, useLocation, useNavigate } from 'react-router-dom';
import useUserStore from '../../stores/userStore';
import { ROUTES } from '../../constants/routes';

interface SidebarItem { name: string; path: string; }
interface SidebarGroup { label: string; items: SidebarItem[]; }

const sidebarGroups: SidebarGroup[] = [
    {
        label: 'Overview',
        items: [
            { name: 'Dashboard', path: ROUTES.DASHBOARD },
            { name: 'Analytics', path: '/analytics' },
        ],
    },
    {
        label: 'Store',
        items: [
            { name: 'Orders', path: '/orders' },
            { name: 'Products', path: '/products' },
            { name: 'Customers', path: '/customers' },
        ],
    },
    {
        label: 'Pricing',
        items: [
            { name: 'Taxes', path: '/taxes' },
            { name: 'Delivery Charges', path: '/delivery-charges' },
            { name: 'Discounts', path: '/discounts' },
        ],
    },
    {
        label: 'Content',
        items: [
            { name: 'Landing Page', path: '/landing-page' },
            { name: 'Spotlights', path: '/spotlights' },
            { name: "People's Choice", path: '/popular-sections' },
            { name: 'Showcase Tea', path: '/showcase-tea' },
        ],
    },
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

            {/* Navigation Groups */}
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
                {sidebarGroups.map((group) => (
                    <div key={group.label} style={{ marginBottom: '8px' }}>
                        <div style={{ padding: '6px 20px 4px', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            {group.label}
                        </div>
                        {group.items.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '9px 20px',
                                        textDecoration: 'none',
                                        color: 'white',
                                        backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        borderLeft: isActive ? '3px solid white' : '3px solid transparent',
                                        transition: 'all 0.15s',
                                        fontSize: '13px',
                                        fontWeight: isActive ? 600 : 400,
                                    }}
                                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                ))}
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
