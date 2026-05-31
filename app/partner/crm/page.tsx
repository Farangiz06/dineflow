"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ChartLine,
  ClipboardList,
  Gift,
  Loader2,
  LogOut,
  Map,
  MessageSquare,
  Phone,
  Plus,
  Settings,
  Star,
  Users,
  Utensils,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider";
import { supabase } from "@/lib/supabaseClient";

type GuestNote = {
  id: string;
  note: string;
  created_at: string;
};

type Customer = {
  user_id: string;
  full_name: string | null;
  total_visits: number;
  total_points: number;
  loyalty_tier: string;
  last_visit: string | null;
  bookings: {
    id: string;
    booking_date: string;
    booking_time: string;
    guests_count: number;
    status: string;
    occasion: string | null;
    special_notes: string | null;
  }[];
  notes: GuestNote[];
};

const t = {
  en: {
    title: "Customer CRM",
    subtitle: "All customers who booked your restaurant — history, notes, loyalty.",
    dashboard: "Dashboard", bookings: "Bookings", floorMap: "Floor Map",
    menu: "Menu", analytics: "Analytics", crm: "CRM", settings: "Settings", logout: "Logout",
    loading: "Loading customers...", noCustomers: "No customers yet.",
    noCustomersText: "Once customers book your restaurant, they appear here.",
    visits: "visits", points: "pts", lastVisit: "Last visit",
    bookingHistory: "Booking history", addNote: "Add note",
    notePlaceholder: "e.g. Allergic to nuts, always sits by window, VIP...",
    saveNote: "Save", cancel: "Cancel", noNotes: "No notes yet.",
    noBookings: "No bookings yet.",
    bronze: "Bronze", silver: "Silver", gold: "Gold", platinum: "Platinum",
    ownerLabel: "Restaurant Owner", searchPlaceholder: "Search customer...",
    occasion: "Occasion", notes: "Special notes",
  },
  uz: {
    title: "Mijozlar CRM",
    subtitle: "Restoraningizni bron qilgan barcha mijozlar — tarix, notalar, loyalty.",
    dashboard: "Dashboard", bookings: "Bronlar", floorMap: "Floor Map",
    menu: "Menyu", analytics: "Tahlil", crm: "CRM", settings: "Sozlamalar", logout: "Chiqish",
    loading: "Mijozlar yuklanmoqda...", noCustomers: "Hali mijoz yo'q.",
    noCustomersText: "Mijozlar restoraningizni bron qilganda bu yerda ko'rinadi.",
    visits: "tashrif", points: "pt", lastVisit: "Oxirgi tashrif",
    bookingHistory: "Bron tarixi", addNote: "Nota qo'shish",
    notePlaceholder: "Masalan: Yong'oqqa allergiyasi bor, doim deraza yonida o'tiradi, VIP...",
    saveNote: "Saqlash", cancel: "Bekor", noNotes: "Hali nota yo'q.",
    noBookings: "Hali bron yo'q.",
    bronze: "Bronza", silver: "Kumush", gold: "Oltin", platinum: "Platinum",
    ownerLabel: "Restoran egasi", searchPlaceholder: "Mijozni qidirish...",
    occasion: "Sabab", notes: "Maxsus so'rovlar",
  },
  ru: {
    title: "CRM клиентов",
    subtitle: "Все клиенты, бронировавшие ваш ресторан — история, заметки, лояльность.",
    dashboard: "Дэшборд", bookings: "Брони", floorMap: "План зала",
    menu: "Меню", analytics: "Аналитика", crm: "CRM", settings: "Настройки", logout: "Выйти",
    loading: "Загрузка клиентов...", noCustomers: "Клиентов пока нет.",
    noCustomersText: "Когда клиенты забронируют ваш ресторан, они появятся здесь.",
    visits: "визитов", points: "очков", lastVisit: "Последний визит",
    bookingHistory: "История броней", addNote: "Добавить заметку",
    notePlaceholder: "Напр.: Аллергия на орехи, всегда сидит у окна, VIP...",
    saveNote: "Сохранить", cancel: "Отмена", noNotes: "Заметок пока нет.",
    noBookings: "Броней пока нет.",
    bronze: "Бронза", silver: "Серебро", gold: "Золото", platinum: "Платинум",
    ownerLabel: "Владелец ресторана", searchPlaceholder: "Поиск клиента...",
    occasion: "Повод", notes: "Особые пожелания",
  },
};

