import { axiosInstance } from '../libs/axiosInstance';
import type { HeroBanner, ApiResponse } from '../types/cms';

// Get all hero banners (admin)
export const getAllHeroBanners = async (): Promise<ApiResponse<HeroBanner[]>> => {
    const response = await axiosInstance.get('/admin/cms/hero-banners');
    return response.data;
};

// Get single hero banner
export const getHeroBannerById = async (id: number): Promise<ApiResponse<HeroBanner>> => {
    const response = await axiosInstance.get(`/admin/cms/hero-banners/${id}`);
    return response.data;
};

// Create hero banner
export const createHeroBanner = async (formData: FormData): Promise<ApiResponse<HeroBanner>> => {
    const response = await axiosInstance.post('/admin/cms/hero-banners', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Update hero banner
export const updateHeroBanner = async (id: number, formData: FormData): Promise<ApiResponse<HeroBanner>> => {
    const response = await axiosInstance.put(`/admin/cms/hero-banners/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Delete hero banner
export const deleteHeroBanner = async (id: number): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(`/admin/cms/hero-banners/${id}`);
    return response.data;
};

export default {
    getAllHeroBanners,
    getHeroBannerById,
    createHeroBanner,
    updateHeroBanner,
    deleteHeroBanner,
};
