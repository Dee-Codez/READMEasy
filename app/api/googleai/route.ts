const {GoogleGenerativeAI,HarmCategory,HarmBlockThreshold,} = require("@google/generative-ai");
import { NextRequest, NextResponse } from 'next/server';

  const MODEL_NAME = "gemini-1.0-pro";
  const API_KEY = process.env.GOOGLEAI_API_KEY;

  export async function GET() {
    return NextResponse.json("Hi, I am READMEasy, a helpful Large Language Model making good readme documentations for your repositories on the go.");
  }

  export async function POST(req: NextRequest) {
    const body = await req.json();
    const res = await runChat(body.query);
    return NextResponse.json({ response: res})
}

  async function runChat(userInput) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [{ text: "What are you?" }],
        },
        {
          role: "model",
      parts: [{ text: "I am READMEasy, a helpful Large Language Model,fine tuned by Debam, that can assist you with a variety of tasks but mostly with creating good readme documentations for your repositories on the go. I'll answer in a straightforward manner from now on without mentioning any part of question in response"}],
        },
      ],
    });

    const result = await chat.sendMessage(userInput);
    const response = result.response;
    return response.text();
}

