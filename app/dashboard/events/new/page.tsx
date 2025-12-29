"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, FileText, ArrowLeft, Sparkles, CheckCircle, AlertCircle } from "lucide-react";

export default function NewEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    duration: 30,
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create event");
        setIsLoading(false);
        return;
      }

      // Success - redirect to events page
      router.push("/dashboard/events");
    } catch (err) {
      setError("Network error. Please try again.");
      setIsLoading(false);
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
            Create Event Type
          </h1>
        </div>
        <p className="text-subtle text-lg">
          Set up a new meeting type that others can book
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
          {/* Event Name */}
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
              <div className="flex items-center gap-2 text-sm text-brand font-medium">
                <Clock className="w-4 h-4" />
                {formData.duration} minutes
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
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
              disabled={isLoading || !formData.title}
              className="flex-1 bg-brand text-white px-6 py-3 rounded-lg font-medium
                       hover:bg-brand-dark transition-all duration-300
                       hover:-translate-y-0.5 hover:shadow-lg
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Create Event Type
                </>
              )}
            </button>
          </div>
        </form>
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
            <span>Use clear, professional names like "Product Demo" or "Consultation Call"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand mt-0.5">•</span>
            <span>Add a description to help people understand what the meeting is about</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand mt-0.5">•</span>
            <span>Choose a duration that includes buffer time for introductions and wrap-up</span>
          </li>
        </ul>
      </div>
    </div>
  );
}