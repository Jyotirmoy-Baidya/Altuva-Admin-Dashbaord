import { useEffect, useRef, useState } from 'react';
import {
    getShowcaseTeaTags, createShowcaseTeaTag, updateShowcaseTeaTag, deleteShowcaseTeaTag,
    getShowcaseTeaProducts, createShowcaseTeaProduct, updateShowcaseTeaProduct, deleteShowcaseTeaProduct,
} from '../apis/adminStoreApi';
import { getAllProducts } from '../apis/productApi';

interface Tag { id: number; name: string; sort_order: number; }
interface ShowcaseProduct { id: number; name: string; image_url: string; tag_id: number; product_id: number; sort_order: number; }
interface Product { id: number; name: string; slug: string; }

const emptyTag = { name: '', sort_order: 0 };
const emptyProduct = { name: '', tag_id: 0, product_id: 0, sort_order: 0 };

function ShowcaseTeaPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [products, setProducts] = useState<ShowcaseProduct[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    const [tagForm, setTagForm] = useState(emptyTag);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [tagError, setTagError] = useState('');
    const [savingTag, setSavingTag] = useState(false);

    const [productForm, setProductForm] = useState(emptyProduct);
    const [editingProduct, setEditingProduct] = useState<ShowcaseProduct | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [productError, setProductError] = useState('');
    const [savingProduct, setSavingProduct] = useState(false);
    const [loading, setLoading] = useState(true);

    const fileRef = useRef<HTMLInputElement>(null);

    const load = async () => {
        const [t, p, ap] = await Promise.all([
            getShowcaseTeaTags(),
            getShowcaseTeaProducts(),
            getAllProducts(),
        ]);
        setTags(t.data || []);
        setProducts(p.data || []);
        setAllProducts(ap.data || []);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    // ─── Tag handlers ──────────────────────────────────────────────────────────

    const handleEditTag = (t: Tag) => {
        setEditingTag(t);
        setTagForm({ name: t.name, sort_order: t.sort_order });
        setTagError('');
    };

    const handleCancelTag = () => { setEditingTag(null); setTagForm(emptyTag); setTagError(''); };

    const handleSaveTag = async () => {
        if (!tagForm.name.trim()) { setTagError('Name is required'); return; }
        setSavingTag(true); setTagError('');
        try {
            if (editingTag) {
                const r = await updateShowcaseTeaTag(editingTag.id, tagForm);
                setTags(tags.map(t => t.id === editingTag.id ? r.data : t));
            } else {
                const r = await createShowcaseTeaTag(tagForm);
                setTags([...tags, r.data]);
            }
            handleCancelTag();
        } catch (e: any) {
            setTagError(e?.response?.data?.message || 'Failed to save');
        } finally {
            setSavingTag(false);
        }
    };

    const handleDeleteTag = async (id: number) => {
        if (!confirm('Delete this tag? Products using it will also be deleted.')) return;
        await deleteShowcaseTeaTag(id);
        setTags(tags.filter(t => t.id !== id));
        setProducts(products.filter(p => p.tag_id !== id));
    };

    // ─── Product handlers ──────────────────────────────────────────────────────

    const handleEditProduct = (p: ShowcaseProduct) => {
        setEditingProduct(p);
        setProductForm({ name: p.name, tag_id: p.tag_id, product_id: p.product_id, sort_order: p.sort_order });
        setImagePreview(p.image_url);
        setImageFile(null);
        setProductError('');
    };

    const handleCancelProduct = () => {
        setEditingProduct(null);
        setProductForm(emptyProduct);
        setImageFile(null);
        setImagePreview('');
        if (fileRef.current) fileRef.current.value = '';
        setProductError('');
    };

    const handleSaveProduct = async () => {
        if (!productForm.name.trim()) { setProductError('Name is required'); return; }
        if (!productForm.tag_id) { setProductError('Tag is required'); return; }
        if (!productForm.product_id) { setProductError('Product is required'); return; }
        if (!editingProduct && !imageFile) { setProductError('Image is required'); return; }
        setSavingProduct(true); setProductError('');
        try {
            const fd = new FormData();
            fd.append('name', productForm.name);
            fd.append('tag_id', String(productForm.tag_id));
            fd.append('product_id', String(productForm.product_id));
            fd.append('sort_order', String(productForm.sort_order));
            if (imageFile) fd.append('image', imageFile);

            if (editingProduct) {
                const r = await updateShowcaseTeaProduct(editingProduct.id, fd);
                setProducts(products.map(p => p.id === editingProduct.id ? r.data : p));
            } else {
                const r = await createShowcaseTeaProduct(fd);
                setProducts([...products, r.data]);
            }
            handleCancelProduct();
        } catch (e: any) {
            setProductError(e?.response?.data?.message || 'Failed to save');
        } finally {
            setSavingProduct(false);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm('Delete this showcase product?')) return;
        await deleteShowcaseTeaProduct(id);
        setProducts(products.filter(p => p.id !== id));
    };

    // ─── Styles ────────────────────────────────────────────────────────────────

    const card: React.CSSProperties = { background: 'var(--card-background)', borderRadius: 12, padding: 24, border: '1px solid var(--border-color)' };
    const label: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' };
    const input: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 14, background: 'var(--input-background)', color: 'var(--text-primary)', boxSizing: 'border-box' };
    const btn = (variant: 'primary' | 'danger' | 'ghost'): React.CSSProperties => ({
        padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
        ...(variant === 'primary' && { background: 'var(--primary-color)', color: 'white' }),
        ...(variant === 'danger'  && { background: '#fee2e2', color: '#dc2626' }),
        ...(variant === 'ghost'   && { background: 'var(--border-color)', color: 'var(--text-primary)' }),
    });

    if (loading) return <div style={{ padding: 32, color: 'var(--text-secondary)' }}>Loading…</div>;

    return (
        <div style={{ padding: 32, maxWidth: 960 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>Showcase Tea</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 32 }}>
                Manage tags and products shown in the Showcase Tea section on the landing page.
            </p>

            {/* ── TAGS SECTION ── */}
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>Tags</h2>

            <div style={{ ...card, marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>
                    {editingTag ? 'Edit Tag' : 'Add Tag'}
                </h3>
                {tagError && <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#dc2626', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{tagError}</div>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 12, marginBottom: 16 }}>
                    <div>
                        <label style={label}>Tag Name *</label>
                        <input style={input} value={tagForm.name} onChange={e => setTagForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Caffeine Free" />
                    </div>
                    <div>
                        <label style={label}>Sort Order</label>
                        <input style={input} type="number" value={tagForm.sort_order} onChange={e => setTagForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button style={btn('primary')} onClick={handleSaveTag} disabled={savingTag}>
                        {savingTag ? 'Saving…' : editingTag ? 'Update Tag' : 'Add Tag'}
                    </button>
                    {editingTag && <button style={btn('ghost')} onClick={handleCancelTag}>Cancel</button>}
                </div>
            </div>

            {tags.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 32 }}>No tags yet.</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
                    {tags.map(t => (
                        <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'var(--card-background)', border: '1px solid var(--border-color)', borderRadius: 99, fontSize: 13 }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</span>
                            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>#{t.sort_order}</span>
                            <button style={{ ...btn('ghost'), padding: '3px 10px', fontSize: 12 }} onClick={() => handleEditTag(t)}>Edit</button>
                            <button style={{ ...btn('danger'), padding: '3px 10px', fontSize: 12 }} onClick={() => handleDeleteTag(t.id)}>✕</button>
                        </div>
                    ))}
                </div>
            )}

            {/* ── PRODUCTS SECTION ── */}
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>Showcase Products</h2>

            <div style={{ ...card, marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>
                    {editingProduct ? 'Edit Product' : 'Add Product'}
                </h3>
                {productError && <div style={{ padding: '10px 14px', background: '#fee2e2', color: '#dc2626', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{productError}</div>}

                {/* Image */}
                <div style={{ marginBottom: 20 }}>
                    <label style={label}>Product Image</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        {imagePreview ? (
                            <img src={imagePreview} alt="preview" style={{ width: 90, height: 120, objectFit: 'contain', borderRadius: 10, border: '1px solid var(--border-color)', flexShrink: 0, background: '#f8f8f8' }} />
                        ) : (
                            <div style={{ width: 90, height: 120, borderRadius: 10, border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: 11, flexShrink: 0 }}>
                                No image
                            </div>
                        )}
                        <div>
                            <input ref={fileRef} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} style={{ display: 'none' }} />
                            <button style={btn('ghost')} onClick={() => fileRef.current?.click()}>
                                {imagePreview ? 'Change Image' : 'Upload Image'}
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <div>
                        <label style={label}>Display Name *</label>
                        <input style={input} value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} placeholder="Hibiscus Tea" />
                    </div>
                    <div>
                        <label style={label}>Sort Order</label>
                        <input style={input} type="number" value={productForm.sort_order} onChange={e => setProductForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
                    </div>
                    <div>
                        <label style={label}>Tag *</label>
                        <select style={input} value={productForm.tag_id} onChange={e => setProductForm(f => ({ ...f, tag_id: parseInt(e.target.value) }))}>
                            <option value={0}>Select a tag…</option>
                            {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={label}>Linked Product *</label>
                        <select style={input} value={productForm.product_id} onChange={e => setProductForm(f => ({ ...f, product_id: parseInt(e.target.value) }))}>
                            <option value={0}>Select a product…</option>
                            {allProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                    <button style={btn('primary')} onClick={handleSaveProduct} disabled={savingProduct}>
                        {savingProduct ? 'Saving…' : editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                    {editingProduct && <button style={btn('ghost')} onClick={handleCancelProduct}>Cancel</button>}
                </div>
            </div>

            {products.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No showcase products yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {products.map(p => {
                        const tag = tags.find(t => t.id === p.tag_id);
                        const linked = allProducts.find(ap => ap.id === p.product_id);
                        return (
                            <div key={p.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}>
                                <img src={p.image_url} alt={p.name} style={{ width: 60, height: 80, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--border-color)', flexShrink: 0, background: '#f8f8f8' }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>{p.name}</p>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 99, background: '#e0f2fe', color: '#0369a1', fontWeight: 600 }}>
                                            {tag?.name || `Tag #${p.tag_id}`}
                                        </span>
                                        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                                            → {linked?.name || `Product #${p.product_id}`}
                                        </span>
                                        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Order: {p.sort_order}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                    <button style={btn('ghost')} onClick={() => handleEditProduct(p)}>Edit</button>
                                    <button style={btn('danger')} onClick={() => handleDeleteProduct(p.id)}>Delete</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ShowcaseTeaPage;
