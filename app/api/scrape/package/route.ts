// import puppeteer from 'puppeteer-core'
// import { NextRequest, NextResponse } from 'next/server';
// import chromium from '@sparticuz/chromium';

// export async function GET() {
//     return NextResponse.json("Hi, I am READMEasy Package.JSON Agent, I can extract dependecies for you.");
// }

// export async function POST(req: NextRequest) {
//     const body = await req.json();
//     const url = body.url;
//       const browser = await puppeteer.launch({
//         args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
//         defaultViewport: chromium.defaultViewport,
//         executablePath: await chromium.executablePath(),
//         headless: chromium.headless,
//         ignoreHTTPSErrors: true,
//     })
//     const page = await browser.newPage();
//     await page.goto(url);
//     const pagedata = await page.evaluate(() => {
//         const preTag = document.querySelector('pre');
//         if (preTag) {
//             return JSON.parse(preTag.textContent || '');
//         }
//         return null;
//     });
//     const npage = await browser.newPage();
//     await npage.goto("https://s-maciejewski.github.io/pretty-package/");
//     await npage.waitForSelector('textarea');
//     await npage.evaluate((data) => {
//         const textarea = document.querySelector('textarea');
//         if (textarea) {
//         textarea.value = "";
//         }
//     }, pagedata);
//     await npage.type('textarea', JSON.stringify(pagedata, null, 2));

//     await npage.waitForSelector('input[type="checkbox"]');
//     await npage.evaluate(() => {
//         const checkboxes = document.querySelectorAll('input[type="checkbox"]');
//         checkboxes.forEach((checkbox) => {
//             const inputCheckbox = checkbox as HTMLInputElement;
//             if (inputCheckbox.checked) {
//                 inputCheckbox.click();
//             }
//         });
//     });

//     await npage.waitForSelector('button');
//     await npage.evaluate(() => {
//         const buttons = Array.from(document.querySelectorAll('button'));
//         const formatButton = buttons.find(button => button.textContent === "Format");
//         if (formatButton) {
//             formatButton.click();
//         }
//     });

//     await npage.waitForSelector('span');
//     const spanContent = await npage.evaluate(() => {
//         const spans = Array.from(document.querySelectorAll('span'));
//         const nameSpan = spans.find(span => span.textContent && span.textContent.includes('name'));
//         return nameSpan ? nameSpan.textContent : '';
//     });

//     // const spanId = 'Main_outputBox__6XzB3 MuiBox-root css-0';
//     // await new Promise(resolve => setTimeout(resolve, 2000));
//     // const spanContent = await npage.$eval(`#${spanId}`, span => span.textContent || '');

//     await browser.close();
//     return NextResponse.json(spanContent);
// }