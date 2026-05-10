"use client";

import { useState } from "react";
import { Armchair, Users } from "lucide-react";

type RestaurantTable = {
  id: string;
  table_name: string;
  seats: number;
  zone: string | null;
  status: string;
};

type TableMapProps = {
  tables: RestaurantTable[];
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

export default function TableMap({ tables }: TableMapProps) {
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  const selectedTable = tables.find((table) => table.id === selectedTableId);

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

  return (
    <div className="rounded-[2rem] border border-orange-100 bg-[#151c27] p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Open Table Map</h2>
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
            <p className="mt-1 text-xs text-gray-400">Today by scheduled time</p>
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

                <p className="mt-1 font-bold text-gray-100">{booking.name}</p>

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
  );
}