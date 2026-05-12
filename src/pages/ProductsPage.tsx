import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
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

    const getErrMsg = (e: unknown, fallback: string) => {
        if (e && typeof e === 'object' && 'response' in e) {
            const res = (e as { response?: { data?: { message?: string } } }).response;
            if (res?.data?.message) return res.data.message;
        }
        if (e instanceof Error) return e.message;
        return fallback;
    };

    const fetchProducts = async () => {
        setIsFetching(true);
        try {
            const res = await getAllProducts();
            if (res.success && res.data) setProducts(res.data);
        } catch (e) {
            toast.error(getErrMsg(e, 'Failed to load products'));
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreate = async (formData: FormData) => {
        setIsLoading(true);
        const toastId = toast.loading('Creating product...');
        try {
            const res = await createProduct(formData);
            if (res.success && res.data) {
                setProducts([res.data, ...products]);
                setView('list');
                toast.success('Product created successfully!', { id: toastId });
            } else {
                toast.error(res.message || 'Failed to create product', { id: toastId });
            }
        } catch (e) {
            toast.error(getErrMsg(e, 'Failed to create product'), { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (formData: FormData) => {
        if (!editingProduct) return;
        setIsLoading(true);
        const toastId = toast.loading('Updating product...');
        try {
            const res = await updateProduct(editingProduct.id, formData);
            if (res.success && res.data) {
                setProducts(products.map(p => p.id === editingProduct.id ? res.data! : p));
                setView('list');
                setEditingProduct(null);
                toast.success('Product updated successfully!', { id: toastId });
            } else {
                toast.error(res.message || 'Failed to update product', { id: toastId });
            }
        } catch (e) {
            toast.error(getErrMsg(e, 'Failed to update product'), { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this product?')) return;
        const toastId = toast.loading('Deleting product...');
        try {
            await deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
            toast.success('Product deleted', { id: toastId });
        } catch (e) {
            toast.error(getErrMsg(e, 'Failed to delete product'), { id: toastId });
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
