// import puppeteer from 'puppeteer';
// import { NextRequest, NextResponse } from 'next/server';


// export async function GET() {
//     return NextResponse.json("Hi, I am READMEasy Scraper Agent, I can scrape any website for you.");
// }

// export async function POST(req: NextRequest) {
//     const body = await req.json();
//     const url = body.url;
//     const browser = await puppeteer.launch({headless: false});
//     const page = await browser.newPage();
//     await page.goto(url);
//     const data = await page.evaluate(() => 
//         new Promise((resolve) => 
//             setTimeout(() => resolve(document.documentElement.innerText), 3000)
//         )
//     );
//     await browser.close();
//     return NextResponse.json(data);
// }
