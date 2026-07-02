"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/src/store/auth";
import ActiveEffect from "./reactbits/cosmectic/ActiveEffect";
import { EffectKey } from "@/src/lib/shop/Types";
import { shopItemService } from "@/src/infra/container";

export default function GlobalEffectWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUserStore((s) => s.user);
  const getUser = useUserStore((s) => s.getUser);

  const [effectKey, setEffectKey] = useState<EffectKey | null>(null);

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user, getUser]);

  useEffect(() => {
    let isMounted = true;
    if (user?.equippedEffect) {
      shopItemService.getShopItemById(user.equippedEffect).then((item) => {
        if (isMounted) {
          setEffectKey((item?.effectKey as EffectKey) || null);
        }
      });
    } else {
      setEffectKey(null);
    }
    return () => {
      isMounted = false;
    };
  }, [user?.equippedEffect]);

  return <ActiveEffect effectKey={effectKey}>{children}</ActiveEffect>;
}
