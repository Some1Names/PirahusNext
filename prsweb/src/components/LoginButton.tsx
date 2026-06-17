"use client";

import React from 'react';
import { FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const LoginButton = () => {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push('/login')}
            className={`
                flex items-center gap-3
                px-5
                bg-[#0d0d0d] hover:bg-[#6812D2]
                transition-all duration-500 ease-in-out
                group focus:outline-none shadow-lg
                h-14
            `}
        >
            {/* User Icon */}
            <FaUser size={18} className="text-[#F1F1F1]" />

            {/* Divider */}
            <div className="w-px h-5 bg-[#F1F1F1] opacity-30" />

            {/* Label */}
            <span className="text-[#F1F1F1] text-sm font-medium tracking-widest uppercase">
                Login
            </span>
        </button>
    );
};

export default LoginButton;