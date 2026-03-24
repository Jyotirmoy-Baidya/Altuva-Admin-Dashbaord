import { useState, useRef, useCallback } from 'react';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
    onCropComplete: (croppedFile: File) => void;
    onCancel: () => void;
    imageFile: File;
}

function ImageCropper({ onCropComplete, onCancel, imageFile }: ImageCropperProps) {
    const imgRef = useRef<HTMLImageElement>(null);
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 90,
        height: 50.625, // 16:9 ratio
        x: 5,
        y: 25,
    });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [imageSrc, setImageSrc] = useState<string>('');

    // Load image
    useState(() => {
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result as string);
        };
        reader.readAsDataURL(imageFile);
    });

    const getCroppedImg = useCallback(async () => {
        if (!completedCrop || !imgRef.current) {
            return;
        }

        const image = imgRef.current;
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        // Set canvas to full resolution to maintain quality
        canvas.width = completedCrop.width * scaleX;
        canvas.height = completedCrop.height * scaleY;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return;
        }

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY
        );

        return new Promise<File>((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    return;
                }
                const file = new File([blob], imageFile.name, {
                    type: imageFile.type,
                });
                resolve(file);
            }, imageFile.type, 1.0);
        });
    }, [completedCrop, imageFile]);

    const handleCropComplete = async () => {
        const croppedFile = await getCroppedImg();
        if (croppedFile) {
            onCropComplete(croppedFile);
        }
    };

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const aspectRatio = 16 / 9;
        const cropWidth = 90;
        const cropHeight = (cropWidth / aspectRatio) * (width / height) * aspectRatio;

        setCrop({
            unit: '%',
            width: cropWidth,
            height: cropHeight,
            x: 5,
            y: (100 - cropHeight) / 2,
        });
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000,
                padding: '20px',
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '24px',
                    maxWidth: '800px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'auto',
                }}
            >
                <h2 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: '600' }}>Crop Image (16:9)</h2>

                <div style={{ marginBottom: '20px' }}>
                    <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={16 / 9}
                    >
                        <img
                            ref={imgRef}
                            src={imageSrc}
                            alt="Crop preview"
                            onLoad={onImageLoad}
                            style={{ maxWidth: '100%', maxHeight: '60vh' }}
                        />
                    </ReactCrop>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#f5f5f5',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleCropComplete}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                        }}
                    >
                        Crop & Upload
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ImageCropper;
