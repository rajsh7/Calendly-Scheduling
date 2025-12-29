import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateSlots } from "@/lib/slots";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const username = searchParams.get("username");
    const slug = searchParams.get("slug");
    const dateStr = searchParams.get("date");

    if (!username || !slug || !dateStr) {
      return NextResponse.json([]);
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) return NextResponse.json([]);

    const event = await prisma.eventType.findFirst({
      where: { slug, userId: user.id },
    });

    if (!event) return NextResponse.json([]);

    // ✅ TIMEZONE-SAFE DATE
    const startOfDay = new Date(`${dateStr}T00:00:00Z`);
    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

    // ✅ USE UTC DAY
    const day = startOfDay.getUTCDay();

    const availability = await prisma.availability.findFirst({
      where: {
        userId: user.id,
        day,
      },
    });

    if (!availability) return NextResponse.json([]);

    const bookings = await prisma.booking.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    const slots = generateSlots(
      {
        startTime: availability.startTime,
        endTime: availability.endTime,
      },
      event.duration,
      bookings
    );

    return NextResponse.json(slots);
  } catch (error) {
    console.error("Slots API error:", error);
    return NextResponse.json([]);
  }
}
