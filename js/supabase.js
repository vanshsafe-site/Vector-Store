const SUPABASE_URL =
"https://cuzgjevdoybvpadtsrsg.supabase.co";
const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1emdqZXZkb3lidnBhZHRzcnNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MjczMTMsImV4cCI6MjA5NzAwMzMxM30.uiLjmbRz8JCgveMFSKYUCq-eVLEtUXZ61EaYKcYq0AQ" ;      
const supabaseClient =
window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
