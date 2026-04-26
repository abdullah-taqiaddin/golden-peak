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

  const [pendingCount, approvedCount, rejectedCount, totalCount] = await Promise.all([
    prisma.user.count({ where: { role: "USER", status: UserStatus.PENDING } }),
    prisma.user.count({ where: { role: "USER", status: UserStatus.APPROVED } }),
    prisma.user.count({ where: { role: "USER", status: UserStatus.REJECTED } }),
    prisma.user.count({ where: { role: "USER" } })
  ]);

  return NextResponse.json({
    counts: {
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      all: totalCount
    },
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
