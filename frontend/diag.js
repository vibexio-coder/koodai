
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY;

async function checkGemini() {
    console.log('--- Checking Gemini API ---');
    if (!apiKey) {
        console.error('VITE_GEMINI_API_KEY is missing in .env');
        return;
    }
    console.log('API Key found. Attempting connection...');
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Say 'Connected'");
        console.log('Gemini Response:', result.response.text());
        console.log('Gemini status: CONNECTED');
    } catch (error) {
        console.error('Gemini connection failed:', error.message);
    }
}

checkGemini();
