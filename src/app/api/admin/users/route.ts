import { UserStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { requireApiAdmin } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const statusMap: Record<string, UserStatus> = {
  pending: UserStatus.PENDING,
  approved: UserStatus.APPROVED,
  rejected: UserStatus.REJECTED
};

export async function GET(request: NextRequest) {
  const { error } = await requireApiAdmin(request);
  if (error) return error;

  const statusParam = request.nextUrl.searchParams.get("status")?.toLowerCase();
  const status = statusParam ? statusMap[statusParam] : undefined;

  const users = await prisma.user.findMany({
    where: {
      role: "USER",
      ...(status ? { status } : {})
    },
    orderBy: { createdAt: "desc" },
    include: {
      progressItems: {
        select: { id: true }
      }
    }
  });

  return NextResponse.json({
    users: users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      status: user.status,
      experienceLevel: user.experienceLevel,
      createdAt: user.createdAt,
      progressCount: user.progressItems.length
    }))
  });
}
