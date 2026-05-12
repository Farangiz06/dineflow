"use client";

import { useState } from "react";
import {
  Armchair,
  CalendarDays,
  CheckCircle,
  Clock,
  Loader2,
  Minus,
  Plus,
  Users,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/components/LanguageProvider";

type RestaurantTable = {
  id: string;
  table_name: string;
  seats: number;
  zone: string | null;
  status: string;
  shape: string | null;
  position_x: number | null;
  position_y: number | null;
  width: number | null;
  height: number | null;
  rotation: number | null;
  color: string | null;
};

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
};

type BookingSectionProps = {
  restaurantId: string;
  tables: RestaurantTable[];
  menuItems: MenuItem[];
};

const bookingText = {
  en: {
    floorMap: "Choose Your Table",
    floorMapSubtitle:
      "Select an available table from the live restaurant floor map.",
    zone1: "Zone 1",
    zone2: "Zone 2",
    zone3: "Zone 3",
    dineIn: "Dine-in",
    pickup: "Pick-up",
    available: "Available",
    booked: "Booked",
    reserved: "Reserved",
    blocked: "Blocked",
    selected: "Selected",
    seats: "seats",
    table: "Table",
    selectedTable: "Selected table",
    noTableSelected: "No table selected",
    menu: "Menu",
    menuSubtitle: "Pre-order your meals before arrival.",
    noMenu: "No menu items yet.",
    bookingForm: "Booking Details",
    bookingFormText: "Fill in your reservation details.",
    name: "Your Name",
    namePlaceholder: "John Smith",
    phone: "Phone Number",
    phonePlaceholder: "+998 90 123 45 67",
    date: "Date",
    time: "Time",
    guests: "Guests",
    preorder: "Pre-order summary",
    noMeals: "No meals selected yet.",
    total: "Total",
    confirm: "Confirm Booking",
    saving: "Saving...",
    chooseTableError: "Please select an available table first.",
    fillError: "Please fill in all booking details.",
    loginError: "Please login again before booking.",
    success: "Booking created successfully! Restaurant will confirm it soon.",
    bookingError: "Booking error:",
    preorderError: "Pre-order error:",
  },
  uz: {
    floorMap: "Stolingizni tanlang",
    floorMapSubtitle:
      "Restoranning jonli floor map’idan bo‘sh stolni tanlang.",
    zone1: "Zona 1",
    zone2: "Zona 2",
    zone3: "Zona 3",
    dineIn: "Zalda",
    pickup: "Olib ketish",
    available: "Bo‘sh",
    booked: "Band",
    reserved: "Rezerv",
    blocked: "Bloklangan",
    selected: "Tanlangan",
    seats: "o‘rin",
    table: "Stol",
    selectedTable: "Tanlangan stol",
    noTableSelected: "Stol tanlanmagan",
    menu: "Menyu",
    menuSubtitle: "Kelishdan oldin ovqatlarni oldindan buyurtma qiling.",
    noMenu: "Hali menyu itemlari yo‘q.",
    bookingForm: "Bron ma’lumotlari",
    bookingFormText: "Bron qilish uchun ma’lumotlarni to‘ldiring.",
    name: "Ismingiz",
    namePlaceholder: "Ali Valiyev",
    phone: "Telefon raqam",
    phonePlaceholder: "+998 90 123 45 67",
    date: "Sana",
    time: "Vaqt",
    guests: "Mehmonlar",
    preorder: "Oldindan buyurtma xulosasi",
    noMeals: "Hali ovqat tanlanmagan.",
    total: "Jami",
    confirm: "Bronni tasdiqlash",
    saving: "Saqlanmoqda...",
    chooseTableError: "Avval bo‘sh stol tanlang.",
    fillError: "Barcha bron ma’lumotlarini to‘ldiring.",
    loginError: "Bron qilishdan oldin qayta login qiling.",
    success: "Bron muvaffaqiyatli yaratildi! Restoran tez orada tasdiqlaydi.",
    bookingError: "Bron xatosi:",
    preorderError: "Oldindan buyurtma xatosi:",
  },
  ru: {
    floorMap: "Выберите стол",
    floorMapSubtitle: "Выберите свободный стол на живой карте ресторана.",
    zone1: "Зона 1",
    zone2: "Зона 2",
    zone3: "Зона 3",
    dineIn: "В зале",
    pickup: "Самовывоз",
    available: "Свободен",
    booked: "Занят",
    reserved: "Резерв",
    blocked: "Заблокирован",
    selected: "Выбран",
    seats: "мест",
    table: "Стол",
    selectedTable: "Выбранный стол",
    noTableSelected: "Стол не выбран",
    menu: "Меню",
    menuSubtitle: "Закажите блюда заранее до прихода.",
    noMenu: "Пункты меню ещё не добавлены.",
    bookingForm: "Детали бронирования",
    bookingFormText: "Заполните данные для бронирования.",
    name: "Ваше имя",
    namePlaceholder: "Иван Иванов",
    phone: "Номер телефона",
    phonePlaceholder: "+998 90 123 45 67",
    date: "Дата",
    time: "Время",
    guests: "Гости",
    preorder: "Предзаказ",
    noMeals: "Блюда ещё не выбраны.",
    total: "Итого",
    confirm: "Подтвердить бронирование",
    saving: "Сохранение...",
    chooseTableError: "Сначала выберите свободный стол.",
    fillError: "Заполните все данные бронирования.",
    loginError: "Пожалуйста, войдите снова перед бронированием.",
    success: "Бронирование создано! Ресторан скоро подтвердит его.",
    bookingError: "Ошибка бронирования:",
    preorderError: "Ошибка предзаказа:",
  },
};

