import Link from "next/link";
import {
  Armchair,
  Building2,
  CalendarDays,
  ClipboardList,
  Map,
  Search,
  ShoppingBag,
  Star,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import RestaurantCard from "@/components/RestaurantCard";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: restaurants, error } = await supabase
    .from("restaurants")
    .select("id, name, cuisine_type, city, image_url, is_open")
    .eq("approval_status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase restaurants error:", error.message);
  }

  const restaurantList =
    restaurants?.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      type: restaurant.cuisine_type || "Restaurant",
      location: restaurant.city || "Tashkent",
      rating: 4.8,
      price: "$$",
      status: restaurant.is_open ? "Open" : "Closed",
      image:
        restaurant.image_url ||
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
    })) || [];

  return (
    <main className="min-h-screen bg-[#fffaf5]">
      <Navbar />

      <section className="relative overflow-hidden bg-gray-950">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1600&auto=format&fit=crop)",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full bg-orange-500/20 px-4 py-2 text-sm font-bold text-orange-300">
              Restaurant booking and table management platform
            </p>

            <h1 className="text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
              Discover restaurants before you book.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-200">
              DineFlow helps customers explore restaurants, view restaurant
              information, and after login book exact tables and pre-order meals.
              Restaurants can manage bookings, menu, and floor plans from one
              partner dashboard.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register/customer"
                className="rounded-2xl bg-orange-500 px-7 py-4 text-center font-black text-white shadow-lg shadow-orange-950/30 hover:bg-orange-600"
              >
                Create Customer Account
              </Link>

              <Link
                href="/register/partner"
                className="rounded-2xl border border-white/30 bg-white/10 px-7 py-4 text-center font-black text-white backdrop-blur hover:bg-white/20"
              >
                Register Restaurant
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-5 text-sm font-semibold text-gray-200">
              <span className="flex items-center gap-2">
                <Star className="fill-orange-400 text-orange-400" size={18} />
                Restaurant discovery
              </span>

              <span className="flex items-center gap-2">
                <Users size={18} />
                Customer, partner, and admin panels
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-950">How DineFlow works</h2>
          <p className="mt-2 text-gray-600">
            Public visitors can explore. Registered users can book.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-4">
          {[
            {
              title: "Explore Restaurants",
              text: "Visitors can view restaurant photos and basic information.",
              icon: Search,
            },
            {
              title: "Register or Login",
              text: "Booking is available only after creating an account.",
              icon: Users,
            },
            {
              title: "Choose Table",
              text: "Customers can select exact tables from the floor map.",
              icon: Armchair,
            },
            {
              title: "Pre-order Meals",
              text: "Users can order meals before arriving at the restaurant.",
              icon: ShoppingBag,
            },
          ].map((step, index) => (
            <div
              key={step.title}
              className="rounded-3xl border border-orange-100 bg-white p-6 text-center shadow-sm"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <step.icon size={22} />
              </div>

              <p className="mt-4 text-sm font-black text-orange-500">
                Step {index + 1}
              </p>

              <h3 className="mt-2 font-black text-gray-950">{step.title}</h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="restaurants" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-950">
              Featured Restaurants
            </h2>
            <p className="mt-2 text-gray-600">
              Preview restaurant photos, cuisine, city, and status. Login is
              required to book a table.
            </p>
          </div>

          <Link
            href="/login"
            className="rounded-2xl bg-gray-950 px-5 py-3 text-center font-black text-white hover:bg-gray-800"
          >
            Login to Book
          </Link>
        </div>

        {restaurantList.length === 0 ? (
          <div className="rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-sm">
            <h3 className="text-xl font-bold text-gray-950">
              No restaurants found
            </h3>
            <p className="mt-2 text-gray-500">
              Approved restaurants will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {restaurantList.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                {...restaurant}
                actionHref="/login"
                actionText="Login to Book"
              />
            ))}
          </div>
        )}
      </section>

      <section
        id="customers"
        className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-2"
      >
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="font-black text-orange-600">For Customers</p>

          <h2 className="mt-3 text-3xl font-black text-gray-950">
            Book after registration
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            Customers can register, enter the user panel, see restaurants, choose
            exact tables, and pre-order meals.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-orange-50 p-5">
              <CalendarDays className="text-orange-500" />
              <h3 className="mt-3 font-black text-gray-950">Table booking</h3>
              <p className="mt-2 text-sm text-gray-500">
                Select date, time, table, and guest count.
              </p>
            </div>

            <div className="rounded-2xl bg-orange-50 p-5">
              <ShoppingBag className="text-orange-500" />
              <h3 className="mt-3 font-black text-gray-950">Pre-order meals</h3>
              <p className="mt-2 text-sm text-gray-500">
                Add dishes before arriving.
              </p>
            </div>
          </div>

          <Link
            href="/register/customer"
            className="mt-8 inline-flex rounded-2xl bg-orange-500 px-6 py-3 font-black text-white hover:bg-orange-600"
          >
            Create Customer Account
          </Link>
        </div>

        <div
          id="partners"
          className="rounded-[2rem] bg-gray-950 p-8 text-white shadow-sm"
        >
          <p className="font-black text-orange-400">For Restaurants</p>

          <h2 className="mt-3 text-3xl font-black">
            Manage your restaurant after approval
          </h2>

          <p className="mt-4 leading-7 text-gray-300">
            Restaurant owners register as partners. After admin approval, they
            can manage menu, tables, floor map, and bookings.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <Map className="text-orange-400" />
              <p className="mt-3 text-sm font-bold">Floor Map</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <ClipboardList className="text-orange-400" />
              <p className="mt-3 text-sm font-bold">Menu Editor</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <Building2 className="text-orange-400" />
              <p className="mt-3 text-sm font-bold">Partner Panel</p>
            </div>
          </div>

          <Link
            href="/register/partner"
            className="mt-8 inline-flex rounded-2xl bg-orange-500 px-6 py-3 font-black text-white hover:bg-orange-600"
          >
            Register Restaurant
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-[2rem] bg-orange-500 p-8 text-white md:p-12">
          <h2 className="text-3xl font-black">Ready to use DineFlow?</h2>

          <p className="mt-3 max-w-2xl text-orange-50">
            Create a customer account to book restaurants, or register your
            restaurant as a partner.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/register/customer"
              className="rounded-2xl bg-white px-6 py-3 text-center font-black text-orange-600"
            >
              Customer Sign Up
            </Link>

            <Link
              href="/register/partner"
              className="rounded-2xl border border-white/40 px-6 py-3 text-center font-black text-white"
            >
              Partner Sign Up
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}