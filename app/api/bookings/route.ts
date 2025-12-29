import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      username,
      slug,
      date,
      startTime,
      endTime,
      guestName,
      guestEmail,
    } = body;

    // 🔒 VALIDATION
    if (
      !username ||
      !slug ||
      !date ||
      !startTime ||
      !endTime ||
      !guestName ||
      !guestEmail
    ) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // ✅ FIND USER BY USERNAME (CASE-INSENSITIVE)
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username.trim(),
          mode: "insensitive",
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ✅ FIND EVENT
    const event = await prisma.eventType.findFirst({
      where: {
        slug,
        userId: user.id,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const bookingDate = new Date(date);

    // 🔥 DUPLICATE BOOKING CHECK
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: user.id,
        date: bookingDate,
        startTime,
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "This booking already exists" },
        { status: 409 }
      );
    }

    // ✅ CREATE BOOKING
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
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
