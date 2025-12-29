import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const { name, email, username, password } = await req.json();

  if (!name || !email || !username || !password) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const exists = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (exists) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      username,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ success: true });
}
