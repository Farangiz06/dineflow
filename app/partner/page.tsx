"use client";

import Link from "next/link";
import {
  Bell,
  CalendarDays,
  ChartLine,
  ClipboardList,
  LayoutDashboard,
  Loader2,
  LogOut,
  Map,
  Settings,
  Table2,
  Users,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider";
import { supabase } from "@/lib/supabaseClient";

type QuickStats = {
  totalBookings: number;
  pendingBookings: number;
  todayBookings: number;
  totalTables: number;
  menuItems: number;
};

type RecentBooking = {
  id: string;
  customer_name: string | null;
  booking_date: string;
  booking_time: string;
  guests_count: number;
  status: string;
};

const t = {
  en: {
    panel: "Partner Panel",
    welcome: "Welcome back",
    subtitle: "Here's what's happening at your restaurant today.",
    dashboard: "Dashboard",
    bookings: "Bookings",
    floorMap: "Floor Map",
    menu: "Menu",
    analytics: "Analytics",
    settings: "Settings",
    logout: "Logout",
    totalBookings: "Total Bookings",
    todayBookings: "Today",
    pending: "Pending",
    tables: "Tables",
    menuItems: "Menu Items",
    recentBookings: "Recent Bookings",
    viewAll: "View all",
    noBookings: "No bookings yet.",
    loading: "Loading...",
    guests: "guests",
    quickActions: "Quick Actions",
    manageBookings: "Manage bookings",
    addTable: "Edit floor map",
    addDish: "Add a dish",
    viewAnalytics: "View analytics",
    ownerLabel: "Restaurant Owner",
  },
  uz: {
    panel: "Hamkor paneli",
    welcome: "Xush kelibsiz",
    subtitle: "Bugun restoraningizda nima bo'lyapti.",
    dashboard: "Dashboard",
    bookings: "Bronlar",
    floorMap: "Floor Map",
    menu: "Menyu",
    analytics: "Tahlil",
    settings: "Sozlamalar",
    logout: "Chiqish",
    totalBookings: "Jami bronlar",
    todayBookings: "Bugun",
    pending: "Kutilmoqda",
    tables: "Stollar",
    menuItems: "Menyu itemlari",
    recentBookings: "So'nggi bronlar",
    viewAll: "Barchasini ko'rish",
    noBookings: "Hali bron yo'q.",
    loading: "Yuklanmoqda...",
    guests: "mehmon",
    quickActions: "Tezkor amallar",
    manageBookings: "Bronlarni boshqarish",
    addTable: "Floor mapni tahrirlash",
    addDish: "Taom qo'shish",
    viewAnalytics: "Tahlilni ko'rish",
    ownerLabel: "Restoran egasi",
  },
  ru: {
    panel: "Партнёрский кабинет",
    welcome: "Добро пожаловать",
    subtitle: "Вот что происходит в вашем ресторане сегодня.",
    dashboard: "Дэшборд",
    bookings: "Брони",
    floorMap: "План зала",
    menu: "Меню",
    analytics: "Аналитика",
    settings: "Настройки",
    logout: "Выйти",
    totalBookings: "Всего бронирований",
    todayBookings: "Сегодня",
    pending: "В ожидании",
    tables: "Столов",
    menuItems: "Блюд в меню",
    recentBookings: "Последние брони",
    viewAll: "Смотреть все",
    noBookings: "Бронирований пока нет.",
    loading: "Загрузка...",
    guests: "гостей",
    quickActions: "Быстрые действия",
    manageBookings: "Управлять бронями",
    addTable: "Редактировать план зала",
    addDish: "Добавить блюдо",
    viewAnalytics: "Открыть аналитику",
    ownerLabel: "Владелец ресторана",
  },
};

function statusStyle(status: string) {
  if (status === "confirmed" || status === "approved") return "bg-green-100 text-green-700";
  if (status === "cancelled") return "bg-red-100 text-red-700";
  if (status === "completed") return "bg-blue-100 text-blue-700";
  return "bg-orange-100 text-orange-700";
}

export default function PartnerDashboardPage() {
  const { language } = useLanguage();
  const text = t[language];
  const router = useRouter();

  const [restaurantName, setRestaurantName] = useState("");
  const [stats, setStats] = useState<QuickStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { router.push("/login"); return; }

      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("id, name")
        .eq("owner_id", userData.user.id)
        .single();

      if (!restaurant) { setIsLoading(false); return; }
      setRestaurantName(restaurant.name);

      const today = new Date().toISOString().split("T")[0];

      const [allBookings, todayBookings, tables, menu] = await Promise.all([
        supabase.from("bookings").select("id, status").eq("restaurant_id", restaurant.id),
        supabase.from("bookings").select("id").eq("restaurant_id", restaurant.id).eq("booking_date", today),
        supabase.from("restaurant_tables").select("id").eq("restaurant_id", restaurant.id),
        supabase.from("menu_items").select("id").eq("restaurant_id", restaurant.id),
      ]);

      const bookingList = allBookings.data ?? [];
      setStats({
        totalBookings: bookingList.length,
        pendingBookings: bookingList.filter((b) => b.status === "pending").length,
        todayBookings: todayBookings.data?.length ?? 0,
        totalTables: tables.data?.length ?? 0,
        menuItems: menu.data?.length ?? 0,
      });

      const { data: recent } = await supabase
        .from("bookings")
        .select("id, customer_name, booking_date, booking_time, guests_count, status")
        .eq("restaurant_id", restaurant.id)
        .order("created_at", { ascending: false })
        .limit(5);

      setRecentBookings((recent ?? []) as RecentBooking[]);
      setIsLoading(false);
    }
    load();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const navItems = [
    { label: text.dashboard, icon: LayoutDashboard, href: "/partner", active: true },
    { label: text.bookings, icon: CalendarDays, href: "/partner/bookings" },
    { label: text.floorMap, icon: Map, href: "/partner/floor-plan" },
    { label: text.menu, icon: ClipboardList, href: "/partner/menu" },
    { label: text.analytics, icon: ChartLine, href: "/partner/analytics" },
    { label: text.settings, icon: Settings, href: "/partner/settings" },
  ];

  return (
    <main className="flex min-h-screen bg-gray-50">
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
            <p className="text-sm font-black text-white">{restaurantName || "..."}</p>
            <p className="mt-0.5 text-xs text-gray-400">{text.ownerLabel}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={16} />
            {text.logout}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <h1 className="text-2xl font-black text-gray-950">
              {text.welcome}{restaurantName ? `, ${restaurantName}` : ""}!
            </h1>
            <p className="text-sm text-gray-500">{text.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/partner/bookings"
              className="relative rounded-2xl border border-gray-200 bg-white p-2.5 text-gray-600 hover:bg-orange-50"
            >
              <Bell size={20} />
              {stats && stats.pendingBookings > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-white">
                  {stats.pendingBookings}
                </span>
              )}
            </Link>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-black text-orange-600">
              {restaurantName.charAt(0) || "P"}
            </div>
          </div>
        </header>

        <section className="flex-1 p-6 lg:p-8">
          {isLoading ? (
            <div className="flex items-center gap-3 text-gray-500">
              <Loader2 className="animate-spin text-orange-500" />
              {text.loading}
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
                {[
                  { label: text.totalBookings, value: stats?.totalBookings ?? 0, icon: CalendarDays, accent: false },
                  { label: text.todayBookings, value: stats?.todayBookings ?? 0, icon: Bell, accent: true },
                  { label: text.pending, value: stats?.pendingBookings ?? 0, icon: Users, accent: false },
                  { label: text.tables, value: stats?.totalTables ?? 0, icon: Table2, accent: false },
                  { label: text.menuItems, value: stats?.menuItems ?? 0, icon: ClipboardList, accent: false },
                ].map((card) => (
                  <div
                    key={card.label}
                    className={`rounded-3xl p-6 ${
                      card.accent ? "bg-orange-500 text-white" : "border border-gray-200 bg-white shadow-sm"
                    }`}
                  >
                    <card.icon size={22} className={card.accent ? "text-white/80" : "text-orange-500"} />
                    <p className={`mt-4 text-3xl font-black ${card.accent ? "text-white" : "text-gray-950"}`}>
                      {card.value}
                    </p>
                    <p className={`mt-1 text-sm font-bold ${card.accent ? "text-white/80" : "text-gray-600"}`}>
                      {card.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom grid */}
              <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                {/* Recent bookings */}
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-black text-gray-950">{text.recentBookings}</h2>
                    <Link href="/partner/bookings" className="text-sm font-bold text-orange-600 hover:underline">
                      {text.viewAll}
                    </Link>
                  </div>
                  {recentBookings.length === 0 ? (
                    <p className="text-sm text-gray-400">{text.noBookings}</p>
                  ) : (
                    <div className="space-y-3">
                      {recentBookings.map((b) => (
                        <div key={b.id} className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
                          <div>
                            <p className="text-sm font-black text-gray-900">{b.customer_name || "Guest"}</p>
                            <p className="text-xs text-gray-500">
                              {b.booking_date} · {b.booking_time} · {b.guests_count} {text.guests}
                            </p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-black ${statusStyle(b.status)}`}>
                            {b.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick actions */}
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 text-lg font-black text-gray-950">{text.quickActions}</h2>
                  <div className="space-y-3">
                    {[
                      { label: text.manageBookings, href: "/partner/bookings", icon: CalendarDays },
                      { label: text.addTable, href: "/partner/floor-plan", icon: Table2 },
                      { label: text.addDish, href: "/partner/menu", icon: ClipboardList },
                      { label: text.viewAnalytics, href: "/partner/analytics", icon: ChartLine },
                    ].map((action) => (
                      <Link
                        key={action.href}
                        href={action.href}
                        className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700 transition hover:bg-orange-100"
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