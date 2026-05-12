"use client";

import Link from "next/link";
import { Building2, Loader2, Mail, User, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider";

const loginText = {
  en: {
    welcome: "Welcome back",
    subtitle: "Login to continue to your panel.",
    customer: "Customer",
    customerText: "Access bookings and your profile.",
    partner: "Partner",
    partnerText: "Manage your restaurant panel after approval.",
    emailLabel: "Email Address",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Your password",
    loginButton: "Login",
    loading: "Logging in...",
    noAccount: "Don’t have an account?",
    register: "Register",
    emptyError: "Please enter email and password.",
    failedError: "Login failed.",
    profileError: "Profile not found. Please check the profiles table.",
    checkEmailTitle: "Email not confirmed?",
    checkEmailText:
      "If you just registered, please open your email and confirm your account first.",
    checkEmailButton: "Go to check email page",
  },

  uz: {
    welcome: "Xush kelibsiz",
    subtitle: "Panelingizga kirish uchun login qiling.",
    customer: "Mijoz",
    customerText: "Bronlar va profilingizga kiring.",
    partner: "Hamkor",
    partnerText: "Tasdiqdan keyin restoran panelingizni boshqaring.",
    emailLabel: "Email manzil",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Parol",
    passwordPlaceholder: "Parolingiz",
    loginButton: "Kirish",
    loading: "Kirilmoqda...",
    noAccount: "Hali akkauntingiz yo‘qmi?",
    register: "Ro‘yxatdan o‘tish",
    emptyError: "Email va parolni kiriting.",
    failedError: "Login amalga oshmadi.",
    profileError: "Profil topilmadi. Supabase profiles jadvalini tekshiring.",
    checkEmailTitle: "Email hali tasdiqlanmadimi?",
    checkEmailText:
      "Agar hozirgina ro‘yxatdan o‘tgan bo‘lsangiz, avval emailingizni ochib akkauntni tasdiqlang.",
    checkEmailButton: "Email tekshirish sahifasiga o‘tish",
  },

  ru: {
    welcome: "С возвращением",
    subtitle: "Войдите, чтобы перейти в свой кабинет.",
    customer: "Клиент",
    customerText: "Доступ к бронированиям и профилю.",
    partner: "Партнёр",
    partnerText: "Управляйте ресторанным кабинетом после одобрения.",
    emailLabel: "Email адрес",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Пароль",
    passwordPlaceholder: "Ваш пароль",
    loginButton: "Войти",
    loading: "Вход...",
    noAccount: "Нет аккаунта?",
    register: "Зарегистрироваться",
    emptyError: "Введите email и пароль.",
    failedError: "Не удалось войти.",
    profileError: "Профиль не найден. Проверьте таблицу profiles в Supabase.",
    checkEmailTitle: "Email не подтверждён?",
    checkEmailText:
      "Если вы только что зарегистрировались, сначала откройте email и подтвердите аккаунт.",
    checkEmailButton: "Перейти на страницу проверки email",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const text = loginText[language];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    setMessage("");

    if (!email || !password) {
      setMessage(text.emptyError);
      return;
    }

    setIsLoading(true);

    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError || !loginData.user) {
      setMessage(loginError?.message || text.failedError);
      setIsLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, partner_status")
      .eq("id", loginData.user.id)
      .single();

    if (profileError || !profile) {
      setMessage(text.profileError);
      setIsLoading(false);
      return;
    }

    if (profile.role === "admin") {
      router.push("/admin");
    } else if (profile.role === "partner") {
      if (profile.partner_status === "approved") {
        router.push("/partner");
      } else {
        router.push("/partner/pending");
      }
    } else {
      router.push("/user");
    }

    router.refresh();
    setIsLoading(false);
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[0.9fr_1.1fr]">
      <section
        className="hidden bg-cover bg-center lg:block"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200&auto=format&fit=crop)",
        }}
      />

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

          <h1 className="text-4xl font-black text-gray-950">
            {text.welcome}
          </h1>

          <p className="mt-2 text-gray-500">{text.subtitle}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
              <User className="text-orange-500" />
              <p className="mt-2 font-black text-gray-950">{text.customer}</p>
              <p className="mt-1 text-sm text-gray-500">
                {text.customerText}
              </p>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
              <Building2 className="text-orange-500" />
              <p className="mt-2 font-black text-gray-950">{text.partner}</p>
              <p className="mt-1 text-sm text-gray-500">{text.partnerText}</p>
            </div>
          </div>

          <form className="mt-6 space-y-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                {text.emailLabel}
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={text.emailPlaceholder}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                {text.passwordLabel}
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
              <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
                {message}
              </div>
            )}

            <button
              type="button"
              disabled={isLoading}
              onClick={handleLogin}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-black text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading && <Loader2 className="animate-spin" size={18} />}
              {isLoading ? text.loading : text.loginButton}
            </button>

            <div className="rounded-2xl bg-orange-50 p-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-1 text-orange-500" size={20} />

                <div>
                  <p className="font-black text-gray-950">
                    {text.checkEmailTitle}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {text.checkEmailText}
                  </p>

                  <Link
                    href="/auth/check-email"
                    className="mt-3 inline-flex text-sm font-black text-orange-600 hover:text-orange-700"
                  >
                    {text.checkEmailButton}
                  </Link>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500">
              {text.noAccount}{" "}
              <Link href="/register" className="font-black text-orange-600">
                {text.register}
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}