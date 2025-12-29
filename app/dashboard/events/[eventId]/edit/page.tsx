"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, FileText, Link2, ArrowLeft, Save, Trash2, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

export default function EditEventPage() {
  const { eventId } = useParams() as { eventId: string };
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 30,
    slug: "",
  });

  // Fetch existing event
  useEffect(() => {
    fetch(`/api/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setFormData({
          title: data.title,
          description: data.description || "",
          duration: data.duration,
          slug: data.slug,
        });
      })
      .catch(() => setError("Failed to load event"))
      .finally(() => setLoading(false));
  }, [eventId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Update failed");
        setSaving(false);
        return;
      }

      router.push("/dashboard/events");
    } catch (err) {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Delete failed");
        setDeleting(false);
        return;
      }

      router.push("/dashboard/events");
    } catch (err) {
      setError("Network error. Please try again.");
      setDeleting(false);
    }
  }

  const durationOptions = [
    { value: 15, label: "15 minutes", icon: "⚡" },
    { value: 30, label: "30 minutes", icon: "⏱️" },
    { value: 45, label: "45 minutes", icon: "⏰" },
    { value: 60, label: "1 hour", icon: "🕐" },
    { value: 90, label: "1.5 hours", icon: "🕐" },
    { value: 120, label: "2 hours", icon: "🕑" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand/30 border-t-brand rounded-full animate-spin mx-auto mb-4" />
          <p className="text-subtle">Loading event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <div className="animate-fadeUp">
        <Link
          href="/dashboard/events"
          className="inline-flex items-center gap-2 text-subtle hover:text-brand transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to events
        </Link>
      </div>

      {/* Header */}
      <div className="animate-fadeUp" style={{ animationDelay: '50ms' }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-brand" />
          </div>
          <h1 className="text-4xl font-bold text-text">
            Edit Event Type
          </h1>
        </div>
        <p className="text-subtle text-lg">
          Update your event details and settings
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-border rounded-2xl p-8 shadow-soft animate-fadeUp" style={{ animationDelay: '100ms' }}>
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Title */}
          <div className="group">
            <label htmlFor="title" className="block text-sm font-semibold text-text mb-2">
              Event name *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle group-focus-within:text-brand transition-colors" />
              <input
                id="title"
                type="text"
                className="w-full pl-11 pr-4 py-3 border border-border rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                         transition-all duration-300 bg-white
                         hover:border-brand/30"
                placeholder="30 Minute Meeting"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <p className="text-xs text-subtle mt-1.5">
              Choose a clear, descriptive name for your meeting type
            </p>
          </div>

          {/* Event Slug */}
          <div className="group">
            <label htmlFor="slug" className="block text-sm font-semibold text-text mb-2">
              URL slug *
            </label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-subtle group-focus-within:text-brand transition-colors" />
              <input
                id="slug"
                type="text"
                className="w-full pl-11 pr-4 py-3 border border-border rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                         transition-all duration-300 bg-white font-mono
                         hover:border-brand/30"
                placeholder="30-min-meeting"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>
            <p className="text-xs text-subtle mt-1.5">
              This will be used in your booking URL (lowercase, hyphens only)
            </p>
          </div>

          {/* Description */}
          <div className="group">
            <label htmlFor="description" className="block text-sm font-semibold text-text mb-2">
              Description
              <span className="text-subtle font-normal ml-1">(optional)</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-subtle group-focus-within:text-brand transition-colors" />
              <textarea
                id="description"
                className="w-full pl-11 pr-4 py-3 border border-border rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                         transition-all duration-300 bg-white
                         hover:border-brand/30 resize-none"
                placeholder="Brief description of what this meeting is about..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-semibold text-text mb-3">
              Duration *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {durationOptions.map((option) => (
                <label
                  key={option.value}
                  className={`relative flex items-center justify-center gap-2 p-4 border-2 rounded-xl cursor-pointer
                           transition-all duration-300 hover:-translate-y-0.5
                           ${
                             formData.duration === option.value
                               ? 'border-brand bg-blue-50 shadow-md'
                               : 'border-border hover:border-brand/30 hover:bg-muted'
                           }`}
                >
                  <input
                    type="radio"
                    name="duration"
                    value={option.value}
                    checked={formData.duration === option.value}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="sr-only"
                  />
                  <span className="text-2xl">{option.icon}</span>
                  <div className="text-left">
                    <div className={`font-semibold ${formData.duration === option.value ? 'text-brand' : 'text-text'}`}>
                      {option.label}
                    </div>
                  </div>
                  {formData.duration === option.value && (
                    <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-brand" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-text mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand" />
              Preview
            </h3>
            <div className="bg-white rounded-lg p-4 border border-border">
              <h4 className="font-bold text-lg text-text mb-1">
                {formData.title || "Event Name"}
              </h4>
              <p className="text-sm text-subtle mb-2">
                {formData.description || "No description provided"}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-brand font-medium">
                  <Clock className="w-4 h-4" />
                  {formData.duration} minutes
                </div>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                  /{formData.slug || "slug"}
                </code>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-border rounded-lg font-medium
                       hover:bg-muted transition-all duration-300
                       hover:-translate-y-0.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !formData.title || !formData.slug}
              className="flex-1 bg-brand text-white px-6 py-3 rounded-lg font-medium
                       hover:bg-brand-dark transition-all duration-300
                       hover:-translate-y-0.5 hover:shadow-lg
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="mt-8 pt-8 border-t border-red-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-red-600 mb-1">Danger Zone</h3>
              <p className="text-sm text-subtle">
                Once deleted, this event cannot be recovered
              </p>
            </div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium
                       hover:bg-red-700 transition-all duration-300
                       hover:-translate-y-0.5 hover:shadow-lg
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center gap-2"
            >
              {deleting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  Delete Event
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-muted border border-border rounded-xl p-5 animate-fadeUp" style={{ animationDelay: '150ms' }}>
        <h3 className="font-semibold text-text mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand" />
          Pro Tips
        </h3>
        <ul className="space-y-2 text-sm text-subtle">
          <li className="flex items-start gap-2">
            <span className="text-brand mt-0.5">•</span>
            <span>Changes will affect all future bookings, not existing ones</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand mt-0.5">•</span>
            <span>Changing the slug will update your booking URL</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand mt-0.5">•</span>
            <span>Keep descriptions concise to help people understand your meeting quickly</span>
          </li>
        </ul>
      </div>
    </div>
  );
}