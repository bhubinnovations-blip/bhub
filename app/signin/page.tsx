"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";

const googleProvider = new GoogleAuthProvider();

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required!");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.assign("/welcome.html");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      window.location.assign("/welcome.html");
    } catch (err) {
      console.error(err);
      setError("Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-[1.01]">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-6 animate-fade-in">
          Welcome Back to <span className="text-blue-600">BHub</span>
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-medium animate-shake">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="Enter your email address"
              className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition duration-200 focus:shadow-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                placeholder="Enter your password"
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition duration-200 focus:shadow-lg pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <span className="text-gray-700">Show password</span>
            </label>
            <button
              type="button"
              className="text-blue-600 hover:underline font-medium transition duration-200 hover:text-blue-800"
              onClick={() => router.push("/reset-password")}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-[1.02] duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {loading && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social Login */}
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-lg font-medium shadow-sm transition-transform transform hover:scale-[1.02] duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
          >
            {loading && <span className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></span>}
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-gray-800">{loading ? 'Loading...' : 'Continue with Google'}</span>
          </button>
        </div>

        {/* Signup link */}
        <p className="text-sm text-center text-gray-700 mt-6 animate-fade-in-up">
          Don’t have an account?{' '}
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="text-blue-600 font-semibold hover:underline transition duration-200 hover:text-blue-800"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}