import { useState, useEffect } from 'react';
import ProductForm from '../components/admin/ProductForm';
import ProductList from '../components/admin/ProductList';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../apis/productApi';
import type { Product } from '../types/cms';

type View = 'list' | 'create' | 'edit';

function ProductsPage() {
    const [view, setView] = useState<View>('list');
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        setIsFetching(true);
        try {
            const res = await getAllProducts();
            if (res.success && res.data) setProducts(res.data);
        } catch {
            setError('Failed to load products');
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreate = async (formData: FormData) => {
        setIsLoading(true);
        try {
            const res = await createProduct(formData);
            if (res.success && res.data) {
                setProducts([res.data, ...products]);
                setView('list');
            }
        } catch {
            setError('Failed to create product');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (formData: FormData) => {
        if (!editingProduct) return;
        setIsLoading(true);
        try {
            const res = await updateProduct(editingProduct.id, formData);
            if (res.success && res.data) {
                setProducts(products.map(p => p.id === editingProduct.id ? res.data! : p));
                setView('list');
                setEditingProduct(null);
            }
        } catch {
            setError('Failed to update product');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this product?')) return;
        try {
            await deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        } catch {
            setError('Failed to delete product');
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setView('edit');
    };

    const handleCancel = () => {
        setEditingProduct(null);
        setView('list');
    };

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px', color: 'var(--primary-color)' }}>
                        {view === 'create' ? 'Create Product' : view === 'edit' ? 'Edit Product' : 'Products'}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                        {view === 'list' ? `${products.length} product${products.length !== 1 ? 's' : ''} total` : 'Fill in the product details below'}
                    </p>
                </div>
                {view === 'list' && (
                    <button
                        onClick={() => setView('create')}
                        style={{ padding: '10px 20px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                        + Add Product
                    </button>
                )}
            </div>

            {/* Error */}
            {error && (
                <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                    {error}
                    <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}>×</button>
                </div>
            )}

            {/* Content */}
            {view === 'list' ? (
                isFetching ? (
                    <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>Loading products...</div>
                ) : (
                    <ProductList products={products} onEdit={handleEdit} onDelete={handleDelete} />
                )
            ) : (
                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '24px' }}>
                    <ProductForm
                        onSubmit={view === 'create' ? handleCreate : handleUpdate}
                        onCancel={handleCancel}
                        initialData={editingProduct ?? undefined}
                        isLoading={isLoading}
                    />
                </div>
            )}
        </div>
    );
}

export default ProductsPage;
