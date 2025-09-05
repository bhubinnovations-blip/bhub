"use client";

import Head from "next/head";

export default function PaymentCard() {
  return (
    <div className="bg-neutral-800 p-4 rounded-lg flex justify-between">
      <span>Pay at venue</span>
      <span className="material-icons">payments</span>
    </div>
  );
}