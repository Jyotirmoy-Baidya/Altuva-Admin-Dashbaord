import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';
import { getOrderStats } from '../apis/orderApi';
import type { OrderStats } from '../types/order';

function DashboardPage() {
    const { user } = useUserStore();
    const navigate = useNavigate();
    const [stats, setStats] = useState<OrderStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOrderStats().then(res => setStats(res.data)).finally(() => setLoading(false));
    }, []);

    const fmt = (n: number | string) => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

    const statCards = stats ? [
        { title: 'Total Revenue', value: fmt(stats.total_revenue), icon: '₹', color: '#22c55e', sub: 'Placed & fulfilled orders' },
        { title: 'Total Orders', value: stats.total_orders, icon: '📦', color: '#3b82f6', sub: 'All time' },
        { title: 'Orders to Process', value: stats.placed_orders, icon: '⏳', color: '#f59e0b', sub: 'Newly placed' },
        { title: 'Delivered', value: stats.delivered_orders, icon: '✅', color: '#8b5cf6', sub: 'Successfully delivered' },
    ] : [];

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px', color: 'var(--primary-color)' }}>Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Welcome back, {user?.name}!</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} style={{ padding: '24px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border-color)', height: '100px', animation: 'pulse 1.5s infinite' }} />
                    ))
                    : statCards.map((stat) => (
                        <div
                            key={stat.title}
                            style={{ padding: '20px 24px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{stat.title}</p>
                                <span style={{ fontSize: '22px' }}>{stat.icon}</span>
                            </div>
                            <p style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color, lineHeight: 1 }}>{stat.value}</p>
                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>{stat.sub}</p>
                        </div>
                    ))
                }
            </div>

            {/* Top Products */}
            {stats && stats.top_products.length > 0 && (
                <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '24px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--primary-color)' }}>Top Selling Products</h2>
                        <button
                            onClick={() => navigate('/orders')}
                            style={{ fontSize: '12px', color: 'var(--primary-color)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                        >
                            View all orders →
                        </button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)' }}>Product</th>
                                <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)' }}>Units Sold</th>
                                <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)' }}>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.top_products.map((p, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '10px 12px', fontWeight: 500 }}>{p.product_name}</td>
                                    <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text-secondary)' }}>{p.total_qty}</td>
                                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>{fmt(p.total_revenue)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Quick links */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '24px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--primary-color)' }}>Quick Actions</h2>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {[
                        { label: 'View Orders', path: '/orders' },
                        { label: 'Manage Products', path: '/products' },
                        { label: 'Manage Discounts', path: '/discounts' },
                        { label: 'View Customers', path: '/customers' },
                    ].map(action => (
                        <button
                            key={action.path}
                            onClick={() => navigate(action.path)}
                            style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', backgroundColor: 'white', fontWeight: 500 }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
