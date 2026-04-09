// CMS Type definitions

export interface HeroBanner {
    id: number;
    image_url: string;
    title: string;
    subtitle?: string;
    headtext?: string;
    text_color: string;
    cta_button_color: string;
    cta_button_text_color: string;
    cta_button_text?: string;
    cta_button_url?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateHeroBannerData {
    image: File;
    title: string;
    subtitle?: string;
    headtext?: string;
    text_color?: string;
    cta_button_color?: string;
    cta_button_text_color?: string;
    cta_button_text?: string;
    is_active?: boolean;
}

export interface UpdateHeroBannerData {
    image?: File;
    title?: string;
    subtitle?: string;
    headtext?: string;
    text_color?: string;
    cta_button_color?: string;
    cta_button_text_color?: string;
    cta_button_text?: string;
    is_active?: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

// ─── Product Types ────────────────────────────────────────────────────────────

export interface Product {
    id: number;
    name: string;
    slug: string;
    brand: string;
    category: string;
    sub_category?: string;
    type?: string;
    price: string;
    discounted_price?: string;
    discount_percentage?: string;
    currency: string;
    stock: number;
    low_stock_threshold?: number;
    is_in_stock?: boolean;
    sku?: string;
    primary_image: string;
    secondary_image?: string;
    images?: { url: string; altText: string }[];
    description: string;
    detailed_description?: string;
    key_features?: string[];
    ingredients?: string[];
    nutrition_info?: { calories?: string; fat?: string; carbs?: string; protein?: string };
    shelf_life?: string;
    storage_instructions?: string;
    care_instructions?: string;
    country_of_origin?: string;
    manufacturer?: { name?: string; address?: string };
    contact_email?: string;
    contact_phone?: string;
    amazon_link?: string;
    tags?: string[];
    flavors?: string[];
    weight?: string;
    ratings_average?: string;
    ratings_count?: number;
    is_active?: boolean;
    is_featured?: boolean;
    created_at: string;
    updated_at: string;
}
