import type { Product } from '../../types/cms';

interface ProductListProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
}

function ProductList({ products, onEdit, onDelete }: ProductListProps) {
    if (products.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)', background: '#fff', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
                <p>No products yet. Create your first product.</p>
            </div>
        );
    }

    return (
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f8f8f8', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={th}>Image</th>
                        <th style={th}>Product</th>
                        <th style={th}>Category</th>
                        <th style={th}>Price</th>
                        <th style={th}>Stock</th>
                        <th style={th}>Status</th>
                        <th style={th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={td}>
                                <img
                                    src={p.primary_image}
                                    alt={p.name}
                                    style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                                />
                            </td>
                            <td style={td}>
                                <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '2px' }}>{p.name}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{p.brand} · {p.sku || 'No SKU'}</div>
                            </td>
                            <td style={td}>
                                <div style={{ fontSize: '13px' }}>{p.category}</div>
                                {p.sub_category && <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{p.sub_category}</div>}
                            </td>
                            <td style={td}>
                                <div style={{ fontSize: '13px', fontWeight: 600 }}>₹{p.discounted_price || p.price}</div>
                                {p.discounted_price && (
                                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>₹{p.price}</div>
                                )}
                            </td>
                            <td style={td}>
                                <span style={{
                                    fontSize: '12px', fontWeight: 600,
                                    color: Number(p.stock) <= Number(p.low_stock_threshold ?? 5) ? '#d97706' : '#16a34a',
                                }}>
                                    {p.stock} units
                                </span>
                            </td>
                            <td style={td}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ ...badge, background: p.is_active ? '#dcfce7' : '#fee2e2', color: p.is_active ? '#16a34a' : '#dc2626' }}>
                                        {p.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                    {p.is_featured && (
                                        <span style={{ ...badge, background: '#fef9c3', color: '#ca8a04' }}>Featured</span>
                                    )}
                                </div>
                            </td>
                            <td style={td}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => onEdit(p)}
                                        style={{ padding: '6px 12px', background: 'var(--primary-color)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                                        Edit
                                    </button>
                                    <button onClick={() => onDelete(p.id)}
                                        style={{ padding: '6px 12px', background: '#fff', color: '#dc2626', border: '1px solid #dc2626', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const th: React.CSSProperties = {
    padding: '12px 16px', textAlign: 'left', fontSize: '12px',
    fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em',
};

const td: React.CSSProperties = {
    padding: '12px 16px', verticalAlign: 'middle',
};

const badge: React.CSSProperties = {
    display: 'inline-block', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
};

export default ProductList;
