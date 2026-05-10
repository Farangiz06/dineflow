import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Phone, Star } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import BookingSection from "@/components/BookingSection";

type RestaurantPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function RestaurantDetailPage({
  params,
}: RestaurantPageProps) {
  const { id } = await params;

  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .single();

  const { data: tables, error: tablesError } = await supabase
    .from("restaurant_tables")
    .select("id, table_name, seats, zone, status")
    .eq("restaurant_id", id)
    .order("table_name", { ascending: true });

  const { data: menuItems, error: menuError } = await supabase
    .from("menu_items")
    .select("id, name, description, category, price, image_url, is_available")
    .eq("restaurant_id", id)
    .order("created_at", { ascending: true });

  if (restaurantError || !restaurant) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-6">
        <div className="max-w-md rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-gray-950">
            Restaurant not found
          </h1>

          <p className="mt-3 text-gray-500">
            This restaurant does not exist or could not be loaded.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-2xl bg-orange-500 px-6 py-3 font-bold text-white hover:bg-orange-600"
          >
            Back Home
          </Link>
        </div>
      </main>
    );
  }

  if (tablesError) {
    console.error("Tables error:", tablesError.message);
  }

  if (menuError) {
    console.error("Menu error:", menuError.message);
  }

  return (
    <main className="min-h-screen bg-[#fffaf5]">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 font-semibold text-gray-600 hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          Back to restaurants
        </Link>

        <div className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-sm">
          <div
            className="h-[360px] bg-cover bg-center"
            style={{
              backgroundImage: `url(${
                restaurant.image_url ||
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop"
              })`,
            }}
          />

          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700">
                  {restaurant.cuisine_type || "Restaurant"}
                </span>

                <h1 className="mt-4 text-4xl font-black text-gray-950">
                  {restaurant.name}
                </h1>

                <p className="mt-3 max-w-2xl text-gray-600">
                  {restaurant.description ||
                    "Enjoy a comfortable dining experience with easy table booking and meal pre-order."}
                </p>

                <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <MapPin size={17} />
                    {restaurant.address || restaurant.city || "Tashkent"}
                  </span>

                  <span className="flex items-center gap-2">
                    <Phone size={17} />
                    {restaurant.phone || "No phone"}
                  </span>

                  <span className="flex items-center gap-2">
                    <Clock size={17} />
                    {restaurant.opening_time || "10:00"} -{" "}
                    {restaurant.closing_time || "23:00"}
                  </span>

                  <span className="flex items-center gap-2">
                    <Star
                      size={17}
                      className="fill-orange-400 text-orange-400"
                    />
                    4.8 rating
                  </span>
                </div>
              </div>

              <div className="rounded-3xl bg-orange-50 p-5 text-center">
                <p className="text-sm font-semibold text-gray-500">Status</p>

                <p
                  className={`mt-2 text-xl font-black ${
                    restaurant.is_open ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {restaurant.is_open ? "Open Now" : "Closed"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <BookingSection
          restaurantId={id}
          tables={tables || []}
          menuItems={menuItems || []}
        />
      </section>
    </main>
  );
}