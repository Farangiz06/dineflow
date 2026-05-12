import LandingContent from "@/components/LandingContent";
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

  return <LandingContent restaurantList={restaurantList} />;
}