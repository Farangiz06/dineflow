"use client";

import { useState } from "react";
import { Armchair, CheckCircle, Loader2, Users } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type RestaurantTable = {
  id: string;
  table_name: string;
  seats: number;
  zone: string | null;
  status: string;
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

type TableShape = "square" | "rectangle" | "circle" | "diamond";

const tableLayouts: Record<
  string,
  {
    shape: TableShape;
    className: string;
  }
> = {
  T1: {
    shape: "diamond",
    className: "col-start-1 row-start-1",
  },
  T2: {
    shape: "rectangle",
    className: "col-start-3 row-start-1",
  },
  T3: {
    shape: "square",
    className: "col-start-5 row-start-1",
  },
  T4: {
    shape: "rectangle",
    className: "col-start-1 row-start-3",
  },
  T5: {
    shape: "rectangle",
    className: "col-start-3 row-start-3",
  },
  T6: {
    shape: "circle",
    className: "col-start-5 row-start-3",
  },
};

export default function BookingSection({
  restaurantId,
  tables,
  menuItems,
}: BookingSectionProps) {
  const [selectedTableId, setSelectedTableId] = useState<string>("");
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

  function getTableStyle(table: RestaurantTable) {
    const isSelected = selectedTableId === table.id;
    const isAvailable = table.status === "available";

    if (isSelected) {
      return "border-orange-500 bg-orange-500 text-white shadow-xl shadow-orange-200";
    }

    if (isAvailable) {
      return "border-blue-300 bg-blue-500 text-white hover:bg-blue-600";
    }

    return "cursor-not-allowed border-gray-300 bg-gray-400 text-gray-800 opacity-70";
  }

  function getShapeStyle(shape: TableShape) {
    if (shape === "circle") {
      return "h-28 w-28 rounded-full";
    }

    if (shape === "rectangle") {
      return "h-24 w-40 rounded-2xl";
    }

    if (shape === "diamond") {
      return "h-28 w-28 rotate-45 rounded-2xl";
    }

    return "h-28 w-28 rounded-2xl";
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

    if (!selectedTableId) {
      setMessage("Please select a table first.");
      return;
    }

    if (!customerName || !customerPhone || !bookingDate || !bookingTime) {
      setMessage("Please fill in all booking details.");
      return;
    }

    setIsSaving(true);

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        restaurant_id: restaurantId,
        table_id: selectedTableId,
        customer_name: customerName,
        customer_phone: customerPhone,
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
      setMessage(`Booking error: ${bookingError?.message || "Unknown error"}`);
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
        setMessage(`Pre-order error: ${itemsError.message}`);
        setIsSaving(false);
        return;
      }
    }

    setMessage("Booking created successfully! Restaurant will confirm it soon.");
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
    <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      <section className="space-y-8">
        <div className="rounded-[2rem] border border-orange-100 bg-[#151c27] p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">
                Open Table Map
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Choose an available table from the restaurant floor.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white">
              Main Floor
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <aside className="rounded-3xl bg-[#202836] p-4">
              <div className="mb-4 rounded-2xl bg-[#2b3444] px-4 py-3 text-gray-300">
                Search by name
              </div>

              <div className="mb-5">
                <h3 className="font-bold text-white">Reservations</h3>
                <p className="mt-1 text-xs text-gray-400">
                  Today by scheduled time
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    time: "10:00 am",
                    name: "Linda Streets",
                    guests: 2,
                    table: "T1",
                  },
                  {
                    time: "10:15 am",
                    name: "Randall Bales",
                    guests: 4,
                    table: "T3",
                  },
                  {
                    time: "11:15 am",
                    name: "Hosea Hegmann",
                    guests: 5,
                    table: "T5",
                  },
                ].map((booking) => (
                  <div
                    key={booking.name}
                    className="rounded-2xl border border-white/5 bg-[#161d29] p-3"
                  >
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{booking.time}</span>
                      <span>{booking.table}</span>
                    </div>

                    <p className="mt-1 font-bold text-gray-100">
                      {booking.name}
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                      <Users size={13} />
                      {booking.guests} guests
                    </p>
                  </div>
                ))}
              </div>
            </aside>

            <section className="relative min-h-[520px] overflow-hidden rounded-3xl bg-[#1d2430] p-6">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button className="rounded-xl bg-[#111827] px-4 py-2 font-bold text-white">
                    Today
                  </button>
                  <button className="rounded-xl bg-[#111827] px-4 py-2 font-bold text-white">
                    Lunch
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-gray-300">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded bg-blue-500" />
                    Available
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded bg-gray-400" />
                    Booked
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded bg-orange-500" />
                    Selected
                  </span>
                </div>
              </div>

              <div className="grid min-h-[390px] grid-cols-5 grid-rows-4 gap-8">
                {tables.map((table) => {
                  const layout = tableLayouts[table.table_name] || {
                    shape: "square" as TableShape,
                    className: "",
                  };

                  const isAvailable = table.status === "available";
                  const shapeStyle = getShapeStyle(layout.shape);

                  return (
                    <button
                      key={table.id}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedTableId(table.id)}
                      className={`relative flex items-center justify-center border-2 transition ${shapeStyle} ${layout.className} ${getTableStyle(
                        table
                      )}`}
                    >
                      <div
                        className={`flex flex-col items-center justify-center ${
                          layout.shape === "diamond" ? "-rotate-45" : ""
                        }`}
                      >
                        <Armchair size={22} />
                        <span className="mt-1 text-xs font-semibold">
                          {table.seats} seats
                        </span>
                        <span className="text-lg font-black">
                          {table.table_name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-3xl bg-[#111827] p-4 text-white">
                {selectedTable ? (
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Selected Table</p>
                      <h3 className="mt-1 text-xl font-black">
                        {selectedTable.table_name} • {selectedTable.seats} seats
                      </h3>
                      <p className="mt-1 text-sm text-gray-400">
                        Zone: {selectedTable.zone || "Main Hall"}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black">
                      Ready to book
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">
                    Choose an available table to continue your booking.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>

        <div className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-gray-950">Menu</h2>

            <p className="mt-1 text-gray-500">
              Pre-order your meals before arrival.
            </p>
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
                      {item.description || "Delicious menu item."}
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => removeMenuItem(item.id)}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-200 font-black text-orange-600 hover:bg-orange-50"
                      >
                        -
                      </button>

                      <div className="flex-1 rounded-xl bg-orange-50 px-4 py-3 text-center font-black text-orange-700">
                        {selectedItems[item.id] || 0}
                      </div>

                      <button
                        type="button"
                        onClick={() => addMenuItem(item.id)}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 font-black text-white hover:bg-orange-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-orange-50 p-5 text-gray-600">
              No menu items added yet.
            </p>
          )}
        </div>
      </section>

      <aside className="h-fit rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm lg:sticky lg:top-8">
        <h2 className="text-2xl font-black text-gray-950">Book a Table</h2>

        <p className="mt-2 text-sm text-gray-500">
          Fill in your booking details and send your request to the restaurant.
        </p>

        <div className="mt-5 rounded-2xl bg-orange-50 p-4">
          <p className="text-sm font-bold text-gray-700">Selected table</p>
          <p className="mt-1 text-lg font-black text-orange-600">
            {selectedTable
              ? `${selectedTable.table_name} • ${selectedTable.seats} seats`
              : "No table selected"}
          </p>
        </div>

        <form className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Your Name
            </label>

            <input
              type="text"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="John Smith"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Phone Number
            </label>

            <input
              type="tel"
              value={customerPhone}
              onChange={(event) => setCustomerPhone(event.target.value)}
              placeholder="+998 90 123 45 67"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Date
            </label>

            <input
              type="date"
              value={bookingDate}
              onChange={(event) => setBookingDate(event.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Time
            </label>

            <input
              type="time"
              value={bookingTime}
              onChange={(event) => setBookingTime(event.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Guests
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
            <p className="font-black text-gray-950">Pre-order summary</p>

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
                  Total: {totalAmount.toLocaleString()} UZS
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                No meals selected yet.
              </p>
            )}
          </div>

          {message && (
            <div
              className={`rounded-2xl p-4 text-sm font-bold ${
                message.includes("successfully")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.includes("successfully") && (
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
            {isSaving ? "Saving..." : "Confirm Booking"}
          </button>
        </form>
      </aside>
    </div>
  );
}