import type { Order, OrderStats } from '../types/order';
import { getToken } from '../utils/storage';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
});

const handle = async <T>(res: Response): Promise<{ success: boolean; data: T }> => {
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Request failed');
    return json;
};

export const getOrderStats = () =>
    fetch(`${BASE}/admin/orders/stats`, { headers: authHeaders() })
        .then(r => handle<OrderStats>(r));

export const getAllOrders = (params: { page?: number; status?: string }) => {
    const q = new URLSearchParams();
    if (params.page) q.set('page', String(params.page));
    if (params.status) q.set('status', params.status);
    return fetch(`${BASE}/admin/orders?${q}`, { headers: authHeaders() })
        .then(r => handle<{ orders: Order[]; total: number; page: number; limit: number }>(r));
};

export const getOrderDetail = (id: number) =>
    fetch(`${BASE}/admin/orders/${id}`, { headers: authHeaders() })
        .then(r => handle<Order>(r));

export const updateOrderStatus = (id: number, status: string, revert_stock = false) =>
    fetch(`${BASE}/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status, revert_stock }),
    }).then(r => handle<Order>(r));
