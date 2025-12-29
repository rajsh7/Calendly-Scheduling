import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { Calendar, Clock, User, Mail, Video, MapPin, Filter, Download } from "lucide-react";

export default async function BookingsPage() {
  const session = await getAuthSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    orderBy: {
      date: "asc",
    },
    include: {
      eventType: {
        select: {
          title: true,
          duration: true,
        },
      },
    },
  });

  // Separate upcoming and past bookings
  const now = new Date();
  const upcomingBookings = bookings.filter(b => new Date(b.date) >= now);
  const pastBookings = bookings.filter(b => new Date(b.date) < now);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date));
  };

  const formatTime = (time: string) => {
    return time;
  };

  const getTimeUntil = (date: Date) => {
    const diff = new Date(date).getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days < 7) return `In ${days} days`;
    return formatDate(date);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeUp">
        <div>
          <h1 className="text-4xl font-bold text-text mb-2">
            Bookings
          </h1>
          <p className="text-subtle text-lg">
            Manage your scheduled meetings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg
                           hover:bg-muted transition-all duration-300 hover:-translate-y-0.5 font-medium">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-brand text-white rounded-lg
                           hover:bg-brand-dark transition-all duration-300 hover:-translate-y-0.5 font-medium">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeUp" style={{ animationDelay: '50ms' }}>
        <div className="bg-white border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-brand" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{bookings.length}</p>
              <p className="text-sm text-subtle">Total Bookings</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{upcomingBookings.length}</p>
              <p className="text-sm text-subtle">Upcoming</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{pastBookings.length}</p>
              <p className="text-sm text-subtle">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {bookings.length === 0 ? (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-border rounded-2xl p-12 text-center shadow-soft animate-fadeUp" style={{ animationDelay: '100ms' }}>
          <div className="w-20 h-20 bg-white rounded-2xl shadow-soft flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-brand" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-3">
            No bookings yet
          </h2>
          <p className="text-subtle mb-6 max-w-md mx-auto">
            When people book meetings with you, they'll appear here. Share your scheduling link to start receiving bookings.
          </p>
        </div>
      ) : (
        <>
          {/* Upcoming Bookings */}
          {upcomingBookings.length > 0 && (
            <div className="space-y-4 animate-fadeUp" style={{ animationDelay: '100ms' }}>
              <h2 className="text-2xl font-bold text-text flex items-center gap-2">
                <Clock className="w-6 h-6 text-brand" />
                Upcoming Meetings
              </h2>

              <div className="space-y-3">
                {upcomingBookings.map((booking, index) => (
                  <div
                    key={booking.id}
                    className="bg-white border border-border rounded-xl p-6 
                             hover:shadow-lift transition-all duration-300 hover:-translate-y-1
                             animate-fadeUp group"
                    style={{ animationDelay: `${(index + 2) * 50}ms` }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Side - Event Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0
                                      group-hover:scale-110 transition-transform duration-300">
                          <Calendar className="w-6 h-6 text-brand" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg text-text">
                              {booking.eventType.title}
                            </h3>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              Upcoming
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-subtle mb-3">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              <span className="font-medium text-text">{getTimeUntil(booking.date)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                              <span className="text-xs">({booking.eventType.duration}m)</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-subtle">
                              <User className="w-4 h-4" />
                              <span>{booking.guestName}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-subtle">
                              <Mail className="w-4 h-4" />
                              <span>{booking.guestEmail}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Actions */}
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg
                                         hover:bg-muted transition-all duration-300 hover:-translate-y-0.5 text-sm font-medium">
                          <Video className="w-4 h-4" />
                          Join
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg
                                         hover:bg-brand-dark transition-all duration-300 hover:-translate-y-0.5 text-sm font-medium">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <div className="space-y-4 animate-fadeUp" style={{ animationDelay: `${(upcomingBookings.length + 2) * 50}ms` }}>
              <h2 className="text-2xl font-bold text-text flex items-center gap-2">
                <Calendar className="w-6 h-6 text-gray-600" />
                Past Meetings
              </h2>

              <div className="space-y-3">
                {pastBookings.map((booking, index) => (
                  <div
                    key={booking.id}
                    className="bg-white border border-border rounded-xl p-6 
                             opacity-75 hover:opacity-100 hover:shadow-lift 
                             transition-all duration-300 hover:-translate-y-1
                             animate-fadeUp"
                    style={{ animationDelay: `${(upcomingBookings.length + index + 3) * 50}ms` }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Side */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-6 h-6 text-gray-600" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg text-text">
                              {booking.eventType.title}
                            </h3>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              Completed
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-subtle mb-3">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(booking.date)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-subtle">
                              <User className="w-4 h-4" />
                              <span>{booking.guestName}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-subtle">
                              <Mail className="w-4 h-4" />
                              <span>{booking.guestEmail}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}