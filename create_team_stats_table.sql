-- Criar tabela team_stats simplificada
CREATE TABLE team_stats (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  wins INTEGER NOT NULL DEFAULT 0,
  draws INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Inserir registro inicial
INSERT INTO team_stats (
  wins, draws, losses
) VALUES (
  0, 0, 0
); 