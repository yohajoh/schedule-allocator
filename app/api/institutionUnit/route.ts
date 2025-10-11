// app/api/units/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client"; // Adjust path if needed
import { Prisma } from "@/lib/generated/prisma";

/**
 * @method GET
 * @path /api/units
 * @description Retrieves a list of all Institution Units.
 */
export async function GET() {
  try {
    const units = await prisma.institutionUnit.findMany({
      orderBy: { unit_id: "asc" },
      // Include parent/children for better context, limiting depth for efficiency
      include: {
        parentUnit: {
          select: { unit_id: true, unit_name: true, unit_code: true },
        },
        childUnits: {
          select: { unit_id: true, unit_name: true, unit_code: true },
        },
      },
    });
    return NextResponse.json(units, { status: 200 });
  } catch (error) {
    console.error("Error fetching units:", error);
    return NextResponse.json(
      { message: "Failed to retrieve units." },
      { status: 500 }
    );
  }
}

/**
 * @method POST
 * @path /api/units
 * @description Creates a new Institution Unit (e.g., an Institution, College, or Department).
 * @body { unit_code, unit_name, unit_type, parent_unit_id (optional) }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { unit_code, unit_name, unit_type, parent_unit_id } = body;

    // Basic validation for required fields
    if (!unit_code || !unit_name || !unit_type) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: unit_code, unit_name, and unit_type.",
        },
        { status: 400 }
      );
    }

    const newUnit = await prisma.institutionUnit.create({
      data: {
        unit_code,
        unit_name,
        unit_type,
        // Only include parent_unit_id if it's provided and a number
        parent_unit_id: parent_unit_id ? Number(parent_unit_id) : null,
      },
    });

    // You can optionally check for parent unit existence here before creation

    return NextResponse.json(newUnit, { status: 201 });
  } catch (error) {
    console.error("Error creating unit:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // P2002 is the error code for unique constraint violation (unit_code)
      return NextResponse.json(
        { message: "Unit code already exists. Please use a unique code." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Failed to create unit." },
      { status: 500 }
    );
  }
}
