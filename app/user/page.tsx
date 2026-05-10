"use client";

import Link from "next/link";
import { CalendarDays, Search, ShoppingBag, Utensils } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export default function UserPanelPage() {
  return (
    <main className="min-h-screen bg-[#fffaf5]">
      <header className="border-b border-orange-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Utensils size={18} />
            </div>
            <span className="text-xl font-black">DineFlow</span>
          </Link>

          <LogoutButton />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="font-bold text-orange-600">Customer Panel</p>

        <h1 className="mt-2 text-4xl font-black text-gray-950">
          Find restaurants and manage your bookings
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          This is the customer area. Here users can browse restaurants, book
          tables, pre-order meals, and later see their own reservations.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Link
            href="/user/restaurants"
            className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <Search className="text-orange-500" />

            <h2 className="mt-4 text-xl font-black text-gray-950">
              Browse Restaurants
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Choose a restaurant, view details, select a table, and start your
              booking.
            </p>

            <span className="mt-5 inline-flex rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white">
              View Restaurants
            </span>
          </Link>

          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
            <CalendarDays className="text-orange-500" />

            <h2 className="mt-4 text-xl font-black text-gray-950">
              My Bookings
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Soon: customers will see their booking history, status, date, time,
              table, and restaurant.
            </p>

            <span className="mt-5 inline-flex rounded-2xl bg-gray-100 px-5 py-3 text-sm font-black text-gray-500">
              Coming Soon
            </span>
          </div>

          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
            <ShoppingBag className="text-orange-500" />

            <h2 className="mt-4 text-xl font-black text-gray-950">
              Pre-orders
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Soon: users will manage meals they pre-ordered before going to the
              restaurant.
            </p>

            <span className="mt-5 inline-flex rounded-2xl bg-gray-100 px-5 py-3 text-sm font-black text-gray-500">
              Coming Soon
            </span>
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] bg-orange-500 p-8 text-white">
          <h2 className="text-2xl font-black">
            Ready to book your next restaurant?
          </h2>

          <p className="mt-3 max-w-2xl text-orange-50">
            Go to the restaurant list, choose one restaurant, select your table,
            add meals, and confirm your booking.
          </p>

          <Link
            href="/user/restaurants"
            className="mt-6 inline-flex rounded-2xl bg-white px-6 py-3 font-black text-orange-600"
          >
            Start Booking
          </Link>
        </div>
      </section>
    </main>
  );
}