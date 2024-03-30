import { NextRequest, NextResponse } from 'next/server';


import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name') || "";
  // const deleteFlag = req.nextUrl.searchParams.get('delete');

  const user = await prisma.user.findFirst({
    where: {
      name: name,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  // if (deleteFlag === 'true' && user) {
  //   await prisma.readme.deleteMany({
  //     where: {
  //       userID: user.id,
  //     },
  //   });
  //   await prisma.user.delete({
  //     where: {
  //       id: user.id,
  //     },
  //   });
  // }
  return NextResponse.json(user);
}

export async function POST(req: NextRequest) {
  const { name, content } = await req.json();
  const userExist = await prisma.user.findFirst({
    where: {
      name: name,
    },
  });
  if (userExist) {
    await prisma.readme.deleteMany({
      where: {
        userID: userExist.id,
      },
    });
    await prisma.user.delete({
      where: {
        id: userExist.id,
      },
    });
  }
  const user = await prisma.user.create({
    data: {
      name:name,
      data: content,
    },
  });
  return NextResponse.json(user);
}