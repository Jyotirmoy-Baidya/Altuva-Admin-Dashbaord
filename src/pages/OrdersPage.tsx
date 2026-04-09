import { useEffect, useState } from 'react';
import { getAllOrders, getOrderDetail, updateOrderStatus } from '../apis/orderApi';
import type { Order, OrderStatus } from '../types/order';
import { ORDER_STATUS_LABELS, ADMIN_STATUS_FLOW } from '../types/order';

const STATUS_COLORS: Record<string, string> = {
    payment_pending: '#f59e0b',
    placed: '#3b82f6',
    confirmed: '#8b5cf6',
    packed: '#06b6d4',
    dispatched: '#f97316',
    out_for_delivery: '#84cc16',
    delivered: '#22c55e',
    canceled: '#ef4444',
    refunded: '#6b7280',
};

const fmt = (n: string | number) => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const [selected, setSelected] = useState<Order | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');
    const [confirmModal, setConfirmModal] = useState<{ show: boolean; status: OrderStatus; stockPrompt: boolean } | null>(null);

    const LIMIT = 20;
    const totalPages = Math.ceil(total / LIMIT);

    const load = () => {
        setLoading(true);
        getAllOrders({ page, status: statusFilter || undefined })
            .then(res => { setOrders(res.data.orders); setTotal(res.data.total); })
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [page, statusFilter]);

    const openDetail = (id: number) => {
        setDetailLoading(true);
        setSelected(null);
        setNewStatus('');
        getOrderDetail(id)
            .then(res => { setSelected(res.data); setNewStatus(res.data.status); })
            .finally(() => setDetailLoading(false));
    };

    const handleStatusChange = (status: OrderStatus) => {
        if (!selected) return;
        const needsStockPrompt = status === 'canceled' || status === 'refunded';
        setConfirmModal({ show: true, status, stockPrompt: needsStockPrompt });
    };

    const applyStatus = async (revertStock: boolean) => {
        if (!selected || !confirmModal) return;
        setUpdatingStatus(true);
        try {
            const res = await updateOrderStatus(selected.id, confirmModal.status, revertStock);
            setSelected(res.data);
            setNewStatus(res.data.status);
            load();
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Failed to update status');
        } finally {
            setUpdatingStatus(false);
            setConfirmModal(null);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 48px)', overflow: 'hidden' }}>
            {/* Left: Orders list */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-color)' }}>Orders</h1>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <select
                            value={statusFilter}
                            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                            style={{ padding: '6px 10px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
                        >
                            <option value="">All Statuses</option>
                            {(Object.entries(ORDER_STATUS_LABELS) as [OrderStatus, string][]).map(([v, l]) => (
                                <option key={v} value={v}>{l}</option>
                            ))}
                        </select>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{total} orders</span>
                    </div>
                </div>

                {/* Table */}
                <div style={{ flex: 1, overflow: 'auto', backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#fafafa' }}>
                                {['Order #', 'Customer', 'Total', 'Items', 'Status', 'Date'].map(h => (
                                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        {Array.from({ length: 6 }).map((__, j) => (
                                            <td key={j} style={{ padding: '12px 14px' }}>
                                                <div style={{ height: '14px', backgroundColor: '#f0f0f0', borderRadius: '4px', animation: 'pulse 1.5s infinite' }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No orders found
                                    </td>
                                </tr>
                            ) : orders.map(order => {
                                const color = STATUS_COLORS[order.status] || '#999';
                                const isActive = selected?.id === order.id;
                                return (
                                    <tr
                                        key={order.id}
                                        onClick={() => openDetail(order.id)}
                                        style={{
                                            borderBottom: '1px solid var(--border-color)',
                                            cursor: 'pointer',
                                            backgroundColor: isActive ? '#f8f4ff' : 'white',
                                            transition: 'background 0.1s',
                                        }}
                                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#fafafa'; }}
                                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'white'; }}
                                    >
                                        <td style={{ padding: '12px 14px', fontWeight: 600 }}>{order.order_number}</td>
                                        <td style={{ padding: '12px 14px' }}>
                                            <div style={{ fontWeight: 500 }}>{order.customer_name}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{order.customer_email}</div>
                                        </td>
                                        <td style={{ padding: '12px 14px', fontWeight: 600 }}>{fmt(order.grand_total)}</td>
                                        <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{order.item_count}</td>
                                        <td style={{ padding: '12px 14px' }}>
                                            <span style={{
                                                display: 'inline-block', padding: '3px 8px', borderRadius: '100px',
                                                fontSize: '11px', fontWeight: 600,
                                                backgroundColor: `${color}20`, color,
                                            }}>
                                                {ORDER_STATUS_LABELS[order.status] ?? order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 14px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                                            {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                            style={{ padding: '6px 14px', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', opacity: page === 1 ? 0.4 : 1 }}>
                            Prev
                        </button>
                        <span style={{ padding: '6px 14px', fontSize: '13px', color: 'var(--text-secondary)' }}>{page} / {totalPages}</span>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                            style={{ padding: '6px 14px', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', opacity: page === totalPages ? 0.4 : 1 }}>
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Right: Order detail panel */}
            <div style={{ width: '360px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {detailLoading ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Loading...</p>
                    </div>
                ) : !selected ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Select an order to view details</p>
                    </div>
                ) : (
                    <div style={{ flex: 1, overflow: 'auto', backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '20px' }}>
                        {/* Order header */}
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p style={{ fontSize: '16px', fontWeight: 700 }}>{selected.order_number}</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                        {new Date(selected.created_at).toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <span style={{
                                    padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600,
                                    backgroundColor: `${STATUS_COLORS[selected.status] || '#999'}20`,
                                    color: STATUS_COLORS[selected.status] || '#999',
                                }}>
                                    {ORDER_STATUS_LABELS[selected.status] ?? selected.status}
                                </span>
                            </div>
                        </div>

                        <hr style={{ borderColor: 'var(--border-color)', margin: '12px 0' }} />

                        {/* Customer */}
                        <Section title="Customer">
                            <Row label="Name" value={selected.customer_name || '—'} />
                            <Row label="Email" value={selected.customer_email || '—'} />
                        </Section>

                        {/* Items */}
                        <Section title="Items">
                            {selected.items?.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                                    {item.product_image && (
                                        <img src={item.product_image} alt={item.product_name} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px', backgroundColor: '#f3f4f6', flexShrink: 0 }} />
                                    )}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: '12px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product_name}</p>
                                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Qty {item.quantity} × {fmt(item.unit_price)}</p>
                                    </div>
                                    <span style={{ fontSize: '12px', fontWeight: 600, flexShrink: 0 }}>{fmt(item.line_total)}</span>
                                </div>
                            ))}
                        </Section>

                        {/* Pricing */}
                        <Section title="Pricing">
                            <Row label="Subtotal" value={fmt(selected.subtotal)} />
                            {Number(selected.discount_amount) > 0 && (
                                <Row label={`Discount${selected.discount_code ? ` (${selected.discount_code})` : ''}`} value={`−${fmt(selected.discount_amount)}`} />
                            )}
                            {selected.tax_breakdown?.map((t, i) => (
                                <Row key={i} label={t.name} value={fmt(t.amount)} />
                            ))}
                            <Row label="Delivery" value={Number(selected.delivery_charge) === 0 ? 'Free' : fmt(selected.delivery_charge)} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
                                <span style={{ fontSize: '13px', fontWeight: 700 }}>Total</span>
                                <span style={{ fontSize: '13px', fontWeight: 700 }}>{fmt(selected.grand_total)}</span>
                            </div>
                        </Section>

                        {/* Delivery address */}
                        <Section title="Delivery Address">
                            <p style={{ fontSize: '12px', fontWeight: 600 }}>{selected.delivery_address.name}</p>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                {selected.delivery_address.address_line_1}
                                {selected.delivery_address.address_line_2 && `, ${selected.delivery_address.address_line_2}`}
                                {selected.delivery_address.landmark && `, Near ${selected.delivery_address.landmark}`}
                            </p>
                            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                {selected.delivery_address.city}, {selected.delivery_address.state} – {selected.delivery_address.pin}
                            </p>
                        </Section>

                        {/* Payment */}
                        <Section title="Payment">
                            <Row label="Method" value={selected.payment_method === 'online' ? 'Online (Razorpay)' : 'Cash on Delivery'} />
                            <Row label="Status" value={selected.payment_status} />
                            {selected.razorpay_payment_id && (
                                <Row label="Payment ID" value={selected.razorpay_payment_id} mono />
                            )}
                        </Section>

                        {/* Status update */}
                        {selected.status !== 'delivered' && selected.status !== 'payment_pending' && (
                            <Section title="Update Status">
                                <select
                                    value={newStatus}
                                    onChange={e => setNewStatus(e.target.value as OrderStatus)}
                                    style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px', marginBottom: '8px' }}
                                >
                                    {ADMIN_STATUS_FLOW.map(s => (
                                        <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => newStatus && newStatus !== selected.status && handleStatusChange(newStatus as OrderStatus)}
                                    disabled={updatingStatus || !newStatus || newStatus === selected.status}
                                    style={{
                                        width: '100%', padding: '8px', backgroundColor: 'var(--primary-color)',
                                        color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer',
                                        fontSize: '13px', fontWeight: 600,
                                        opacity: updatingStatus || !newStatus || newStatus === selected.status ? 0.4 : 1,
                                    }}
                                >
                                    {updatingStatus ? 'Updating...' : 'Update Status'}
                                </button>
                            </Section>
                        )}
                    </div>
                )}
            </div>

            {/* Confirm modal for cancel/refund */}
            {confirmModal?.show && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '28px', width: '400px', maxWidth: '90vw' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
                            Mark as {ORDER_STATUS_LABELS[confirmModal.status]}?
                        </h3>

                        {confirmModal.stockPrompt && (
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                                Would you like to <strong>revert the item quantities back to stock</strong>? This will add the ordered quantities back to product inventory.
                            </p>
                        )}

                        <div style={{ display: 'flex', gap: '10px', flexDirection: confirmModal.stockPrompt ? 'column' : 'row' }}>
                            {confirmModal.stockPrompt ? (
                                <>
                                    <button
                                        onClick={() => applyStatus(true)}
                                        style={{ padding: '10px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                                    >
                                        Yes, revert stock &amp; {ORDER_STATUS_LABELS[confirmModal.status].toLowerCase()}
                                    </button>
                                    <button
                                        onClick={() => applyStatus(false)}
                                        style={{ padding: '10px', backgroundColor: 'white', color: 'var(--primary-color)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                                    >
                                        No, just mark as {ORDER_STATUS_LABELS[confirmModal.status].toLowerCase()}
                                    </button>
                                    <button
                                        onClick={() => setConfirmModal(null)}
                                        style={{ padding: '10px', backgroundColor: 'white', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => applyStatus(false)}
                                        style={{ flex: 1, padding: '10px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => setConfirmModal(null)}
                                        style={{ flex: 1, padding: '10px', backgroundColor: 'white', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper sub-components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{title}</p>
            {children}
        </div>
    );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{label}</span>
            <span style={{ fontSize: '12px', fontWeight: 500, fontFamily: mono ? 'monospace' : undefined, maxWidth: '200px', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
        </div>
    );
}
