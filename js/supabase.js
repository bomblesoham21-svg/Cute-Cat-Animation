const SUPABASE_URL = "https://lndeflbixwjxormrdmvg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuZGVmbGJpeHdqeG9ybXJkbXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExODUxMTYsImV4cCI6MjA5Njc2MTExNn0.oIGrvENsT60tJ0aWQfYiSA6_cfiMAFJZxmKKTEa2sRA";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Expose globally so catchat.js (window.supabase) + scene1.js (supabaseClient) both work
window.supabase = supabaseClient;
window.supabaseClient = supabaseClient;

console.log("Supabase Connected");
