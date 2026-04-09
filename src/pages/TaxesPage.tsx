import { useEffect, useState } from 'react';
import { getTaxes, createTax, updateTax, deleteTax } from '../apis/adminStoreApi';

interface Tax { id: number; name: string; type: string; value: string; is_active: boolean; }
const empty = { name: '', type: 'percentage', value: '', is_active: true };

function TaxesPage() {
    const [taxes, setTaxes] = useState<Tax[]>([]);
    const [form, setForm] = useState(empty);
    const [editing, setEditing] = useState<Tax | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const load = () => getTaxes().then(r => setTaxes(r.data || [])).finally(() => setLoading(false));
    useEffect(() => { load(); }, []);

    const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

    const handleEdit = (tax: Tax) => {
        setEditing(tax);
        setForm({ name: tax.name, type: tax.type, value: tax.value, is_active: tax.is_active });
    };

    const handleSave = async () => {
        if (!form.name || !form.value) { setError('Name and value are required'); return; }
        setSaving(true); setError('');
        try {
            if (editing) {
                const updated = await updateTax(editing.id, form);
                setTaxes(taxes.map(t => t.id === editing.id ? updated.data : t));
            } else {
                const created = await createTax(form);
                setTaxes([...taxes, created.data]);
            }
            setEditing(null); setForm(empty);
        } catch (e: any) { setError(e?.response?.data?.message || 'Failed to save'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this tax?')) return;
        await deleteTax(id);
        setTaxes(taxes.filter(t => t.id !== id));
    };

    const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' as const };

    return (
        <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px', color: 'var(--primary-color)' }}>Taxes</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Active taxes are automatically applied to every cart</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>
                {/* Table */}
                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8f8f8', borderBottom: '1px solid var(--border-color)' }}>
                                {['Name', 'Type', 'Value', 'Status', ''].map(h => (
                                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</td></tr>
                            ) : taxes.length === 0 ? (
                                <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>No taxes yet</td></tr>
                            ) : taxes.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '12px 14px', fontWeight: 600, fontSize: '13px' }}>{t.name}</td>
                                    <td style={{ padding: '12px 14px', fontSize: '13px', textTransform: 'capitalize' }}>{t.type}</td>
                                    <td style={{ padding: '12px 14px', fontSize: '13px' }}>{t.type === 'percentage' ? `${t.value}%` : `₹${t.value}`}</td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: t.is_active ? '#dcfce7' : '#f3f4f6', color: t.is_active ? '#16a34a' : '#6b7280' }}>
                                            {t.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button onClick={() => handleEdit(t)} style={{ padding: '5px 10px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                                            <button onClick={() => handleDelete(t.id)} style={{ padding: '5px 10px', background: '#fff', color: '#dc2626', border: '1px solid #dc2626', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}>Del</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Form */}
                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '20px' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 700 }}>{editing ? 'Edit Tax' : 'Add Tax'}</h3>
                    {error && <div style={{ padding: '8px 12px', background: '#fee2e2', color: '#dc2626', borderRadius: '6px', fontSize: '12px', marginBottom: '12px' }}>{error}</div>}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Name <span style={{ color: 'red' }}>*</span></label>
                            <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. CGST" />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Type</label>
                            <select style={inputStyle} value={form.type} onChange={e => set('type', e.target.value)}>
                                <option value="percentage">Percentage (%)</option>
                                <option value="flat">Flat (₹)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Value <span style={{ color: 'red' }}>*</span></label>
                            <input style={inputStyle} type="number" step="0.01" value={form.value} onChange={e => set('value', e.target.value)} placeholder={form.type === 'percentage' ? '9 for 9%' : '50 for ₹50'} />
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                            <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} />
                            Active
                        </label>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '9px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                                {saving ? 'Saving...' : editing ? 'Update' : 'Add Tax'}
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

export default TaxesPage;
