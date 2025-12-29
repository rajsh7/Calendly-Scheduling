"use client";

import { useEffect, useState } from "react";
import { Clock, Calendar, CheckCircle, AlertCircle, Copy, Zap, Sun, Moon } from "lucide-react";

const DAYS = [
  { name: "Sunday", short: "Sun", icon: "☀️" },
  { name: "Monday", short: "Mon", icon: "💼" },
  { name: "Tuesday", short: "Tue", icon: "💼" },
  { name: "Wednesday", short: "Wed", icon: "💼" },
  { name: "Thursday", short: "Thu", icon: "💼" },
  { name: "Friday", short: "Fri", icon: "💼" },
  { name: "Saturday", short: "Sat", icon: "🎉" },
];

type Slot = {
  day: number;
  startTime: string;
  endTime: string;
};

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/availability")
      .then((res) => res.json())
      .then((data) => {
        setSlots(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load availability");
        setLoading(false);
      });
  }, []);

  function updateSlot(day: number, field: "startTime" | "endTime", value: string) {
    setSlots((prev) => {
      const existing = prev.find((s) => s.day === day);
      if (existing) {
        return prev.map((s) =>
          s.day === day ? { ...s, [field]: value } : s
        );
      }
      return [...prev, { day, startTime: "09:00", endTime: "17:00" }];
    });
    setSaved(false);
  }

  function toggleDay(day: number) {
    setSlots((prev) =>
      prev.some((s) => s.day === day)
        ? prev.filter((s) => s.day !== day)
        : [...prev, { day, startTime: "09:00", endTime: "17:00" }]
    );
    setSaved(false);
  }

  function applyToAll() {
    if (slots.length === 0) return;
    const template = slots[0];
    const allDays = DAYS.map((_, index) => ({
      day: index,
      startTime: template.startTime,
      endTime: template.endTime,
    }));
    setSlots(allDays);
    setSaved(false);
  }

  function setWeekdays() {
    const weekdaySlots = [1, 2, 3, 4, 5].map(day => ({
      day,
      startTime: "09:00",
      endTime: "17:00",
    }));
    setSlots(weekdaySlots);
    setSaved(false);
  }

  async function saveAvailability() {
    setSaving(true);
    setError("");
    
    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slots),
      });

      if (!res.ok) {
        throw new Error("Failed to save");
      }

      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError("Failed to save availability");
      setSaving(false);
    }
  }

  const activeDaysCount = slots.length;
  const totalHours = slots.reduce((total, slot) => {
    const start = parseInt(slot.startTime.split(':')[0]);
    const end = parseInt(slot.endTime.split(':')[0]);
    return total + (end - start);
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-brand/30 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="animate-fadeUp">
        <h1 className="text-4xl font-bold text-text mb-2">
          Availability
        </h1>
        <p className="text-subtle text-lg">
          Set your weekly schedule and available hours
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Success Alert */}
      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">Availability saved successfully!</p>
        </div>
      )}

      {/* Stats & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeUp" style={{ animationDelay: '50ms' }}>
        {/* Stats */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand" />
            Your Schedule
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-subtle text-sm">Active days</span>
              <span className="font-bold text-xl text-text">{activeDaysCount}/7</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-subtle text-sm">Weekly hours</span>
              <span className="font-bold text-xl text-text">{totalHours}h</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-border rounded-xl p-6">
          <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-brand" />
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button
              onClick={setWeekdays}
              className="w-full flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg
                       hover:bg-muted hover:border-brand/30 transition-all duration-300
                       hover:-translate-y-0.5 text-sm font-medium"
            >
              <Copy className="w-4 h-4" />
              Set weekdays (9-5)
            </button>
            <button
              onClick={applyToAll}
              disabled={slots.length === 0}
              className="w-full flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg
                       hover:bg-muted hover:border-brand/30 transition-all duration-300
                       hover:-translate-y-0.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Copy className="w-4 h-4" />
              Apply first day to all
            </button>
          </div>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-3">
        {DAYS.map((day, dayIndex) => {
          const active = slots.find((s) => s.day === dayIndex);

          return (
            <div
              key={dayIndex}
              className={`bg-white border-2 rounded-xl p-6 transition-all duration-300
                         hover:shadow-lift hover:-translate-y-1 animate-fadeUp group
                         ${active ? 'border-brand/30 shadow-sm' : 'border-border'}`}
              style={{ animationDelay: `${(dayIndex + 2) * 40}ms` }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Day Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-3xl">{day.icon}</div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg text-text">
                        {day.name}
                      </h3>
                      {active && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    {active && (
                      <p className="text-sm text-subtle">
                        {active.startTime} - {active.endTime}
                      </p>
                    )}
                  </div>
                </div>

                {/* Toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!active}
                    onChange={() => toggleDay(dayIndex)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 
                               rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white 
                               after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white 
                               after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 
                               after:transition-all peer-checked:bg-brand"></div>
                </label>
              </div>

              {/* Time Inputs */}
              {active && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex items-center gap-2 flex-1">
                      <Sun className="w-4 h-4 text-subtle" />
                      <label className="text-sm font-medium text-subtle min-w-[60px]">
                        Start time
                      </label>
                      <input
                        type="time"
                        value={active.startTime}
                        onChange={(e) =>
                          updateSlot(dayIndex, "startTime", e.target.value)
                        }
                        className="flex-1 border border-border rounded-lg px-4 py-2.5 
                                 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                                 transition-all duration-300 hover:border-brand/30"
                      />
                    </div>

                    <div className="flex items-center gap-2 flex-1">
                      <Moon className="w-4 h-4 text-subtle" />
                      <label className="text-sm font-medium text-subtle min-w-[60px]">
                        End time
                      </label>
                      <input
                        type="time"
                        value={active.endTime}
                        onChange={(e) =>
                          updateSlot(dayIndex, "endTime", e.target.value)
                        }
                        className="flex-1 border border-border rounded-lg px-4 py-2.5
                                 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                                 transition-all duration-300 hover:border-brand/30"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex gap-3 animate-fadeUp sticky bottom-6 bg-white/80 backdrop-blur-lg border border-border rounded-xl p-4 shadow-lift"
           style={{ animationDelay: `${(DAYS.length + 2) * 40}ms` }}>
        <button
          onClick={saveAvailability}
          disabled={saving || slots.length === 0}
          className="flex-1 bg-brand text-white px-6 py-3.5 rounded-lg font-medium
                     hover:bg-brand-dark transition-all duration-300
                     hover:-translate-y-0.5 hover:shadow-xl
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Saved!
            </>
          ) : (
            <>
              <Clock className="w-5 h-5" />
              Save availability
            </>
          )}
        </button>

        {slots.length > 0 && (
          <button
            onClick={() => setSlots([])}
            className="px-6 py-3.5 border-2 border-red-200 text-red-600 rounded-lg font-medium
                     hover:bg-red-50 transition-all duration-300 hover:-translate-y-0.5"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Help Text */}
      <div className="bg-muted border border-border rounded-xl p-6 animate-fadeUp" 
           style={{ animationDelay: `${(DAYS.length + 3) * 40}ms` }}>
        <h3 className="font-semibold text-text mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand" />
          Tips for setting availability
        </h3>
        <ul className="space-y-2 text-sm text-subtle">
          <li className="flex items-start gap-2">
            <span className="text-brand mt-0.5">•</span>
            <span>Toggle days on/off to control which days you're available for meetings</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand mt-0.5">•</span>
            <span>Set different hours for each day to match your schedule</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand mt-0.5">•</span>
            <span>Use quick actions to set up common schedules quickly</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand mt-0.5">•</span>
            <span>Remember to save your changes before leaving the page</span>
          </li>
        </ul>
      </div>
    </div>
  );
}