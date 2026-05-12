"use client";

import Link from "next/link";
import { CalendarDays, Search, ShoppingBag, Utensils } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider";

const userPanelText = {
  en: {
    panel: "Customer Panel",
    title: "Find restaurants and manage your bookings",
    subtitle:
      "This is the customer area. Here users can browse restaurants, book tables, pre-order meals, and see their reservations.",
    browseTitle: "Browse Restaurants",
    browseText:
      "Choose a restaurant, view details, select a table, and start your booking.",
    browseButton: "View Restaurants",
    bookingsTitle: "My Bookings",
    bookingsText:
      "See your booking history, status, date, time, table, and restaurant.",
    bookingsButton: "View Bookings",
    preorderTitle: "Pre-orders",
    preorderText:
      "Manage meals you pre-ordered before going to the restaurant.",
    comingSoon: "Coming Soon",
    ctaTitle: "Ready to book your next restaurant?",
    ctaText:
      "Go to the restaurant list, choose one restaurant, select your table, add meals, and confirm your booking.",
    ctaButton: "Start Booking",
  },
  uz: {
    panel: "Mijoz paneli",
    title: "Restoranlarni toping va bronlaringizni boshqaring",
    subtitle:
      "Bu mijozlar hududi. Bu yerda restoranlarni ko‘rish, stol bron qilish, ovqatni oldindan buyurtma qilish va bronlarni ko‘rish mumkin.",
    browseTitle: "Restoranlarni ko‘rish",
    browseText:
      "Restoranni tanlang, ma’lumotlarini ko‘ring, stol tanlang va bronni boshlang.",
    browseButton: "Restoranlarni ko‘rish",
    bookingsTitle: "Mening bronlarim",
    bookingsText:
      "Bron tarixi, status, sana, vaqt, stol va restoran ma’lumotlarini ko‘ring.",
    bookingsButton: "Bronlarni ko‘rish",
    preorderTitle: "Oldindan buyurtmalar",
    preorderText:
      "Restoranga borishdan oldin buyurtma qilingan ovqatlarni boshqaring.",
    comingSoon: "Tez orada",
    ctaTitle: "Keyingi restoraningizni bron qilishga tayyormisiz?",
    ctaText:
      "Restoranlar ro‘yxatiga o‘ting, restoran tanlang, stol belgilang, ovqat qo‘shing va bronni tasdiqlang.",
    ctaButton: "Bronni boshlash",
  },
  ru: {
    panel: "Кабинет клиента",
    title: "Находите рестораны и управляйте бронированиями",
    subtitle:
      "Это зона клиента. Здесь можно смотреть рестораны, бронировать столы, заранее заказывать блюда и видеть свои бронирования.",
    browseTitle: "Посмотреть рестораны",
    browseText:
      "Выберите ресторан, посмотрите детали, выберите стол и начните бронирование.",
    browseButton: "Посмотреть рестораны",
    bookingsTitle: "Мои бронирования",
    bookingsText:
      "Смотрите историю бронирований, статус, дату, время, стол и ресторан.",
    bookingsButton: "Посмотреть брони",
    preorderTitle: "Предзаказы",
    preorderText:
      "Управляйте блюдами, которые вы заказали до прихода в ресторан.",
    comingSoon: "Скоро",
    ctaTitle: "Готовы забронировать ресторан?",
    ctaText:
      "Перейдите к списку ресторанов, выберите ресторан, стол, добавьте блюда и подтвердите бронирование.",
    ctaButton: "Начать бронирование",
  },
};

export default function UserPanelPage() {
  const { language } = useLanguage();
  const text = userPanelText[language];

  return (
    <main className="min-h-screen bg-[#fffaf5]">
      <header className="border-b border-orange-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Utensils size={18} />
            </div>
            <span className="text-xl font-black">DineFlow</span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <LogoutButton />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="font-bold text-orange-600">{text.panel}</p>

        <h1 className="mt-2 text-4xl font-black text-gray-950">
          {text.title}
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600">{text.subtitle}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Link
            href="/user/restaurants"
            className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <Search className="text-orange-500" />

            <h2 className="mt-4 text-xl font-black text-gray-950">
              {text.browseTitle}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {text.browseText}
            </p>

            <span className="mt-5 inline-flex rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white">
              {text.browseButton}
            </span>
          </Link>

          <Link
            href="/user/bookings"
            className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <CalendarDays className="text-orange-500" />

            <h2 className="mt-4 text-xl font-black text-gray-950">
              {text.bookingsTitle}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {text.bookingsText}
            </p>

            <span className="mt-5 inline-flex rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white">
              {text.bookingsButton}
            </span>
          </Link>

          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
            <ShoppingBag className="text-orange-500" />

            <h2 className="mt-4 text-xl font-black text-gray-950">
              {text.preorderTitle}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {text.preorderText}
            </p>

            <span className="mt-5 inline-flex rounded-2xl bg-gray-100 px-5 py-3 text-sm font-black text-gray-500">
              {text.comingSoon}
            </span>
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] bg-orange-500 p-8 text-white">
          <h2 className="text-2xl font-black">{text.ctaTitle}</h2>

          <p className="mt-3 max-w-2xl text-orange-50">{text.ctaText}</p>

          <Link
            href="/user/restaurants"
            className="mt-6 inline-flex rounded-2xl bg-white px-6 py-3 font-black text-orange-600"
          >
            {text.ctaButton}
          </Link>
        </div>
      </section>
    </main>
  );
}