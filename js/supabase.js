window.supabase = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
console.log("Supabase Connected");
console.log("SUPABASE FILE LOADED");
console.log(window.supabase);
console.log(typeof window.supabase?.from);
