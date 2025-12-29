"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ConfirmPage() {
  const params = useParams();

  const username = Array.isArray(params.username)
    ? params.username[0]
    : params.username;

  const eventSlug = Array.isArray(params.eventSlug)
    ? params.eventSlug[0]
    : params.eventSlug;

  const searchParams = useSearchParams();
  const router = useRouter();

  // values already decided from slot selection
  const date = searchParams.get("date");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // safety guards
  if (!username || !eventSlug) {
    return <p className="p-10">Invalid route</p>;
  }

  if (!date || !start || !end) {
    return <p className="p-10">Invalid booking details</p>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        slug: eventSlug,
        date,
        startTime: start,
        endTime: end,
        guestName: name,
        guestEmail: email,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Booking failed");
      setLoading(false);
      return;
    }

    // ✅ auto redirect after success
    router.replace(`/confirmed?bookingId=${data.id}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">
          Confirm your booking
        </h1>

        <p className="text-sm text-gray-500 text-center">
          Enter your details to confirm
        </p>

        {error && (
          <p className="text-red-600 text-sm text-center">
            {error}
          </p>
        )}

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          className="w-full border rounded-lg px-4 py-2"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Your email"
          required
          className="w-full border rounded-lg px-4 py-2"
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Confirming..." : "Confirm booking"}
        </button>
      </form>
    </div>
  );
}
