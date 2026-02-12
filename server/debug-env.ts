import dotenv from 'dotenv';
dotenv.config();
console.log('Key length:', process.env.GEMINI_API_KEY?.length);
console.log('Key start:', process.env.GEMINI_API_KEY?.substring(0, 6));
