"use client";

import Link from "next/link";
import { Building2, Loader2, User, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    setMessage("");

    if (!email || !password) {
      setMessage("Please enter email and password.");
      return;
    }

    setIsLoading(true);

    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError || !loginData.user) {
      setMessage(loginError?.message || "Login failed.");
      setIsLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, partner_status")
      .eq("id", loginData.user.id)
      .single();

    if (profileError || !profile) {
      setMessage("Profile not found. Please check profiles table.");
      setIsLoading(false);
      return;
    }

    if (profile.role === "admin") {
      router.push("/admin");
    } else if (profile.role === "partner") {
      if (profile.partner_status === "approved") {
        router.push("/partner");
      } else {
        router.push("/partner/pending");
      }
    } else {
      router.push("/user");
    }

    router.refresh();
    setIsLoading(false);
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[0.9fr_1.1fr]">
      <section
        className="hidden bg-cover bg-center lg:block"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop)",
        }}
      />

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <Link href="/" className="mb-8 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Utensils size={18} />
            </div>
            <span className="text-xl font-black">DineFlow</span>
          </Link>

          <h1 className="text-4xl font-black text-gray-950">Welcome back</h1>
          <p className="mt-2 text-gray-500">
            Login to continue to your panel.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
              <User className="text-orange-500" />
              <p className="mt-2 font-black text-gray-950">Customer</p>
              <p className="mt-1 text-sm text-gray-500">
                Access bookings and profile.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
              <Building2 className="text-orange-500" />
              <p className="mt-2 font-black text-gray-950">Partner</p>
              <p className="mt-1 text-sm text-gray-500">
                Manage your restaurant panel.
              </p>
            </div>
          </div>

          <form className="mt-6 space-y-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Your password"
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
              onClick={handleLogin}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-black text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading && <Loader2 className="animate-spin" size={18} />}
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Don’t have an account?{" "}
              <Link href="/register" className="font-black text-orange-600">
                Register
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}