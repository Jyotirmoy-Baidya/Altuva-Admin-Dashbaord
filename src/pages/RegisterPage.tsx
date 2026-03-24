import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../apis/adminApi';
import { ROUTES } from '../constants/routes';

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await register({
                name: formData.name,
                email: formData.email,
                phone_number: formData.phone_number,
                password: formData.password,
            });

            setSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate(ROUTES.LOGIN);
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
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
                    textAlign: 'center',
                }}
            >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h2 style={{ fontSize: '24px', marginBottom: '12px', color: 'var(--primary-color)' }}>
                    Registration Successful!
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Your account has been created. Please wait for admin approval before logging in.
                </p>
                <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Redirecting to login...
                </p>
            </div>
        );
    }

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
                Admin Registration
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>
                Create your admin account
            </p>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label
                        htmlFor="name"
                        style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'var(--text-primary)',
                        }}
                    >
                        Full Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '14px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            outline: 'none',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary-color)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                    />
                </div>

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
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary-color)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label
                        htmlFor="phone_number"
                        style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'var(--text-primary)',
                        }}
                    >
                        Phone Number (Optional)
                    </label>
                    <input
                        id="phone_number"
                        type="tel"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '14px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            outline: 'none',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary-color)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
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
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--primary-color)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                    />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label
                        htmlFor="confirmPassword"
                        style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: 'var(--text-primary)',
                        }}
                    >
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '14px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            outline: 'none',
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
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'white',
                        backgroundColor: 'var(--primary-color)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1,
                    }}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

            <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                Already have an account?{' '}
                <a
                    href={ROUTES.LOGIN}
                    style={{
                        color: 'var(--primary-color)',
                        textDecoration: 'none',
                        fontWeight: '600',
                    }}
                >
                    Login
                </a>
            </p>
        </div>
    );
}

export default RegisterPage;
