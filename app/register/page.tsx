import Link from "next/link";
import { ArrowLeft, Building2, User, Utensils } from "lucide-react";

export default function RegisterChoicePage() {
  return (
    <main className="min-h-screen bg-[#fffaf5] px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Utensils size={18} />
            </div>
            <span className="text-xl font-black">DineFlow</span>
          </Link>

          <Link
            href="/login"
            className="text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            Already have an account? Login
          </Link>
        </div>

        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-gray-600 hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          Back to home
        </Link>

        <div className="text-center">
          <h1 className="text-4xl font-black text-gray-950">
            Create your account
          </h1>
          <p className="mt-3 text-gray-600">How do you want to use DineFlow?</p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
          <Link
            href="/register/customer"
            className="rounded-[2rem] border border-orange-100 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white">
              <User size={30} />
            </div>
            <h2 className="mt-6 text-2xl font-black text-gray-950">
              I’m a Customer
            </h2>
            <p className="mx-auto mt-3 max-w-xs leading-7 text-gray-600">
              Book tables, choose your seat, pre-order meals and enjoy better
              dining.
            </p>
            <span className="mt-8 inline-flex rounded-2xl bg-orange-500 px-8 py-3 font-black text-white">
              Continue as Customer
            </span>
          </Link>

          <Link
            href="/register/partner"
            className="rounded-[2rem] border border-orange-100 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white">
              <Building2 size={30} />
            </div>
            <h2 className="mt-6 text-2xl font-black text-gray-950">
              I’m a Restaurant Partner
            </h2>
            <p className="mx-auto mt-3 max-w-xs leading-7 text-gray-600">
              Manage your restaurant, bookings, menu, tables and floor plan from
              one panel.
            </p>
            <span className="mt-8 inline-flex rounded-2xl bg-orange-500 px-8 py-3 font-black text-white">
              Continue as Partner
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}