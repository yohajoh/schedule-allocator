// app/api/units/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client"; // Adjust path if needed
import { Prisma } from "@/lib/generated/prisma";

// Define the shape of the URL parameters
interface UnitContext {
  params: {
    id: string; // The unit_id from the URL segment
  };
}

/**
 * @method GET
 * @path /api/units/[id]
 * @description Retrieves a specific Institution Unit by its ID.
 */
export async function GET(req: NextRequest, { params }: UnitContext) {
  const unitId = Number(params.id);

  if (isNaN(unitId)) {
    return NextResponse.json(
      { message: "Invalid Unit ID format." },
      { status: 400 }
    );
  }

  try {
    const unit = await prisma.institutionUnit.findUnique({
      where: { unit_id: unitId },
      // Include parent/children for full context
      include: {
        parentUnit: {
          select: { unit_id: true, unit_name: true, unit_code: true },
        },
        childUnits: {
          select: { unit_id: true, unit_name: true, unit_code: true },
        },
      },
    });

    if (!unit) {
      return NextResponse.json(
        { message: `Institution Unit with ID ${unitId} not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(unit, { status: 200 });
  } catch (error) {
    console.error(`Error fetching unit ${unitId}:`, error);
    return NextResponse.json(
      { message: "Failed to retrieve unit." },
      { status: 500 }
    );
  }
}

/**
 * @method PATCH
 * @path /api/units/[id]
 * @description Updates specific attributes of an existing Institution Unit.
 * @body { unit_name?, unit_code?, unit_type?, parent_unit_id? }
 */
export async function PATCH(req: NextRequest, { params }: UnitContext) {
  const unitId = Number(params.id);

  if (isNaN(unitId)) {
    return NextResponse.json(
      { message: "Invalid Unit ID format." },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();

    // Prisma will automatically handle only updating the fields present in 'data'
    const updatedUnit = await prisma.institutionUnit.update({
      where: { unit_id: unitId },
      data: {
        unit_code: body.unit_code,
        unit_name: body.unit_name,
        unit_type: body.unit_type,
        // Convert to number or null if provided
        parent_unit_id:
          body.parent_unit_id === undefined
            ? undefined // don't update if not provided
            : body.parent_unit_id === null
            ? null
            : Number(body.parent_unit_id),
      },
    });

    return NextResponse.json(updatedUnit, { status: 200 });
  } catch (error) {
    console.error(`Error updating unit ${unitId}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        // P2025 is the error code for "An operation failed because it depends on one or more records that were required but not found." (Unit not found)
        return NextResponse.json(
          { message: `Institution Unit with ID ${unitId} not found.` },
          { status: 404 }
        );
      }
      if (error.code === "P2002") {
        // P2002 is the error code for unique constraint violation (unit_code)
        return NextResponse.json(
          { message: "Unit code already exists. Please use a unique code." },
          { status: 409 }
        );
      }
    }
    return NextResponse.json(
      { message: "Failed to update unit." },
      { status: 500 }
    );
  }
}

/**
 * @method DELETE
 * @path /api/units/[id]
 * @description Deletes a specific Institution Unit by its ID.
 */
export async function DELETE(req: NextRequest, { params }: UnitContext) {
  const unitId = Number(params.id);

  if (isNaN(unitId)) {
    return NextResponse.json(
      { message: "Invalid Unit ID format." },
      { status: 400 }
    );
  }

  try {
    await prisma.institutionUnit.delete({
      where: { unit_id: unitId },
    });

    return NextResponse.json(
      { message: `Institution Unit ${unitId} deleted successfully.` },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting unit ${unitId}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        // Unit not found
        return NextResponse.json(
          { message: `Institution Unit with ID ${unitId} not found.` },
          { status: 404 }
        );
      }
      // P2003 is the code for "Foreign key constraint failed on the field"
      if (error.code === "P2003") {
        // This is a crucial check for your hierarchical model
        return NextResponse.json(
          {
            message:
              "Cannot delete unit. It is currently referenced by other records (e.g., has child units, assigned roles, offered courses, or administered batches). Please remove all dependencies first.",
          },
          { status: 409 }
        );
      }
    }
    return NextResponse.json(
      { message: "Failed to delete unit." },
      { status: 500 }
    );
  }
}
