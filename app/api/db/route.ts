import { NextRequest, NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const { name } = await req.json();
  const user = await prisma.user.create({
    data: {
      name,
    },
  });
  return NextResponse.json(user);
}