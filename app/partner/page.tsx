"use client";

import Link from "next/link";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Map,
  Settings,
  Utensils,
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider";

const partnerPanelText = {
  en: {
    panel: "Partner Panel",
    title: "Manage your restaurant",
    subtitle:
      "This is the restaurant owner area. Here you can edit your floor map, manage menu items, see bookings, and control restaurant settings.",
    floorMapTitle: "Editable Floor Map",
    floorMapText:
      "Create, move, resize, recolor, and organize restaurant tables visually.",
    floorMapButton: "Open Floor Map",
    menuTitle: "Menu Editor",
    menuText:
      "Add dishes, prices, categories, images, and availability for customers.",
    menuButton: "Open Menu Editor",
    bookingsTitle: "Bookings",
    bookingsText:
      "See incoming customer reservations and approve, cancel, or complete them.",
    bookingsButton: "Open Bookings",
    settingsTitle: "Restaurant Settings",
    settingsText:
      "Edit restaurant name, phone, city, address, opening time, image, and open/closed status.",
    settingsButton: "Open Settings",
    quickTitle: "Today’s partner workflow",
    step1: "1. Build your floor map",
    step1Text: "Add tables and place them like your real restaurant layout.",
    step2: "2. Add your menu",
    step2Text: "Upload dishes so customers can pre-order before arrival.",
    step3: "3. Manage bookings",
    step3Text: "Approve, cancel, or complete customer booking requests.",
  },

  uz: {
    panel: "Hamkor paneli",
    title: "Restoraningizni boshqaring",
    subtitle:
      "Bu restoran egasi uchun panel. Bu yerda floor map tahrirlash, menyu boshqarish, bronlarni ko‘rish va restoran sozlamalarini boshqarish mumkin.",
    floorMapTitle: "Tahrirlanadigan Floor Map",
    floorMapText:
      "Stollarni qo‘shing, joyini o‘zgartiring, o‘lchamini, rangini va joylashuvini boshqaring.",
    floorMapButton: "Floor Map ochish",
    menuTitle: "Menyu tahrirlash",
    menuText:
      "Taomlar, narxlar, kategoriyalar, rasmlar va mavjudlik holatini qo‘shing.",
    menuButton: "Menyu editorni ochish",
    bookingsTitle: "Bronlar",
    bookingsText:
      "Mijozlardan kelgan bronlarni ko‘ring, tasdiqlang, bekor qiling yoki yakunlang.",
    bookingsButton: "Bronlarni ochish",
    settingsTitle: "Restoran sozlamalari",
    settingsText:
      "Restoran nomi, telefon, shahar, manzil, ish vaqti, rasm va ochiq/yopiq holatini tahrirlang.",
    settingsButton: "Sozlamalarni ochish",
    quickTitle: "Bugungi partner workflow",
    step1: "1. Floor map yarating",
    step1Text:
      "Stollarni qo‘shib, haqiqiy restoran joylashuviga o‘xshatib qo‘ying.",
    step2: "2. Menyu qo‘shing",
    step2Text:
      "Mijozlar oldindan buyurtma qilishi uchun taomlarni kiriting.",
    step3: "3. Bronlarni boshqaring",
    step3Text:
      "Mijoz bronlarini tasdiqlang, bekor qiling yoki yakunlang.",
  },

  ru: {
    panel: "Партнёрский кабинет",
    title: "Управляйте рестораном",
    subtitle:
      "Это зона владельца ресторана. Здесь можно редактировать план зала, управлять меню, смотреть бронирования и настройки ресторана.",
    floorMapTitle: "Редактируемый план зала",
    floorMapText:
      "Добавляйте столы, двигайте их, меняйте размер, цвет и расположение.",
    floorMapButton: "Открыть план зала",
    menuTitle: "Редактор меню",
    menuText:
      "Добавляйте блюда, цены, категории, изображения и доступность для клиентов.",
    menuButton: "Открыть меню",
    bookingsTitle: "Бронирования",
    bookingsText:
      "Смотрите входящие бронирования клиентов, подтверждайте, отменяйте или завершайте их.",
    bookingsButton: "Открыть брони",
    settingsTitle: "Настройки ресторана",
    settingsText:
      "Редактируйте название ресторана, телефон, город, адрес, часы работы, изображение и статус открыто/закрыто.",
    settingsButton: "Открыть настройки",
    quickTitle: "Рабочий процесс партнёра",
    step1: "1. Создайте план зала",
    step1Text:
      "Добавьте столы и расположите их как в реальном ресторане.",
    step2: "2. Добавьте меню",
    step2Text:
      "Добавьте блюда, чтобы клиенты могли делать предзаказ.",
    step3: "3. Управляйте бронированиями",
    step3Text:
      "Подтверждайте, отменяйте или завершайте заявки клиентов.",
  },
};

export default function PartnerPanelPage() {
  const { language } = useLanguage();
  const text = partnerPanelText[language];

  return (
    <main className="min-h-screen bg-[#fffaf5]">
      <header className="border-b border-orange-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Utensils size={18} />
            </div>

            <span className="text-xl font-black text-gray-950">
              DineFlow Partner
            </span>
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

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/partner/floor-plan"
            className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <Map className="text-orange-500" />

            <h2 className="mt-4 text-xl font-black text-gray-950">
              {text.floorMapTitle}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {text.floorMapText}
            </p>

            <span className="mt-5 inline-flex rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white">
              {text.floorMapButton}
            </span>
          </Link>

          <Link
            href="/partner/menu"
            className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <ClipboardList className="text-orange-500" />

            <h2 className="mt-4 text-xl font-black text-gray-950">
              {text.menuTitle}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {text.menuText}
            </p>

            <span className="mt-5 inline-flex rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white">
              {text.menuButton}
            </span>
          </Link>

          <Link
            href="/partner/bookings"
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

          <Link
            href="/partner/settings"
            className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <Settings className="text-orange-500" />

            <h2 className="mt-4 text-xl font-black text-gray-950">
              {text.settingsTitle}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {text.settingsText}
            </p>

            <span className="mt-5 inline-flex rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white">
              {text.settingsButton}
            </span>
          </Link>
        </div>

        <div className="mt-10 rounded-[2rem] bg-gray-950 p-8 text-white">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="text-orange-400" />
            <h2 className="text-2xl font-black">{text.quickTitle}</h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="font-black text-orange-400">{text.step1}</p>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                {text.step1Text}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="font-black text-orange-400">{text.step2}</p>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                {text.step2Text}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="font-black text-orange-400">{text.step3}</p>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                {text.step3Text}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}