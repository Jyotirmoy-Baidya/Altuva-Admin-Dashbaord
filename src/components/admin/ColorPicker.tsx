import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
    label: string;
    value: string;
    onChange: (color: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
    const [showPicker, setShowPicker] = useState(false);

    return (
        <div style={{ marginBottom: '20px' }}>
            <label
                style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                }}
            >
                {label}
            </label>

            <div style={{ position: 'relative' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                    }}
                >
                    <div
                        onClick={() => setShowPicker(!showPicker)}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '4px',
                            backgroundColor: value,
                            border: '1px solid var(--border-color)',
                            cursor: 'pointer',
                            flexShrink: 0,
                        }}
                    />
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => {
                            const val = e.target.value;
                            // Allow typing # and valid hex characters
                            if (/^#[0-9A-Fa-f]{0,6}$/.test(val) || val === '') {
                                onChange(val || '#000000');
                            }
                        }}
                        onBlur={(e) => {
                            // Ensure valid hex color on blur
                            const val = e.target.value;
                            if (!/^#[0-9A-Fa-f]{6}$/.test(val)) {
                                onChange(value); // Reset to previous valid value
                            }
                        }}
                        placeholder="#000000"
                        style={{
                            fontSize: '14px',
                            fontFamily: 'monospace',
                            border: 'none',
                            outline: 'none',
                            flex: 1,
                            textTransform: 'uppercase',
                        }}
                    />
                </div>

                {showPicker && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            marginTop: '8px',
                            padding: '12px',
                            backgroundColor: 'white',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            zIndex: 1000,
                        }}
                    >
                        <HexColorPicker color={value} onChange={onChange} />
                        <button
                            onClick={() => setShowPicker(false)}
                            style={{
                                marginTop: '12px',
                                width: '100%',
                                padding: '8px',
                                backgroundColor: 'var(--primary-color)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>

            {showPicker && (
                <div
                    onClick={() => setShowPicker(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999,
                    }}
                />
            )}
        </div>
    );
}

export default ColorPicker;
