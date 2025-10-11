import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password, email, full_name } = body;

    if (!username || !password || !email || !full_name) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists (by username or email)
    const existingUser = await prisma.systemUser.findFirst({
      where: {
        OR: [
          { username },
          { email },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this username or email already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.systemUser.create({
      data: {
        username,
        email,
        full_name,
        password_hash: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", user: newUser },
      { status: 201 }
    );
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
