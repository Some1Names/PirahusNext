"use client";

import { useState } from "react";
import type { GiftTransfer } from "@/src/lib/shop/Types";

interface GiftModalProps {
  currentPoints: number;
  onClose: () => void;
  onSend: (transfer: GiftTransfer) => Promise<boolean>;
}

export default function GiftModal({
  currentPoints,
  onClose,
  onSend,
}: GiftModalProps) {
  const [recipientCode, setRecipientCode] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  const parsedAmount = Number(amount);

  const isValid =
    recipientCode.trim().length > 0 &&
    Number.isInteger(parsedAmount) &&
    parsedAmount > 0 &&
    parsedAmount <= currentPoints;

  const handleSubmit = async () => {
    if (!isValid) {
      setError(
        parsedAmount > currentPoints
          ? "แต้มไม่พอสำหรับโอนจำนวนนี้"
          : "กรอกข้อมูลให้ครบและถูกต้อง",
      );
      return;
    }

    setError(null);
    setSending(true);
    onClose();

    await new Promise((resolve) => setTimeout(resolve, 50));

    try {
      await onSend({
        recipientCode: recipientCode.trim(),
        amount: parsedAmount,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      id="gift-modal"
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center bg-[rgba(4,8,5,0.75)] p-4"
      style={{ zIndex: 1000 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[340px] border-2 border-[#ffb347] bg-[#101712] p-6 font-mono text-[#eaffef]"
      >
        <h3 className="mb-4 flex items-center gap-2 font-['Pixelify_Sans'] text-lg text-[#ffb347]">
          <span>✉️</span>
          โอนแต้มให้เพื่อน
        </h3>

        <div className="mb-4 flex flex-col gap-1">
          <label
            htmlFor="recipientCode"
            className="text-xs tracking-wide text-[#7c9985]"
          >
            รหัสประจำตัว / username ของเพื่อน
          </label>

          <input
            id="recipientCode"
            type="text"
            placeholder="เช่น 6xxxxxxxx"
            value={recipientCode}
            onChange={(e) => setRecipientCode(e.target.value)}
            disabled={sending || success}
            className="border-2 border-[#2b3a2f] bg-[#0d130f] px-3 py-2 text-sm text-[#eaffef] outline-none transition-colors focus:border-[#ffb347] disabled:opacity-50"
          />
        </div>

        <div className="mb-4 flex flex-col gap-1">
          <label
            htmlFor="amount"
            className="text-xs tracking-wide text-[#7c9985]"
          >
            จำนวนแต้ม (คงเหลือ {currentPoints} pts)
          </label>

          <input
            id="amount"
            type="number"
            min={1}
            max={currentPoints}
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={sending || success}
            className="border-2 border-[#2b3a2f] bg-[#0d130f] px-3 py-2 text-sm text-[#eaffef] outline-none transition-colors focus:border-[#ffb347] disabled:opacity-50"
          />
        </div>

        {error && <p className="mb-3 text-xs text-[#ff8a8a]">{error}</p>}

        {success && (
          <p className="mb-3 text-sm text-[#8cffb0]">โอนแต้มสำเร็จ 🎉</p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            disabled={sending}
            className="flex-1 border-2 border-[#2b3a2f] bg-transparent py-2 text-xs tracking-wide text-[#7c9985] transition-colors hover:border-[#6dff9e] hover:text-[#eaffef] disabled:opacity-50"
          >
            ยกเลิก
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isValid || sending || success}
            className="flex-1 border-2 border-[#ffb347] bg-[#ffb347] py-2 text-xs tracking-wide text-[#221200] transition-colors hover:bg-[#ffc978] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {sending ? "กำลังโอน..." : "โอนแต้ม"}
          </button>
        </div>
      </div>
    </div>
  );
}
