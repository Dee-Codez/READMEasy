import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id') || "";
    const res = await fetch(`https://api.github.com/users/${id}/repos`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GITHUB_KEY}`
            },
        });
    const data = await res.json();
    return NextResponse.json(data);
}

