const fs = require('fs');
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    const file = fs.readFileSync(process.cwd() + '/data/url.json');
    return NextResponse.json(JSON.parse(file.toString()));
  }



  export async function POST(req: NextRequest) {
      const body = await req.json();
      const data = JSON.stringify(body, null, 4);
        fs.writeFileSync(process.cwd() + '/data/url.json', data);

      return NextResponse.json({ message: "Data written to path" + process.cwd() + '/data/url.json'})
  }