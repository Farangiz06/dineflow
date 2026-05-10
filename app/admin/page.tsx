"use client";

import Link from "next/link";
import {
  Building2,
  ChartLine,
  ShieldCheck,
  Users,
  Utensils,
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export default function AdminPanelPage() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      <header className="border-b border-white/10 bg-[#111827]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Utensils size={18} />
            </div>
            <span className="text-xl font-black">DineFlow Admin</span>
          </Link>

          <LogoutButton />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="font-bold text-orange-400">Platform Admin Panel</p>

        <h1 className="mt-2 text-4xl font-black">
          Manage the whole DineFlow platform
        </h1>

        <p className="mt-3 max-w-2xl text-gray-300">
          Admin can manage restaurant partner requests, users, restaurants,
          platform analytics, and safety settings.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/partners"
            className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10"
          >
            <Building2 className="text-orange-400" />
            <h2 className="mt-4 text-xl font-black">Partner Requests</h2>
            <p className="mt-2 text-sm text-gray-400">
              Approve or reject restaurant owners.
            </p>
          </Link>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <ShieldCheck className="text-orange-400" />
            <h2 className="mt-4 text-xl font-black">Admin Control</h2>
            <p className="mt-2 text-sm text-gray-400">
              Control platform access and safety settings.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <Users className="text-orange-400" />
            <h2 className="mt-4 text-xl font-black">Users</h2>
            <p className="mt-2 text-sm text-gray-400">
              Soon: see all customers and partners.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <ChartLine className="text-orange-400" />
            <h2 className="mt-4 text-xl font-black">Analytics</h2>
            <p className="mt-2 text-sm text-gray-400">
              Soon: platform stats and growth.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black">Admin workflow</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-sm font-bold text-orange-400">Step 1</p>
              <h3 className="mt-2 font-black">Partner registers</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                Restaurant owner submits owner and restaurant information.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-sm font-bold text-orange-400">Step 2</p>
              <h3 className="mt-2 font-black">Admin reviews</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                Admin checks the restaurant information and decides approval.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-sm font-bold text-orange-400">Step 3</p>
              <h3 className="mt-2 font-black">Partner gets access</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                Approved partners can access the partner dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}