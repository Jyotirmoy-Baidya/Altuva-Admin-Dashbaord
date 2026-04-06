import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import type { Product } from '../../types/cms';

interface ProductFormProps {
    onSubmit: (formData: FormData) => Promise<void>;
    onCancel: () => void;
    initialData?: Product;
    isLoading?: boolean;
}

const TABS = ['Basic', 'Pricing & Stock', 'Images', 'Description', 'Food Details', 'Origin & Contact', 'Tags & Status'];

const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');

function TagInput({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
    const [input, setInput] = useState('');

    const add = () => {
        const trimmed = input.trim();
        if (trimmed && !values.includes(trimmed)) {
            onChange([...values, trimmed]);
        }
        setInput('');
    };

    const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));

    return (
        <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>{label}</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
                    placeholder={`Add ${label.toLowerCase()} and press Enter`}
                    style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px' }}
                />
                <button type="button" onClick={add}
                    style={{ padding: '8px 16px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
                    Add
                </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {values.map((v, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: '#f0f0f0', borderRadius: '20px', fontSize: '12px' }}>
                        {v}
                        <button type="button" onClick={() => remove(i)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '14px', lineHeight: 1 }}>×</button>
                    </span>
                ))}
            </div>
        </div>
    );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>
                {label}{required && <span style={{ color: 'red' }}> *</span>}
            </label>
            {children}
        </div>
    );
}

const inputStyle = {
    width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)',
    borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' as const,
};

const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };

