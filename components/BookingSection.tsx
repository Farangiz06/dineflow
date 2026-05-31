"use client";

import { useState } from "react";
import {
  Armchair,
  CalendarDays,
  CheckCircle,
  Clock,
  CreditCard,
  Loader2,
  MessageSquare,
  Minus,
  Plus,
  Sparkles,
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
    floorMapSubtitle: "Select an available table from the restaurant floor map.",
    available: "Available", booked: "Booked", reserved: "Reserved",
    blocked: "Blocked", selected: "Selected", seats: "seats", table: "Table",
    selectedTable: "Selected table", noTableSelected: "No table selected",
    menu: "Pre-order Menu", menuSubtitle: "Pre-order your meals before arrival.",
    noMenu: "No menu items yet.",
    bookingForm: "Booking Details", bookingFormText: "Fill in your reservation details.",
    name: "Your Name", namePlaceholder: "John Smith",
    phone: "Phone Number", phonePlaceholder: "+998 90 123 45 67",
    arrivalDate: "Date", arrivalTime: "Arrival Time", departureTime: "Departure Time",
    guests: "Number of Guests",
    occasionLabel: "Occasion",
    occasions: { none: "Regular visit", birthday: "🎂 Birthday", anniversary: "💍 Anniversary", business: "💼 Business dinner", graduation: "🎓 Graduation", proposal: "💝 Proposal", other: "Other" },
    seatingLabel: "Seating Preference",
    seatings: { any: "No preference", indoor: "Indoor", outdoor: "Outdoor / Terrace", quiet: "Quiet corner", window: "Window seat" },
    notesLabel: "Special Requests & Allergies",
    notesPlaceholder: "Allergies, dietary requirements, high chair needed, birthday cake...",
    prepaymentLabel: "Prepayment",
    prepaymentNone: "No prepayment",
    prepaymentHalf: "50% deposit (15% penalty if no-show)",
    prepaymentFull: "100% full payment (delivery if no-show)",
    deliveryAddressLabel: "Delivery address (for no-show fallback)",
    deliveryAddressPlaceholder: "Your address in case of no-show...",
    preorder: "Pre-order summary", noMeals: "No meals selected yet.",
    total: "Total", confirm: "Confirm Booking", saving: "Saving...",
    chooseTableError: "Please select an available table first.",
    fillError: "Please fill in name, phone, date and arrival time.",
    loginError: "Please login again before booking.",
    success: "Booking created successfully! Restaurant will confirm soon.",
    bookingError: "Booking error:",
  },
  uz: {
    floorMap: "Stolingizni tanlang",
    floorMapSubtitle: "Restoran floor map'idan bo'sh stol tanlang.",
    available: "Bo'sh", booked: "Band", reserved: "Rezerv",
    blocked: "Bloklangan", selected: "Tanlangan", seats: "o'rin", table: "Stol",
    selectedTable: "Tanlangan stol", noTableSelected: "Stol tanlanmagan",
    menu: "Oldindan buyurtma", menuSubtitle: "Kelishdan oldin ovqatlarni buyurtma qiling.",
    noMenu: "Hali menyu itemlari yo'q.",
    bookingForm: "Bron ma'lumotlari", bookingFormText: "Bron qilish uchun to'ldiring.",
    name: "Ismingiz", namePlaceholder: "Ali Valiyev",
    phone: "Telefon raqam", phonePlaceholder: "+998 90 123 45 67",
    arrivalDate: "Sana", arrivalTime: "Kelish vaqti", departureTime: "Ketish vaqti",
    guests: "Mehmonlar soni",
    occasionLabel: "Tashrif sababi",
    occasions: { none: "Oddiy tashrif", birthday: "🎂 Tug'ilgan kun", anniversary: "💍 Yillik yubiley", business: "💼 Biznes kechlik", graduation: "🎓 Bitirish", proposal: "💝 Sovchilik", other: "Boshqa" },
    seatingLabel: "O'tirish joyi",
    seatings: { any: "Farqi yo'q", indoor: "Ichkarida", outdoor: "Tashqarida / Terassa", quiet: "Tinch burchak", window: "Deraza yonida" },
    notesLabel: "Maxsus so'rovlar va allergiya",
    notesPlaceholder: "Allergiya, vegetarian, bolalar o'rindig'i, tort...",
    prepaymentLabel: "Oldindan to'lov",
    prepaymentNone: "To'lovsiz bron",
    prepaymentHalf: "50% depozit (kelmasa 15% jarima)",
    prepaymentFull: "100% to'liq (kelmasa dastavka)",
    deliveryAddressLabel: "Dastavka manzili (kelmagan taqdirda)",
    deliveryAddressPlaceholder: "Kelmagan taqdirda dastavka manzili...",
    preorder: "Oldindan buyurtma", noMeals: "Hali ovqat tanlanmagan.",
    total: "Jami", confirm: "Bronni tasdiqlash", saving: "Saqlanmoqda...",
    chooseTableError: "Avval bo'sh stol tanlang.",
    fillError: "Ism, telefon, sana va kelish vaqtini to'ldiring.",
    loginError: "Iltimos qayta login qiling.",
    success: "Bron muvaffaqiyatli yaratildi! Restoran tez orada tasdiqlaydi.",
    bookingError: "Bron xatosi:",
  },
  ru: {
    floorMap: "Выберите стол",
    floorMapSubtitle: "Выберите свободный стол на карте зала.",
    available: "Свободен", booked: "Занят", reserved: "Резерв",
    blocked: "Блок", selected: "Выбран", seats: "мест", table: "Стол",
    selectedTable: "Выбранный стол", noTableSelected: "Стол не выбран",
    menu: "Предзаказ", menuSubtitle: "Закажите блюда до прихода.",
    noMenu: "Меню пока не добавлено.",
    bookingForm: "Детали брони", bookingFormText: "Заполните данные бронирования.",
    name: "Ваше имя", namePlaceholder: "Иван Иванов",
    phone: "Телефон", phonePlaceholder: "+998 90 123 45 67",
    arrivalDate: "Дата", arrivalTime: "Время прихода", departureTime: "Время ухода",
    guests: "Количество гостей",
    occasionLabel: "Повод",
    occasions: { none: "Обычный визит", birthday: "🎂 День рождения", anniversary: "💍 Годовщина", business: "💼 Бизнес-ужин", graduation: "🎓 Выпускной", proposal: "💝 Предложение", other: "Другое" },
    seatingLabel: "Предпочтение по месту",
    seatings: { any: "Без предпочтений", indoor: "Внутри", outdoor: "Улица / Терраса", quiet: "Тихий уголок", window: "У окна" },
    notesLabel: "Особые пожелания и аллергии",
    notesPlaceholder: "Аллергии, вегетарианское меню, детский стул, торт...",
    prepaymentLabel: "Предоплата",
    prepaymentNone: "Без предоплаты",
    prepaymentHalf: "50% депозит (штраф 15% при неявке)",
    prepaymentFull: "100% полная оплата (доставка при неявке)",
    deliveryAddressLabel: "Адрес доставки (при неявке)",
    deliveryAddressPlaceholder: "Ваш адрес на случай неявки...",
    preorder: "Предзаказ", noMeals: "Блюда не выбраны.",
    total: "Итого", confirm: "Подтвердить бронь", saving: "Сохранение...",
    chooseTableError: "Сначала выберите свободный стол.",
    fillError: "Заполните имя, телефон, дату и время прихода.",
    loginError: "Пожалуйста, войдите снова.",
    success: "Бронь успешно создана! Ресторан скоро подтвердит.",
    bookingError: "Ошибка бронирования:",
  },
};

