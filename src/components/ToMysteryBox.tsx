import { useRouter } from 'next/navigation';
import { Gift, X } from 'lucide-react';

interface MenuToggleProps {
    isOpen: boolean;
    toggle: () => void;
}

const MenuToggle = ({ isOpen, toggle }: MenuToggleProps) => {
    const router = useRouter();

    const handleClick = () => {
        if (isOpen) {
            toggle();
        } else {
            router.push('/mysterybox');
        }
    };

    return (
        <button
            onClick={() => router.push('/mysterybox')}
            className="flex items-center justify-center w-14 h-14 bg-[#0d0d0d] hover:bg-[#6812D2] transition-all duration-500 ease-in-out group focus:outline-none shadow-lg"
            aria-label="Open Mystery Box"
        >
            <Gift size={28} strokeWidth={1.5} className="text-[#F1F1F1] transition-all duration-500" />
        </button>
    );
};

export default MenuToggle;