function ProductForm({ onSubmit, onCancel, initialData, isLoading }: ProductFormProps) {
    const [activeTab, setActiveTab] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState(initialData?.primary_image || '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const secondaryFileInputRef = useRef<HTMLInputElement>(null);
    const [secondaryPreviewUrl, setSecondaryPreviewUrl] = useState(initialData?.secondary_image || '');
    const [secondaryImageFile, setSecondaryImageFile] = useState<File | null>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>(
        initialData?.images?.map(img => img.url) || []
    );

    const [form, setForm] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        brand: initialData?.brand || '',
        category: initialData?.category || '',
        sub_category: initialData?.sub_category || '',
        type: initialData?.type || 'Edible',
        price: initialData?.price || '',
        discounted_price: initialData?.discounted_price || '',
        discount_percentage: initialData?.discount_percentage || '0',
        currency: initialData?.currency || 'INR',
        stock: String(initialData?.stock ?? 0),
        low_stock_threshold: String(initialData?.low_stock_threshold ?? 5),
        sku: initialData?.sku || '',
        is_in_stock: initialData?.is_in_stock ?? true,
        secondary_image: initialData?.secondary_image || '',
        description: initialData?.description || '',
        detailed_description: initialData?.detailed_description || '',
        shelf_life: initialData?.shelf_life || '',
        storage_instructions: initialData?.storage_instructions || '',
        care_instructions: initialData?.care_instructions || '',
        country_of_origin: initialData?.country_of_origin || '',
        manufacturer_name: initialData?.manufacturer?.name || '',
        manufacturer_address: initialData?.manufacturer?.address || '',
        contact_email: initialData?.contact_email || '',
        contact_phone: initialData?.contact_phone || '',
        amazon_link: initialData?.amazon_link || '',
        weight: initialData?.weight || '',
        is_active: initialData?.is_active ?? true,
        is_featured: initialData?.is_featured ?? false,
        // nutrition
        calories: initialData?.nutrition_info?.calories || '',
        fat: initialData?.nutrition_info?.fat || '',
        carbs: initialData?.nutrition_info?.carbs || '',
        protein: initialData?.nutrition_info?.protein || '',
    });

    const [key_features, setKeyFeatures] = useState<string[]>(initialData?.key_features || []);
    const [ingredients, setIngredients] = useState<string[]>(initialData?.ingredients || []);
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [flavors, setFlavors] = useState<string[]>(initialData?.flavors || []);

    const set = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        set('name', name);
        if (!initialData) set('slug', slugify(name));
    };

    const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSecondaryImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSecondaryImageFile(file);
            setSecondaryPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleGallerySelect = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length) {
            setGalleryFiles(prev => [...prev, ...files]);
            setGalleryPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
        }
        e.target.value = '';
    };

    const removeGalleryImage = (index: number) => {
        setGalleryFiles(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const data = new FormData();

        if (imageFile) data.append('primary_image', imageFile);
        if (secondaryImageFile) data.append('secondary_image', secondaryImageFile);
        galleryFiles.forEach(f => data.append('product_images', f));

        Object.entries(form).forEach(([k, v]) => {
            if (!['calories', 'fat', 'carbs', 'protein', 'manufacturer_name', 'manufacturer_address'].includes(k)) {
                data.append(k, String(v));
            }
        });

        data.append('nutrition_info', JSON.stringify({
            calories: form.calories, fat: form.fat, carbs: form.carbs, protein: form.protein,
        }));
        data.append('manufacturer', JSON.stringify({ name: form.manufacturer_name, address: form.manufacturer_address }));
        data.append('key_features', JSON.stringify(key_features));
        data.append('ingredients', JSON.stringify(ingredients));
        data.append('tags', JSON.stringify(tags));
        data.append('flavors', JSON.stringify(flavors));

        await onSubmit(data);
    };

    const tabContent: Record<number, React.ReactNode> = {
        0: (
            <div>
                <Field label="Product Name" required>
                    <input style={inputStyle} value={form.name} onChange={handleNameChange} placeholder="e.g. Alphonso Mango Jam" required />
                </Field>
                <Field label="Slug" required>
                    <input style={inputStyle} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="auto-generated from name" required />
                </Field>
                <div style={gridStyle}>
                    <Field label="Brand" required>
                        <input style={inputStyle} value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="e.g. Altuva" required />
                    </Field>
                    <Field label="Type">
                        <input style={inputStyle} value={form.type} onChange={e => set('type', e.target.value)} placeholder="e.g. Edible" />
                    </Field>
                </div>
                <div style={gridStyle}>
                    <Field label="Category" required>
                        <input style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Jam, Pickle, Tea" required />
                    </Field>
                    <Field label="Sub Category">
                        <input style={inputStyle} value={form.sub_category} onChange={e => set('sub_category', e.target.value)} placeholder="e.g. Fruit Jam" />
                    </Field>
                </div>
            </div>
        ),
        1: (
            <div>
                <div style={gridStyle}>
                    <Field label="Price (MRP)" required>
                        <input style={inputStyle} type="number" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" required />
                    </Field>
                    <Field label="Discounted Price">
                        <input style={inputStyle} type="number" step="0.01" value={form.discounted_price} onChange={e => set('discounted_price', e.target.value)} placeholder="0.00" />
                    </Field>
                    <Field label="Discount %">
                        <input style={inputStyle} type="number" step="0.01" value={form.discount_percentage} onChange={e => set('discount_percentage', e.target.value)} />
                    </Field>
                    <Field label="Currency">
                        <input style={inputStyle} value={form.currency} onChange={e => set('currency', e.target.value)} placeholder="INR" />
                    </Field>
                </div>
                <div style={{ background: '#f8f8f8', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 700 }}>Inventory</h4>
                    <div style={gridStyle}>
                        <Field label="Stock" required>
                            <input style={inputStyle} type="number" value={form.stock} onChange={e => set('stock', e.target.value)} required />
                        </Field>
                        <Field label="Low Stock Threshold">
                            <input style={inputStyle} type="number" value={form.low_stock_threshold} onChange={e => set('low_stock_threshold', e.target.value)} />
                        </Field>
                        <Field label="SKU">
                            <input style={inputStyle} value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="e.g. ALT-JAM-001" />
                        </Field>
                        <Field label="Weight">
                            <input style={inputStyle} value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="e.g. 500g" />
                        </Field>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                        <input type="checkbox" checked={form.is_in_stock} onChange={e => set('is_in_stock', e.target.checked)} />
                        In Stock
                    </label>
                </div>
            </div>
        ),
        2: (
            <div>
                {/* Primary Image */}
                <Field label="Primary Image" required>
                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageSelect} />
                    <div onClick={() => fileInputRef.current?.click()}
                        style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer', marginBottom: '8px' }}>
                        {previewUrl ? (
                            <img src={previewUrl} alt="primary" style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: '6px' }} />
                        ) : (
                            <div>
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Click to upload primary image</p>
                            </div>
                        )}
                    </div>
                    {previewUrl && (
                        <button type="button" onClick={() => fileInputRef.current?.click()}
                            style={{ padding: '6px 14px', border: '1px solid var(--border-color)', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '12px' }}>
                            Change
                        </button>
                    )}
                </Field>

                {/* Secondary Image */}
                <Field label="Secondary Image">
                    <input ref={secondaryFileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleSecondaryImageSelect} />
                    <div onClick={() => secondaryFileInputRef.current?.click()}
                        style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer', marginBottom: '8px' }}>
                        {secondaryPreviewUrl ? (
                            <img src={secondaryPreviewUrl} alt="secondary" style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: '6px' }} />
                        ) : (
                            <div>
                                <div style={{ fontSize: '28px', marginBottom: '8px' }}>🖼️</div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Click to upload secondary image</p>
                            </div>
                        )}
                    </div>
                    {secondaryPreviewUrl && (
                        <button type="button" onClick={() => secondaryFileInputRef.current?.click()}
                            style={{ padding: '6px 14px', border: '1px solid var(--border-color)', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '12px' }}>
                            Change
                        </button>
                    )}
                </Field>

                {/* Gallery Images */}
                <Field label="Product Gallery (up to 10 images)">
                    <input ref={galleryInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleGallerySelect} />
                    {galleryPreviews.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                            {galleryPreviews.map((url, i) => (
                                <div key={i} style={{ position: 'relative' }}>
                                    <img src={url} alt={`gallery-${i}`} style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }} />
                                    <button type="button" onClick={() => removeGalleryImage(i)}
                                        style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: '#dc2626', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <button type="button" onClick={() => galleryInputRef.current?.click()}
                        style={{ padding: '8px 16px', border: '2px dashed var(--border-color)', borderRadius: '8px', background: '#fafafa', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)', width: '100%' }}>
                        + Add Gallery Images
                    </button>
                </Field>
            </div>
        ),
        3: (
            <div>
                <Field label="Description" required>
                    <textarea
                        style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                        value={form.description}
                        onChange={e => set('description', e.target.value)}
                        placeholder="Short product description"
                        required
                    />
                </Field>
                <Field label="Detailed Description">
                    <textarea
                        style={{ ...inputStyle, minHeight: '140px', resize: 'vertical' }}
                        value={form.detailed_description}
                        onChange={e => set('detailed_description', e.target.value)}
                        placeholder="Full product details..."
                    />
                </Field>
                <TagInput label="Key Features" values={key_features} onChange={setKeyFeatures} />
            </div>
        ),
        4: (
            <div>
                <TagInput label="Ingredients" values={ingredients} onChange={setIngredients} />
                <div style={{ background: '#f8f8f8', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 700 }}>Nutrition Info (per serving)</h4>
                    <div style={gridStyle}>
                        <Field label="Calories"><input style={inputStyle} value={form.calories} onChange={e => set('calories', e.target.value)} placeholder="e.g. 120kcal" /></Field>
                        <Field label="Fat"><input style={inputStyle} value={form.fat} onChange={e => set('fat', e.target.value)} placeholder="e.g. 2g" /></Field>
                        <Field label="Carbs"><input style={inputStyle} value={form.carbs} onChange={e => set('carbs', e.target.value)} placeholder="e.g. 28g" /></Field>
                        <Field label="Protein"><input style={inputStyle} value={form.protein} onChange={e => set('protein', e.target.value)} placeholder="e.g. 1g" /></Field>
                    </div>
                </div>
                <div style={gridStyle}>
                    <Field label="Shelf Life">
                        <input style={inputStyle} value={form.shelf_life} onChange={e => set('shelf_life', e.target.value)} placeholder="e.g. 6 months" />
                    </Field>
                    <Field label="Care Instructions">
                        <input style={inputStyle} value={form.care_instructions} onChange={e => set('care_instructions', e.target.value)} placeholder="e.g. Keep refrigerated after opening" />
                    </Field>
                </div>
                <Field label="Storage Instructions">
                    <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.storage_instructions} onChange={e => set('storage_instructions', e.target.value)} placeholder="Store in a cool, dry place..." />
                </Field>
            </div>
        ),
        5: (
            <div>
                <div style={gridStyle}>
                    <Field label="Country of Origin">
                        <input style={inputStyle} value={form.country_of_origin} onChange={e => set('country_of_origin', e.target.value)} placeholder="India" />
                    </Field>
                    <Field label="Contact Email">
                        <input style={inputStyle} type="email" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} />
                    </Field>
                    <Field label="Contact Phone">
                        <input style={inputStyle} value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)} />
                    </Field>
                    <Field label="Amazon Link">
                        <input style={inputStyle} value={form.amazon_link} onChange={e => set('amazon_link', e.target.value)} placeholder="https://amazon.in/..." />
                    </Field>
                </div>
                <div style={{ background: '#f8f8f8', padding: '16px', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 700 }}>Manufacturer</h4>
                    <div style={gridStyle}>
                        <Field label="Name"><input style={inputStyle} value={form.manufacturer_name} onChange={e => set('manufacturer_name', e.target.value)} /></Field>
                        <Field label="Address"><input style={inputStyle} value={form.manufacturer_address} onChange={e => set('manufacturer_address', e.target.value)} /></Field>
                    </div>
                </div>
            </div>
        ),
        6: (
            <div>
                <TagInput label="Tags" values={tags} onChange={setTags} />
                <TagInput label="Flavors" values={flavors} onChange={setFlavors} />
                <div style={{ background: '#f8f8f8', padding: '16px', borderRadius: '8px', marginTop: '8px' }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: 700 }}>Status</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                            <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} />
                            Active (visible on store)
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                            <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} />
                            Featured product
                        </label>
                    </div>
                </div>
            </div>
        ),
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Tab Nav */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', paddingBottom: '0' }}>
                {TABS.map((tab, i) => (
                    <button
                        key={i} type="button" onClick={() => setActiveTab(i)}
                        style={{
                            padding: '8px 14px', border: 'none', borderRadius: '6px 6px 0 0',
                            background: activeTab === i ? 'var(--primary-color)' : 'transparent',
                            color: activeTab === i ? '#fff' : 'var(--text-secondary)',
                            cursor: 'pointer', fontSize: '12px', fontWeight: activeTab === i ? 700 : 400,
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div style={{ minHeight: '320px' }}>
                {tabContent[activeTab]}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button type="button" onClick={onCancel}
                    style={{ padding: '10px 20px', border: '1px solid var(--border-color)', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '13px' }}>
                    Cancel
                </button>
                <button type="submit" disabled={isLoading}
                    style={{ padding: '10px 24px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, opacity: isLoading ? 0.7 : 1 }}>
                    {isLoading ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
                </button>
            </div>
        </form>
    );
}

export default ProductForm;
