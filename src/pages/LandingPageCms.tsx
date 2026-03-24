import { useState, useEffect } from 'react';
import HeroBannerForm from '../components/admin/HeroBannerForm';
import HeroBannerList from '../components/admin/HeroBannerList';
import {
    getAllHeroBanners,
    createHeroBanner,
    updateHeroBanner,
    deleteHeroBanner,
} from '../apis/cmsApi';
import type { HeroBanner } from '../types/cms';

function LandingPageCms() {
    const [banners, setBanners] = useState<HeroBanner[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await getAllHeroBanners();
            if (response.success && response.data) {
                setBanners(response.data);
            }
        } catch (err) {
            console.error('Error fetching banners:', err);
            setError('Failed to load banners');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleCreate = async (formData: FormData) => {
        try {
            setSaving(true);
            setError('');
            const response = await createHeroBanner(formData);

            if (response.success && response.data) {
                setBanners([response.data, ...banners]);
                setShowForm(false);
                alert('Banner created successfully!');
            }
        } catch (err) {
            console.error('Error creating banner:', err);
            setError('Failed to create banner');
            alert('Failed to create banner. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (formData: FormData) => {
        if (!editingBanner) return;

        try {
            setSaving(true);
            setError('');
            const response = await updateHeroBanner(editingBanner.id, formData);

            if (response.success && response.data) {
                setBanners(banners.map((b) => (b.id === editingBanner.id ? response.data! : b)));
                setEditingBanner(null);
                setShowForm(false);
                alert('Banner updated successfully!');
            }
        } catch (err) {
            console.error('Error updating banner:', err);
            setError('Failed to update banner');
            alert('Failed to update banner. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            setDeleting(id);
            const response = await deleteHeroBanner(id);

            if (response.success) {
                setBanners(banners.filter((b) => b.id !== id));
                alert('Banner deleted successfully!');
            }
        } catch (err) {
            console.error('Error deleting banner:', err);
            alert('Failed to delete banner. Please try again.');
        } finally {
            setDeleting(null);
        }
    };

    const handleEdit = (banner: HeroBanner) => {
        setEditingBanner(banner);
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingBanner(null);
    };

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>Loading...</p>
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--primary-color)' }}>
                    Landing Page CMS
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
                    Manage your landing page hero banners
                </p>
            </div>

            {error && (
                <div
                    style={{
                        padding: '12px',
                        marginBottom: '20px',
                        backgroundColor: '#fee',
                        color: '#c33',
                        borderRadius: '4px',
                        border: '1px solid #fcc',
                    }}
                >
                    {error}
                </div>
            )}

            {/* Create/Edit Form */}
            {!showForm ? (
                <div style={{ marginBottom: '32px' }}>
                    <button
                        onClick={() => setShowForm(true)}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600',
                        }}
                    >
                        + Create New Banner
                    </button>
                </div>
            ) : (
                <div style={{ marginBottom: '32px' }}>
                    <HeroBannerForm
                        onSubmit={editingBanner ? handleUpdate : handleCreate}
                        onCancel={handleCancel}
                        initialData={editingBanner || undefined}
                        isLoading={saving}
                    />
                </div>
            )}

            {/* Banner List */}
            <div>
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                    Existing Banners ({banners.length})
                </h2>
                <HeroBannerList
                    banners={banners}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isDeleting={deleting}
                />
            </div>
        </div>
    );
}

export default LandingPageCms;
