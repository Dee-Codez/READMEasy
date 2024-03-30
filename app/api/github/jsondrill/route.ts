import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id') || "";
    const repoName = req.nextUrl.searchParams.get('reponame') || "";
    const path = req.nextUrl.searchParams.get('path') || "";
    const res = await fetch(`https://api.github.com/repos/${id}/${repoName}/contents/${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GITHUB_KEY}` 
      },
    });
    const data = await res.json();
    return NextResponse.json(data);
}

