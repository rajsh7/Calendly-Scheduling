import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.email) {
    return NextResponse.json([], { status: 200 });
  }

  const availability = await prisma.availability.findMany({
    where: {
      user: { email: session.user.email },
    },
    orderBy: { day: "asc" },
  });

  return NextResponse.json(availability);
}

export async function POST(req: Request) {
  const session = await getAuthSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data: {
    day: number;
    startTime: string;
    endTime: string;
  }[] = await req.json();

  // 🔑 Get userId safely
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  // Clear old availability
  await prisma.availability.deleteMany({
    where: { userId: user.id },
  });

  // Save new availability
  await prisma.availability.createMany({
    data: data.map((slot) => ({
      day: slot.day,
      startTime: slot.startTime,
      endTime: slot.endTime,
      userId: user.id,
    })),
  });

  return NextResponse.json({ success: true });
}
