type Availability = {
  startTime: string; // "09:00"
  endTime: string;   // "17:00"
};

type Booking = {
  startTime: string; // "10:00"
  endTime: string;   // "10:30"
};

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function toTime(m: number) {
  const h = Math.floor(m / 60).toString().padStart(2, "0");
  const min = (m % 60).toString().padStart(2, "0");
  return `${h}:${min}`;
}

export function generateSlots(
  availability: Availability,
  duration: number,
  bookings: Booking[]
) {
  const slots: { start: string; end: string }[] = [];

  const start = toMinutes(availability.startTime);
  const end = toMinutes(availability.endTime);

  for (let t = start; t + duration <= end; t += duration) {
    const slotStart = t;
    const slotEnd = t + duration;

    const overlaps = bookings.some((b) => {
      const bStart = toMinutes(b.startTime);
      const bEnd = toMinutes(b.endTime);
      return slotStart < bEnd && slotEnd > bStart;
    });

    if (!overlaps) {
      slots.push({
        start: toTime(slotStart),
        end: toTime(slotEnd),
      });
    }
  }

  return slots;
}
