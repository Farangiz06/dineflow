"use client";

import Link from "next/link";
import {
  Bell,
  Building2,
  CalendarDays,
  ChartLine,
  CheckCircle,
  LayoutDashboard,
  Loader2,
  LogOut,
  ShieldCheck,
  Users,
  Utensils,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type PlatformStats = {
  totalRestaurants: number;
  pendingRestaurants: number;
  approvedRestaurants: number;
  totalBookings: number;
  totalUsers: number;
};

type PendingRestaurant = {
  id: string;
  name: string;
  cuisine_type: string | null;
  city: string | null;
  created_at: string;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [pending, setPending] = useState<PendingRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const [restaurantRes, bookingRes, profileRes] = await Promise.all([
        supabase.from("restaurants").select("id, approval_status"),
        supabase.from("bookings").select("id"),
        supabase.from("profiles").select("id"),
      ]);

      const restaurants = restaurantRes.data ?? [];
      setStats({
        totalRestaurants: restaurants.length,
        pendingRestaurants: restaurants.filter(
          (r) => r.approval_status === "pending" || !r.approval_status
        ).length,
        approvedRestaurants: restaurants.filter(
          (r) => r.approval_status === "approved"
        ).length,
        totalBookings: bookingRes.data?.length ?? 0,
        totalUsers: profileRes.data?.length ?? 0,
      });

      const { data: pendingData } = await supabase
        .from("restaurants")
        .select("id, name, cuisine_type, city, created_at")
        .or("approval_status.eq.pending,approval_status.is.null")
        .order("created_at", { ascending: false })
        .limit(5);

      setPending((pendingData ?? []) as PendingRestaurant[]);
      setIsLoading(false);
    }
    load();
  }, []);

  async function handleApprove(id: string) {
    setActionLoading(id + "_approve");
    await supabase.from("restaurants").update({ approval_status: "approved" }).eq("id", id);
    setPending((prev) => prev.filter((r) => r.id !== id));
    setStats((prev) =>
      prev ? { ...prev, pendingRestaurants: prev.pendingRestaurants - 1, approvedRestaurants: prev.approvedRestaurants + 1 } : prev
    );
    setActionLoading(null);
  }

  async function handleReject(id: string) {
    setActionLoading(id + "_reject");
    await supabase.from("restaurants").update({ approval_status: "rejected" }).eq("id", id);
    setPending((prev) => prev.filter((r) => r.id !== id));
    setStats((prev) =>
      prev ? { ...prev, pendingRestaurants: prev.pendingRestaurants - 1 } : prev
    );
    setActionLoading(null);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin", active: true },
    { label: "Partner Requests", icon: Building2, href: "/admin/partners" },
    { label: "Users", icon: Users, href: "/admin/users" },
    { label: "Analytics", icon: ChartLine, href: "/admin/analytics" },
  ];

  return (
    <main className="flex min-h-screen bg-[#0d1117]">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col bg-[#07111f] p-6 text-white lg:flex">
        <Link href="/" className="mb-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500">
            <Utensils size={18} />
          </div>
          <span className="text-lg font-black">DineFlow</span>
        </Link>

        <nav className="flex-1 space-y-1 text-sm font-semibold">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition ${
                item.active
                  ? "bg-orange-500 text-white"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 space-y-3">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-sm font-black text-white">Admin</p>
            <p className="mt-0.5 text-xs text-gray-400">DineFlow Platform</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col text-white">
        <header className="flex items-center justify-between border-b border-white/10 bg-[#111827] px-6 py-4">
          <div>
            <h1 className="text-2xl font-black">Admin Dashboard</h1>
            <p className="text-sm text-gray-400">DineFlow platform overview</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/partners"
              className="relative rounded-2xl border border-white/10 bg-white/5 p-2.5 text-gray-300 hover:bg-white/10"
            >
              <Bell size={20} />
              {stats && stats.pendingRestaurants > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-white">
                  {stats.pendingRestaurants}
                </span>
              )}
            </Link>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20 text-sm font-black text-orange-400">
              A
            </div>
          </div>
        </header>

        <section className="flex-1 p-6 lg:p-8">
          {isLoading ? (
            <div className="flex items-center gap-3 text-gray-400">
              <Loader2 className="animate-spin text-orange-500" />
              Loading platform data...
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
                {[
                  { label: "Total Restaurants", value: stats?.totalRestaurants ?? 0, icon: Building2, accent: false },
                  { label: "Pending Approval", value: stats?.pendingRestaurants ?? 0, icon: Bell, accent: true },
                  { label: "Approved", value: stats?.approvedRestaurants ?? 0, icon: CheckCircle, accent: false },
                  { label: "Total Bookings", value: stats?.totalBookings ?? 0, icon: CalendarDays, accent: false },
                  { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, accent: false },
                ].map((card) => (
                  <div
                    key={card.label}
                    className={`rounded-3xl p-6 ${
                      card.accent ? "bg-orange-500" : "border border-white/10 bg-white/5"
                    }`}
                  >
                    <card.icon size={22} className={card.accent ? "text-white/80" : "text-orange-400"} />
                    <p className="mt-4 text-3xl font-black text-white">{card.value}</p>
                    <p className={`mt-1 text-sm font-bold ${card.accent ? "text-white/80" : "text-gray-400"}`}>
                      {card.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pending + Quick actions */}
              <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-black">Pending Partner Requests</h2>
                    <Link href="/admin/partners" className="text-sm font-bold text-orange-400 hover:underline">
                      View all
                    </Link>
                  </div>
                  {pending.length === 0 ? (
                    <p className="text-sm text-gray-500">No pending requests.</p>
                  ) : (
                    <div className="space-y-4">
                      {pending.map((r) => (
                        <div key={r.id} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                          <div>
                            <p className="text-sm font-black text-white">{r.name}</p>
                            <p className="text-xs text-gray-400">
                              {r.cuisine_type || "Restaurant"} · {r.city || "City unknown"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(r.id)}
                              disabled={actionLoading !== null}
                              className="flex items-center gap-1 rounded-xl bg-green-500/20 px-3 py-1.5 text-xs font-black text-green-400 hover:bg-green-500/30 disabled:opacity-50"
                            >
                              {actionLoading === r.id + "_approve" ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <CheckCircle size={12} />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(r.id)}
                              disabled={actionLoading !== null}
                              className="flex items-center gap-1 rounded-xl bg-red-500/20 px-3 py-1.5 text-xs font-black text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                            >
                              {actionLoading === r.id + "_reject" ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <XCircle size={12} />
                              )}
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h2 className="mb-5 text-lg font-black">Quick Actions</h2>
                  <div className="space-y-3">
                    {[
                      { label: "Review all partner requests", href: "/admin/partners", icon: Building2 },
                      { label: "Platform security", href: "/admin", icon: ShieldCheck },
                      { label: "View all users", href: "/admin/users", icon: Users },
                      { label: "Platform analytics", href: "/admin/analytics", icon: ChartLine },
                    ].map((action) => (
                      <Link
                        key={action.href}
                        href={action.href}
                        className="flex items-center gap-3 rounded-2xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm font-bold text-orange-400 transition hover:bg-orange-500/20"
                      >
                        <action.icon size={16} />
                        {action.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}