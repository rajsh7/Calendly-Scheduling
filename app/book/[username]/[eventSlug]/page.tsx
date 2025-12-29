"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function BookingPage() {
  const { username, eventSlug } = useParams() as {
    username: string;
    eventSlug: string;
  };

  const searchParams = useSearchParams();
  const date = searchParams.get("date") || "";

  const [slots, setSlots] = useState<
    { start: string; end: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) return;

    fetch(
      `/api/slots?username=${username}&slug=${eventSlug}&date=${date}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSlots(data);
        } else {
          setSlots([]);
          console.error("Slots API error:", data);
        }
      });
  }, [username, eventSlug, date]);

  async function bookSlot(start: string, end: string) {
    const guestName = prompt("Your name?");
    const guestEmail = prompt("Your email?");

    if (!guestName || !guestEmail) return;

    setLoading(true);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        slug: eventSlug,
        date,
        startTime: start,
        endTime: end,
        guestName,
        guestEmail,
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert("✅ Booking confirmed!");
      // Reload slots so booked one disappears
      setSlots((prev) =>
        prev.filter((s) => !(s.start === start && s.end === end))
      );
    } else {
      const data = await res.json();
      alert(data.error || "Booking failed");
    }
  }

  return (
  <div className="min-h-screen bg-muted flex items-center justify-center px-4">
    <div
      className="w-full max-w-md bg-surface border border-border
                 rounded-2xl shadow-soft p-6 space-y-6 animate-fadeUp"
    >
      <div>
        <h1 className="text-2xl font-semibold text-text">
          Select a time
        </h1>
        <p className="text-sm text-subtle">
          {date}
        </p>
      </div>

      {slots.length === 0 ? (
        <p className="text-subtle text-center">
          No slots available for this date.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {slots.map((s, i) => (
            <button
              key={i}
              disabled={loading}
              onClick={() => bookSlot(s.start, s.end)}
              className="border border-border rounded-lg py-2 text-sm font-medium
                         hover:bg-brand hover:text-white transition
                         disabled:opacity-50"
            >
              {s.start} – {s.end}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);

}