function tierColor(tier: string) {
  if (tier === "platinum") return "text-purple-600 bg-purple-50";
  if (tier === "gold") return "text-yellow-600 bg-yellow-50";
  if (tier === "silver") return "text-gray-600 bg-gray-100";
  return "text-orange-600 bg-orange-50";
}

function tierLabel(tier: string, text: typeof t.en) {
  if (tier === "platinum") return text.platinum;
  if (tier === "gold") return text.gold;
  if (tier === "silver") return text.silver;
  return text.bronze;
}

function statusStyle(status: string) {
  if (status === "confirmed" || status === "approved") return "bg-green-100 text-green-700";
  if (status === "cancelled") return "bg-red-100 text-red-700";
  if (status === "completed") return "bg-blue-100 text-blue-700";
  return "bg-orange-100 text-orange-700";
}

export default function PartnerCRMPage() {
  const { language } = useLanguage();
  const text = t[language];
  const router = useRouter();

  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<Record<string, string>>({});
  const [addingNote, setAddingNote] = useState<string | null>(null);
  const [savingNote, setSavingNote] = useState(false);

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
      setRestaurantId(restaurant.id);
      setRestaurantName(restaurant.name);

      // Get all bookings for this restaurant with user profiles
      const { data: bookingData } = await supabase
        .from("bookings")
        .select("id, user_id, booking_date, booking_time, guests_count, status, occasion, special_notes")
        .eq("restaurant_id", restaurant.id)
        .order("booking_date", { ascending: false });

      if (!bookingData || bookingData.length === 0) {
        setCustomers([]);
        setIsLoading(false);
        return;
      }

      // Get unique user IDs
      const userIds = [...new Set(bookingData.map((b) => b.user_id).filter(Boolean))];

      // Get profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, total_points, loyalty_tier")
        .in("id", userIds);

      // Get loyalty points
      const { data: loyaltyData } = await supabase
        .from("loyalty_points")
        .select("user_id, points, total_visits, last_visit")
        .eq("restaurant_id", restaurant.id)
        .in("user_id", userIds);

      // Get guest notes
      const { data: notesData } = await supabase
        .from("guest_notes")
        .select("id, user_id, note, created_at")
        .eq("restaurant_id", restaurant.id)
        .order("created_at", { ascending: false });

      // Build customer map
      const customerMap: Record<string, Customer> = {};

      for (const uid of userIds) {
        const profile = profiles?.find((p) => p.id === uid);
        const loyalty = loyaltyData?.find((l) => l.user_id === uid);
        const userNotes = (notesData ?? [])
          .filter((n) => n.user_id === uid)
          .map((n) => ({ id: n.id, note: n.note, created_at: n.created_at }));

        customerMap[uid] = {
          user_id: uid,
          full_name: profile?.full_name ?? null,
          total_visits: loyalty?.total_visits ?? 0,
          total_points: profile?.total_points ?? loyalty?.points ?? 0,
          loyalty_tier: profile?.loyalty_tier ?? "bronze",
          last_visit: loyalty?.last_visit ?? null,
          bookings: [],
          notes: userNotes,
        };
      }

      for (const b of bookingData) {
        if (b.user_id && customerMap[b.user_id]) {
          customerMap[b.user_id].bookings.push({
            id: b.id,
            booking_date: b.booking_date,
            booking_time: b.booking_time,
            guests_count: b.guests_count,
            status: b.status,
            occasion: b.occasion,
            special_notes: b.special_notes,
          });
        }
      }

      setCustomers(Object.values(customerMap).sort((a, b) => b.total_visits - a.total_visits));
      setIsLoading(false);
    }
    load();
  }, [router]);

  async function handleSaveNote(userId: string) {
    if (!restaurantId || !noteInput[userId]?.trim()) return;
    setSavingNote(true);
    await supabase.from("guest_notes").insert({
      restaurant_id: restaurantId,
      user_id: userId,
      note: noteInput[userId].trim(),
    });
    setNoteInput((prev) => ({ ...prev, [userId]: "" }));
    setAddingNote(null);
    setSavingNote(false);
    // refresh notes
    const { data: fresh } = await supabase
      .from("guest_notes")
      .select("id, user_id, note, created_at")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false });
    setCustomers((prev) =>
      prev.map((c) => ({
        ...c,
        notes: (fresh ?? []).filter((n) => n.user_id === c.user_id).map((n) => ({ id: n.id, note: n.note, created_at: n.created_at })),
      }))
    );
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const navItems = [
    { label: text.dashboard, icon: ChartLine, href: "/partner" },
    { label: text.bookings, icon: CalendarDays, href: "/partner/bookings" },
    { label: text.floorMap, icon: Map, href: "/partner/floor-plan" },
    { label: text.menu, icon: ClipboardList, href: "/partner/menu" },
    { label: text.analytics, icon: ChartLine, href: "/partner/analytics" },
    { label: text.crm, icon: Users, href: "/partner/crm", active: true },
    { label: text.settings, icon: Settings, href: "/partner/settings" },
  ];

  const filtered = customers.filter((c) =>
    !search || c.full_name?.toLowerCase().includes(search.toLowerCase())
  );

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
            <Link key={item.href} href={item.href}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition ${
                (item as { active?: boolean }).active
                  ? "bg-orange-500 text-white"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}>
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
          <button onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-400 hover:bg-white/10 hover:text-white">
            <LogOut size={16} />{text.logout}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <h1 className="text-2xl font-black text-gray-950">{text.title}</h1>
            <p className="text-sm text-gray-500">{text.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-black text-orange-600">
              {restaurantName.charAt(0) || "P"}
            </div>
          </div>
        </header>

        <section className="flex-1 p-6 lg:p-8">
          {isLoading ? (
            <div className="flex items-center gap-3 text-gray-500">
              <Loader2 className="animate-spin text-orange-500" />{text.loading}
            </div>
          ) : customers.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
              <Users className="mx-auto text-orange-300" size={52} />
              <h2 className="mt-4 text-2xl font-black text-gray-950">{text.noCustomers}</h2>
              <p className="mx-auto mt-2 max-w-md text-gray-500">{text.noCustomersText}</p>
            </div>
          ) : (
            <>
              {/* Search */}
              <div className="mb-6">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={text.searchPlaceholder}
                  className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500"
                />
              </div>

              {/* Stats row */}
              <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "Total customers", value: customers.length, icon: Users },
                  { label: "Returning (2+ visits)", value: customers.filter((c) => c.total_visits >= 2).length, icon: Star },
                  { label: "Gold & above", value: customers.filter((c) => c.loyalty_tier === "gold" || c.loyalty_tier === "platinum").length, icon: Gift },
                  { label: "Total visits", value: customers.reduce((s, c) => s + c.total_visits, 0), icon: CalendarDays },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <stat.icon size={18} className="text-orange-500" />
                    <p className="mt-3 text-2xl font-black text-gray-950">{stat.value}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Customer list */}
              <div className="space-y-4">
                {filtered.map((customer) => {
                  const isExpanded = expandedId === customer.user_id;
                  const isAddingNoteHere = addingNote === customer.user_id;

                  return (
                    <div key={customer.user_id} className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                      {/* Customer header */}
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : customer.user_id)}
                        className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-lg font-black text-orange-600">
                            {customer.full_name?.charAt(0) ?? "?"}
                          </div>
                          <div>
                            <p className="font-black text-gray-950">{customer.full_name ?? "Unknown"}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                              <span>{customer.total_visits} {text.visits}</span>
                              <span>·</span>
                              <span className={`rounded-full px-2 py-0.5 font-bold ${tierColor(customer.loyalty_tier)}`}>
                                {tierLabel(customer.loyalty_tier, text)}
                              </span>
                              <span>·</span>
                              <span>{customer.total_points} {text.points}</span>
                              {customer.last_visit && (
                                <>
                                  <span>·</span>
                                  <span>{text.lastVisit}: {new Date(customer.last_visit).toLocaleDateString()}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {customer.notes.length > 0 && (
                            <span className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 text-xs font-bold text-orange-600">
                              <MessageSquare size={12} />
                              {customer.notes.length}
                            </span>
                          )}
                          <ArrowLeft size={16} className={`text-gray-400 transition ${isExpanded ? "-rotate-90" : "rotate-180"}`} />
                        </div>
                      </button>

                      {/* Expanded section */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 px-6 pb-6 pt-4">
                          <div className="grid gap-6 lg:grid-cols-2">
                            {/* Booking history */}
                            <div>
                              <h3 className="mb-3 text-sm font-black text-gray-700">{text.bookingHistory}</h3>
                              {customer.bookings.length === 0 ? (
                                <p className="text-xs text-gray-400">{text.noBookings}</p>
                              ) : (
                                <div className="space-y-2">
                                  {customer.bookings.slice(0, 5).map((b) => (
                                    <div key={b.id} className="rounded-xl bg-gray-50 px-4 py-3">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-sm font-bold text-gray-800">
                                            {b.booking_date} · {b.booking_time}
                                          </p>
                                          <p className="text-xs text-gray-500">{b.guests_count} guests</p>
                                          {b.occasion && b.occasion !== "none" && (
                                            <p className="text-xs text-orange-600 mt-0.5">{text.occasion}: {b.occasion}</p>
                                          )}
                                          {b.special_notes && (
                                            <p className="text-xs text-gray-500 mt-0.5 italic">{text.notes}: {b.special_notes}</p>
                                          )}
                                        </div>
                                        <span className={`rounded-full px-2 py-1 text-xs font-black ${statusStyle(b.status)}`}>
                                          {b.status}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Notes */}
                            <div>
                              <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-sm font-black text-gray-700">Partner Notes</h3>
                                <button
                                  type="button"
                                  onClick={() => setAddingNote(isAddingNoteHere ? null : customer.user_id)}
                                  className="flex items-center gap-1 rounded-xl bg-orange-500 px-3 py-1.5 text-xs font-black text-white hover:bg-orange-600"
                                >
                                  <Plus size={12} />
                                  {text.addNote}
                                </button>
                              </div>

                              {isAddingNoteHere && (
                                <div className="mb-3">
                                  <textarea
                                    value={noteInput[customer.user_id] ?? ""}
                                    onChange={(e) => setNoteInput((prev) => ({ ...prev, [customer.user_id]: e.target.value }))}
                                    placeholder={text.notePlaceholder}
                                    rows={3}
                                    className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-500"
                                  />
                                  <div className="mt-2 flex gap-2">
                                    <button
                                      type="button"
                                      disabled={savingNote}
                                      onClick={() => handleSaveNote(customer.user_id)}
                                      className="flex items-center gap-1 rounded-xl bg-orange-500 px-4 py-2 text-xs font-black text-white hover:bg-orange-600 disabled:opacity-60"
                                    >
                                      {savingNote && <Loader2 size={12} className="animate-spin" />}
                                      {text.saveNote}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setAddingNote(null)}
                                      className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"
                                    >
                                      {text.cancel}
                                    </button>
                                  </div>
                                </div>
                              )}

                              {customer.notes.length === 0 ? (
                                <p className="text-xs text-gray-400">{text.noNotes}</p>
                              ) : (
                                <div className="space-y-2">
                                  {customer.notes.map((note) => (
                                    <div key={note.id} className="rounded-xl bg-orange-50 px-4 py-3">
                                      <p className="text-sm text-gray-700">{note.note}</p>
                                      <p className="mt-1 text-xs text-gray-400">
                                        {new Date(note.created_at).toLocaleDateString()}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}