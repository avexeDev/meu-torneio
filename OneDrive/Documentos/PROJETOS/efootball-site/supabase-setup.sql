-- Criar tabelas no Supabase
-- Execute este SQL no editor SQL do Supabase

-- Tabela de torneios
CREATE TABLE tournaments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  game TEXT,
  logo TEXT,
  start_date DATE,
  description TEXT,
  status TEXT DEFAULT 'Ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de clubes
CREATE TABLE clubs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  country TEXT,
  logo TEXT,
  tournament_id BIGINT REFERENCES tournaments(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de jogadores
CREATE TABLE players (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birthdate DATE,
  position TEXT,
  nationality TEXT,
  number INTEGER,
  height INTEGER,
  photo TEXT,
  club_id BIGINT REFERENCES clubs(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de treinadores
CREATE TABLE coaches (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birthdate DATE,
  nationality TEXT,
  experience INTEGER,
  formation TEXT,
  photo TEXT,
  club_id BIGINT REFERENCES clubs(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de partidas
CREATE TABLE matches (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  home_team_id BIGINT REFERENCES clubs(id) ON DELETE CASCADE,
  away_team_id BIGINT REFERENCES clubs(id) ON DELETE CASCADE,
  home_score INTEGER,
  away_score INTEGER,
  round INTEGER,
  match_date TIMESTAMP WITH TIME ZONE,
  tournament_id BIGINT REFERENCES tournaments(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'scheduled',
  events JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de rodadas
CREATE TABLE rounds (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tournament_id BIGINT REFERENCES tournaments(id) ON DELETE CASCADE,
  number INTEGER,
  round_date DATE,
  matches JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para que usuários só vejam seus próprios dados
CREATE POLICY "Users can view own tournaments" ON tournaments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tournaments" ON tournaments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tournaments" ON tournaments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tournaments" ON tournaments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own clubs" ON clubs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own clubs" ON clubs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clubs" ON clubs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own clubs" ON clubs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own players" ON players FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own players" ON players FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own players" ON players FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own players" ON players FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own coaches" ON coaches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coaches" ON coaches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own coaches" ON coaches FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own coaches" ON coaches FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own matches" ON matches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own matches" ON matches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own matches" ON matches FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own matches" ON matches FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own rounds" ON rounds FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own rounds" ON rounds FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rounds" ON rounds FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own rounds" ON rounds FOR DELETE USING (auth.uid() = user_id);