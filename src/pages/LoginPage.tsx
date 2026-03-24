import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';
import { ROUTES } from '../constants/routes';

function LoginPage() {
    const navigate = useNavigate();
    const { login, isLoading } = useUserStore();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login(formData.email, formData.password);
            navigate(ROUTES.DASHBOARD);
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div
            style={{
                width: '100%',
                maxWidth: '400px',
                padding: '40px',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                border: '1px solid var(--border-color)',
            }}
        >
            <h1
                style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    color: 'var(--primary-color)',
                }}
            >
                Admin Login
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>
                Sign in to access your admin dashboard
            </p>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label
                        htmlFor="email"
                        style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'var(--text-primary)',
                        }}
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '14px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary-color)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                    />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label
                        htmlFor="password"
                        style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'var(--text-primary)',
                        }}
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '14px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary-color)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                    />
                </div>

                {error && (
                    <div
                        style={{
                            padding: '12px',
                            marginBottom: '20px',
                            backgroundColor: '#fee',
                            color: '#c33',
                            borderRadius: '4px',
                            fontSize: '14px',
                            border: '1px solid #fcc',
                        }}
                    >
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'white',
                        backgroundColor: 'var(--primary-color)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.7 : 1,
                        transition: 'opacity 0.2s',
                    }}
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                Don't have an account?{' '}
                <a
                    href={ROUTES.REGISTER}
                    style={{
                        color: 'var(--primary-color)',
                        textDecoration: 'none',
                        fontWeight: '600',
                    }}
                >
                    Register
                </a>
            </p>
        </div>
    );
}

export default LoginPage;
