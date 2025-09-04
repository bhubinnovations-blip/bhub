"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    getAuth,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Eye, EyeOff, Loader2 } from "lucide-react";


export default function RegisterPage() {
    const router = useRouter();
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();


        if (!fullname || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }


        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }


        try {
            setLoading(true);
            setError(null);


            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCred.user;


            await setDoc(doc(db, "BHub", user.uid), {
                email: user.email,
                userID: user.uid,
                fullname,
                role: "user",
            });


            window.location.assign("/welcome.html");
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please check your email and password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-cyan-400">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
                    Create BHub Account
                </h2>


                <form onSubmit={handleRegister} className="space-y-6">
                    {/* Fullname */}
                    <div className="relative">
                        <input
                            type="text"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            placeholder=" "
                            className="peer w-full px-4 pt-5 pb-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-transparent"
                            required
                        />
                        <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500">
                            Full Name
                        </label>
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder=" "
                            className="peer w-full px-4 pt-5 pb-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-transparent"
                            required
                        />
                        <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500">
                            Email
                        </label>
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=" "
                            className="peer w-full px-4 pt-5 pb-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-transparent"
                            required
                        />
                        <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500">
                            Password (min. 6 characters)
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {/* Confirm Password */}
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder=" "
                            className="peer w-full px-4 pt-5 pb-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder-transparent"
                            required
                        />
                        <label className="absolute left-4 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500">
                            Confirm Password
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-sm font-medium">
                            {error}
                        </div>
                    )}


                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg shadow-md transition duration-300 ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold"
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Registering...
                            </>
                        ) : (
                            "Register"
                        )}
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Already have an account?{" "}
                        <span
                            onClick={() => router.push("/signin")}
                            className="text-blue-500 font-semibold hover:underline cursor-pointer"
                        >
                            Login
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}