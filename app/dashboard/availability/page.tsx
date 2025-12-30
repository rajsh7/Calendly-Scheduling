"use client";

import { useEffect, useState } from "react";
import { Clock, Calendar, CheckCircle, AlertCircle, Copy, Zap, Sun, Moon, Plus, Trash2, Coffee } from "lucide-react";

const DAYS = [
  { name: "Sunday", short: "Sun", icon: "☀️" },
  { name: "Monday", short: "Mon", icon: "💼" },
  { name: "Tuesday", short: "Tue", icon: "💼" },
  { name: "Wednesday", short: "Wed", icon: "💼" },
  { name: "Thursday", short: "Thu", icon: "💼" },
  { name: "Friday", short: "Fri", icon: "💼" },
  { name: "Saturday", short: "Sat", icon: "🎉" },
];

type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
};

type DayAvailability = {
  day: number;
  enabled: boolean;
  slots: TimeSlot[];
};

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/availability")
      .then((res) => res.json())
      .then((data) => {
        // Convert old format to new format
        const daysMap = new Map<number, TimeSlot[]>();
        
        data.forEach((slot: any) => {
          if (!daysMap.has(slot.day)) {
            daysMap.set(slot.day, []);
          }
          daysMap.get(slot.day)!.push({
            id: slot.id || crypto.randomUUID(),
            startTime: slot.startTime,
            endTime: slot.endTime,
          });
        });

        const newAvailability = DAYS.map((_, index) => ({
          day: index,
          enabled: daysMap.has(index),
          slots: daysMap.get(index) || [],
        }));

        setAvailability(newAvailability);
        setLoading(false);
      })
      .catch(() => {
        // Initialize empty if fetch fails
        setAvailability(
          DAYS.map((_, index) => ({
            day: index,
            enabled: false,
            slots: [],
          }))
        );
        setLoading(false);
      });
  }, []);

  const toggleDay = (dayIndex: number) => {
    setAvailability((prev) =>
      prev.map((day) => {
        if (day.day === dayIndex) {
          if (day.enabled) {
            // Disabling - clear slots
            return { ...day, enabled: false, slots: [] };
          } else {
            // Enabling - add default slot
            return {
              ...day,
              enabled: true,
              slots: [{ id: crypto.randomUUID(), startTime: "09:00", endTime: "17:00" }],
            };
          }
        }
        return day;
      })
    );
    setSaved(false);
  };

  const addSlot = (dayIndex: number) => {
    setAvailability((prev) =>
      prev.map((day) => {
        if (day.day === dayIndex && day.enabled) {
          const lastSlot = day.slots[day.slots.length - 1];
          const newStartTime = lastSlot ? lastSlot.endTime : "09:00";
          
          return {
            ...day,
            slots: [
              ...day.slots,
              { id: crypto.randomUUID(), startTime: newStartTime, endTime: "17:00" },
            ],
          };
        }
        return day;
      })
    );
    setSaved(false);
  };

  const removeSlot = (dayIndex: number, slotId: string) => {
    setAvailability((prev) =>
      prev.map((day) => {
        if (day.day === dayIndex) {
          const newSlots = day.slots.filter((s) => s.id !== slotId);
          return {
            ...day,
            slots: newSlots,
            enabled: newSlots.length > 0,
          };
        }
        return day;
      })
    );
    setSaved(false);
  };

  const updateSlot = (
    dayIndex: number,
    slotId: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setAvailability((prev) =>
      prev.map((day) => {
        if (day.day === dayIndex) {
          return {
            ...day,
            slots: day.slots.map((slot) =>
              slot.id === slotId ? { ...slot, [field]: value } : slot
            ),
          };
        }
        return day;
      })
    );
    setSaved(false);
  };

  const validateAvailability = (): string | null => {
    for (const day of availability) {
      if (!day.enabled) continue;

      // Check if slots exist
      if (day.slots.length === 0) {
        return `${DAYS[day.day].name} is enabled but has no time slots`;
      }

      for (let i = 0; i < day.slots.length; i++) {
        const slot = day.slots[i];
        const startMins = timeToMinutes(slot.startTime);
        const endMins = timeToMinutes(slot.endTime);

        // Check if end time is after start time
        if (endMins <= startMins) {
          return `${DAYS[day.day].name}: End time must be after start time in slot ${i + 1}`;
        }

        // Check minimum slot duration (15 minutes)
        if (endMins - startMins < 15) {
          return `${DAYS[day.day].name}: Slot ${i + 1} must be at least 15 minutes long`;
        }

        // Check for overlapping slots
        for (let j = i + 1; j < day.slots.length; j++) {
          const nextSlot = day.slots[j];
          const nextStartMins = timeToMinutes(nextSlot.startTime);
          const nextEndMins = timeToMinutes(nextSlot.endTime);

          if (
            (startMins < nextEndMins && endMins > nextStartMins) ||
            (nextStartMins < endMins && nextEndMins > startMins)
          ) {
            return `${DAYS[day.day].name}: Slots ${i + 1} and ${j + 1} overlap`;
          }
        }
      }
    }

    return null;
  };

  const timeToMinutes = (time: string): number => {
    const [hours, mins] = time.split(":").map(Number);
    return hours * 60 + mins;
  };

  const applyToAll = () => {
    const firstEnabledDay = availability.find((d) => d.enabled);
    if (!firstEnabledDay || firstEnabledDay.slots.length === 0) {
      setError("Enable and configure at least one day first");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setAvailability((prev) =>
      prev.map((day) => ({
        ...day,
        enabled: true,
        slots: firstEnabledDay.slots.map((s) => ({
          ...s,
          id: crypto.randomUUID(),
        })),
      }))
    );
    setSaved(false);
  };

  const setWeekdays = () => {
    setAvailability((prev) =>
      prev.map((day) => {
        if (day.day >= 1 && day.day <= 5) {
          return {
            ...day,
            enabled: true,
            slots: [
              { id: crypto.randomUUID(), startTime: "09:00", endTime: "12:00" },
              { id: crypto.randomUUID(), startTime: "13:00", endTime: "17:00" },
            ],
          };
        }
        return { ...day, enabled: false, slots: [] };
      })
    );
    setSaved(false);
  };

  async function saveAvailability() {
    setSaving(true);
    setError("");

    // Validate before saving
    const validationError = validateAvailability();
    if (validationError) {
      setError(validationError);
      setSaving(false);
      return;
    }

    // Convert to API format
    const slotsToSave = availability
      .filter((day) => day.enabled && day.slots.length > 0)
      .flatMap((day) =>
        day.slots.map((slot) => ({
          day: day.day,
          startTime: slot.startTime,
          endTime: slot.endTime,
        }))
      );

    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slotsToSave),
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

  const activeDaysCount = availability.filter((d) => d.enabled).length;
  const totalSlots = availability.reduce((sum, day) => sum + day.slots.length, 0);
  const totalHours = availability.reduce((sum, day) => {
    return (
      sum +
      day.slots.reduce((slotSum, slot) => {
        const start = timeToMinutes(slot.startTime);
        const end = timeToMinutes(slot.endTime);
        return slotSum + (end - start) / 60;
      }, 0)
    );
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
        <h1 className="text-4xl font-bold text-text mb-2">Availability</h1>
        <p className="text-subtle text-lg">
          Set your weekly schedule with flexible time slots and breaks
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeUp" style={{ animationDelay: "50ms" }}>
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
              <span className="text-subtle text-sm">Total time slots</span>
              <span className="font-bold text-xl text-text">{totalSlots}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-subtle text-sm">Weekly hours</span>
              <span className="font-bold text-xl text-text">{totalHours.toFixed(1)}h</span>
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
              <Coffee className="w-4 h-4" />
              Weekdays 9-5 (with lunch break)
            </button>
            <button
              onClick={applyToAll}
              disabled={activeDaysCount === 0}
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
          const dayData = availability.find((d) => d.day === dayIndex);
          if (!dayData) return null;

          return (
            <div
              key={dayIndex}
              className={`bg-white border-2 rounded-xl p-6 transition-all duration-300
                         hover:shadow-lift hover:-translate-y-1 animate-fadeUp group
                         ${dayData.enabled ? "border-brand/30 shadow-sm" : "border-border"}`}
              style={{ animationDelay: `${(dayIndex + 2) * 40}ms` }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                {/* Day Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-3xl">{day.icon}</div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg text-text">{day.name}</h3>
                      {dayData.enabled && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          {dayData.slots.length} slot{dayData.slots.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    {dayData.enabled && dayData.slots.length > 0 && (
                      <p className="text-sm text-subtle">
                        {dayData.slots.map((s) => `${s.startTime}-${s.endTime}`).join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dayData.enabled}
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

              {/* Time Slots */}
              {dayData.enabled && (
                <div className="space-y-3 pt-4 border-t border-border">
                  {dayData.slots.map((slot, slotIndex) => (
                    <div
                      key={slot.id}
                      className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
                        <Sun className="w-4 h-4 text-subtle flex-shrink-0" />
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) =>
                            updateSlot(dayIndex, slot.id, "startTime", e.target.value)
                          }
                          className="flex-1 border border-border rounded-lg px-3 py-2
                                   focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                                   transition-all duration-300 hover:border-brand/30"
                        />
                      </div>

                      <span className="text-subtle text-sm sm:mx-2">to</span>

                      <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
                        <Moon className="w-4 h-4 text-subtle flex-shrink-0" />
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) =>
                            updateSlot(dayIndex, slot.id, "endTime", e.target.value)
                          }
                          className="flex-1 border border-border rounded-lg px-3 py-2
                                   focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent
                                   transition-all duration-300 hover:border-brand/30"
                        />
                      </div>

                      <button
                        onClick={() => removeSlot(dayIndex, slot.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        title="Remove slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addSlot(dayIndex)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-brand/30 rounded-lg
                             hover:bg-blue-50 hover:border-brand transition-all duration-300 text-brand font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add time slot (e.g., for split shifts or breaks)
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div
        className="flex gap-3 animate-fadeUp sticky bottom-6 bg-white/80 backdrop-blur-lg border border-border rounded-xl p-4 shadow-lift"
        style={{ animationDelay: `${(DAYS.length + 2) * 40}ms` }}
      >
        <button
          onClick={saveAvailability}
          disabled={saving || activeDaysCount === 0}
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

        {activeDaysCount > 0 && (
          <button
            onClick={() => setAvailability(DAYS.map((_, i) => ({ day: i, enabled: false, slots: [] })))}
            className="px-6 py-3.5 border-2 border-red-200 text-red-600 rounded-lg font-medium
                     hover:bg-red-50 transition-all duration-300 hover:-translate-y-0.5"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Help Text */}
      <div
        className="bg-muted border border-border rounded-xl p-6 animate-fadeUp"
        style={{ animationDelay: `${(DAYS.length + 3) * 40}ms` }}
      >
        <h3 className="font-semibold text-text mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand" />
          How to use flexible scheduling
        </h3>
        <ul className="space-y-2 text-sm text-subtle">
          <li className="flex items-start gap-2">
            <span className="text-brand mt-0.5">•</span>
            <span>
              <strong>Multiple time slots:</strong> Add separate slots for morning/afternoon or to block
              lunch breaks
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand mt-0.5">•</span>
            <span>
              <strong>Example:</strong> 9:00-12:00, 13:00-17:00 (blocks 12-1pm for lunch)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand mt-0.5">•</span>
            <span>
              <strong>Validation:</strong> Slots can't overlap and must be at least 15 minutes long
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand mt-0.5">•</span>
            <span>
              <strong>Quick setup:</strong> Use "Weekdays 9-5" to set Mon-Fri with automatic lunch break
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}