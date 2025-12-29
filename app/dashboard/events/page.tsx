import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Plus, Settings, ExternalLink, Copy } from "lucide-react";
import { CopyEventLinkButton } from "@/components/CopyEventLinkButton";

export default async function EventsPage() {
  const session = await getAuthSession();
  if (!session?.user?.email) redirect("/login");

  const events = await prisma.eventType.findMany({
  where: {
    user: {
      email: session.user.email,
    },
  },
      select: {
        id: true,
        title: true,
        description: true, // ✅ ADD THIS
        duration: true,
        slug: true,
        userId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });


  const userSlug = session.user.email.split('@')[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeUp">
        <div>
          <h1 className="text-4xl font-bold text-text mb-2">
            Event Types
          </h1>
          <p className="text-subtle text-lg">
            Create and manage your meeting types
          </p>
        </div>

        <Link
          href="/dashboard/events/new"
          className="bg-brand text-white px-6 py-3 rounded-lg font-medium
                     hover:bg-brand-dark transition-all duration-300
                     hover:-translate-y-0.5 hover:shadow-lg
                     flex items-center gap-2 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          New Event Type
        </Link>
      </div>

      {/* Empty State */}
      {events.length === 0 ? (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-border rounded-2xl p-12 text-center shadow-soft animate-fadeUp" style={{ animationDelay: '100ms' }}>
          <div className="w-20 h-20 bg-white rounded-2xl shadow-soft flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-brand" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-3">
            No event types yet
          </h2>
          <p className="text-subtle mb-6 max-w-md mx-auto">
            Create your first event type to start accepting bookings. Define your meeting duration, availability, and more.
          </p>
          <Link
            href="/dashboard/events/new"
            className="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-lg
                       hover:bg-brand-dark transition-all duration-300
                       hover:-translate-y-0.5 hover:shadow-lg font-medium"
          >
            <Plus className="w-5 h-5" />
            Create your first event
          </Link>
        </div>
      ) : (
        /* Event Cards Grid */
        <>
          <div className="grid gap-5">
            {events.map((event, index) => (
              <div
                key={event.id}
                className="bg-white border border-border rounded-xl p-6
                           flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4
                           shadow-soft transition-all duration-300
                           hover:shadow-lift hover:-translate-y-1
                           animate-fadeUp group"
                style={{ animationDelay: `${(index + 1) * 50}ms` }}
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0
                                group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-6 h-6 text-brand" />
                  </div>

                  {/* Event Info */}
                  <div className="flex-1">
                    <h2 className="font-bold text-xl text-text mb-1 group-hover:text-brand transition-colors">
                      {event.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-subtle">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{event.duration} minutes</span>
                      </div>
                      {event.description && (
                        <span className="hidden sm:inline">• {event.description}</span>
                      )}
                    </div>

                    {/* Event Link */}
                    <div className="mt-3 flex items-center gap-2">
                      <code className="text-xs bg-gray-100 px-3 py-1.5 rounded-lg text-gray-700 font-mono">
                        /{userSlug}/{event.slug}
                      </code>
                      <CopyEventLinkButton userSlug={userSlug} eventSlug={event.slug} />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Link
                    href={`/${userSlug}/${event.slug}`}
                    target="_blank"
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg
                             hover:bg-muted hover:border-brand/30 transition-all duration-300
                             hover:-translate-y-0.5 text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View
                  </Link>
                  <Link
                    href={`/dashboard/events/${event.id}/edit`}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-brand text-white rounded-lg
                             hover:bg-brand-dark transition-all duration-300
                             hover:-translate-y-0.5 text-sm font-medium"
                  >
                    <Settings className="w-4 h-4" />
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Footer */}
          <div className="bg-muted border border-border rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeUp" style={{ animationDelay: `${(events.length + 1) * 50}ms` }}>
            <div className="text-center sm:text-left">
              <p className="text-sm text-subtle mb-1">Total Event Types</p>
              <p className="text-3xl font-bold text-text">{events.length}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-2 bg-white rounded-lg border border-border">
                <p className="text-xs text-subtle mb-0.5">Active</p>
                <p className="text-xl font-bold text-green-600">{events.length}</p>
              </div>
              <div className="text-center px-4 py-2 bg-white rounded-lg border border-border">
                <p className="text-xs text-subtle mb-0.5">Draft</p>
                <p className="text-xl font-bold text-gray-400">0</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}