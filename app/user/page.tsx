"use client";

import Link from "next/link";
import {
  Bell,
  CalendarDays,
  ChartLine,
  Compass,
  Gift,
  Loader2,
  LogOut,
  Star,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider";
import { supabase } from "@/lib/supabaseClient";

type UserStats = {
  totalBookings: number;
  upcomingBookings: number;
  totalPoints: number;
  loyaltyTier: string;
};

type RecentBooking = {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  restaurant_name: string;
};

const t = {
  en: {
    welcome: "Welcome back",
    subtitle: "Your bookings, loyalty points, and nearby restaurants.",
    dashboard: "Dashboard",
    explore: "Explore",
    bookings: "My Bookings",
    points: "Loyalty Points",
    logout: "Logout",
    totalBookings: "Total Bookings",
    upcoming: "Upcoming",
    loyaltyPoints: "My Points",
    tier: "Tier",
    recentBookings: "Recent Bookings",
    viewAll: "View all",
    noBookings: "No bookings yet.",
    loading: "Loading...",
    quickActions: "Quick Actions",
    browseRestaurants: "Browse restaurants",
    exploreDeals: "Explore deals & nearby",
    viewLoyalty: "My loyalty points",
    bronze: "Bronze", silver: "Silver", gold: "Gold", platinum: "Platinum",
    pointsDesc: "Earn points every booking",
    tierDesc: "Your loyalty level",
    upcomingDesc: "Confirmed upcoming bookings",
    customer: "Customer",
  },
  uz: {
    welcome: "Xush kelibsiz",
    subtitle: "Bronlaringiz, loyalty pointlaringiz va yaqin restoranlar.",
    dashboard: "Dashboard",
    explore: "Kashf etish",
    bookings: "Bronlarim",
    points: "Loyalty Pointlar",
    logout: "Chiqish",
    totalBookings: "Jami bronlar",
    upcoming: "Kutilayotgan",
    loyaltyPoints: "Mening pointlarim",
    tier: "Daraja",
    recentBookings: "So'nggi bronlar",
    viewAll: "Barchasini ko'rish",
    noBookings: "Hali bron yo'q.",
    loading: "Yuklanmoqda...",
    quickActions: "Tezkor amallar",
    browseRestaurants: "Restoranlarni ko'rish",
    exploreDeals: "Aksiyalar va yaqin joylar",
    viewLoyalty: "Mening loyalty pointlarim",
    bronze: "Bronza", silver: "Kumush", gold: "Oltin", platinum: "Platinum",
    pointsDesc: "Har brondan point yig'ing",
    tierDesc: "Loyalty darajangiz",
    upcomingDesc: "Tasdiqlangan kelgusi bronlar",
    customer: "Mijoz",
  },
  ru: {
    welcome: "Добро пожаловать",
    subtitle: "Ваши брони, баллы лояльности и рестораны рядом.",
    dashboard: "Дэшборд",
    explore: "Исследовать",
    bookings: "Мои брони",
    points: "Баллы лояльности",
    logout: "Выйти",
    totalBookings: "Всего бронирований",
    upcoming: "Предстоящие",
    loyaltyPoints: "Мои баллы",
    tier: "Уровень",
    recentBookings: "Последние брони",
    viewAll: "Смотреть все",
    noBookings: "Бронирований пока нет.",
    loading: "Загрузка...",
    quickActions: "Быстрые действия",
    browseRestaurants: "Смотреть рестораны",
    exploreDeals: "Акции и рестораны рядом",
    viewLoyalty: "Мои баллы лояльности",
    bronze: "Бронза", silver: "Серебро", gold: "Золото", platinum: "Платинум",
    pointsDesc: "Копите баллы с каждой брони",
    tierDesc: "Ваш текущий уровень",
    upcomingDesc: "Подтверждённые предстоящие брони",
    customer: "Клиент",
  },
};

function tierLabel(tier: string, text: typeof t.en) {
  if (tier === "platinum") return text.platinum;
  if (tier === "gold") return text.gold;
  if (tier === "silver") return text.silver;
  return text.bronze;
}

function tierColor(tier: string) {
  if (tier === "platinum") return "text-purple-400";
  if (tier === "gold") return "text-yellow-400";
  if (tier === "silver") return "text-gray-300";
  return "text-orange-400";
}

function statusStyle(status: string) {
  if (status === "confirmed" || status === "approved") return "bg-green-100 text-green-700";
  if (status === "cancelled") return "bg-red-100 text-red-700";
  if (status === "completed") return "bg-blue-100 text-blue-700";
  return "bg-orange-100 text-orange-700";
}

export default function UserDashboardPage() {
  const { language } = useLanguage();
  const text = t[language];
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) { router.push("/login"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, total_points, loyalty_tier")
        .eq("id", userData.user.id)
        .single();

      setFullName(profile?.full_name ?? "");

      const today = new Date().toISOString().split("T")[0];
      const { data: allBookings } = await supabase
        .from("bookings")
        .select("id, booking_date, status")
        .eq("user_id", userData.user.id);

      const upcoming = (allBookings ?? []).filter(
        (b) => b.booking_date >= today && (b.status === "confirmed" || b.status === "approved" || b.status === "pending")
      ).length;

      setStats({
        totalBookings: allBookings?.length ?? 0,
        upcomingBookings: upcoming,
        totalPoints: profile?.total_points ?? 0,
        loyaltyTier: profile?.loyalty_tier ?? "bronze",
      });

      const { data: recent } = await supabase
        .from("bookings")
        .select("id, booking_date, booking_time, status, restaurants(name)")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      const mapped = (recent ?? []).map((b) => {
        const r = b.restaurants as { name: string } | { name: string }[] | null;
        const rName = Array.isArray(r) ? r[0]?.name : r?.name;
        return {
          id: b.id,
          booking_date: b.booking_date,
          booking_time: b.booking_time,
          status: b.status,
          restaurant_name: rName ?? "Restaurant",
        };
      });
      setRecentBookings(mapped);
      setIsLoading(false);
    }
    load();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const navItems = [
    { label: text.dashboard, icon: ChartLine, href: "/user", active: true },
    { label: text.explore, icon: Compass, href: "/user/explore" },
    { label: text.bookings, icon: CalendarDays, href: "/user/bookings" },
    { label: text.points, icon: Gift, href: "/user/loyalty" },
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

        {stats && (
          <div className="my-4 rounded-2xl bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">{text.tier}</p>
                <p className={`mt-1 text-sm font-black ${tierColor(stats.loyaltyTier)}`}>
                  {tierLabel(stats.loyaltyTier, text)}
                </p>
              </div>
              <Star size={20} className="text-orange-400" />
            </div>
            <p className="mt-2 text-xl font-black text-white">{stats.totalPoints} pts</p>
          </div>
        )}

        <div className="space-y-2">
          <div className="rounded-2xl bg-white/5 p-3">
            <p className="text-sm font-black text-white">{fullName || "..."}</p>
            <p className="mt-0.5 text-xs text-gray-400">{text.customer}</p>
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
              {text.welcome}{fullName ? `, ${fullName}` : ""}! 👋
            </h1>
            <p className="text-sm text-gray-500">{text.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/user/bookings"
              className="relative rounded-2xl border border-gray-200 bg-white p-2.5 text-gray-600 hover:bg-orange-50"
            >
              <Bell size={20} />
              {stats && stats.upcomingBookings > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-white">
                  {stats.upcomingBookings}
                </span>
              )}
            </Link>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-black text-orange-600">
              {fullName?.charAt(0) || "U"}
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
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: text.totalBookings, value: stats?.totalBookings ?? 0, desc: text.pointsDesc, icon: CalendarDays, accent: false },
                  { label: text.upcoming, value: stats?.upcomingBookings ?? 0, desc: text.upcomingDesc, icon: Bell, accent: true },
                  { label: text.loyaltyPoints, value: `${stats?.totalPoints ?? 0} pts`, desc: text.pointsDesc, icon: Gift, accent: false },
                  { label: text.tier, value: tierLabel(stats?.loyaltyTier ?? "bronze", text), desc: text.tierDesc, icon: Star, accent: false },
                ].map((card) => (
                  <div
                    key={card.label}
                    className={`rounded-3xl p-6 ${
                      card.accent ? "bg-orange-500" : "border border-gray-200 bg-white shadow-sm"
                    }`}
                  >
                    <card.icon size={22} className={card.accent ? "text-white/80" : "text-orange-500"} />
                    <p className={`mt-4 text-3xl font-black ${card.accent ? "text-white" : "text-gray-950"}`}>
                      {card.value}
                    </p>
                    <p className={`mt-1 text-sm font-bold ${card.accent ? "text-white/80" : "text-gray-600"}`}>
                      {card.label}
                    </p>
                    <p className={`mt-0.5 text-xs ${card.accent ? "text-white/60" : "text-gray-400"}`}>
                      {card.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom grid */}
              <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-lg font-black text-gray-950">{text.recentBookings}</h2>
                    <Link href="/user/bookings" className="text-sm font-bold text-orange-600 hover:underline">
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
                            <p className="text-sm font-black text-gray-900">{b.restaurant_name}</p>
                            <p className="text-xs text-gray-500">{b.booking_date} · {b.booking_time}</p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-black ${statusStyle(b.status)}`}>
                            {b.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-5 text-lg font-black text-gray-950">{text.quickActions}</h2>
                  <div className="space-y-3">
                    {[
                      { label: text.exploreDeals, href: "/user/explore", icon: Compass },
                      { label: text.browseRestaurants, href: "/user/restaurants", icon: Utensils },
                      { label: text.viewLoyalty, href: "/user/loyalty", icon: Gift },
                      { label: text.bookings, href: "/user/bookings", icon: CalendarDays },
                    ].map((a) => (
                      <Link
                        key={a.href}
                        href={a.href}
                        className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700 transition hover:bg-orange-100"
                      >
                        <a.icon size={16} />
                        {a.label}
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