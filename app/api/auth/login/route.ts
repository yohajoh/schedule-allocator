import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/prisma/client"; // ✅ Make sure path matches your actual file

export async function POST(req: Request) {
  try {
    console.log("✅ Login route hit — request received");

    const body = await req.json();
    console.log("🟩 Incoming body:", body);

    const { email, password } = body;

    if (!email || !password) {
      console.warn("⚠️ Missing email or password in request");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("🔍 Checking user in database for email:", email);
    const user = await prisma.systemUser.findUnique({
      where: { email },
    });

    if (!user) {
      console.warn("❌ No user found with this email:", email);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    console.log("✅ User found:", {
      id: user.user_id,
      email: user.email,
      full_name: user.full_name,
      password_hash: user.password_hash // Masking hash
    });

    console.log("🔑 Comparing provided password with stored hash...");
    const isMatch = await bcrypt.compare(password.trim(), user.password_hash.trim());

    console.log("🔍 Password match result:", isMatch);

    if (!isMatch) {
      console.warn("❌ Incorrect password for user:", email);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    console.log("✅ Password verified successfully");

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("🚨 Missing JWT_SECRET environment variable");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    console.log("🔧 Generating JWT token...");
    const token = jwt.sign(
      { id: user.user_id, email: user.email },
      secret,
      { expiresIn: "1d" }
    );

    console.log("✅ JWT generated successfully:", token);

    console.log("🚀 Login successful, sending response...");
    
    const response = NextResponse.json({ message: "Login successful" });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return response;

  } catch (err) {
    console.error("💥 Login error caught in catch block:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
