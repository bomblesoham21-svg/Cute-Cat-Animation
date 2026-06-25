import { createClient } from '@supabase/supabase-js';

// Initialize Supabase using your Vercel Environment Variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// System Prompts: Short, punchy personality strings per cat variant (cleaned)
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
        // Targeting the active Gemini 3.5 Flash light model from your AI Studio dropdown list
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        
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
                },
                // Allow creative cat roleplay without safety blocks
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                ]
            })
        });

        const aiData = await apiResponse.json();

        // Robust parsing with safety / error handling
        if (aiData.error) {
            console.error("Gemini API Error Object:", aiData.error);
            return res.status(200).json({ reply: "Meow... the cosmic wires got crossed. Try again? 🐾" });
        }

        if (aiData.candidates && aiData.candidates.length > 0) {
            const candidate = aiData.candidates[0];
            
            if (candidate.finishReason && candidate.finishReason !== "STOP") {
                console.warn("Gemini finishReason:", candidate.finishReason, "for catType:", catType);
            }

            const text = candidate?.content?.parts?.[0]?.text;
            if (text) {
                const aiResponseText = text.trim();
                return res.status(200).json({ reply: aiResponseText });
            }
        }

        // Only reach here on truly unexpected structure
        console.error("Gemini Unexpected Response Structure:", JSON.stringify(aiData, null, 2));
        return res.status(200).json({ reply: "Meow... My thoughts are a bit tangled. Try asking again? 🐾" });

    } catch (globalError) {
        console.error("Serverless Pipeline Error:", globalError);
        return res.status(500).json({ error: "Internal processing failure." });
    }
}
