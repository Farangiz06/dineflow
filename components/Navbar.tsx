import Link from "next/link";
import { Utensils } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
            <Utensils size={18} />
          </div>
          <span className="text-xl font-black text-gray-950">DineFlow</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-bold text-gray-700 md:flex">
          <Link href="/" className="hover:text-orange-600">
            Home
          </Link>
          <a href="#how-it-works" className="hover:text-orange-600">
            How it works
          </a>
          <a href="#customers" className="hover:text-orange-600">
            For Customers
          </a>
          <a href="#partners" className="hover:text-orange-600">
            For Restaurants
          </a>
          <a href="#restaurants" className="hover:text-orange-600">
            Restaurants
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-orange-50 md:block"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-orange-600"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}