export default function BookingSection({
  restaurantId,
  tables,
  menuItems,
}: BookingSectionProps) {
  const { language } = useLanguage();
  const text = bookingText[language];

  const [selectedTableId, setSelectedTableId] = useState("");
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [guestsCount, setGuestsCount] = useState("2");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const selectedTable = tables.find((table) => table.id === selectedTableId);

  const selectedMenuItems = menuItems
    .filter((item) => selectedItems[item.id])
    .map((item) => ({
      ...item,
      quantity: selectedItems[item.id],
    }));

  const totalAmount = selectedMenuItems.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0);

  function getStatusColor(table: RestaurantTable) {
    if (selectedTableId === table.id) {
      return "#f97316";
    }

    if (table.status === "available") {
      return table.color || "#38bdf8";
    }

    if (table.status === "reserved") {
      return "#a855f7";
    }

    if (table.status === "blocked") {
      return "#94a3b8";
    }

    return "#9ca3af";
  }

  function getTableShape(table: RestaurantTable) {
    if (table.shape === "circle") {
      return "rounded-full";
    }

    if (table.shape === "diamond") {
      return "rounded-2xl rotate-45";
    }

    if (table.shape === "rectangle") {
      return "rounded-2xl";
    }

    return "rounded-2xl";
  }

  function getTableInnerShape(table: RestaurantTable) {
    if (table.shape === "diamond") {
      return "-rotate-45";
    }

    return "";
  }

  function addMenuItem(itemId: string) {
    setSelectedItems((current) => ({
      ...current,
      [itemId]: (current[itemId] || 0) + 1,
    }));
  }

  function removeMenuItem(itemId: string) {
    setSelectedItems((current) => {
      const currentQuantity = current[itemId] || 0;

      if (currentQuantity <= 1) {
        const updated = { ...current };
        delete updated[itemId];
        return updated;
      }

      return {
        ...current,
        [itemId]: currentQuantity - 1,
      };
    });
  }

  async function handleBookingSubmit() {
    setMessage("");

    if (!selectedTableId || selectedTable?.status !== "available") {
      setMessage(text.chooseTableError);
      return;
    }

    if (!customerName || !customerPhone || !bookingDate || !bookingTime) {
      setMessage(text.fillError);
      return;
    }

    setIsSaving(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      setMessage(text.loginError);
      setIsSaving(false);
      return;
    }

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        restaurant_id: restaurantId,
        table_id: selectedTableId,
        customer_id: userData.user.id,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: userData.user.email,
        booking_date: bookingDate,
        booking_time: bookingTime,
        guests_count: Number(guestsCount),
        status: "pending",
        notes: selectedMenuItems.length
          ? `Pre-order total: ${totalAmount.toLocaleString()} UZS`
          : null,
      })
      .select("id")
      .single();

    if (bookingError || !booking) {
      setMessage(`${text.bookingError} ${bookingError?.message || ""}`);
      setIsSaving(false);
      return;
    }

    if (selectedMenuItems.length > 0) {
      const bookingItemsPayload = selectedMenuItems.map((item) => ({
        booking_id: booking.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        price: Number(item.price),
      }));

      const { error: itemsError } = await supabase
        .from("booking_items")
        .insert(bookingItemsPayload);

      if (itemsError) {
        setMessage(`${text.preorderError} ${itemsError.message}`);
        setIsSaving(false);
        return;
      }
    }

    setMessage(text.success);
    setCustomerName("");
    setCustomerPhone("");
    setBookingDate("");
    setBookingTime("");
    setGuestsCount("2");
    setSelectedTableId("");
    setSelectedItems({});
    setIsSaving(false);
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.75fr]">
      <section className="space-y-8">
        <div className="overflow-hidden rounded-[2rem] border border-sky-100 bg-white shadow-sm">
          <div className="border-b border-sky-100 bg-white p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-950">
                  {text.floorMap}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {text.floorMapSubtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button className="rounded-2xl bg-sky-500 px-5 py-3 font-black text-white">
                  {text.zone1}
                </button>
                <button className="rounded-2xl bg-gray-100 px-5 py-3 font-black text-gray-600">
                  {text.zone2}
                </button>
                <button className="rounded-2xl bg-gray-100 px-5 py-3 font-black text-gray-600">
                  {text.zone3}
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_280px]">
            <div className="relative h-[650px] overflow-hidden bg-[#f8fbff]">
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  backgroundImage:
                    "linear-gradient(#e5edf7 1px, transparent 1px), linear-gradient(90deg, #e5edf7 1px, transparent 1px)",
                  backgroundSize: "36px 36px",
                }}
              />

              <div className="absolute left-10 top-20 h-[430px] w-[90%] rounded-[2rem] border-[10px] border-gray-200 opacity-70" />

              <div className="absolute left-[18%] top-[12%] h-8 w-[58%] bg-gray-200 opacity-60" />
              <div className="absolute left-[22%] top-[54%] h-8 w-[20%] rotate-[-42deg] bg-gray-200 opacity-60" />
              <div className="absolute left-[58%] top-[26%] h-8 w-[22%] rotate-[-45deg] bg-gray-200 opacity-60" />

              <div className="relative h-full w-full">
                {tables.map((table, index) => {
                  const isClickable = table.status === "available";
                  const x = table.position_x ?? 60 + (index % 4) * 160;
                  const y = table.position_y ?? 80 + Math.floor(index / 4) * 150;
                  const width = table.width ?? 92;
                  const height = table.height ?? 92;

                  return (
                    <button
                      key={table.id}
                      type="button"
                      disabled={!isClickable}
                      onClick={() => setSelectedTableId(table.id)}
                      style={{
                        left: x,
                        top: y,
                        width,
                        height,
                        backgroundColor: getStatusColor(table),
                        transform: `rotate(${table.rotation || 0}deg)`,
                      }}
                      className={`absolute flex flex-col items-center justify-center border-[6px] border-white text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 ${getTableShape(
                        table
                      )}`}
                    >
                      <span
                        className={`flex flex-col items-center justify-center ${getTableInnerShape(
                          table
                        )}`}
                      >
                        <span className="rounded-full bg-white/25 px-2 py-0.5 text-xs font-black">
                          {table.seats}
                        </span>
                        <span className="mt-1 text-xl font-black">
                          {table.table_name}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <aside className="border-l border-sky-100 bg-white p-5">
              <h3 className="text-xl font-black text-gray-950">
                Floor Plan Actions
              </h3>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-center">
                  <p className="font-black text-sky-600">{text.dineIn}</p>
                </div>

                <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-center">
                  <p className="font-black text-sky-600">{text.pickup}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl bg-sky-50 p-3">
                  <span className="font-bold text-gray-700">
                    {text.available}
                  </span>
                  <span className="h-4 w-4 rounded bg-sky-500" />
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-purple-50 p-3">
                  <span className="font-bold text-gray-700">
                    {text.reserved}
                  </span>
                  <span className="h-4 w-4 rounded bg-purple-500" />
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-3">
                  <span className="font-bold text-gray-700">{text.booked}</span>
                  <span className="h-4 w-4 rounded bg-gray-400" />
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-orange-50 p-3">
                  <span className="font-bold text-gray-700">
                    {text.selected}
                  </span>
                  <span className="h-4 w-4 rounded bg-orange-500" />
                </div>
              </div>

              <div className="mt-6 rounded-3xl bg-gray-950 p-5 text-white">
                <p className="text-sm text-gray-400">{text.selectedTable}</p>

                <h4 className="mt-2 text-2xl font-black">
                  {selectedTable
                    ? `${selectedTable.table_name} • ${selectedTable.seats} ${text.seats}`
                    : text.noTableSelected}
                </h4>
              </div>
            </aside>
          </div>
        </div>

        <div className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-gray-950">{text.menu}</h2>
            <p className="mt-1 text-gray-500">{text.menuSubtitle}</p>
          </div>

          {menuItems.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
                >
                  <div
                    className="h-40 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${
                        item.image_url ||
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop"
                      })`,
                    }}
                  />

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-black text-gray-950">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.category || "Dish"}
                        </p>
                      </div>

                      <p className="font-black text-orange-600">
                        {Number(item.price).toLocaleString()} UZS
                      </p>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {item.description || "Dish"}
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => removeMenuItem(item.id)}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-200 font-black text-orange-600 hover:bg-orange-50"
                      >
                        <Minus size={18} />
                      </button>

                      <div className="flex-1 rounded-xl bg-orange-50 px-4 py-3 text-center font-black text-orange-700">
                        {selectedItems[item.id] || 0}
                      </div>

                      <button
                        type="button"
                        onClick={() => addMenuItem(item.id)}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 font-black text-white hover:bg-orange-600"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-orange-50 p-5 text-gray-600">
              {text.noMenu}
            </p>
          )}
        </div>
      </section>

      <aside className="h-fit rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm lg:sticky lg:top-8">
        <h2 className="text-2xl font-black text-gray-950">
          {text.bookingForm}
        </h2>

        <p className="mt-2 text-sm text-gray-500">{text.bookingFormText}</p>

        <div className="mt-5 rounded-2xl bg-orange-50 p-4">
          <p className="text-sm font-bold text-gray-700">
            {text.selectedTable}
          </p>

          <p className="mt-1 text-lg font-black text-orange-600">
            {selectedTable
              ? `${selectedTable.table_name} • ${selectedTable.seats} ${text.seats}`
              : text.noTableSelected}
          </p>
        </div>

        <form className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              {text.name}
            </label>

            <input
              type="text"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder={text.namePlaceholder}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              {text.phone}
            </label>

            <input
              type="tel"
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
              placeholder={text.phonePlaceholder}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                {text.date}
              </label>

              <div className="relative">
                <CalendarDays className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(event) => setBookingDate(event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 pl-11 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                {text.time}
              </label>

              <div className="relative">
                <Clock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(event) => setBookingTime(event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 pl-11 outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              {text.guests}
            </label>

            <input
              type="number"
              min="1"
              value={guestsCount}
              onChange={(event) => setGuestsCount(event.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
            <p className="font-black text-gray-950">{text.preorder}</p>

            {selectedMenuItems.length > 0 ? (
              <div className="mt-3 space-y-2">
                {selectedMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm text-gray-700"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>
                      {(Number(item.price) * item.quantity).toLocaleString()}{" "}
                      UZS
                    </span>
                  </div>
                ))}

                <div className="border-t border-orange-200 pt-3 font-black text-orange-700">
                  {text.total}: {totalAmount.toLocaleString()} UZS
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">{text.noMeals}</p>
            )}
          </div>

          {message && (
            <div
              className={`rounded-2xl p-4 text-sm font-bold ${
                message === text.success
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message === text.success && (
                <CheckCircle className="mb-2" size={20} />
              )}
              {message}
            </div>
          )}

          <button
            type="button"
            disabled={isSaving}
            onClick={handleBookingSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-black text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving && <Loader2 className="animate-spin" size={18} />}
            {isSaving ? text.saving : text.confirm}
          </button>
        </form>
      </aside>
    </div>
  );
}