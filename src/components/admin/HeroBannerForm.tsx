import { useState, useRef, type FormEvent } from 'react';
import ImageCropper from './ImageCropper';
import ColorPicker from './ColorPicker';
import type { HeroBanner } from '../../types/cms';

interface HeroBannerFormProps {
    onSubmit: (formData: FormData) => Promise<void>;
    onCancel: () => void;
    initialData?: HeroBanner;
    isLoading?: boolean;
}

function HeroBannerForm({ onSubmit, onCancel, initialData, isLoading }: HeroBannerFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showCropper, setShowCropper] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [croppedFile, setCroppedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(initialData?.image_url || '');

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        subtitle: initialData?.subtitle || '',
        headtext: initialData?.headtext || '',
        text_color: initialData?.text_color || '#000000',
        cta_button_color: initialData?.cta_button_color || '#181818',
        cta_button_text_color: initialData?.cta_button_text_color || '#FFFFFF',
        cta_button_text: initialData?.cta_button_text || '',
        is_active: initialData?.is_active ?? true,
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setShowCropper(true);
        }
    };

    const handleCropComplete = (file: File) => {
        setCroppedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setShowCropper(false);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const data = new FormData();

        if (croppedFile) {
            data.append('image', croppedFile);
        }

        data.append('title', formData.title);
        data.append('subtitle', formData.subtitle);
        data.append('headtext', formData.headtext);
        data.append('text_color', formData.text_color);
        data.append('cta_button_color', formData.cta_button_color);
        data.append('cta_button_text_color', formData.cta_button_text_color);
        data.append('cta_button_text', formData.cta_button_text);
        data.append('is_active', String(formData.is_active));

        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div
                style={{
                    padding: '24px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                }}
            >
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>
                    {initialData ? 'Edit Hero Banner' : 'Create New Hero Banner'}
                </h3>

                {/* Image Upload */}
                <div style={{ marginBottom: '20px' }}>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                        }}
                    >
                        Banner Image {!initialData && <span style={{ color: 'red' }}>*</span>}
                    </label>

                    {previewUrl && (
                        <div style={{ marginBottom: '12px' }}>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                style={{
                                    width: '100%',
                                    maxWidth: '600px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-color)',
                                }}
                            />
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            padding: '10px 16px',
                            backgroundColor: '#f5f5f5',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                        }}
                    >
                        {previewUrl ? 'Change Image' : 'Upload Image'}
                    </button>
                    <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Recommended: 1920x1080px (16:9 ratio). Max size: 5MB
                    </p>
                </div>

                {/* Title */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                        Title <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '14px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                        }}
                        placeholder="Enter banner title"
                    />
                </div>

                {/* Subtitle */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                        Subtitle
                    </label>
                    <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '14px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                        }}
                        placeholder="Enter subtitle (optional)"
                    />
                </div>

                {/* Headtext */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                        Description
                    </label>
                    <textarea
                        value={formData.headtext}
                        onChange={(e) => setFormData({ ...formData, headtext: e.target.value })}
                        rows={3}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '14px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            resize: 'vertical',
                        }}
                        placeholder="Enter description (optional)"
                    />
                </div>

                {/* Text Color */}
                <ColorPicker
                    label="Text Color"
                    value={formData.text_color}
                    onChange={(color) => setFormData({ ...formData, text_color: color })}
                />

                {/* CTA Button Text */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                        CTA Button Text
                    </label>
                    <input
                        type="text"
                        value={formData.cta_button_text}
                        onChange={(e) => setFormData({ ...formData, cta_button_text: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '14px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                        }}
                        placeholder="e.g., Get Started"
                    />
                </div>

                {/* CTA Button Colors */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <ColorPicker
                        label="CTA Button Color"
                        value={formData.cta_button_color}
                        onChange={(color) => setFormData({ ...formData, cta_button_color: color })}
                    />

                    <ColorPicker
                        label="CTA Button Text Color"
                        value={formData.cta_button_text_color}
                        onChange={(color) => setFormData({ ...formData, cta_button_text_color: color })}
                    />
                </div>

                {/* Is Active */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            style={{ marginRight: '8px' }}
                        />
                        <span style={{ fontSize: '14px' }}>Active (visible on website)</span>
                    </label>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#f5f5f5',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || (!croppedFile && !initialData)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: isLoading || (!croppedFile && !initialData) ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            opacity: isLoading || (!croppedFile && !initialData) ? 0.6 : 1,
                        }}
                    >
                        {isLoading ? 'Saving...' : initialData ? 'Update Banner' : 'Create Banner'}
                    </button>
                </div>
            </div>

            {/* Image Cropper Modal */}
            {showCropper && selectedFile && (
                <ImageCropper
                    imageFile={selectedFile}
                    onCropComplete={handleCropComplete}
                    onCancel={() => {
                        setShowCropper(false);
                        setSelectedFile(null);
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                    }}
                />
            )}
        </form>
    );
}

export default HeroBannerForm;
