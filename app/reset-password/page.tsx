"use client"

import Head from "next/head";
import React, { useState } from "react";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your reset password logic here
    console.log("Reset link sent to:", email);
  };

  return (
    <>
      <Head>
        <title>Reset Password - BHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-cyan-400 font-sans">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
          {/* Heading */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Reset Password
          </h2>
          <p className="text-center text-gray-600 text-sm mb-6">
            Enter your email address registered with BHub and we’ll send you a link to reset your password.
          </p>

          {/* Reset Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block mb-1 text-gray-700 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email ( required )"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition duration-300"
            >
              Send Reset Link
            </button>
          </form>

          {/* Back to login */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Remembered your password?{" "}
            <a href="/signin" className="text-blue-500 font-semibold hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;