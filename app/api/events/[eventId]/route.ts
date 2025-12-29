// app/api/events/[eventId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    eventId: string;
  }>;
};

// GET - Fetch single event
export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { eventId } = await context.params;

    const event = await prisma.eventType.findUnique({
      where: {
        id: eventId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Check if user owns this event
    if (event.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      id: event.id,
      title: event.title,
      description: event.description,
      duration: event.duration,
      slug: event.slug,
      createdAt: event.createdAt,
    });
  } catch (error) {
    console.error("GET /api/events/[eventId] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update event
export async function PUT(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { eventId } = await context.params;
    const body = await req.json();
    const { title, description, duration, slug } = body;

    // Validate required fields
    if (!title || !slug || !duration) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if event exists and belongs to user
    const existingEvent = await prisma.eventType.findUnique({
      where: { id: eventId },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    if (existingEvent.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Check if slug is already taken by another event of this user
    if (slug !== existingEvent.slug) {
      const slugExists = await prisma.eventType.findFirst({
        where: {
          slug,
          userId: existingEvent.userId,
          id: { not: eventId },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Slug already in use" },
          { status: 400 }
        );
      }
    }

    // Update event
    const updatedEvent = await prisma.eventType.update({
      where: { id: eventId },
      data: {
        title,
        description: description || null,
        duration: Number(duration),
        slug,
      },
    });

    return NextResponse.json({
      id: updatedEvent.id,
      title: updatedEvent.title,
      description: updatedEvent.description,
      duration: updatedEvent.duration,
      slug: updatedEvent.slug,
    });
  } catch (error) {
    console.error("PUT /api/events/[eventId] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete event
export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { eventId } = await context.params;

    // Check if event exists and belongs to user
    const event = await prisma.eventType.findUnique({
      where: { id: eventId },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    if (event.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Delete associated bookings first (if you want to prevent deletion if bookings exist, add a check here)
    await prisma.booking.deleteMany({
      where: { eventTypeId: eventId },
    });

    // Delete the event
    await prisma.eventType.delete({
      where: { id: eventId },
    });

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/events/[eventId] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}