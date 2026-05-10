import {
  Bell,
  CalendarDays,
  ChartLine,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Settings,
  ShoppingBag,
  Table2,
  Users,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import { upcomingBookings } from "@/lib/data";

export default function DashboardPage() {
  const tables = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];

  return (
    <main className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-72 flex-col bg-[#07111f] p-6 text-white lg:flex">
        <div className="mb-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500">
            <Menu size={18} />
          </div>
          <span className="text-xl font-bold">DineFlow</span>
        </div>

        <nav className="space-y-2 text-sm font-semibold">
          {[
            { label: "Dashboard", icon: LayoutDashboard, active: true },
            { label: "Bookings", icon: CalendarDays },
            { label: "Tables", icon: Table2 },
            { label: "Menu", icon: ClipboardList },
            { label: "Orders", icon: ShoppingBag },
            { label: "Customers", icon: Users },
            { label: "Analytics", icon: ChartLine },
            { label: "Settings", icon: Settings },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left ${
                item.active
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl bg-white/5 p-4">
          <p className="text-sm font-bold">Bella Vista</p>
          <p className="mt-1 text-xs text-gray-400">Restaurant owner</p>
        </div>
      </aside>

      <section className="flex-1 p-6 lg:p-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-950">Dashboard</h1>
            <p className="mt-1 text-gray-500">Welcome back, Bella Vista!</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700">
              May 8, 2026
            </button>

            <button className="relative rounded-2xl border border-gray-200 bg-white p-3 text-gray-700">
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500" />
            </button>

            <div className="h-11 w-11 rounded-full bg-orange-200" />
          </div>
        </header>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Today's Bookings"
            value="24"
            subtitle="+12% from yesterday"
            icon={CalendarDays}
          />
          <StatCard
            title="Pending Bookings"
            value="6"
            subtitle="View and confirm"
            icon={Bell}
          />
          <StatCard
            title="Available Tables"
            value="8"
            subtitle="Right now"
            icon={Table2}
          />
          <StatCard
            title="Pre-order Amount"
            value="2.45M UZS"
            subtitle="Today's estimated"
            icon={ShoppingBag}
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-950">
                Upcoming Bookings
              </h2>
              <button className="text-sm font-bold text-orange-600">
                View all
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500">
                    <th className="py-3 font-semibold">Time</th>
                    <th className="py-3 font-semibold">Customer</th>
                    <th className="py-3 font-semibold">Guests</th>
                    <th className="py-3 font-semibold">Table</th>
                    <th className="py-3 font-semibold">Pre-order</th>
                    <th className="py-3 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {upcomingBookings.map((booking) => (
                    <tr key={`${booking.time}-${booking.customer}`} className="border-b border-gray-50">
                      <td className="py-4 font-semibold text-gray-900">
                        {booking.time}
                      </td>
                      <td className="py-4 text-gray-700">{booking.customer}</td>
                      <td className="py-4 text-gray-700">{booking.guests}</td>
                      <td className="py-4 text-gray-700">{booking.table}</td>
                      <td className="py-4 text-gray-700">{booking.preorder}</td>
                      <td className="py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            booking.status === "Confirmed"
                              ? "bg-green-50 text-green-700"
                              : "bg-orange-50 text-orange-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-950">
                Table Overview
              </h2>
              <button className="text-sm font-bold text-orange-600">
                View floor map
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {tables.map((table, index) => {
                const available = [0, 2, 4, 11].includes(index);
                return (
                  <div
                    key={table}
                    className={`flex h-16 items-center justify-center rounded-2xl text-sm font-bold ${
                      available
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {table}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-green-100" />
                Available
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-gray-100" />
                Booked
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-orange-500" />
                Selected
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}