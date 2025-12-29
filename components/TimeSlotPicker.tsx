"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, CheckCircle } from "lucide-react";

type Availability = {
  id: string;
  day: number;
  startTime: string;
  endTime: string;
};

type Props = {
  username: string;
  eventSlug: string;
  date: string;
  duration: number;
  availability: Availability[];
};

export function TimeSlotPicker({ username, eventSlug, date, duration, availability }: Props) {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const generateTimeSlots = () => {
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();
    
    const dayAvailability = availability.find(a => a.day === dayOfWeek);
    if (!dayAvailability) return [];

    const slots: string[] = [];
    const [startHour, startMin] = dayAvailability.startTime.split(':').map(Number);
    const [endHour, endMin] = dayAvailability.endTime.split(':').map(Number);

    let currentTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    while (currentTime + duration <= endTime) {
      const hours = Math.floor(currentTime / 60);
      const mins = currentTime % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      slots.push(timeString);
      currentTime += 30; // 30-minute intervals
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const formatTime = (time: string) => {
    const [hours, mins] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    if (!selectedTime) return;
    // Navigate to booking form with date and time
    router.push(`/${username}/${eventSlug}/book?date=${date}&time=${selectedTime}`);
  };

  if (timeSlots.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-text mb-2">No available times</h3>
        <p className="text-subtle">Please select a different date</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Slots Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2
                    scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {timeSlots.map((time, index) => (
          <button
            key={time}
            onClick={() => handleTimeSelect(time)}
            className={`
              relative p-4 rounded-xl border-2 font-medium transition-all duration-300
              hover:-translate-y-1 hover:shadow-md
              animate-fadeUp
              ${selectedTime === time
                ? 'border-brand bg-blue-50 text-brand shadow-md'
                : 'border-border bg-white hover:border-brand/50'
              }
            `}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatTime(time)}</span>
            </div>
            {selectedTime === time && (
              <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-brand" />
            )}
          </button>
        ))}
      </div>

      {/* Confirm Button */}
      {selectedTime && (
        <div className="sticky bottom-0 bg-white pt-6 border-t border-border animate-fadeIn">
          <button
            onClick={handleConfirm}
            className="w-full bg-brand text-white py-4 rounded-xl font-semibold
                     hover:bg-brand-dark transition-all duration-300
                     hover:-translate-y-1 hover:shadow-xl
                     flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Confirm {formatTime(selectedTime)}
          </button>
        </div>
      )}

      {/* Info */}
      <div className="text-center text-sm text-subtle">
        <p>Showing {timeSlots.length} available time slots</p>
      </div>
    </div>
  );
}