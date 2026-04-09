import { useEffect, useState } from 'react';
import { getCustomers, getCustomerCart } from '../apis/adminStoreApi';

interface Customer {
    id: number; name: string; email: string;
    phone?: string; is_active: boolean; created_at: string;
}

interface CartItem {
    product: { name: string; primary_image: string; sku?: string };
    quantity: number; unit_price: number; line_total: number;
}

interface CartSummary {
    items: CartItem[];
    total_before_discount: number;
    discount: { name: string; code: string; amount: number } | null;
    total_after_discount: number;
    tax_breakdown: { name: string; amount: number }[];
    total_tax: number;
    delivery_charge: { name: string; amount: number };
    grand_total: number;
    item_count: number;
}

const cell: React.CSSProperties = { padding: '12px 16px', fontSize: '13px', verticalAlign: 'middle' };
const head: React.CSSProperties = { ...cell, fontWeight: 700, fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#f8f8f8' };

function CustomerCartDrawer({ customer, onClose }: { customer: Customer; onClose: () => void }) {
    const [cart, setCart] = useState<CartSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCustomerCart(customer.id)
            .then(r => setCart(r.data))
            .finally(() => setLoading(false));
    }, [customer.id]);

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex' }}>
            <div onClick={onClose} style={{ flex: 1, background: 'rgba(0,0,0,0.4)' }} />
            <div style={{ width: '480px', background: '#fff', height: '100vh', overflowY: 'auto', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{customer.name}'s Cart</h2>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>{customer.email}</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#666' }}>×</button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading cart...</div>
                ) : !cart || cart.item_count === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🛒</div>
                        <p>Cart is empty</p>
                    </div>
                ) : (
                    <>
                        {/* Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {cart.items.map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                                    <img src={item.product.primary_image} alt={item.product.name} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 600, fontSize: '13px', margin: '0 0 3px' }}>{item.product.name}</p>
                                        {item.product.sku && <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 4px' }}>SKU: {item.product.sku}</p>}
                                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>Qty: {item.quantity} × ₹{item.unit_price}</p>
                                    </div>
                                    <p style={{ fontWeight: 700, fontSize: '14px' }}>₹{item.line_total}</p>
                                </div>
                            ))}
                        </div>

                        {/* Breakdown */}
                        <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                            {[
                                { label: 'Subtotal', value: `₹${cart.total_before_discount}` },
                                ...(cart.discount ? [{ label: `Discount (${cart.discount.code})`, value: `-₹${cart.discount.amount}`, green: true }] : []),
                                { label: 'After Discount', value: `₹${cart.total_after_discount}` },
                                ...cart.tax_breakdown.map(t => ({ label: t.name, value: `₹${t.amount}` })),
                                { label: cart.delivery_charge.name, value: cart.delivery_charge.amount === 0 ? 'Free' : `₹${cart.delivery_charge.amount}` },
                            ].map((row, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--border-color)', fontSize: '13px' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
                                    <span style={{ fontWeight: 500, color: (row as any).green ? '#16a34a' : '#111' }}>{row.value}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', fontSize: '15px', fontWeight: 700 }}>
                                <span>Grand Total</span>
                                <span>₹{cart.grand_total}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Customer | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        getCustomers().then(r => setCustomers(r.data || [])).finally(() => setLoading(false));
    }, []);

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px', color: 'var(--primary-color)' }}>Customers</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{customers.length} registered customers</p>
                </div>
                <input
                    placeholder="Search by name or email..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    style={{ padding: '9px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '13px', width: '240px' }}
                />
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>Loading...</div>
            ) : (
                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                {['Name', 'Email', 'Phone', 'Status', 'Joined', 'Cart'].map(h => (
                                    <th key={h} style={head}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => (
                                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={cell}>
                                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{c.name}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>#{c.id}</div>
                                    </td>
                                    <td style={{ ...cell, color: 'var(--text-secondary)' }}>{c.email}</td>
                                    <td style={{ ...cell, color: 'var(--text-secondary)' }}>{c.phone || '—'}</td>
                                    <td style={cell}>
                                        <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: c.is_active ? '#dcfce7' : '#fee2e2', color: c.is_active ? '#16a34a' : '#dc2626' }}>
                                            {c.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={{ ...cell, color: 'var(--text-secondary)', fontSize: '12px' }}>
                                        {new Date(c.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={cell}>
                                        <button onClick={() => setSelected(c)}
                                            style={{ padding: '6px 14px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                                            View Cart
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No customers found</div>
                    )}
                </div>
            )}

            {selected && <CustomerCartDrawer customer={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}

export default CustomersPage;
