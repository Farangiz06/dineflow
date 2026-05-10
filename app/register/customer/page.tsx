"use client";

import Link from "next/link";
import { ArrowLeft, Loader2, Mail, Phone, User, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CustomerRegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister() {
    setMessage("");

    if (!fullName || !email || !password) {
      setMessage("Please fill in full name, email and password.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          role: "customer",
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/user");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden bg-gray-950 lg:block">
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop"
          alt="Customer"
          className="h-full w-full object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h1 className="text-5xl font-black leading-tight">
            Book smarter with <span className="text-orange-500">DineFlow</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-white/80">
            Choose restaurants, select your exact table, and pre-order meals
            before arrival.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <Link href="/" className="mb-8 inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
                <Utensils size={18} />
              </div>
              <span className="text-xl font-black">DineFlow</span>
            </Link>

            <Link
              href="/register"
              className="mb-6 flex items-center gap-2 font-semibold text-gray-600 hover:text-orange-600"
            >
              <ArrowLeft size={18} />
              Back
            </Link>

            <h1 className="text-3xl font-black text-gray-950">
              Customer Registration
            </h1>
            <p className="mt-2 text-gray-500">
              Create your customer account.
            </p>
          </div>

          <form className="space-y-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-800">
                Full Name
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 focus-within:border-orange-500">
                <User size={18} className="text-gray-400" />
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Enter your full name"
                  className="w-full outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-800">
                Email Address
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 focus-within:border-orange-500">
                <Mail size={18} className="text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="w-full outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-800">
                Phone Number
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 focus-within:border-orange-500">
                <Phone size={18} className="text-gray-400" />
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-800">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            {message && (
              <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
                {message}
              </p>
            )}

            <button
              type="button"
              disabled={isLoading}
              onClick={handleRegister}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-black text-white hover:bg-orange-600 disabled:opacity-70"
            >
              {isLoading && <Loader2 className="animate-spin" size={18} />}
              {isLoading ? "Creating..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-black text-orange-600">
                Login
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}