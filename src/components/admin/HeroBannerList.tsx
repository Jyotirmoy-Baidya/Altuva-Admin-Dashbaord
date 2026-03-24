import type { HeroBanner } from '../../types/cms';

interface HeroBannerListProps {
    banners: HeroBanner[];
    onEdit: (banner: HeroBanner) => void;
    onDelete: (id: number) => void;
    isDeleting?: number | null;
}

function HeroBannerList({ banners, onEdit, onDelete, isDeleting }: HeroBannerListProps) {
    if (banners.length === 0) {
        return (
            <div
                style={{
                    padding: '40px',
                    textAlign: 'center',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                }}
            >
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
                    No hero banners yet. Create your first banner above!
                </p>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gap: '16px' }}>
            {banners.map((banner) => (
                <div
                    key={banner.id}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '300px 1fr auto',
                        gap: '20px',
                        padding: '16px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        alignItems: 'center',
                    }}
                >
                    {/* Image Preview */}
                    <div>
                        <img
                            src={banner.image_url}
                            alt={banner.title}
                            style={{
                                width: '100%',
                                aspectRatio: '16/9',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                border: '1px solid var(--border-color)',
                            }}
                        />
                    </div>

                    {/* Banner Info */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{banner.title}</h4>
                            <span
                                style={{
                                    padding: '2px 8px',
                                    fontSize: '12px',
                                    borderRadius: '12px',
                                    backgroundColor: banner.is_active ? '#e8f5e9' : '#fce4ec',
                                    color: banner.is_active ? '#2e7d32' : '#c62828',
                                }}
                            >
                                {banner.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        {banner.subtitle && (
                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '4px 0' }}>
                                {banner.subtitle}
                            </p>
                        )}

                        {banner.headtext && (
                            <p
                                style={{
                                    fontSize: '13px',
                                    color: 'var(--text-secondary)',
                                    margin: '8px 0 0 0',
                                    maxWidth: '500px',
                                }}
                            >
                                {banner.headtext.length > 150
                                    ? banner.headtext.substring(0, 150) + '...'
                                    : banner.headtext}
                            </p>
                        )}

                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                            {banner.cta_button_text && (
                                <div
                                    style={{
                                        display: 'inline-block',
                                        padding: '6px 12px',
                                        fontSize: '12px',
                                        borderRadius: '4px',
                                        backgroundColor: banner.cta_button_color,
                                        color: banner.cta_button_text_color,
                                    }}
                                >
                                    {banner.cta_button_text}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <div
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        backgroundColor: banner.text_color,
                                        border: '1px solid var(--border-color)',
                                    }}
                                    title={`Text: ${banner.text_color}`}
                                />
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Text</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button
                            onClick={() => onEdit(banner)}
                            disabled={isDeleting === banner.id}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#f5f5f5',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                cursor: isDeleting === banner.id ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                opacity: isDeleting === banner.id ? 0.5 : 1,
                            }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this banner?')) {
                                    onDelete(banner.id);
                                }
                            }}
                            disabled={isDeleting === banner.id}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#fee',
                                border: '1px solid #fcc',
                                borderRadius: '4px',
                                cursor: isDeleting === banner.id ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                color: '#c33',
                                opacity: isDeleting === banner.id ? 0.5 : 1,
                            }}
                        >
                            {isDeleting === banner.id ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default HeroBannerList;
