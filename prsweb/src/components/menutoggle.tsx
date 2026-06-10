import React from 'react';
import { Settings, X } from 'lucide-react';

interface MenuToggleProps {
    isOpen: boolean;
    toggle: () => void;
}

const MenuToggle = ({ isOpen, toggle }: MenuToggleProps) => {
    return (
        <button
            onClick={toggle}
            className={`
        fixed top-8 right-8 z-2000 
        flex items-center justify-center 
        w-14 h-14 
        transition-all duration-500 ease-in-out
        group focus:outline-none shadow-lg
        ${isOpen
                    ? "bg-white hover:bg-[#6812D2]"
                    : "bg-[#0d0d0d] hover:bg-[#6812D2]"
                }
      `}
            aria-label={isOpen ? "Close Menu" : "Open Settings"}
        >
            {/* Icon Container */}
            <div className={`
                transition-all duration-500 
                ${isOpen ? "text-[#0d0d0d] group-hover:rotate-90" : "text-[#F1F1F1] group-hover:rotate-90"}`}>
                {isOpen ? (
                    <X size={28} strokeWidth={1.5} />
                ) : (
                    <Settings size={28} strokeWidth={1.5} />
                )}
            </div>
        </button>
    );
};

export default MenuToggle;