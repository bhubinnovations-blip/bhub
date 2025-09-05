"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import Image from "next/image";

type Salon = {
    userID: string;
    name: string;
    location: string;
    poster: string;
    role: string;
};

export default function HomePage() {
    const [salons, setSalons] = useState<Salon[]>([]);
    const [uid, setUid] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState(""); // ✅ added search state
    const router = useRouter();

    // ✅ Watch auth
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user: User | null) => {
            if (user) {
                setUid(user.uid);
            }
        });
        return () => unsub();
    }, []);

    // ✅ Load salons
    useEffect(() => {
        const fetchSalons = async () => {
            const snap = await getDocs(collection(db, "BHub"));
            const results: Salon[] = [];
            snap.forEach((docSnap) => {
                const data = docSnap.data() as Salon;
                if (data.role === "salon") {
                    results.push(data);
                }
            });
            setSalons(results);
        };
        fetchSalons();
    }, []);

    const toggleFavorite = async (salon: Salon) => {
        if (!uid) return;
        const ref = doc(db, "Favorite", uid, "Salons", salon.name);

        if (favorites.includes(salon.userID)) {
            await deleteDoc(ref);
            setFavorites((prev) => prev.filter((id) => id !== salon.userID));
        } else {
            await setDoc(ref, {
                name: salon.name,
                userID: uid,
                location: salon.location,
                poster: salon.poster,
                vendorID: salon.userID,
            });
            setFavorites((prev) => [...prev, salon.userID]);
        }
    };

    // ✅ Filter salons by search (case-insensitive, trims spaces)
    const filteredSalons = salons.filter(
        (salon) =>
            salon.name.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            salon.location.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    return (
        <div className="bg-neutral-900 min-h-screen text-white font-sans">
            {/* Header */}
            <div className="fixed top-0 w-full bg-neutral-800 p-4 z-10">
                <h2 className="text-center text-2xl">Salons</h2>
                <div className="relative mt-2">
                    <span className="absolute left-3 top-3 text-gray-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Search salon here..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // ✅ updates state
                        className="w-full bg-neutral-700 pl-10 py-2 rounded-lg outline-none"
                    />
                </div>
            </div>

            {/* Salon List */}
            <div
                id="vendor-container-view"
                className="
          grid grid-cols-1 gap-6
          md:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          pt-32 
          pb-10
          px-4
        "
            >
                {filteredSalons.length > 0 ? (
                    filteredSalons.map((salon) => (
                        <div
                            key={salon.userID}
                            className="bg-neutral-800 rounded-lg overflow-hidden shadow"
                        >
                            <Image
                                src={salon.poster}
                                alt={salon.name}
                                width={400}
                                height={200}
                                className="w-full h-48 object-cover cursor-pointer"
                                onClick={() => {
                                    localStorage.setItem("salon_id", salon.userID);
                                    localStorage.setItem("salon_name", salon.name);
                                    router.push("/bhub");
                                }}
                            />
                            <div className="p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">{salon.name}</span>
                                    <button onClick={() => toggleFavorite(salon)}>
                                        {favorites.includes(salon.userID) ? "❤️" : "🤍"}
                                    </button>
                                </div>
                                <p className="text-sm text-gray-400 flex items-center gap-1">
                                    📍 {salon.location}
                                </p>
                                <div className="mt-2 text-sm text-gray-400">
                                    ⭐ 0.0 • 0 reviews
                                </div>
                                <button
                                    onClick={() => {
                                        localStorage.setItem("salon_id", salon.userID);
                                        localStorage.setItem("salon_name", salon.name);
                                        router.push("/bhub");
                                    }}
                                    className="mt-4 w-full bg-orange-500 py-2 rounded-lg hover:bg-orange-600"
                                >
                                    View More
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-400">
                        No salons found
                    </p>
                )}
            </div>

            {/* Footer Links */}
            <div className="hidden md:block mt-16 bg-neutral-800 p-6">
                <h3 className="font-bold text-lg">Links of interest</h3>
                <ul className="mt-4 space-y-2 text-sm">
                    <li className="cursor-pointer" onClick={() => router.push("/about")}>
                        About us
                    </li>
                    <li className="cursor-pointer" onClick={() => router.push("/privacy")}>
                        Privacy Policy
                    </li>
                    <li className="cursor-pointer" onClick={() => router.push("/terms")}>
                        Terms & Conditions
                    </li>
                    <li className="cursor-pointer" onClick={() => router.push("/contact")}>
                        Contact us
                    </li>
                </ul>

                <h3 className="font-bold text-lg mt-8">Follow us</h3>
                <ul className="mt-4 space-y-2 text-sm">
                    <li>Facebook</li>
                    <li>Twitter</li>
                    <li>Instagram</li>
                    <li
                        className="cursor-pointer"
                        onClick={() =>
                            window.open("https://www.linkedin.com/company/bhubapp/")
                        }
                    >
                        LinkedIn
                    </li>
                </ul>
            </div>
        </div>
    );
}