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
