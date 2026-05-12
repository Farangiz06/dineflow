import Link from "next/link";
import { Lock, Utensils } from "lucide-react";

export default function PublicRestaurantRedirectPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-6">
      <div className="w-full max-w-md rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-white">
          <Lock size={28} />
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500 text-white">
            <Utensils size={16} />
          </div>

          <span className="text-lg font-black text-gray-950">DineFlow</span>
        </div>

        <h1 className="mt-6 text-3xl font-black text-gray-950">
          Login required
        </h1>

        <p className="mt-3 leading-7 text-gray-600">
          Restaurant booking is available only after login or registration.
          Please enter your customer account to choose a table and pre-order
          meals.
        </p>

        <div className="mt-8 grid gap-3">
          <Link
            href="/login"
            className="rounded-2xl bg-orange-500 px-6 py-3 font-black text-white hover:bg-orange-600"
          >
            Login to Book
          </Link>

          <Link
            href="/register/customer"
            className="rounded-2xl border border-orange-200 px-6 py-3 font-black text-orange-600 hover:bg-orange-50"
          >
            Create Customer Account
          </Link>

          <Link
            href="/"
            className="rounded-2xl px-6 py-3 font-bold text-gray-500 hover:text-gray-800"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}