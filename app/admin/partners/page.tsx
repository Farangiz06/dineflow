import Link from "next/link";
import { Building2, Utensils } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import PartnerApprovalActions from "@/components/PartnerApprovalActions";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("id, owner_id, name, cuisine_type, city, address, phone, approval_status, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#0f172a] text-white">
      <header className="border-b border-white/10 bg-[#111827]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Utensils size={18} />
            </div>
            <span className="text-xl font-black">DineFlow Admin</span>
          </Link>

          <Link
            href="/admin"
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white"
          >
            Back to Admin
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="font-bold text-orange-400">Admin Approval</p>
        <h1 className="mt-2 text-4xl font-black">Partner Requests</h1>
        <p className="mt-3 max-w-2xl text-gray-300">
          Review restaurant partner registrations and approve or reject access.
        </p>

        <div className="mt-8 space-y-5">
          {restaurants && restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <Building2 className="text-orange-400" />
                      <h2 className="text-2xl font-black">
                        {restaurant.name}
                      </h2>
                    </div>

                    <p className="mt-3 text-gray-300">
                      {restaurant.cuisine_type || "Restaurant"} •{" "}
                      {restaurant.city || "City not set"}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      {restaurant.address || "Address not set"}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Phone: {restaurant.phone || "No phone"}
                    </p>

                    <span
                      className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-black ${
                        restaurant.approval_status === "approved"
                          ? "bg-green-500/20 text-green-300"
                          : restaurant.approval_status === "rejected"
                          ? "bg-red-500/20 text-red-300"
                          : "bg-orange-500/20 text-orange-300"
                      }`}
                    >
                      {restaurant.approval_status || "pending"}
                    </span>
                  </div>

                  <PartnerApprovalActions
                    restaurantId={restaurant.id}
                    ownerId={restaurant.owner_id}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <h2 className="text-xl font-black">No partner requests yet</h2>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}