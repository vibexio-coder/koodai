
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = 'AIzaSyDTqEcVhng-EpFkHT-AdznIqLW0jVneicw';
const genAI = new GoogleGenerativeAI(apiKey);

async function testModels() {
    const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash'];

    for (const modelName of models) {
        console.log(`Testing model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            console.log(`✅ ${modelName} works! Response: ${result.response.text().substring(0, 20)}`);
            return modelName;
        } catch (e) {
            console.log(`❌ ${modelName} failed: ${e.message}`);
        }
    }
}

testModels();
