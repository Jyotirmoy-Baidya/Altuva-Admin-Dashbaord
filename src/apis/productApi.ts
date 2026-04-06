import { axiosInstance } from '../libs/axiosInstance';
import type { Product, ApiResponse } from '../types/cms';

export const getAllProducts = async (): Promise<ApiResponse<Product[]>> => {
    const response = await axiosInstance.get('/admin/products');
    return response.data;
};

export const getProductById = async (id: number): Promise<ApiResponse<Product>> => {
    const response = await axiosInstance.get(`/admin/products/${id}`);
    return response.data;
};

export const createProduct = async (formData: FormData): Promise<ApiResponse<Product>> => {
    const response = await axiosInstance.post('/admin/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const updateProduct = async (id: number, formData: FormData): Promise<ApiResponse<Product>> => {
    const response = await axiosInstance.put(`/admin/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteProduct = async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(`/admin/products/${id}`);
    return response.data;
};