function tableColor(status: string, isSelected: boolean) {
  if (isSelected) return "bg-orange-500 text-white border-orange-600";
  if (status === "available") return "bg-green-50 border-green-300 text-green-800 hover:bg-green-100 cursor-pointer";
  if (status === "booked") return "bg-red-50 border-red-200 text-red-400 cursor-not-allowed";
  if (status === "reserved") return "bg-yellow-50 border-yellow-300 text-yellow-600 cursor-not-allowed";
  return "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed";
}

export default function BookingSection({ restaurantId, tables, menuItems }: BookingSectionProps) {
  const { language } = useLanguage();
  const text = bookingText[language];

  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [guestsCount, setGuestsCount] = useState("2");
  const [occasion, setOccasion] = useState("none");
  const [seatingPreference, setSeatingPreference] = useState("any");
  const [specialNotes, setSpecialNotes] = useState("");
  const [prepaymentType, setPrepaymentType] = useState("none");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  function addMenuItem(id: string) {
    setSelectedItems((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }

  function removeMenuItem(id: string) {
    setSelectedItems((prev) => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });
  }

  const selectedMenuItems = menuItems
    .filter((item) => selectedItems[item.id])
    .map((item) => ({ ...item, quantity: selectedItems[item.id] }));

  const totalAmount = selectedMenuItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity, 0
  );

  async function handleBookingSubmit() {
    if (!selectedTable) { setMessage(text.chooseTableError); return; }
    if (!customerName || !customerPhone || !bookingDate || !arrivalTime) {
      setMessage(text.fillError); return;
    }

    setIsSaving(true);
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { setMessage(text.loginError); setIsSaving(false); return; }

    // Calculate cancel deadline (2 hours before arrival)
    const cancelDeadline = new Date(`${bookingDate}T${arrivalTime}`);
    cancelDeadline.setHours(cancelDeadline.getHours() - 2);

    const prepaymentAmount = prepaymentType === "full"
      ? totalAmount
      : prepaymentType === "half"
      ? Math.round(totalAmount * 0.5)
      : 0;

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: userData.user.id,
        restaurant_id: restaurantId,
        table_id: selectedTable.id,
        booking_date: bookingDate,
        booking_time: arrivalTime,
        arrival_time: arrivalTime,
        departure_time: departureTime || null,
        guests_count: parseInt(guestsCount),
        status: "pending",
        customer_name: customerName,
        customer_phone: customerPhone,
        occasion,
        seating_preference: seatingPreference,
        special_notes: specialNotes || null,
        prepayment_type: prepaymentType,
        prepayment_amount: prepaymentAmount,
        prepayment_status: prepaymentType === "none" ? "not_required" : "pending",
        cancel_deadline: cancelDeadline.toISOString(),
        delivery_address: prepaymentType === "full" ? deliveryAddress || null : null,
      })
      .select()
      .single();

    if (bookingError || !booking) {
      setMessage(`${text.bookingError} ${bookingError?.message}`);
      setIsSaving(false);
      return;
    }

    // Save pre-order items
    if (selectedMenuItems.length > 0) {
      await supabase.from("booking_items").insert(
        selectedMenuItems.map((item) => ({
          booking_id: booking.id,
          menu_item_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
        }))
      );
    }

    // Award loyalty points (10 per booking)
    const { data: existingPoints } = await supabase
      .from("loyalty_points")
      .select("id, points, total_visits")
      .eq("user_id", userData.user.id)
      .eq("restaurant_id", restaurantId)
      .single();

    if (existingPoints) {
      await supabase
        .from("loyalty_points")
        .update({
          points: existingPoints.points + 10,
          total_visits: existingPoints.total_visits + 1,
          last_visit: new Date().toISOString(),
        })
        .eq("id", existingPoints.id);
    } else {
      await supabase.from("loyalty_points").insert({
        user_id: userData.user.id,
        restaurant_id: restaurantId,
        points: 10,
        total_visits: 1,
        last_visit: new Date().toISOString(),
      });
    }

    // Update profile total_points
    const { data: profileData } = await supabase
      .from("profiles")
      .select("total_points")
      .eq("id", userData.user.id)
      .single();

    await supabase
      .from("profiles")
      .update({ total_points: (profileData?.total_points ?? 0) + 10 })
      .eq("id", userData.user.id);

    setMessage(text.success);
    setIsSaving(false);
    setSelectedTable(null);
    setSelectedItems({});
    setCustomerName(""); setCustomerPhone(""); setBookingDate("");
    setArrivalTime(""); setDepartureTime(""); setGuestsCount("2");
    setOccasion("none"); setSeatingPreference("any");
    setSpecialNotes(""); setPrepaymentType("none"); setDeliveryAddress("");
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
      <div className="space-y-8">
        {/* Floor map */}
        <section className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-gray-950">{text.floorMap}</h2>
          <p className="mt-1 text-sm text-gray-500">{text.floorMapSubtitle}</p>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold">
            {[
              { label: text.available, color: "bg-green-100 text-green-700" },
              { label: text.selected, color: "bg-orange-500 text-white" },
              { label: text.booked, color: "bg-red-100 text-red-400" },
              { label: text.reserved, color: "bg-yellow-100 text-yellow-600" },
            ].map((l) => (
              <span key={l.label} className={`rounded-full px-3 py-1 ${l.color}`}>{l.label}</span>
            ))}
          </div>

          {tables.length === 0 ? (
            <p className="mt-6 text-sm text-gray-400">No tables added yet.</p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {tables.map((table) => {
                const isSelected = selectedTable?.id === table.id;
                const isClickable = table.status === "available" || isSelected;
                return (
                  <button
                    key={table.id}
                    type="button"
                    disabled={!isClickable}
                    onClick={() => isClickable && setSelectedTable(isSelected ? null : table)}
                    className={`rounded-2xl border-2 p-4 text-left transition ${tableColor(table.status, isSelected)}`}
                  >
                    <Armchair size={20} />
                    <p className="mt-2 font-black text-sm">{table.table_name}</p>
                    <p className="text-xs opacity-75">{table.seats} {text.seats}</p>
                    {table.zone && <p className="text-xs opacity-60">{table.zone}</p>}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Menu */}
        {menuItems.length > 0 && (
          <section className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-gray-950">{text.menu}</h2>
            <p className="mt-1 text-sm text-gray-500">{text.menuSubtitle}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {menuItems.map((item) => (
                <div key={item.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="mb-3 h-32 w-full rounded-xl object-cover" />
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-black text-gray-950 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                    <p className="font-black text-orange-600 shrink-0">{Number(item.price).toLocaleString()} UZS</p>
                  </div>
                  {item.description && <p className="mt-2 text-xs text-gray-500 leading-5">{item.description}</p>}
                  <div className="mt-3 flex items-center gap-2">
                    <button type="button" onClick={() => removeMenuItem(item.id)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-200 text-orange-600 hover:bg-orange-50">
                      <Minus size={16} />
                    </button>
                    <div className="flex-1 rounded-xl bg-orange-50 py-2 text-center font-black text-orange-700 text-sm">
                      {selectedItems[item.id] || 0}
                    </div>
                    <button type="button" onClick={() => addMenuItem(item.id)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white hover:bg-orange-600">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Booking form */}
      <aside className="h-fit rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm lg:sticky lg:top-8">
        <h2 className="text-2xl font-black text-gray-950">{text.bookingForm}</h2>
        <p className="mt-1 text-sm text-gray-500">{text.bookingFormText}</p>

        {/* Selected table */}
        <div className="mt-4 rounded-2xl bg-orange-50 p-4">
          <p className="text-xs font-bold text-gray-500">{text.selectedTable}</p>
          <p className="mt-1 font-black text-orange-600">
            {selectedTable ? `${selectedTable.table_name} · ${selectedTable.seats} ${text.seats}` : text.noTableSelected}
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-700">{text.name}</label>
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
              placeholder={text.namePlaceholder}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500" />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-700">{text.phone}</label>
            <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder={text.phonePlaceholder}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500" />
          </div>

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-700">{text.arrivalDate}</label>
            <div className="relative">
              <CalendarDays className="absolute left-4 top-3.5 text-gray-400" size={16} />
              <input type="date" value={bookingDate} min={today} onChange={(e) => setBookingDate(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 pl-10 text-sm outline-none focus:border-orange-500" />
            </div>
          </div>

          {/* Arrival + Departure time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">{text.arrivalTime}</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3.5 text-gray-400" size={15} />
                <input type="time" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-3 py-3 pl-9 text-sm outline-none focus:border-orange-500" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">{text.departureTime}</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3.5 text-gray-400" size={15} />
                <input type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-3 py-3 pl-9 text-sm outline-none focus:border-orange-500" />
              </div>
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-700">{text.guests}</label>
            <div className="relative">
              <Users className="absolute left-4 top-3.5 text-gray-400" size={16} />
              <input type="number" min="1" value={guestsCount} onChange={(e) => setGuestsCount(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 pl-10 text-sm outline-none focus:border-orange-500" />
            </div>
          </div>

          {/* Occasion */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-700">
              <Sparkles size={14} className="mr-1 inline text-orange-400" />
              {text.occasionLabel}
            </label>
            <select value={occasion} onChange={(e) => setOccasion(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500">
              {Object.entries(text.occasions).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          {/* Seating preference */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-700">
              <Armchair size={14} className="mr-1 inline text-orange-400" />
              {text.seatingLabel}
            </label>
            <select value={seatingPreference} onChange={(e) => setSeatingPreference(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500">
              {Object.entries(text.seatings).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          {/* Special notes */}
          <div>
            <label className="mb-1.5 block text-sm font-bold text-gray-700">
              <MessageSquare size={14} className="mr-1 inline text-orange-400" />
              {text.notesLabel}
            </label>
            <textarea value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder={text.notesPlaceholder} rows={3}
              className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500" />
          </div>

          {/* Prepayment */}
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              <CreditCard size={14} className="mr-1 inline text-orange-400" />
              {text.prepaymentLabel}
            </label>
            <div className="space-y-2">
              {[
                { val: "none", label: text.prepaymentNone },
                { val: "half", label: text.prepaymentHalf },
                { val: "full", label: text.prepaymentFull },
              ].map((opt) => (
                <label key={opt.val} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition ${
                  prepaymentType === opt.val ? "border-orange-400 bg-orange-50" : "border-gray-200"
                }`}>
                  <input type="radio" name="prepayment" value={opt.val}
                    checked={prepaymentType === opt.val}
                    onChange={() => setPrepaymentType(opt.val)}
                    className="mt-0.5 accent-orange-500" />
                  <span className="text-xs text-gray-700 leading-5">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Delivery address (only for full prepayment) */}
          {prepaymentType === "full" && (
            <div>
              <label className="mb-1.5 block text-sm font-bold text-gray-700">{text.deliveryAddressLabel}</label>
              <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder={text.deliveryAddressPlaceholder}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-orange-500" />
            </div>
          )}

          {/* Pre-order summary */}
          {selectedMenuItems.length > 0 && (
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
              <p className="font-black text-gray-950 text-sm">{text.preorder}</p>
              <div className="mt-3 space-y-1.5">
                {selectedMenuItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs text-gray-600">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{(Number(item.price) * item.quantity).toLocaleString()} UZS</span>
                  </div>
                ))}
                <div className="border-t border-orange-200 pt-2 font-black text-orange-700 text-sm flex justify-between">
                  <span>{text.total}</span>
                  <span>{totalAmount.toLocaleString()} UZS</span>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`rounded-2xl p-4 text-sm font-bold ${
              message === text.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}>
              {message === text.success && <CheckCircle className="mb-1.5" size={18} />}
              {message}
            </div>
          )}

          {/* Submit */}
          <button type="button" disabled={isSaving} onClick={handleBookingSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-black text-white hover:bg-orange-600 disabled:opacity-70">
            {isSaving && <Loader2 className="animate-spin" size={18} />}
            {isSaving ? text.saving : text.confirm}
          </button>
        </div>
      </aside>
    </div>
  );
}