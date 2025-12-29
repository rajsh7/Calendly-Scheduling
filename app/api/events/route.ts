import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import slugify from "slugify";

export async function POST(req: Request) {
  const session = await getAuthSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, duration } = await req.json();

  if (!title || !duration) {
    return NextResponse.json(
      { error: "Title and duration required" },
      { status: 400 }
    );
  }

  const slug = slugify(title, { lower: true });

  const event = await prisma.eventType.create({
    data: {
      title,
      duration,
      slug,
      user: {
        connect: { email: session.user.email },
      },
    },
  });

  return NextResponse.json(event);
}

export async function GET() {
  const session = await getAuthSession();

  if (!session?.user?.email) {
    return NextResponse.json([], { status: 200 });
  }

  const events = await prisma.eventType.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(events);
}

