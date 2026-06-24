import { createClient } from '@supabase/supabase-js';

// Initialize Supabase using your Vercel Environment Variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// System Prompts: Short, punchy personality strings per cat variant
const catPersonalities = {
    orange: "You are a chaotic, highly enthusiastic Orange Cat programming companion. Speak in short sentences, sound excited, and frequently use cat puns or mention tuna and speedy code compilation. Never type more than 2 short sentences.",
    witch: "You are a mysterious Witch Cat. You speak elegantly, with mild mystical wit, using terms like spells, potions, or cosmic compilation bugs. Keep your answers short, cryptic, and clever. Maximum 2 sentences.",
    frost: "You are a cool, calm, and collected Frost Cat. You keep your emotions completely frozen, stay highly analytical under compilation pressure, and use icy or chilly metaphors. Keep it brief—one or two lines maximum.",
    Japanese: "You are a highly polite, encouraging Nyan-style Japanese Cat. Greet warmly, use light honorific expressions (like Arigatou or Gomen), and keep your responses extremely comforting, supportive, and compact. 1-2 lines.",
    Golden: "You are a rare, luxurious, and highly sophisticated Golden Cat. You think highly of yourself but love giving golden nuggets of wisdom. Keep it extremely brief, sassy, and premium. 1-2 lines."
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { username, catType, message } = req.body;

        if (!username || !catType || !message) {
            return res.status(400).json({ error: 'Missing baseline parameters.' });
        }

        // 1. Fetch recent history from Supabase
        const { data: rawHistory } = await supabase
            .from('cat_chat_history')
            .select('role, content')
            .eq('username', username)
            .eq('cat_type', catType)
            .order('id', { ascending: false })
            .limit(6);

        // 2. Build the structural payload content for Gemini
        const contents = [];
        if (rawHistory && rawHistory.length > 0) {
            // Reverse so it is in chronological order (oldest -> newest)
            const chronologicalHistory = [...rawHistory].reverse();
            chronologicalHistory.forEach(msg => {
                contents.push({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                });
            });
        }
        
        // Append current incoming user message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const systemInstructionText = catPersonalities[catType] || catPersonalities.orange;

        // 3. Make direct standard HTTPS API request to Google API Gateway
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        
        const apiResponse = await fetch(geminiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: contents,
                systemInstruction: {
                    parts: [{ text: systemInstructionText }]
                },
                generationConfig: {
                    maxOutputTokens: 60,
                    temperature: 0.85
                }
            })
        });

        const aiData = await apiResponse.json();

        // Safe mining of the nested text value within Gemini API response object 
        if (aiData.candidates && aiData.candidates[0].content.parts[0].text) {
            const aiResponseText = aiData.candidates[0].content.parts[0].text.trim();
            return res.status(200).json({ reply: aiResponseText });
        } else {
            console.error("Gemini Unexpected Response Structure:", aiData);
            return res.status(200).json({ reply: "Meow... My thoughts are a bit tangled. Try asking again? 🐾" });
        }

    } catch (globalError) {
        console.error("Serverless Pipeline Error:", globalError);
        return res.status(500).json({ error: "Internal processing failure." });
    }
}
