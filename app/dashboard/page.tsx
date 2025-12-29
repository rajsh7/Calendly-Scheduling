import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Calendar, Clock, TrendingUp, Settings, Plus, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { CopyLinkButton } from "@/components/CopyLinkButton";

export default async function DashboardPage() {
  const session = await getAuthSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const [eventsCount, availabilityCount, recentBookings] = await Promise.all([
    prisma.eventType.count({
      where: { user: { email: session.user.email } },
    }),
    prisma.availability.count({
      where: { user: { email: session.user.email } },
    }),
    // Get recent bookings if you have a booking model
    prisma.booking?.count({
      where: { 
        eventType: { 
          user: { email: session.user.email } 
        },
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
    }).catch(() => 0), // Fallback if booking model doesn't exist
  ]);

  const userName = session.user.name?.split(" ")[0] || "there";
  const hasSetup = eventsCount > 0 && availabilityCount > 0;
  const userSlug = session.user.email?.split('@')[0] || '';

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="animate-fadeUp">
        <h1 className="text-4xl font-bold text-text mb-2">
          Welcome back, {userName}! 👋
        </h1>
        <p className="text-subtle text-lg">
          Here's what's happening with your scheduling
        </p>
      </div>

      {/* Setup Alert (if not complete) */}
      {!hasSetup && (
        <div className="animate-fadeUp bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-start gap-4" style={{ animationDelay: '100ms' }}>
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">
              Complete your setup
            </h3>
            <p className="text-blue-700 text-sm mb-3">
              {eventsCount === 0 && "Create your first event type and "}
              {availabilityCount === 0 && "set your availability to "}
              start accepting bookings.
            </p>
            <div className="flex flex-wrap gap-3">
              {eventsCount === 0 && (
                <Link
                  href="/dashboard/events/new"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg
                           hover:bg-blue-700 transition-all duration-300 hover:-translate-y-0.5 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Create Event Type
                </Link>
              )}
              {availabilityCount === 0 && (
                <Link
                  href="/dashboard/availability"
                  className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg border border-blue-200
                           hover:bg-blue-50 transition-all duration-300 hover:-translate-y-0.5 text-sm font-medium"
                >
                  <Clock className="w-4 h-4" />
                  Set Availability
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Event Types Card */}
        <div className="animate-fadeUp" style={{ animationDelay: '150ms' }}>
          <div className="bg-white border border-border rounded-xl p-6 hover:shadow-lift transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-brand" />
              </div>
              <Link
                href="/dashboard/events"
                className="text-brand hover:text-brand-dark transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-5xl font-bold text-text mb-2">
              {eventsCount}
            </p>
            <p className="text-subtle mb-3">Active event types</p>
            <Link
              href="/dashboard/events"
              className="text-sm text-brand hover:text-brand-dark font-medium inline-flex items-center gap-1 group"
            >
              Manage events
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Availability Card */}
        <div className="animate-fadeUp" style={{ animationDelay: '200ms' }}>
          <div className="bg-white border border-border rounded-xl p-6 hover:shadow-lift transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <Link
                href="/dashboard/availability"
                className="text-brand hover:text-brand-dark transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="flex items-center gap-2 mb-2">
              {availabilityCount > 0 ? (
                <>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <p className="text-4xl font-bold text-text">Set</p>
                </>
              ) : (
                <>
                  <AlertCircle className="w-8 h-8 text-orange-500" />
                  <p className="text-4xl font-bold text-text">Not set</p>
                </>
              )}
            </div>
            <p className="text-subtle mb-3">Weekly schedule</p>
            <Link
              href="/dashboard/availability"
              className="text-sm text-brand hover:text-brand-dark font-medium inline-flex items-center gap-1 group"
            >
              {availabilityCount > 0 ? "Edit availability" : "Set availability"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Bookings Card */}
        <div className="animate-fadeUp" style={{ animationDelay: '250ms' }}>
          <div className="bg-white border border-border rounded-xl p-6 hover:shadow-lift transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <Link
                href="/dashboard/bookings"
                className="text-brand hover:text-brand-dark transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-5xl font-bold text-text mb-2">
              {recentBookings}
            </p>
            <p className="text-subtle mb-3">Bookings this month</p>
            <Link
              href="/dashboard/bookings"
              className="text-sm text-brand hover:text-brand-dark font-medium inline-flex items-center gap-1 group"
            >
              View all bookings
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="animate-fadeUp" style={{ animationDelay: '300ms' }}>
        <h2 className="text-2xl font-bold text-text mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/dashboard/events/new"
            className="bg-white border border-border rounded-xl p-5 hover:shadow-lift transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 text-brand" />
            </div>
            <h3 className="font-semibold text-text mb-1">New Event Type</h3>
            <p className="text-sm text-subtle">Create a new scheduling event</p>
          </Link>

          <Link
            href="/dashboard/availability"
            className="bg-white border border-border rounded-xl p-5 hover:shadow-lift transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-text mb-1">Edit Hours</h3>
            <p className="text-sm text-subtle">Update your availability</p>
          </Link>

          <Link
            href="/dashboard/bookings"
            className="bg-white border border-border rounded-xl p-5 hover:shadow-lift transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-text mb-1">View Bookings</h3>
            <p className="text-sm text-subtle">See upcoming meetings</p>
          </Link>

          <Link
            href="/dashboard/settings"
            className="bg-white border border-border rounded-xl p-5 hover:shadow-lift transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Settings className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="font-semibold text-text mb-1">Settings</h3>
            <p className="text-sm text-subtle">Configure your account</p>
          </Link>
        </div>
      </div>

      {/* Sharing Section */}
      {hasSetup && (
        <div className="animate-fadeUp bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6" style={{ animationDelay: '350ms' }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-text mb-2">
                🎉 Your scheduling page is ready!
              </h3>
              <p className="text-subtle mb-4">
                Share your link with others so they can book time with you
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <code className="bg-white px-4 py-2 rounded-lg border border-border text-sm text-text font-mono break-all">
                  {process.env.NEXT_PUBLIC_APP_URL || 'https://yoursite.com'}/{userSlug}
                </code>
                <CopyLinkButton userSlug={userSlug} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}