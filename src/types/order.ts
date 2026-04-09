export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number | null;
    product_name: string;
    product_sku: string | null;
    product_image: string | null;
    quantity: number;
    unit_price: string;
    unit_mrp: string;
    line_total: string;
    created_at: string;
}

export interface Order {
    id: number;
    order_number: string;
    customer_id: number;
    customer_name?: string;
    customer_email?: string;
    delivery_address: {
        name: string;
        address_line_1: string;
        address_line_2?: string;
        landmark?: string;
        pin: string;
        city: string;
        state: string;
        country: string;
    };
    subtotal: string;
    discount_amount: string;
    discount_code: string | null;
    tax_amount: string;
    tax_breakdown: { id: number; name: string; type: string; value: number; amount: number }[];
    delivery_charge: string;
    grand_total: string;
    status: OrderStatus;
    payment_method: string;
    razorpay_order_id: string | null;
    razorpay_payment_id: string | null;
    payment_status: 'pending' | 'paid' | 'failed';
    item_count?: number;
    notes: string | null;
    created_at: string;
    updated_at: string;
    items?: OrderItem[];
}

export type OrderStatus =
    | 'payment_pending'
    | 'placed'
    | 'confirmed'
    | 'packed'
    | 'dispatched'
    | 'out_for_delivery'
    | 'delivered'
    | 'canceled'
    | 'refunded';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    payment_pending: 'Payment Pending',
    placed: 'Order Placed',
    confirmed: 'Confirmed',
    packed: 'Packed',
    dispatched: 'Dispatched',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    canceled: 'Canceled',
    refunded: 'Refunded',
};

export const ADMIN_STATUS_FLOW: OrderStatus[] = [
    'placed', 'confirmed', 'packed', 'dispatched', 'out_for_delivery', 'delivered', 'canceled', 'refunded',
];

export interface OrderStats {
    total_orders: number;
    total_revenue: number;
    pending_orders: number;
    placed_orders: number;
    delivered_orders: number;
    top_products: { product_id: number | null; product_name: string; total_qty: number; total_revenue: number }[];
}
