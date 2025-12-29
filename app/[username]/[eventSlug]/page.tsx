import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Calendar, Clock, User, ArrowLeft, CheckCircle, Globe } from "lucide-react";
import Link from "next/link";
import { BookingCalendar } from "@/components/BookingCalendar";
import { TimeSlotPicker } from "@/components/TimeSlotPicker";

type PageProps = {
  params: Promise<{
    username: string;
    eventSlug: string;
  }>;
  searchParams: Promise<{
    date?: string;
  }>;
};

export default async function BookingPage(props: PageProps) {
  const { username, eventSlug } = await props.params;
  const { date } = await props.searchParams;

  // Find user by username
  const user = await prisma.user.findFirst({
    where: {
      email: {
        startsWith: `${username}@`,
      },
    },
  });

  if (!user) notFound();

  // Find event
  const event = await prisma.eventType.findFirst({
    where: {
      slug: eventSlug,
      userId: user.id,
    },
  });

  if (!event) notFound();

  // Get availability
  const availability = await prisma.availability.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      day: "asc",
    },
  });

  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-brand hover:text-brand-dark transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-subtle">
            <Globe className="w-4 h-4" />
            <span>Powered by Calendly Clone</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Side - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Info */}
            <div className="animate-fadeUp">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.name?.[0]?.toUpperCase() || username[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold text-xl text-text">{user.name || username}</h2>
                  <p className="text-subtle text-sm">@{username}</p>
                </div>
              </div>

              {/* Event Title */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-soft">
                <h1 className="text-3xl font-bold text-text mb-3">
                  {event.title}
                </h1>
                
                {event.description && (
                  <p className="text-subtle text-lg mb-6">
                    {event.description}
                  </p>
                )}

                {/* Event Meta */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-text">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-brand" />
                    </div>
                    <div>
                      <p className="font-semibold">{event.duration} minutes</p>
                      <p className="text-sm text-subtle">Duration</p>
                    </div>
                  </div>

                  {date && (
                    <div className="flex items-center gap-3 text-text">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold">
                          {new Date(date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-subtle">Selected date</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-text">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Web conferencing</p>
                      <p className="text-sm text-subtle">Video call details provided</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Info */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 animate-fadeUp" 
                 style={{ animationDelay: '100ms' }}>
              <h3 className="font-semibold text-text mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand" />
                Available Hours
              </h3>
              <div className="space-y-2">
                {availability.length === 0 ? (
                  <p className="text-sm text-subtle">No availability set</p>
                ) : (
                  availability.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-text">{DAYS[slot.day]}</span>
                      <span className="text-subtle">{slot.startTime} - {slot.endTime}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Booking Interface */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-border rounded-2xl shadow-lift p-8 animate-fadeUp" 
                 style={{ animationDelay: '150ms' }}>
              
              {!date ? (
                // Step 1: Date Selection
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-text mb-2">
                      Select a Date
                    </h2>
                    <p className="text-subtle">
                      Choose a date that works best for you
                    </p>
                  </div>

                  <BookingCalendar 
                    username={username}
                    eventSlug={eventSlug}
                    availability={availability}
                  />
                </div>
              ) : (
                // Step 2: Time Slot Selection
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-text mb-2">
                        Select a Time
                      </h2>
                      <p className="text-subtle">
                        Available time slots for {new Date(date).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <Link
                      href={`/${username}/${eventSlug}`}
                      className="text-sm text-brand hover:text-brand-dark font-medium flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Change date
                    </Link>
                  </div>

                  <TimeSlotPicker
                    username={username}
                    eventSlug={eventSlug}
                    date={date}
                    duration={event.duration}
                    availability={availability}
                  />
                </div>
              )}
            </div>

            {/* Security Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-subtle animate-fadeUp"
                 style={{ animationDelay: '200ms' }}>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Secure booking powered by Calendly Clone</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}