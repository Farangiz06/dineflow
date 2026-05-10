import Link from "next/link";
import { ArrowLeft, Utensils } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import RestaurantCard from "@/components/RestaurantCard";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export default async function UserRestaurantsPage() {
  const { data: restaurants, error } = await supabase
    .from("restaurants")
    .select("id, name, cuisine_type, city, image_url, is_open")
    .eq("approval_status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("User restaurants error:", error.message);
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
      <header className="border-b border-orange-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/user" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Utensils size={18} />
            </div>

            <span className="text-xl font-black text-gray-950">
              DineFlow User
            </span>
          </Link>

          <LogoutButton />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link
          href="/user"
          className="mb-8 inline-flex items-center gap-2 font-bold text-gray-600 hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          Back to User Panel
        </Link>

        <div className="mb-8">
          <p className="font-bold text-orange-600">Customer Booking</p>

          <h1 className="mt-2 text-4xl font-black text-gray-950">
            Choose a restaurant to book
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            You are inside the customer panel. Choose a restaurant, open its
            booking page, select a table, pre-order meals, and confirm your
            reservation.
          </p>
        </div>

        {restaurantList.length === 0 ? (
          <div className="rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-black text-gray-950">
              No approved restaurants yet
            </h2>

            <p className="mt-2 text-gray-500">
              Admin must approve partner restaurants first. After approval,
              restaurants will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {restaurantList.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                {...restaurant}
                actionHref={`/user/restaurants/${restaurant.id}`}
                actionText="View & Book"
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}