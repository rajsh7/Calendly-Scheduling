import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Body = {
  username: string;
  slug: string;
  date: string;      // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  guestName: string;
  guestEmail: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  const {
    username,
    slug,
    date,
    startTime,
    endTime,
    guestName,
    guestEmail,
  } = body;

  if (
    !username ||
    !slug ||
    !date ||
    !startTime ||
    !endTime ||
    !guestName ||
    !guestEmail
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const event = await prisma.eventType.findFirst({
    where: { slug, userId: user.id },
    select: { id: true },
  });
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  const bookingDate = new Date(date);

  // ❗ Prevent double booking (overlap check)
  const conflict = await prisma.booking.findFirst({
    where: {
      userId: user.id,
      date: bookingDate,
      AND: [
        { startTime: { lt: endTime } },
        { endTime: { gt: startTime } },
      ],
    },
  });

  if (conflict) {
    return NextResponse.json(
      { error: "Slot already booked" },
      { status: 409 }
    );
  }

  const booking = await prisma.booking.create({
    data: {
      date: bookingDate,
      startTime,
      endTime,
      guestName,
      guestEmail,
      userId: user.id,
      eventTypeId: event.id,
    },
  });

  return NextResponse.json(booking, { status: 201 });
}
