const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

window.supabase = supabaseClient;

console.log("Supabase Connected");
