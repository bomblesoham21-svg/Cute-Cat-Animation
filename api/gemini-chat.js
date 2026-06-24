import { GoogleGenAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client using server-side environment configurations
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Securely instantiate Google Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// System Prompts: Tailor the distinct short, punchy personality for each cat variant
const catPersonalities = {
    orange: "You are a chaotic, highly enthusiastic Orange Cat programming companion. Speak in short sentences, sound excited, and frequently use cat puns or mention tuna and speedy code compilation. Never type more than 2 short sentences.",
    witch: "You are a mysterious Witch Cat. You speak elegantly, with mild mystical wit, using terms like spells, potions, or cosmic compilation bugs. Keep your answers short, cryptic, and clever. Maximum 2 sentences.",
    frost: "You are a cool, calm, and collected Frost Cat. You keep your emotions completely frozen, stay highly analytical under compilation pressure, and use icy or chilly metaphors. Keep it brief—one or two lines maximum.",
    Japanese: "You are a highly polite, encouraging Nyan-style Japanese Cat. Greet warmly, use light honorific expressions (like Arigatou or Gomen), and keep your responses extremely comforting, supportive, and compact. 1-2 lines.",
    Golden: "You are a rare, luxurious, and highly sophisticated Golden Cat. You think highly of yourself but love giving golden nuggets of wisdom. Keep it extremely brief, sassy, and premium. 1-2 lines."
};

export default async function handler(req, res) {
    // Only accept incoming POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { username, catType, message } = req.body;

        if (!username || !catType || !message) {
            return res.status(400).json({ error: 'Missing baseline payload configuration parameters.' });
        }

        // 1. EXTRACT RECENT HISTORICAL CONTEXT FROM SUPABASE (Free-tier safe payload throttling)
        // Grab the last 6 messages for this specific user and cat variant to form continuous chat threads
        const { data: rawHistory, error: dbError } = await supabase
            .from('cat_chat_history')
            .select('role, content')
            .eq('username', username)
            .eq('cat_type', catType)
            .order('id', { ascending: false })
            .limit(6);

        if (dbError) console.error("History fetch warning:", dbError);

        // Map historical rows chronologically matching Gemini's structure requirement ({ role, parts })
        const formattedHistory = [];
        if (rawHistory && rawHistory.length > 0) {
            // Reverse back to ascending order so history reads oldest to newest
            const chronologicalHistory = rawHistory.reverse();
            chronologicalHistory.forEach(msg => {
                formattedHistory.push({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                });
            });
        }

        // 2. BOOTSTRAP GEMINI FLASH MODEL
        const model = ai.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            // Injecting specific structural configuration parameters to guarantee brief cat replies
            generationConfig: {
                maxOutputTokens: 60, 
                temperature: 0.85
            }
        });

        // 3. LAUNCH CHAT SYSTEM INSIDE THE SERVERLESS RUNTIME WITH SPECIFIC IDENTITY CONTEXT
        const chatSession = model.startChat({
            history: formattedHistory,
            systemInstruction: catPersonalities[catType] || catPersonalities.orange
        });

        // Send the message straight into the initialized structural context feed
        const aiResult = await chatSession.sendMessage(message);
        const aiResponseText = aiResult.response.text().trim();

        // Send text reply smoothly back to your catchat.js client application framework
        return res.status(200).json({ reply: aiResponseText });

    } catch (globalError) {
        console.error("Critical AI Gateway Failure:", globalError);
        return res.status(500).json({ error: "Internal operational exception during pipeline parsing." });
    }
}
