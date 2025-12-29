import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Calendar, Clock } from "lucide-react";

type PageProps = {
  params: {
    username: string;
    eventSlug: string;
  };
  searchParams: {
    date?: string;
  };
};

export default async function BookingPage({
  params,
  searchParams,
}: PageProps) {
  const { username, eventSlug } = params;
  const date = searchParams.date;

  // 1️⃣ Find user by username (email prefix)
  const user = await prisma.user.findFirst({
    where: {
      email: {
        startsWith: `${username}@`,
      },
    },
  });

  if (!user) notFound();

  // 2️⃣ Find event
  const event = await prisma.eventType.findFirst({
    where: {
      slug: eventSlug,
      userId: user.id,
    },
  });

  if (!event) notFound();

  // 3️⃣ Fetch availability (basic version)
  const availability = await prisma.availability.findMany({
    where: {
      userId: user.id,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {event.title}
          </h1>
          {event.description && (
            <p className="text-gray-600">{event.description}</p>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {event.duration} minutes
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {date ? date : "Select a date"}
          </div>
        </div>

        {/* Divider */}
        <hr />

        {/* Availability */}
        {!date ? (
          <p className="text-gray-500 text-sm">
            Please select a date to see available slots.
          </p>
        ) : availability.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No availability set for this user.
          </p>
        ) : (
          <div className="grid gap-3">
            {availability.map((slot, i) => (
              <button
                key={i}
                className="w-full border rounded-lg py-3 text-sm font-medium
                           hover:bg-blue-50 hover:border-blue-400 transition"
              >
                {slot.startTime} – {slot.endTime}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
