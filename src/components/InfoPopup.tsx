import React from 'react';
import { X } from 'lucide-react';

interface InfoPopupProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

const InfoPopup = ({ isOpen, onClose, title, children }: InfoPopupProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: 3000, background: 'rgba(0,0,0,0.6)' }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#0d0d0d',
                    border: '1px solid #2f3373',
                    minWidth: '320px',
                    maxWidth: '480px',
                    width: '90%',
                    padding: '2rem',
                    position: 'relative',
                    fontFamily: "'Share Tech Mono', monospace",
                    boxShadow: '0 0 24px rgba(104, 18, 210, 0.25)',
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 hover:bg-[#6812D2] transition-all duration-300 focus:outline-none"
                    aria-label="Close"
                >
                    <X size={20} strokeWidth={1.5} className="text-[#F1F1F1]" />
                </button>

                {/* Title */}
                {title && (
                    <p
                        style={{
                            fontFamily: "'Pixelify Sans', sans-serif",
                            fontSize: '20px',
                            fontWeight: 500,
                            letterSpacing: '4px',
                            color: '#888',
                            textTransform: 'uppercase',
                            marginBottom: '1rem',
                            paddingRight: '2rem',
                        }}
                    >
                        {title}
                    </p>
                )}

                {/* Content */}
                <div style={{ color: '#F1F1F1', fontSize: '14px', lineHeight: 1.6 }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default InfoPopup;