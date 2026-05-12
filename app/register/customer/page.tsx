"use client";

import Link from "next/link";
import { ArrowLeft, Loader2, Mail, Phone, User, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider";

const customerRegisterText = {
  en: {
    title: "Customer Registration",
    subtitle: "Create your customer account.",
    sideTitle: "Book smarter with DineFlow",
    sideText:
      "Choose restaurants, select your exact table, and pre-order meals before arrival.",
    back: "Back",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    email: "Email Address",
    emailPlaceholder: "Enter your email",
    phone: "Phone Number",
    phonePlaceholder: "+998 90 123 45 67",
    password: "Password",
    passwordPlaceholder: "Create a password",
    create: "Create Account",
    creating: "Creating...",
    already: "Already have an account?",
    login: "Login",
    emptyError: "Please fill in full name, email and password.",
  },
  uz: {
    title: "Mijoz ro‘yxatdan o‘tishi",
    subtitle: "Mijoz akkauntingizni yarating.",
    sideTitle: "DineFlow bilan qulayroq bron qiling",
    sideText:
      "Restoranlarni tanlang, aniq stolni belgilang va kelishdan oldin ovqat buyurtma qiling.",
    back: "Orqaga",
    fullName: "To‘liq ism",
    fullNamePlaceholder: "To‘liq ismingizni kiriting",
    email: "Email manzil",
    emailPlaceholder: "Emailingizni kiriting",
    phone: "Telefon raqam",
    phonePlaceholder: "+998 90 123 45 67",
    password: "Parol",
    passwordPlaceholder: "Parol yarating",
    create: "Akkaunt yaratish",
    creating: "Yaratilmoqda...",
    already: "Akkauntingiz bormi?",
    login: "Kirish",
    emptyError: "To‘liq ism, email va parolni kiriting.",
  },
  ru: {
    title: "Регистрация клиента",
    subtitle: "Создайте аккаунт клиента.",
    sideTitle: "Бронируйте удобнее с DineFlow",
    sideText:
      "Выбирайте рестораны, конкретный стол и заранее заказывайте блюда.",
    back: "Назад",
    fullName: "Полное имя",
    fullNamePlaceholder: "Введите полное имя",
    email: "Email адрес",
    emailPlaceholder: "Введите email",
    phone: "Номер телефона",
    phonePlaceholder: "+998 90 123 45 67",
    password: "Пароль",
    passwordPlaceholder: "Создайте пароль",
    create: "Создать аккаунт",
    creating: "Создание...",
    already: "Уже есть аккаунт?",
    login: "Войти",
    emptyError: "Введите полное имя, email и пароль.",
  },
};

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const text = customerRegisterText[language];

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister() {
    setMessage("");

    if (!fullName || !email || !password) {
      setMessage(text.emptyError);
      return;
    }

    setIsLoading(true);

    const origin = window.location.origin;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/login`,
        data: {
          full_name: fullName,
          phone,
          role: "customer",
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    router.push("/auth/check-email");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden bg-gray-950 lg:block">
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop"
          alt="Customer"
          className="h-full w-full object-cover opacity-65"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h1 className="text-5xl font-black leading-tight">
            {text.sideTitle}
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-8 text-white/80">
            {text.sideText}
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
                <Utensils size={18} />
              </div>
              <span className="text-xl font-black">DineFlow</span>
            </Link>

            <LanguageSwitcher />
          </div>

          <Link
            href="/register"
            className="mb-6 flex items-center gap-2 font-semibold text-gray-600 hover:text-orange-600"
          >
            <ArrowLeft size={18} />
            {text.back}
          </Link>

          <h1 className="text-3xl font-black text-gray-950">{text.title}</h1>

          <p className="mt-2 text-gray-500">{text.subtitle}</p>

          <form className="mt-6 space-y-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-800">
                {text.fullName}
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 focus-within:border-orange-500">
                <User size={18} className="text-gray-400" />

                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder={text.fullNamePlaceholder}
                  className="w-full outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-800">
                {text.email}
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 focus-within:border-orange-500">
                <Mail size={18} className="text-gray-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={text.emailPlaceholder}
                  className="w-full outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-800">
                {text.phone}
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 focus-within:border-orange-500">
                <Phone size={18} className="text-gray-400" />

                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder={text.phonePlaceholder}
                  className="w-full outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-800">
                {text.password}
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={text.passwordPlaceholder}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            {message && (
              <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
                {message}
              </p>
            )}

            <button
              type="button"
              disabled={isLoading}
              onClick={handleRegister}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-black text-white hover:bg-orange-600 disabled:opacity-70"
            >
              {isLoading && <Loader2 className="animate-spin" size={18} />}
              {isLoading ? text.creating : text.create}
            </button>

            <p className="text-center text-sm text-gray-500">
              {text.already}{" "}
              <Link href="/login" className="font-black text-orange-600">
                {text.login}
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}