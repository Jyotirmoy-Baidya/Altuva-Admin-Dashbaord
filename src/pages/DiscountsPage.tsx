import { useEffect, useState } from 'react';
import { getDiscounts, createDiscount, updateDiscount, deleteDiscount } from '../apis/adminStoreApi';

interface Discount {
    id: number; name: string; code: string; type: string; value: string;
    min_order_amount: string; max_uses: number | null; used_count: number;
    is_active: boolean; expires_at: string | null; created_at: string;
}

const empty = { name: '', code: '', type: 'flat', value: '', min_order_amount: '0', max_uses: '', is_active: true, expires_at: '' };

function DiscountsPage() {
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [form, setForm] = useState(empty);
    const [editing, setEditing] = useState<Discount | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { getDiscounts().then(r => setDiscounts(r.data || [])).finally(() => setLoading(false)); }, []);

    const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

    const handleEdit = (d: Discount) => {
        setEditing(d);
        setForm({
            name: d.name, code: d.code, type: d.type, value: d.value,
            min_order_amount: d.min_order_amount, max_uses: d.max_uses ? String(d.max_uses) : '',
            is_active: d.is_active, expires_at: d.expires_at ? d.expires_at.slice(0, 10) : '',
        });
    };

    const handleSave = async () => {
        if (!form.name || !form.code || !form.value) { setError('Name, code, and value are required'); return; }
        setSaving(true); setError('');
        try {
            const payload = {
                ...form,
                max_uses: form.max_uses ? parseInt(form.max_uses) : null,
                expires_at: form.expires_at || null,
            };
            if (editing) {
                const updated = await updateDiscount(editing.id, payload);
                setDiscounts(discounts.map(d => d.id === editing.id ? updated.data : d));
            } else {
                const created = await createDiscount(payload);
                setDiscounts([...discounts, created.data]);
            }
            setEditing(null); setForm(empty);
        } catch (e: any) { setError(e?.response?.data?.message || 'Failed to save'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this discount code?')) return;
        await deleteDiscount(id);
        setDiscounts(discounts.filter(d => d.id !== id));
    };

    const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' as const };

    return (
        <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px', color: 'var(--primary-color)' }}>Discount Codes</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Create and manage coupon codes for customers</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>
                {/* Table */}
                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f8f8', borderBottom: '1px solid var(--border-color)' }}>
                                {['Code', 'Discount', 'Min Order', 'Uses', 'Expires', 'Status', ''].map(h => (
                                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</td></tr>
                            ) : discounts.length === 0 ? (
                                <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>No discount codes yet</td></tr>
                            ) : discounts.map(d => {
                                const expired = d.expires_at && new Date(d.expires_at) < new Date();
                                return (
                                    <tr key={d.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '12px 14px' }}>
                                            <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '13px', background: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', display: 'inline-block' }}>{d.code}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{d.name}</div>
                                        </td>
                                        <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600, color: '#16a34a' }}>
                                            {d.type === 'percentage' ? `${d.value}%` : `₹${d.value}`} off
                                        </td>
                                        <td style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--text-secondary)' }}>₹{d.min_order_amount}</td>
                                        <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            {d.used_count}{d.max_uses ? `/${d.max_uses}` : ''}
                                        </td>
                                        <td style={{ padding: '12px 14px', fontSize: '12px', color: expired ? '#dc2626' : 'var(--text-secondary)' }}>
                                            {d.expires_at ? new Date(d.expires_at).toLocaleDateString() : 'Never'}
                                        </td>
                                        <td style={{ padding: '12px 14px' }}>
                                            <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: d.is_active && !expired ? '#dcfce7' : '#fee2e2', color: d.is_active && !expired ? '#16a34a' : '#dc2626' }}>
                                                {expired ? 'Expired' : d.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 14px' }}>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button onClick={() => handleEdit(d)} style={{ padding: '5px 10px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                                                <button onClick={() => handleDelete(d.id)} style={{ padding: '5px 10px', background: '#fff', color: '#dc2626', border: '1px solid #dc2626', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>Del</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Form */}
                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '20px' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700 }}>{editing ? 'Edit Code' : 'New Code'}</h3>
                    {error && <div style={{ padding: '8px 12px', background: '#fee2e2', color: '#dc2626', borderRadius: '6px', fontSize: '12px', marginBottom: '12px' }}>{error}</div>}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Display Name <span style={{ color: 'red' }}>*</span></label>
                            <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Summer Sale" />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Code <span style={{ color: 'red' }}>*</span></label>
                            <input style={{ ...inputStyle, textTransform: 'uppercase', fontFamily: 'monospace' }} value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="e.g. SUMMER20" />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Type</label>
                            <select style={inputStyle} value={form.type} onChange={e => set('type', e.target.value)}>
                                <option value="flat">Flat (₹ off)</option>
                                <option value="percentage">Percentage (% off)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Value <span style={{ color: 'red' }}>*</span></label>
                            <input style={inputStyle} type="number" step="0.01" value={form.value} onChange={e => set('value', e.target.value)} placeholder={form.type === 'percentage' ? '20 for 20%' : '50 for ₹50'} />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Min Order (₹)</label>
                            <input style={inputStyle} type="number" value={form.min_order_amount} onChange={e => set('min_order_amount', e.target.value)} />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Max Uses</label>
                            <input style={inputStyle} type="number" value={form.max_uses} onChange={e => set('max_uses', e.target.value)} placeholder="Leave empty for unlimited" />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Expires On</label>
                            <input style={inputStyle} type="date" value={form.expires_at} onChange={e => set('expires_at', e.target.value)} />
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                            <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} />
                            Active
                        </label>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '9px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                                {saving ? 'Saving...' : editing ? 'Update' : 'Create Code'}
                            </button>
                            {editing && (
                                <button onClick={() => { setEditing(null); setForm(empty); }} style={{ padding: '9px 14px', border: '1px solid var(--border-color)', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DiscountsPage;
