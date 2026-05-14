import { axiosInstance } from '../libs/axiosInstance';

// ─── Customers ────────────────────────────────────────────────────────────────
export const getCustomers = () => axiosInstance.get('/admin/customers').then(r => r.data);
export const getCustomerCart = (id: number) => axiosInstance.get(`/admin/customers/${id}/cart`).then(r => r.data);

// ─── Taxes ───────────────────────────────────────────────────────────────────
export const getTaxes = () => axiosInstance.get('/admin/taxes').then(r => r.data);
export const createTax = (data: object) => axiosInstance.post('/admin/taxes', data).then(r => r.data);
export const updateTax = (id: number, data: object) => axiosInstance.put(`/admin/taxes/${id}`, data).then(r => r.data);
export const deleteTax = (id: number) => axiosInstance.delete(`/admin/taxes/${id}`).then(r => r.data);

// ─── Delivery Charges ────────────────────────────────────────────────────────
export const getDeliveryCharges = () => axiosInstance.get('/admin/delivery-charges').then(r => r.data);
export const createDeliveryCharge = (data: object) => axiosInstance.post('/admin/delivery-charges', data).then(r => r.data);
export const updateDeliveryCharge = (id: number, data: object) => axiosInstance.put(`/admin/delivery-charges/${id}`, data).then(r => r.data);
export const deleteDeliveryCharge = (id: number) => axiosInstance.delete(`/admin/delivery-charges/${id}`).then(r => r.data);

// ─── Discount Codes ───────────────────────────────────────────────────────────
export const getDiscounts = () => axiosInstance.get('/admin/discounts').then(r => r.data);
export const createDiscount = (data: object) => axiosInstance.post('/admin/discounts', data).then(r => r.data);
export const updateDiscount = (id: number, data: object) => axiosInstance.put(`/admin/discounts/${id}`, data).then(r => r.data);
export const deleteDiscount = (id: number) => axiosInstance.delete(`/admin/discounts/${id}`).then(r => r.data);

// ─── Popular Sections ─────────────────────────────────────────────────────────
export const getPopularSections = () => axiosInstance.get('/admin/popular-sections').then(r => r.data);
export const createPopularSection = (data: object) => axiosInstance.post('/admin/popular-sections', data).then(r => r.data);
export const updatePopularSection = (id: number, data: object) => axiosInstance.put(`/admin/popular-sections/${id}`, data).then(r => r.data);
export const deletePopularSection = (id: number) => axiosInstance.delete(`/admin/popular-sections/${id}`).then(r => r.data);

// ─── Showcase Tea Tags ────────────────────────────────────────────────────────
export const getShowcaseTeaTags = () => axiosInstance.get('/admin/showcase-tea/tags').then(r => r.data);
export const createShowcaseTeaTag = (data: object) => axiosInstance.post('/admin/showcase-tea/tags', data).then(r => r.data);
export const updateShowcaseTeaTag = (id: number, data: object) => axiosInstance.put(`/admin/showcase-tea/tags/${id}`, data).then(r => r.data);
export const deleteShowcaseTeaTag = (id: number) => axiosInstance.delete(`/admin/showcase-tea/tags/${id}`).then(r => r.data);

// ─── Showcase Tea Products ────────────────────────────────────────────────────
export const getShowcaseTeaProducts = () => axiosInstance.get('/admin/showcase-tea/products').then(r => r.data);
export const createShowcaseTeaProduct = (data: FormData) => axiosInstance.post('/admin/showcase-tea/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
export const updateShowcaseTeaProduct = (id: number, data: FormData) => axiosInstance.put(`/admin/showcase-tea/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
export const deleteShowcaseTeaProduct = (id: number) => axiosInstance.delete(`/admin/showcase-tea/products/${id}`).then(r => r.data);

// ─── Spotlights ───────────────────────────────────────────────────────────────
export const getSpotlights = () => axiosInstance.get('/admin/spotlights').then(r => r.data);
export const createSpotlight = (data: FormData) => axiosInstance.post('/admin/spotlights', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
export const updateSpotlight = (id: number, data: FormData) => axiosInstance.put(`/admin/spotlights/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
export const deleteSpotlight = (id: number) => axiosInstance.delete(`/admin/spotlights/${id}`).then(r => r.data);
