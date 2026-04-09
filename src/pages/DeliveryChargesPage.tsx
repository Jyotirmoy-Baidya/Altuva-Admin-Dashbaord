import { useEffect, useState } from 'react';
import { getDeliveryCharges, createDeliveryCharge, updateDeliveryCharge, deleteDeliveryCharge } from '../apis/adminStoreApi';

interface Slab { id: number; name: string; min_order_amount: string; max_order_amount: string | null; charge: string; is_active: boolean; }
const empty = { name: '', min_order_amount: '0', max_order_amount: '', charge: '', is_active: true };

function DeliveryChargesPage() {
    const [slabs, setSlabs] = useState<Slab[]>([]);
    const [form, setForm] = useState(empty);
    const [editing, setEditing] = useState<Slab | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const load = () => getDeliveryCharges().then(r => setSlabs(r.data || [])).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);

    const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

    const handleEdit = (s: Slab) => {
        setEditing(s);
        setForm({ name: s.name, min_order_amount: s.min_order_amount, max_order_amount: s.max_order_amount ?? '', charge: s.charge, is_active: s.is_active });
    };

    const handleSave = async () => {
        if (!form.name || !form.charge) { setError('Name and charge are required'); return; }
        setSaving(true); setError('');
        try {
            const payload = { ...form, max_order_amount: form.max_order_amount || null };
            if (editing) {
                const updated = await updateDeliveryCharge(editing.id, payload);
                setSlabs(slabs.map(s => s.id === editing.id ? updated.data : s));
            } else {
                const created = await createDeliveryCharge(payload);
                setSlabs([...slabs, created.data]);
            }
            setEditing(null); setForm(empty);
        } catch (e: any) { setError(e?.response?.data?.message || 'Failed to save'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this slab?')) return;
        await deleteDeliveryCharge(id);
        setSlabs(slabs.filter(s => s.id !== id));
    };

    const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' as const };

    return (
        <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px', color: 'var(--primary-color)' }}>Delivery Charges</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Set delivery fee slabs based on order total after discount</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>
                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f8f8', borderBottom: '1px solid var(--border-color)' }}>
                                {['Name', 'Order Range', 'Charge', 'Status', ''].map(h => (
                                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</td></tr>
                            ) : slabs.length === 0 ? (
                                <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>No slabs yet</td></tr>
                            ) : slabs.map(s => (
                                <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '12px 14px', fontWeight: 600, fontSize: '13px' }}>{s.name}</td>
                                    <td style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                        ₹{s.min_order_amount} – {s.max_order_amount ? `₹${s.max_order_amount}` : '∞'}
                                    </td>
                                    <td style={{ padding: '12px 14px', fontSize: '13px', fontWeight: 600 }}>
                                        {Number(s.charge) === 0 ? 'Free' : `₹${s.charge}`}
                                    </td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: s.is_active ? '#dcfce7' : '#f3f4f6', color: s.is_active ? '#16a34a' : '#6b7280' }}>
                                            {s.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button onClick={() => handleEdit(s)} style={{ padding: '5px 10px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                                            <button onClick={() => handleDelete(s.id)} style={{ padding: '5px 10px', background: '#fff', color: '#dc2626', border: '1px solid #dc2626', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>Del</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '20px' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700 }}>{editing ? 'Edit Slab' : 'Add Slab'}</h3>
                    {error && <div style={{ padding: '8px 12px', background: '#fee2e2', color: '#dc2626', borderRadius: '6px', fontSize: '12px', marginBottom: '12px' }}>{error}</div>}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { key: 'name', label: 'Name', placeholder: 'e.g. Standard Delivery', required: true },
                            { key: 'min_order_amount', label: 'Min Order (₹)', placeholder: '0', required: true },
                            { key: 'max_order_amount', label: 'Max Order (₹)', placeholder: 'Leave empty for no limit' },
                            { key: 'charge', label: 'Charge (₹)', placeholder: '50', required: true },
                        ].map(f => (
                            <div key={f.key}>
                                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>{f.label}{f.required && <span style={{ color: 'red' }}> *</span>}</label>
                                <input style={inputStyle} type={f.key !== 'name' ? 'number' : 'text'} value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} />
                            </div>
                        ))}
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                            <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} />
                            Active
                        </label>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '9px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                                {saving ? 'Saving...' : editing ? 'Update' : 'Add Slab'}
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

export default DeliveryChargesPage;
