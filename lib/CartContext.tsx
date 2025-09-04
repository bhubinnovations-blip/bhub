"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type CartContextType = {
  userUid: string;
  setUserUid: (val: string) => void;
  emailAdd: string;
  setEmailAdd: (val: string) => void;
  vendorUid: string;
  setVendorUid: (val: string) => void;
  currency: string;
  setCurrency: (val: string) => void;
  deviceToken: string;
  setDeviceToken: (val: string) => void;
  vendorTitle: string;
  setVendorTitle: (val: string) => void;
  itemCount: number;
  setItemCount: (val: number) => void;
  dlgCartItemsTotal: number;
  setDlgCartItemsTotal: (val: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [userUid, setUserUid] = useState("");
  const [emailAdd, setEmailAdd] = useState("");
  const [vendorUid, setVendorUid] = useState("");
  const [currency, setCurrency] = useState("");
  const [deviceToken, setDeviceToken] = useState("");
  const [vendorTitle, setVendorTitle] = useState("");
  const [itemCount, setItemCount] = useState(0);
  const [dlgCartItemsTotal, setDlgCartItemsTotal] = useState(0);

  return (
    <CartContext.Provider
      value={{
        userUid,
        setUserUid,
        emailAdd,
        setEmailAdd,
        vendorUid,
        setVendorUid,
        currency,
        setCurrency,
        deviceToken,
        setDeviceToken,
        vendorTitle,
        setVendorTitle,
        itemCount,
        setItemCount,
        dlgCartItemsTotal,
        setDlgCartItemsTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used inside <CartProvider>");
  return ctx;
}