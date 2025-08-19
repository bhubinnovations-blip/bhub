
"use client";

import { useEffect, useRef, useState } from "react";
import feather from "feather-icons";
import Image from "next/image";
import { title } from "process";

interface Tile {
  icon?: string;
  color?: string;
  title: string;
  desc: string;
  delay: string;
  isButton?: boolean;
  isSalon?: boolean;
  isClient?: boolean;
  isBeauty?: boolean;
  isGYM?: boolean;
  isTrainer?: boolean;
}

const tiles: Tile[] = [
  { icon: "user", color: "text-blue-600 group-hover:text-blue-800", title: "Regular Client", isClient: true, desc: "Get salon, beautician, gym or gym trainer.", delay: "0.1s" },
  { icon: "smartphone", color: "text-green-600 group-hover:text-green-800", title: "Salon & Spa", isSalon: true, desc: "Your salon is our opportunity to tell your customers what you offer.", delay: "0.3s" },
  { icon: "zap", color: "text-yellow-500 group-hover:text-yellow-700", title: "Beautician", isBeauty: true, desc: "Tell BHub more about your business we are here for you!", delay: "0.5s" },
  { icon: "globe", color: "text-purple-600 group-hover:text-purple-800", title: "GYM", isGYM: true, desc: "Gym will get someone do just that 'oh - and the best services too'.", delay: "0.7s" },
  { icon: "heart", color: "text-red-500 group-hover:text-red-700", title: "GYM - Trainer", isTrainer: true, desc: "Tell BHub more about your business we are here for you!", delay: "0.9s" },
  { title: "View Featured Beauticians", desc: "Explore our curated selection.", delay: "1.1s", isButton: true },
];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [notifications] = useState(3);
  const [cartItems, setCartItems] = useState(2);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    feather.replace();
    const handleScroll = () => setScrolled(window.scrollY > 10);
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen flex flex-col relative">
      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all ${
          scrolled ? "bg-white/70 backdrop-blur-md shadow-sm" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center py-4 px-6 max-w-6xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image src="/b_hub_logo.png" alt="Logo" width={40} height={40} className="rounded-full" />
            <span className="text-xl font-bold text-blue-600">Welcome to BHub</span>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 relative">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                className="relative p-2 hover:bg-gray-100 rounded-full transition icon-bounce"
                onClick={() => setShowNotifications((prev) => !prev)}
              >
                <i data-feather="bell" className="w-6 h-6 text-gray-700"></i>
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {notifications}
                  </span>
                )}
              </button>
              <div
                className={`absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg overflow-hidden z-50 transform origin-top ${
                  showNotifications ? "notif-open" : "notif-closed"
                }`}
              >
                <ul className="divide-y divide-gray-200">
                  <li className="px-4 py-2 hover:bg-gray-50">New order received!</li>
                  <li className="px-4 py-2 hover:bg-gray-50">Your item has shipped.</li>
                  <li className="px-4 py-2 hover:bg-gray-50">Special discount available!</li>
                </ul>
              </div>
            </div>

            {/* Cart */}
            <div className="relative">
              <button
                className="relative p-2 hover:bg-gray-100 rounded-full transition icon-bounce"
                onClick={() => setShowCart(true)}
              >
                <i data-feather="shopping-cart" className="w-6 h-6 text-gray-700"></i>
                {cartItems > 0 && (
                  <span className="absolute top-1 right-1 bg-blue-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {cartItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white transform z-50 cart-drawer ${
          showCart ? "cart-open" : "cart-closed"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">Your Cart</h2>
          <button onClick={() => setShowCart(false)}>
            <i data-feather="x" className="w-5 h-5"></i>
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between"><span>Product 1</span><span>$20</span></div>
          <div className="flex items-center justify-between"><span>Product 2</span><span>$15</span></div>
        </div>
        <div className="p-4 border-t">
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Checkout</button>
        </div>
      </div>

      {/* Overlay */}
      {showCart && (
        <div
          className="fixed inset-0 bg-black/30 z-40 animate-fadeIn"
          onClick={() => setShowCart(false)}
        ></div>
      )}

      {/* Tiles */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-grow pt-36">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiles.map((tile, index) => (
            <div
              key={index}
              className={`rounded-lg p-6 transition text-center group fade-up ${
                tile.isButton
                  ? "bg-blue-600 text-white cursor-pointer hover:bg-blue-700 shadow-lg"
                  : "bg-white shadow-md hover:shadow-xl"
              }`}
              style={{ animationDelay: tile.delay }}
              onClick={() => {
                if (tile.isButton) {
                  // setCartItems((c) => c + 1);
                  // setShowCart(true);
                } else if (tile.isClient) {
                  localStorage.setItem("bundle", "user");
                  window.location.assign("/signin.html");
                } else if (tile.isSalon) {
                  localStorage.setItem("bundle", "salon");
                  window.location.assign("/signin.html");
                } else if (tile.isBeauty) {
                  localStorage.setItem("bundle", "beauty");
                  window.location.assign("/signin.html");
                } else if (tile.isGYM) {
                  localStorage.setItem("bundle", "gym");
                  window.location.assign("/signin.html");
                } else if (tile.isTrainer) {
                  localStorage.setItem("bundle", "trainer");
                  window.location.assign("/signin.html");
                }
              }}
            >
              {tile.icon && (
                <i
                  data-feather={tile.icon}
                  className={`mx-auto mb-4 w-12 h-12 transition-transform duration-300 group-hover:scale-110 ${tile.color}`}
                ></i>
              )}
              <h2 className={`text-xl font-semibold mb-2 ${tile.isButton ? "text-white" : ""}`}>
                {tile.title}
              </h2>
              <p className={`${tile.isButton ? "text-white/90" : "text-gray-600"}`}>{tile.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-gray-900 text-white text-center py-4">
        <p>&copy; 2025 BHub Innovations. All rights reserved.</p>
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .fade-up { opacity: 0; animation: fadeUp 0.6s ease forwards; }
        .animate-fadeIn { animation: fadeIn 0.3s ease forwards; }
        .icon-bounce:hover { transform: translateY(-2px) scale(1.05); transition: transform 0.2s ease; }

        /* Cart drawer spring */
        .cart-drawer {
          transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55), box-shadow 0.3s ease;
        }
        .cart-open { transform: translateX(0); box-shadow: -4px 0 20px rgba(0,0,0,0.15); }
        .cart-closed { transform: translateX(100%); box-shadow: none; }

        /* Notification dropdown spring */
        .notif-open {
          opacity: 1;
          transform: scaleY(1) translateY(0);
          transition: transform 0.45s cubic-bezier(0.68,-0.55,0.27,1.55), opacity 0.3s ease;
        }
        .notif-closed {
          opacity: 0;
          transform: scaleY(0.95) translateY(-10px);
          transition: transform 0.3s ease, opacity 0.2s ease;
          pointer-events: none;
        }
      `}</style>
    </div>
  );

