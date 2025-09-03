// Configuração do Supabase
const SUPABASE_URL = "https://zqprqypzmyoouefztvam.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxcHJxeXB6bXlvb3VlZnp0dmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MTE0ODUsImV4cCI6MjA3MjQ4NzQ4NX0.5fbuKU_1Wr4xOchthm00r5778pMaja1kWme33u1UXEo";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
