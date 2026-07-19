"use client";

import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useUserStore } from "@/src/store/auth";
import { authService } from "@/src/clients/container";
import { alertUtil } from "@/src/utils/alert.util";
import { ALERT_MESSAGES } from "@/src/core/constants/messages";

interface ProfileModalProps {
  onClose: () => void;
}

const ProfileModal = ({ onClose }: ProfileModalProps) => {
  const { user, getUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const displayPrefix =
    user?.role === "mentee" ? `${user?.studentId?.slice(-3)} ` : "";
  const currentNickname = user?.nickname || "";

  const initialInputValue =
    user?.role === "mentee" && currentNickname.startsWith(displayPrefix)
      ? currentNickname.slice(displayPrefix.length)
      : currentNickname;

  const [inputValue, setInputValue] = useState(initialInputValue);

  const handleUpdate = async () => {
    if (!inputValue.trim()) {
      setError("กรุณากรอกชื่อเล่น");
      return;
    }

    const confirmResult = await alertUtil.showConfirm(
      ALERT_MESSAGES.CONFIRM.UPDATE_PROFILE,
      ALERT_MESSAGES.CONFIRM.UPDATE_PROFILE_DESC
    );
    if (!confirmResult.isConfirmed) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await authService.updateProfile({ nickname: inputValue });

      setSuccess(true);
      await getUser();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-3000 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-[90%] max-w-[400px] bg-[#0d0d0d] border border-[#27272a] p-6 rounded-lg shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6b7280] hover:text-white transition-colors"
        >
          <FaTimes size={16} />
        </button>

        <h2 className="text-[#F1F1F1] text-xl font-bold mb-4 font-['Pixelify_Sans'] tracking-widest uppercase">
          My Profile
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[#6b7280] text-xs font-medium uppercase tracking-wider">
              Student ID
            </label>
            <div className="text-[#F1F1F1] font-mono text-sm">
              {user?.studentId}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[#6b7280] text-xs font-medium uppercase tracking-wider">
              Role
            </label>
            <div className="text-[#a8c060] font-mono text-sm capitalize">
              {user?.role}
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <label className="text-[#6b7280] text-xs font-medium uppercase tracking-wider">
              {user?.role === "mentee"
                ? "Nickname (เฉพาะชื่อเล่น)"
                : "Nickname (ชื่อที่ไม่ระบุตัวตน)"}
            </label>
            <div className="flex items-center h-10 px-3 gap-2 rounded-md border border-[#27272a] bg-[#121212] focus-within:border-[#6812D2] transition-colors">
              {user?.role === "mentee" && (
                <span className="text-[#6b7280] text-sm whitespace-pre">
                  {displayPrefix}
                </span>
              )}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="ชื่อเล่น"
                className="flex-1 bg-transparent text-sm text-[#F1F1F1] outline-none border-none placeholder-[#6b7280]"
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-xs">{error}</div>}
          {success && (
            <div className="text-green-500 text-xs">
              Profile updated successfully!
            </div>
          )}

          <button
            onClick={handleUpdate}
            disabled={loading || inputValue === initialInputValue}
            className="mt-4 h-10 w-full flex items-center justify-center bg-[#6812D2] hover:bg-[#5210a8] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "SAVING..." : "SAVE CHANGES"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;