import { useState, useEffect } from 'react';
import useUserStore from '../stores/userStore';

function DashboardPage() {
    const { user } = useUserStore();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        pendingApprovals: 0,
    });

    useEffect(() => {
        // You can fetch dashboard stats from API here
        // For now, using dummy data
        setStats({
            totalUsers: 42,
            totalProducts: 156,
            pendingApprovals: 5,
        });
    }, []);

    const statCards = [
        { title: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#4CAF50' },
        { title: 'Total Products', value: stats.totalProducts, icon: '📦', color: '#2196F3' },
        { title: 'Pending Approvals', value: stats.pendingApprovals, icon: '⏳', color: '#FF9800' },
    ];

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--primary-color)' }}>
                    Dashboard
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
                    Welcome back, {user?.name}!
                </p>
            </div>

            {/* Stats Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '24px',
                    marginBottom: '40px',
                }}
            >
                {statCards.map((stat) => (
                    <div
                        key={stat.title}
                        style={{
                            padding: '24px',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                    {stat.title}
                                </p>
                                <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                    {stat.value}
                                </p>
                            </div>
                            <div
                                style={{
                                    fontSize: '48px',
                                    opacity: 0.2,
                                }}
                            >
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div
                style={{
                    padding: '24px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                }}
            >
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: 'var(--primary-color)' }}>
                    Recent Activity
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>No recent activity to display.</p>
            </div>
        </div>
    );
}

export default DashboardPage;
