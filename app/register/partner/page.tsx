"use client";

import Link from "next/link";
import { ArrowLeft, Loader2, Utensils } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PartnerRegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [restaurantName, setRestaurantName] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [city, setCity] = useState("Tashkent");
  const [address, setAddress] = useState("");
  const [restaurantPhone, setRestaurantPhone] = useState("");
  const [openingTime, setOpeningTime] = useState("09:00");
  const [closingTime, setClosingTime] = useState("23:00");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function goToRestaurantInfoStep() {
    setMessage("");

    if (!fullName || !email || !password) {
      setMessage("Please fill in owner full name, email and password.");
      return;
    }

    setStep(2);
  }

  function goToFinishStep() {
    setMessage("");

    if (!restaurantName || !cuisineType || !address) {
      setMessage("Please fill in restaurant name, cuisine type and address.");
      return;
    }

    setStep(3);
  }

  async function handlePartnerRegister() {
    setMessage("");

    if (!fullName || !email || !password) {
      setMessage("Please fill in owner account details.");
      setStep(1);
      return;
    }

    if (!restaurantName || !cuisineType || !address) {
      setMessage("Please fill in restaurant information.");
      setStep(2);
      return;
    }

    setIsLoading(true);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: ownerPhone,
          role: "partner",
        },
      },
    });

    if (signUpError || !signUpData.user) {
      setMessage(signUpError?.message || "Registration failed.");
      setIsLoading(false);
      return;
    }

    const { error: restaurantError } = await supabase.from("restaurants").insert({
      owner_id: signUpData.user.id,
      name: restaurantName,
      description: `Welcome to ${restaurantName}.`,
      cuisine_type: cuisineType,
      address,
      city,
      phone: restaurantPhone,
      image_url:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop",
      opening_time: openingTime,
      closing_time: closingTime,
      is_open: true,
      approval_status: "pending",
    });

    if (restaurantError) {
      setMessage(restaurantError.message);
      setIsLoading(false);
      return;
    }

    router.push("/partner/pending");
    router.refresh();
    setIsLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#fffaf5] px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Utensils size={18} />
            </div>
            <span className="text-xl font-black">DineFlow</span>
          </Link>

          <Link href="/login" className="text-sm font-bold text-orange-600">
            Already have an account? Login
          </Link>
        </div>

        <Link
          href="/register"
          className="mb-6 inline-flex items-center gap-2 font-semibold text-gray-600 hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        <div className="mb-8 flex items-center justify-center gap-4">
          {["Owner Account", "Restaurant Info", "Admin Review"].map(
            (label, index) => {
              const number = index + 1;

              return (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${
                      step >= number
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {number}
                  </div>

                  <span
                    className={`hidden text-sm font-bold md:block ${
                      step >= number ? "text-gray-950" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            }
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr]">
          <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
            {step === 1 && (
              <div>
                <h1 className="text-3xl font-black text-gray-950">
                  Owner Account
                </h1>

                <p className="mt-2 text-gray-500">
                  Create your restaurant owner account first.
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Full Name
                    </label>
                    <input
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter your email"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Phone Number
                    </label>
                    <input
                      value={ownerPhone}
                      onChange={(event) => setOwnerPhone(event.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Create a password"
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
                    onClick={goToRestaurantInfoStep}
                    className="w-full rounded-2xl bg-orange-500 px-5 py-4 font-black text-white hover:bg-orange-600"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h1 className="text-3xl font-black text-gray-950">
                  Restaurant Information
                </h1>

                <p className="mt-2 text-gray-500">
                  Tell us about your restaurant. This information will be
                  reviewed by admin before your partner panel is activated.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Restaurant Name
                    </label>
                    <input
                      value={restaurantName}
                      onChange={(event) =>
                        setRestaurantName(event.target.value)
                      }
                      placeholder="Bella Vista"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Cuisine Type
                    </label>
                    <input
                      value={cuisineType}
                      onChange={(event) => setCuisineType(event.target.value)}
                      placeholder="Italian, Uzbek, Korean..."
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      City
                    </label>
                    <input
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      placeholder="Tashkent"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Restaurant Phone
                    </label>
                    <input
                      value={restaurantPhone}
                      onChange={(event) =>
                        setRestaurantPhone(event.target.value)
                      }
                      placeholder="+998 90 123 45 67"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Address
                    </label>
                    <input
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      placeholder="Full restaurant address"
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Opening Time
                    </label>
                    <input
                      type="time"
                      value={openingTime}
                      onChange={(event) => setOpeningTime(event.target.value)}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Closing Time
                    </label>
                    <input
                      type="time"
                      value={closingTime}
                      onChange={(event) => setClosingTime(event.target.value)}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {message && (
                  <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
                    {message}
                  </p>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMessage("");
                      setStep(1);
                    }}
                    className="rounded-2xl border border-gray-200 px-5 py-3 font-black text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={goToFinishStep}
                    className="flex-1 rounded-2xl bg-orange-500 px-5 py-3 font-black text-white hover:bg-orange-600"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h1 className="text-3xl font-black text-gray-950">
                  Submit for Admin Review
                </h1>

                <p className="mt-2 text-gray-500">
                  Your restaurant will be created with pending status. After
                  admin approval, you can access the partner dashboard.
                </p>

                <div className="mt-6 rounded-2xl bg-orange-50 p-5">
                  <p className="text-sm font-bold text-orange-700">
                    Restaurant Summary
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-gray-950">
                    {restaurantName || "Restaurant name"}
                  </h2>

                  <p className="mt-2 text-sm text-gray-600">
                    {cuisineType || "Cuisine type"} • {city || "City"}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {address || "Address"}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {openingTime} - {closingTime}
                  </p>

                  <div className="mt-4 inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-black text-orange-700">
                    Status after submit: pending approval
                  </div>
                </div>

                {message && (
                  <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
                    {message}
                  </p>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMessage("");
                      setStep(2);
                    }}
                    className="rounded-2xl border border-gray-200 px-5 py-3 font-black text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handlePartnerRegister}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-black text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading && <Loader2 className="animate-spin" size={18} />}
                    {isLoading ? "Submitting..." : "Submit for Review"}
                  </button>
                </div>
              </div>
            )}
          </section>

          <aside className="rounded-3xl bg-gray-950 p-6 text-white">
            <h2 className="text-2xl font-black">Partner approval process</h2>

            <ul className="mt-6 space-y-4 text-gray-300">
              <li className="rounded-2xl bg-white/10 p-4">
                <p className="font-bold text-white">1. Submit restaurant</p>
                <p className="mt-1 text-sm text-gray-400">
                  Fill owner and restaurant information.
                </p>
              </li>

              <li className="rounded-2xl bg-white/10 p-4">
                <p className="font-bold text-white">2. Admin reviews</p>
                <p className="mt-1 text-sm text-gray-400">
                  Admin checks restaurant details before approval.
                </p>
              </li>

              <li className="rounded-2xl bg-white/10 p-4">
                <p className="font-bold text-white">3. Partner dashboard opens</p>
                <p className="mt-1 text-sm text-gray-400">
                  After approval, you can manage floor map, menu and bookings.
                </p>
              </li>
            </ul>

            <div
              className="mt-8 h-72 rounded-3xl bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop)",
              }}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}