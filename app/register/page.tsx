"use client";

import Link from "next/link";
import { ArrowLeft, Building2, User, Utensils } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider";

const registerChoiceText = {
  en: {
    already: "Already have an account?",
    login: "Login",
    back: "Back to home",
    title: "Create your account",
    subtitle: "How do you want to use DineFlow?",
    customerTitle: "I’m a Customer",
    customerText:
      "Book tables, choose your seat, pre-order meals and enjoy better dining.",
    customerButton: "Continue as Customer",
    partnerTitle: "I’m a Restaurant Partner",
    partnerText:
      "Manage your restaurant, bookings, menu, tables and floor plan from one panel.",
    partnerButton: "Continue as Partner",
  },
  uz: {
    already: "Akkauntingiz bormi?",
    login: "Kirish",
    back: "Bosh sahifaga qaytish",
    title: "Akkaunt yarating",
    subtitle: "DineFlow’dan qanday foydalanmoqchisiz?",
    customerTitle: "Men mijozman",
    customerText:
      "Stol bron qiling, joy tanlang, ovqatni oldindan buyurtma qiling va qulay tajriba oling.",
    customerButton: "Mijoz sifatida davom etish",
    partnerTitle: "Men restoran hamkoriman",
    partnerText:
      "Restoran, bronlar, menyu, stollar va floor plan’ni bitta paneldan boshqaring.",
    partnerButton: "Hamkor sifatida davom etish",
  },
  ru: {
    already: "Уже есть аккаунт?",
    login: "Войти",
    back: "Назад на главную",
    title: "Создайте аккаунт",
    subtitle: "Как вы хотите использовать DineFlow?",
    customerTitle: "Я клиент",
    customerText:
      "Бронируйте столы, выбирайте место, заранее заказывайте блюда и наслаждайтесь удобным сервисом.",
    customerButton: "Продолжить как клиент",
    partnerTitle: "Я ресторан-партнёр",
    partnerText:
      "Управляйте рестораном, бронированиями, меню, столами и планом зала из одного кабинета.",
    partnerButton: "Продолжить как партнёр",
  },
};

export default function RegisterChoicePage() {
  const { language } = useLanguage();
  const text = registerChoiceText[language];

  return (
    <main className="min-h-screen bg-[#fffaf5] px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Utensils size={18} />
            </div>
            <span className="text-xl font-black">DineFlow</span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <Link
              href="/login"
              className="hidden text-sm font-bold text-orange-600 hover:text-orange-700 md:block"
            >
              {text.already} {text.login}
            </Link>
          </div>
        </div>

        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-gray-600 hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          {text.back}
        </Link>

        <div className="text-center">
          <h1 className="text-4xl font-black text-gray-950">{text.title}</h1>
          <p className="mt-3 text-gray-600">{text.subtitle}</p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
          <Link
            href="/register/customer"
            className="rounded-[2rem] border border-orange-100 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white">
              <User size={30} />
            </div>

            <h2 className="mt-6 text-2xl font-black text-gray-950">
              {text.customerTitle}
            </h2>

            <p className="mx-auto mt-3 max-w-xs leading-7 text-gray-600">
              {text.customerText}
            </p>

            <span className="mt-8 inline-flex rounded-2xl bg-orange-500 px-8 py-3 font-black text-white">
              {text.customerButton}
            </span>
          </Link>

          <Link
            href="/register/partner"
            className="rounded-[2rem] border border-orange-100 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white">
              <Building2 size={30} />
            </div>

            <h2 className="mt-6 text-2xl font-black text-gray-950">
              {text.partnerTitle}
            </h2>

            <p className="mx-auto mt-3 max-w-xs leading-7 text-gray-600">
              {text.partnerText}
            </p>

            <span className="mt-8 inline-flex rounded-2xl bg-orange-500 px-8 py-3 font-black text-white">
              {text.partnerButton}
            </span>
          </Link>
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/login"
            className="text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            {text.already} {text.login}
          </Link>
        </div>
      </div>
    </main>
  );
}