"use client";

import Link from "next/link";
import { MailCheck, Utensils } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider";

const checkEmailText = {
  en: {
    title: "Check your email",
    subtitle:
      "We sent you a confirmation link. Please open your email and confirm your account before logging in.",
    tipTitle: "What to do next?",
    tip1: "Open your email inbox.",
    tip2: "Click the confirmation link from DineFlow / Supabase.",
    tip3: "After confirmation, come back and log in.",
    login: "Go to Login",
    home: "Back to Home",
  },
  uz: {
    title: "Emailingizni tekshiring",
    subtitle:
      "Biz sizga tasdiqlash linkini yubordik. Login qilishdan oldin emailingizni ochib, akkauntingizni tasdiqlang.",
    tipTitle: "Keyin nima qilish kerak?",
    tip1: "Email inbox’ingizni oching.",
    tip2: "DineFlow / Supabase yuborgan tasdiqlash linkini bosing.",
    tip3: "Tasdiqlagandan keyin qaytib login qiling.",
    login: "Login sahifasiga o‘tish",
    home: "Bosh sahifaga qaytish",
  },
  ru: {
    title: "Проверьте email",
    subtitle:
      "Мы отправили вам ссылку подтверждения. Откройте email и подтвердите аккаунт перед входом.",
    tipTitle: "Что делать дальше?",
    tip1: "Откройте свой email.",
    tip2: "Нажмите на ссылку подтверждения от DineFlow / Supabase.",
    tip3: "После подтверждения вернитесь и войдите.",
    login: "Перейти к входу",
    home: "Назад на главную",
  },
};

export default function CheckEmailPage() {
  const { language } = useLanguage();
  const text = checkEmailText[language];

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-6 py-10">
      <div className="w-full max-w-2xl rounded-[2rem] border border-orange-100 bg-white p-8 text-center shadow-sm md:p-12">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Utensils size={18} />
            </div>
            <span className="text-xl font-black text-gray-950">DineFlow</span>
          </Link>

          <LanguageSwitcher />
        </div>

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-600">
          <MailCheck size={40} />
        </div>

        <h1 className="mt-6 text-4xl font-black text-gray-950">
          {text.title}
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-gray-600">
          {text.subtitle}
        </p>

        <div className="mt-8 rounded-3xl bg-orange-50 p-6 text-left">
          <h2 className="text-xl font-black text-gray-950">
            {text.tipTitle}
          </h2>

          <ul className="mt-4 space-y-3 text-gray-700">
            <li>1. {text.tip1}</li>
            <li>2. {text.tip2}</li>
            <li>3. {text.tip3}</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="rounded-2xl bg-orange-500 px-6 py-3 font-black text-white hover:bg-orange-600"
          >
            {text.login}
          </Link>

          <Link
            href="/"
            className="rounded-2xl border border-orange-200 px-6 py-3 font-black text-orange-600 hover:bg-orange-50"
          >
            {text.home}
          </Link>
        </div>
      </div>
    </main>
  );
}