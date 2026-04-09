import { useEffect, useState } from 'react';
import { getPopularSections, createPopularSection, updatePopularSection, deletePopularSection } from '../apis/adminStoreApi';
import { getAllProducts } from '../apis/productApi';

interface ProductOption { id: number; name: string; slug: string; primary_image: string; }
interface PopularSection {
    id: number;
    category: string;
    title: string;
    subtitle: string;
    cta_text: string;
    cta_url: string;
    product_1_slug: string;
    product_2_slug: string;
    sort_order: number;
    is_active: boolean;
}

const empty = {
    category: '', title: '', subtitle: '',
    cta_text: 'Shop All Products', cta_url: '/products',
    product_1_slug: '', product_2_slug: '',
    sort_order: 0, is_active: true,
};

function PopularSectionsPage() {
    const [sections, setSections] = useState<PopularSection[]>([]);
    const [products, setProducts] = useState<ProductOption[]>([]);
    const [form, setForm] = useState(empty);
    const [editing, setEditing] = useState<PopularSection | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getPopularSections().then(r => setSections(r.data || [])).finally(() => setLoading(false));
        getAllProducts().then(r => setProducts((r.data || []).map((p: any) => ({ id: p.id, name: p.name, slug: p.slug, primary_image: p.primary_image }))));
    }, []);

    const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

    const handleEdit = (s: PopularSection) => {
        setEditing(s);
        setForm({ category: s.category, title: s.title, subtitle: s.subtitle || '', cta_text: s.cta_text, cta_url: s.cta_url, product_1_slug: s.product_1_slug || '', product_2_slug: s.product_2_slug || '', sort_order: s.sort_order, is_active: s.is_active });
    };

    const handleCancel = () => { setEditing(null); setForm(empty); setError(''); };

    const handleSave = async () => {
        if (!form.category || !form.title) { setError('Category and title are required'); return; }
        setSaving(true); setError('');
        try {
            if (editing) {
                const updated = await updatePopularSection(editing.id, form);
                setSections(sections.map(s => s.id === editing.id ? updated.data : s));
            } else {
                const created = await createPopularSection(form);
                setSections([...sections, created.data]);
            }
            handleCancel();
        } catch (e: any) {
            setError(e?.response?.data?.message || 'Failed to save');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this section?')) return;
        await deletePopularSection(id);
        setSections(sections.filter(s => s.id !== id));
    };

    const card: React.CSSProperties = { background: 'var(--card-background)', borderRadius: 12, padding: 24, border: '1px solid var(--border-color)' };
    const label: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' };
    const input: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 14, background: 'var(--input-background)', color: 'var(--text-primary)', boxSizing: 'border-box' };
    const btn = (v: 'primary' | 'danger' | 'ghost'): React.CSSProperties => ({
        padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
        ...(v === 'primary' && { background: 'var(--primary-color)', color: 'white' }),
        ...(v === 'danger'  && { background: '#fee2e2', color: '#dc2626' }),
        ...(v === 'ghost'   && { background: 'var(--border-color)', color: 'var(--text-primary)' }),
    });

    // Product selector component inline
    const ProductSelect = ({ field, value }: { field: 'product_1_slug' | 'product_2_slug'; value: string }) => {
        const selected = products.find(p => p.slug === value);
        return (
            <div>
                <select
                    style={input}
                    value={value}
                    onChange={e => set(field, e.target.value)}
                >
                    <option value="">— None —</option>
                    {products.map(p => (
                        <option key={p.slug} value={p.slug}>{p.name}</option>
                    ))}
                </select>
                {selected && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                        <img src={selected.primary_image} alt={selected.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border-color)' }} />
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{selected.name}</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{ padding: 32, maxWidth: 900 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24, color: 'var(--text-primary)' }}>People's Choice</h1>

            {/* Form */}
            <div style={{ ...card, marginBottom: 32 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: 'var(--text-primary)' }}>
                    {editing ? 'Edit Section' : 'Add Section'}
                </h2>

                {error && <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#dc2626', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{error}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                        <label style={label}>Category Name *</label>
                        <input style={input} value={form.category} onChange={e => set('category', e.target.value)} placeholder="JAMS" />
                    </div>
                    <div>
                        <label style={label}>Sort Order</label>
                        <input style={input} type="number" value={form.sort_order} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
                    </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label style={label}>Title *</label>
                    <textarea style={{ ...input, minHeight: 60, resize: 'vertical' }} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Taste The Sweetness\nFind Your Flavour" />
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>Use \n for line breaks</p>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label style={label}>Subtitle</label>
                    <textarea style={{ ...input, minHeight: 60, resize: 'vertical' }} value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Devour into the handmade delight…" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                        <label style={label}>CTA Button Text</label>
                        <input style={input} value={form.cta_text} onChange={e => set('cta_text', e.target.value)} placeholder="Shop All Products" />
                    </div>
                    <div>
                        <label style={label}>CTA Redirect URL</label>
                        <input style={input} value={form.cta_url} onChange={e => set('cta_url', e.target.value)} placeholder="/products" />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                        <label style={label}>Product 1</label>
                        <ProductSelect field="product_1_slug" value={form.product_1_slug} />
                    </div>
                    <div>
                        <label style={label}>Product 2</label>
                        <ProductSelect field="product_2_slug" value={form.product_2_slug} />
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                    <input type="checkbox" id="ps_active" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} />
                    <label htmlFor="ps_active" style={{ fontSize: 13, color: 'var(--text-primary)', cursor: 'pointer' }}>Active</label>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                    <button style={btn('primary')} onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : editing ? 'Update' : 'Add Section'}</button>
                    {editing && <button style={btn('ghost')} onClick={handleCancel}>Cancel</button>}
                </div>
            </div>

            {/* List */}
            {loading ? <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Loading…</p>
                : sections.length === 0 ? <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No sections yet.</p>
                : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {sections.map(s => {
                            const p1 = products.find(p => p.slug === s.product_1_slug);
                            const p2 = products.find(p => p.slug === s.product_2_slug);
                            return (
                                <div key={s.id} style={{ ...card, padding: 16 }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', background: 'var(--border-color)', padding: '2px 10px', borderRadius: 99 }}>{s.category}</span>
                                                <span style={{ fontSize: 11, color: s.is_active ? '#16a34a' : '#dc2626', background: s.is_active ? '#dcfce7' : '#fee2e2', padding: '2px 8px', borderRadius: 99 }}>{s.is_active ? 'Active' : 'Inactive'}</span>
                                                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Order: {s.sort_order}</span>
                                            </div>
                                            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'pre-line', marginBottom: 2 }}>{s.title}</p>
                                            {s.subtitle && <p style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'pre-line', marginBottom: 6 }}>{s.subtitle}</p>}
                                            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                                CTA: <strong>{s.cta_text}</strong> → {s.cta_url}
                                            </p>
                                            {(p1 || p2) && (
                                                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                                    {[p1, p2].filter(Boolean).map((p, i) => p && (
                                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--border-color)', padding: '4px 8px', borderRadius: 8 }}>
                                                            <img src={p.primary_image} style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: 4 }} />
                                                            <span style={{ fontSize: 11, color: 'var(--text-primary)' }}>{p.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                            <button style={btn('ghost')} onClick={() => handleEdit(s)}>Edit</button>
                                            <button style={btn('danger')} onClick={() => handleDelete(s.id)}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
        </div>
    );
}

export default PopularSectionsPage;
