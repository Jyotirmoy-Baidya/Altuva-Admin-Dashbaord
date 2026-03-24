function LandingPageManager() {
    return (
        <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px', color: 'var(--primary-color)' }}>
                Landing Page Manager
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '32px' }}>
                Manage your landing page content
            </p>

            <div
                style={{
                    padding: '40px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center',
                }}
            >
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏠</div>
                <h2 style={{ fontSize: '24px', marginBottom: '8px', color: 'var(--primary-color)' }}>
                    Landing Page Editor
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Landing page management features coming soon...
                </p>
            </div>
        </div>
    );
}

export default LandingPageManager;
