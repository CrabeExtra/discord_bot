import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

let { GOOGLE_API_KEY } = dotenv.config().parsed;

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

export const models = [
  genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
  }),
  genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite",
    tools: [{ googleSearch: {} }],
  }),
  genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite",
  }),
  genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    tools: [{ googleSearch: {} }],
  }),
   genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  }),
  genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    tools: [{ googleSearch: {} }],
  }),
  genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  }),

//   genAI.getGenerativeModel({
//     model: "gemma-4-31b-it",
//   }),

//   genAI.getGenerativeModel({
//     model: "gemma-4-26b-a4b-it",
//   })
];