const fs = require('fs');
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    const file = fs.readFileSync(process.cwd() + '/data/url.json');
    return NextResponse.json(JSON.parse(file.toString()));
  }

  export async function POST(req: NextRequest) {
      const body = await req.json();
      const path = body.path;
      const content = body.content;
      const data = JSON.stringify(content, null, 4);
      if(path === "/data/url.json"){
        fs.writeFileSync(process.cwd() + path, data);
      }else if(path === "/data/readme.json"){
        fs.appendFileSync(process.cwd() + path, data);
      
      }else{
        fs.appendFileSync(process.cwd() + "/data/misc.json", data);
      }
      

      return NextResponse.json({ message: "Data written to path:" + process.cwd() + path})
  }