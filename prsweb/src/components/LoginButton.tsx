"use client";

import { useEffect } from "react";
import { FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/src/store/auth";

const LoginButton = () => {
  const router = useRouter();
  const { user, getUser, logout, loading } = useUserStore();

  useEffect(() => {
    getUser();
  }, [getUser]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center px-5 bg-[#0d0d0d] h-14 text-sm font-medium tracking-widest text-[#F1F1F1] opacity-50 select-none shadow-lg">
        LOADING...
      </div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={() => router.push("/auth/login")}
        className="flex items-center gap-3 px-5 bg-[#0d0d0d] hover:bg-[#6812D2] transition-all duration-500 ease-in-out group focus:outline-none shadow-lg h-14 cursor-pointer"
      >
        <FaUser size={18} className="text-[#F1F1F1]" />
        <div className="w-px h-5 bg-[#F1F1F1] opacity-30" />
        <span className="text-[#F1F1F1] text-sm font-medium tracking-widest uppercase">
          Login
        </span>
      </button>
    );
  }

  const role = user?.role;

  return (
    <div className="flex items-center gap-3">
      {(role === "mentor" || role === "admin") && (
        <button
          onClick={() => router.push("/backrooms/senior")}
          className="flex items-center gap-3 px-5 bg-[#0d0d0d] hover:bg-[#6812D2] transition-all duration-500 ease-in-out group focus:outline-none shadow-lg h-14 cursor-pointer"
        >
          <FaCog size={18} className="text-[#F1F1F1]" />
          <div className="w-px h-5 bg-[#F1F1F1] opacity-30" />
          <span className="text-[#F1F1F1] text-sm font-medium tracking-widest uppercase">
            จัดการคำใบ้
          </span>
        </button>
      )}

      {role === "admin" && (
        <button
          onClick={() => router.push("/backrooms/admin")}
          className="flex items-center gap-3 px-5 bg-[#0d0d0d] hover:bg-[#a8c060] hover:text-[#0a0e08] transition-all duration-500 ease-in-out group focus:outline-none shadow-lg h-14 cursor-pointer"
        >
          <FaUser
            size={18}
            className="text-[#F1F1F1] group-hover:text-[#0a0e08] transition-colors"
          />
          <div className="w-px h-5 bg-[#F1F1F1] group-hover:bg-[#0a0e08] opacity-30 transition-colors" />
          <span className="text-[#F1F1F1] group-hover:text-[#0a0e08] text-sm font-medium tracking-widest uppercase transition-colors">
            ระบบแอดมิน
          </span>
        </button>
      )}

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-5 bg-[#0d0d0d] hover:bg-[#8a3020] transition-all duration-500 ease-in-out group focus:outline-none shadow-lg h-14 cursor-pointer"
      >
        <FaSignOutAlt size={18} className="text-[#F1F1F1]" />
        <div className="w-px h-5 bg-[#F1F1F1] opacity-30" />
        <span className="text-[#F1F1F1] text-sm font-medium tracking-widest uppercase">
          Logout
        </span>
      </button>
    </div>
  );
};

export default LoginButton;
