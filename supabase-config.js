// Configuração do Supabase
const SUPABASE_URL = "https://wfvvvjuootszsrldwiou.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmdnZ2anVvb3RzenNybGR3aW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMjYxODAsImV4cCI6MjA3MjYwMjE4MH0.EP9Dmzx7DEW0p79XAYnZOg_1uXVFta8ZdQRVhaL2aRg";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Classe para gerenciar dados no Supabase
class SupabaseManager {
  constructor() {
    this.currentUser = null;
  }

  // Autenticação
  async signUp(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { data, error };
  }

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }

  // CRUD Operations
  async create(table, data) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Usuário não autenticado");

    const { data: result, error } = await supabase
      .from(table)
      .insert({ ...data, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async read(table, filters = {}) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Usuário não autenticado");

    let query = supabase.from(table).select("*").eq("user_id", user.id);

    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async update(table, id, data) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Usuário não autenticado");

    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async delete(table, id) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("Usuário não autenticado");

    const { error } = await supabase
      .from(table)
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
    return true;
  }
}

const db = new SupabaseManager();