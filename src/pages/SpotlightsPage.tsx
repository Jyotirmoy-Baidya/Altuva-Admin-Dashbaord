import { useEffect, useRef, useState } from 'react';
import { getSpotlights, createSpotlight, updateSpotlight, deleteSpotlight } from '../apis/adminStoreApi';
import ColorPicker from '../components/admin/ColorPicker';

interface Spotlight {
    id: number;
    image_url: string;
    quote: string;
    person_name: string;
    bg_color: string;
    sort_order: number;
    is_active: boolean;
}

const empty = { quote: '', person_name: '', bg_color: '#3B0E0E', sort_order: 0, is_active: true };

function SpotlightsPage() {
    const [items, setItems] = useState<Spotlight[]>([]);
    const [form, setForm] = useState(empty);
    const [editing, setEditing] = useState<Spotlight | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    const load = () =>
        getSpotlights()
            .then(r => setItems(r.data || []))
            .finally(() => setLoading(false));

    useEffect(() => { load(); }, []);

    const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleEdit = (s: Spotlight) => {
        setEditing(s);
        setForm({ quote: s.quote, person_name: s.person_name, bg_color: s.bg_color || '#3B0E0E', sort_order: s.sort_order, is_active: s.is_active });
        setImagePreview(s.image_url);
        setImageFile(null);
    };

    const handleCancel = () => {
        setEditing(null);
        setForm(empty);
        setImageFile(null);
        setImagePreview('');
        if (fileRef.current) fileRef.current.value = '';
        setError('');
    };

    const handleSave = async () => {
        if (!form.quote || !form.person_name) { setError('Quote and person name are required'); return; }
        if (!editing && !imageFile) { setError('Image is required'); return; }
        setSaving(true); setError('');
        try {
            const fd = new FormData();
            fd.append('quote', form.quote);
            fd.append('person_name', form.person_name);
            fd.append('sort_order', String(form.sort_order));
            fd.append('is_active', String(form.is_active));
            fd.append('bg_color', form.bg_color);
            if (imageFile) fd.append('image', imageFile);

            if (editing) {
                const updated = await updateSpotlight(editing.id, fd);
                setItems(items.map(i => i.id === editing.id ? updated.data : i));
            } else {
                const created = await createSpotlight(fd);
                setItems([...items, created.data]);
            }
            handleCancel();
        } catch (e: any) {
            setError(e?.response?.data?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this spotlight?')) return;
        await deleteSpotlight(id);
        setItems(items.filter(i => i.id !== id));
    };

    const card: React.CSSProperties = { background: 'var(--card-background)', borderRadius: 12, padding: 24, border: '1px solid var(--border-color)' };
    const label: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' };
    const input: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 14, background: 'var(--input-background)', color: 'var(--text-primary)', boxSizing: 'border-box' };
    const btn = (variant: 'primary' | 'danger' | 'ghost'): React.CSSProperties => ({
        padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
        ...(variant === 'primary' && { background: 'var(--primary-color)', color: 'white' }),
        ...(variant === 'danger'  && { background: '#fee2e2', color: '#dc2626' }),
        ...(variant === 'ghost'   && { background: 'var(--border-color)', color: 'var(--text-primary)' }),
    });

    return (
        <div style={{ padding: 32, maxWidth: 900 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: 'var(--text-primary)' }}>Spotlights</h1>

            {/* Form */}
            <div style={{ ...card, marginBottom: 32 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: 'var(--text-primary)' }}>
                    {editing ? 'Edit Spotlight' : 'Add Spotlight'}
                </h2>

                {error && (
                    <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#dc2626', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
                        {error}
                    </div>
                )}

                {/* Image upload — square crop hint */}
                <div style={{ marginBottom: 20 }}>
                    <label style={label}>Image (1:1 square)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        {imagePreview ? (
                            <div style={{ width: 100, height: 100, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-color)', flexShrink: 0 }}>
                                <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        ) : (
                            <div style={{ width: 100, height: 100, borderRadius: 12, border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: 12, flexShrink: 0 }}>
                                1:1
                            </div>
                        )}
                        <div>
                            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                            <button style={btn('ghost')} onClick={() => fileRef.current?.click()}>
                                {imagePreview ? 'Change Image' : 'Upload Image'}
                            </button>
                            <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6 }}>Upload a square image for best results</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                        <label style={label}>Person Name *</label>
                        <input style={input} value={form.person_name} onChange={e => set('person_name', e.target.value)} placeholder="Jane Doe" />
                    </div>
                    <div>
                        <label style={label}>Sort Order</label>
                        <input style={input} type="number" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
                    </div>
                </div>

                {/* Background color */}
                <div style={{ marginBottom: 16 }}>
                    <ColorPicker
                        label="Card Background Color"
                        value={form.bg_color}
                        onChange={v => set('bg_color', v)}
                    />
                    {/* Live preview */}
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: form.bg_color, border: '1px solid var(--border-color)', flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Preview of card background</span>
                    </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label style={label}>Quote *</label>
                    <textarea
                        style={{ ...input, minHeight: 90, resize: 'vertical' }}
                        value={form.quote}
                        onChange={e => set('quote', e.target.value)}
                        placeholder="Their testimonial or quote…"
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                    <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} />
                    <label htmlFor="is_active" style={{ fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer' }}>Active</label>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                    <button style={btn('primary')} onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving…' : editing ? 'Update' : 'Add Spotlight'}
                    </button>
                    {editing && <button style={btn('ghost')} onClick={handleCancel}>Cancel</button>}
                </div>
            </div>

            {/* List */}
            {loading ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading…</p>
            ) : items.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No spotlights yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {items.map(s => (
                        <div key={s.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}>
                            <img
                                src={s.image_url}
                                alt={s.person_name}
                                style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border-color)' }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>{s.person_name}</p>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    "{s.quote}"
                                </p>
                                <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                                    <span style={{ fontSize: 11, color: s.is_active ? '#16a34a' : '#dc2626', background: s.is_active ? '#dcfce7' : '#fee2e2', padding: '2px 8px', borderRadius: 99 }}>
                                        {s.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Order: {s.sort_order}</span>
                                    <div style={{ width: 16, height: 16, borderRadius: 4, background: s.bg_color || '#3B0E0E', border: '1px solid var(--border-color)' }} title={s.bg_color} />
                                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{s.bg_color}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                <button style={btn('ghost')} onClick={() => handleEdit(s)}>Edit</button>
                                <button style={btn('danger')} onClick={() => handleDelete(s.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SpotlightsPage;
