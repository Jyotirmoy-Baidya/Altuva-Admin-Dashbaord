import { axiosInstance } from '../libs/axiosInstance';
import type { Order, OrderStats } from '../types/order';

export const getOrderStats = () =>
    axiosInstance.get<{ success: boolean; data: OrderStats }>('/admin/orders/stats')
        .then(r => r.data);

export const getAllOrders = (params: { page?: number; status?: string }) => {
    const q = new URLSearchParams();
    if (params.page) q.set('page', String(params.page));
    if (params.status) q.set('status', params.status);
    return axiosInstance.get<{ success: boolean; data: { orders: Order[]; total: number; page: number; limit: number } }>(
        `/admin/orders?${q}`
    ).then(r => r.data);
};

export const getOrderDetail = (id: number) =>
    axiosInstance.get<{ success: boolean; data: Order }>(`/admin/orders/${id}`)
        .then(r => r.data);

export const updateOrderStatus = (id: number, status: string, revert_stock = false) =>
    axiosInstance.patch<{ success: boolean; data: Order }>(`/admin/orders/${id}/status`, { status, revert_stock })
        .then(r => r.data);
