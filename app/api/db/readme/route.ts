import { NextRequest, NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id');
    const user = await prisma.readme.findMany({
        where: {
            userID: id,
        },
      });
      return NextResponse.json(user);
}


export async function POST(req: NextRequest) {
    const { userid,repoid,name,content } = await req.json();
    const id = parseInt(repoid);
    const existRepo = await prisma.readme.findUnique({
        where: {
            userID: userid,
            repoID: id,
        },
      });
    if(existRepo){
            const user = await prisma.readme.update({
                where: {
                    userID: userid,
                    repoID: id,
                },
                data: {
                    readmeText: content.response,
                },
        });
        return NextResponse.json(user);
    }else{
        const text = content.response;
        const repo = await prisma.readme.create({
            data: {
                userID: userid,
                repoID: id,
                repoName: name,
                readmeText: text,
            },
          });
          return NextResponse.json(repo);
    }       
}