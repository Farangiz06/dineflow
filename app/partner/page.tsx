"use client";

import Link from "next/link";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Map,
  Table2,
  Utensils,
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export default function PartnerPanelPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Utensils size={18} />
            </div>
            <span className="text-xl font-black">DineFlow Partner</span>
          </Link>

          <LogoutButton />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="font-bold text-orange-600">Restaurant Owner Panel</p>
        <h1 className="mt-2 text-4xl font-black text-gray-950">
          Manage your restaurant
        </h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          Here restaurant owners manage bookings, tables, menu, and editable
          floor plans.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/dashboard"
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md"
          >
            <LayoutDashboard className="text-orange-500" />
            <h2 className="mt-4 text-xl font-black">Dashboard</h2>
            <p className="mt-2 text-sm text-gray-500">
              See restaurant overview and stats.
            </p>
          </Link>

          <Link
            href="/partner/floor-plan"
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md"
          >
            <Map className="text-orange-500" />
            <h2 className="mt-4 text-xl font-black">Floor Plan Editor</h2>
            <p className="mt-2 text-sm text-gray-500">
              Move, resize, and edit tables.
            </p>
          </Link>

          <Link
            href="/partner/menu"
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md"
          >
            <ClipboardList className="text-orange-500" />
            <h2 className="mt-4 text-xl font-black">Menu Editor</h2>
            <p className="mt-2 text-sm text-gray-500">
              Add, edit, and delete menu items.
            </p>
          </Link>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <Table2 className="text-orange-500" />
            <h2 className="mt-4 text-xl font-black">Tables</h2>
            <p className="mt-2 text-sm text-gray-500">
              Soon: quick table management.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <CalendarDays className="text-orange-500" />
            <h2 className="mt-4 text-xl font-black">Bookings</h2>
            <p className="mt-2 text-sm text-gray-500">
              Soon: confirm or cancel bookings.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}