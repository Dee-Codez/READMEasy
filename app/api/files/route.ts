const fs = require('fs');
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    return Response.json({ username: "harkirat", email: "harkirat@gmail.com" })
  }



  export async function POST(req: NextRequest) {
      const body = await req.json();
      const data = JSON.stringify(body, null, 4);
        fs.writeFileSync(process.cwd() + '/data/url.json', data);

      return NextResponse.json({ message: "Data written to path" + process.cwd() + '/data/url.json'})
  }