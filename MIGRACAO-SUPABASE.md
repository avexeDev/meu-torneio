# Migração para Supabase

Este guia explica como migrar o sistema TourneyPro do localStorage para o Supabase.

## 🚀 Configuração do Supabase

### 1. Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta e um novo projeto
3. Anote a URL e a chave anônima do projeto

### 2. Configurar Tabelas
Execute o SQL do arquivo `supabase-schema.sql` no SQL Editor do Supabase:

```sql
-- Cole todo o conteúdo do arquivo supabase-schema.sql
```

### 3. Configurar Autenticação
No painel do Supabase:
1. Vá em Authentication > Settings
2. Configure o provedor de email
3. Desabilite "Confirm email" se quiser testes mais rápidos

### 4. Atualizar Configurações
No arquivo `js/supabase-config.js`, substitua:
```javascript
const SUPABASE_URL = 'SUA_URL_DO_SUPABASE';
const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANONIMA';
```

## 📁 Arquivos da Migração

### Novos Arquivos:
- `js/supabase-config.js` - Configuração e classe de gerenciamento
- `js/app-supabase.js` - Versão adaptada do app principal
- `index-supabase.html` - HTML simplificado para Supabase
- `supabase-schema.sql` - Schema das tabelas

### Arquivos Mantidos:
- `css/style.css` - Estilos (sem alteração)
- `css/player-profile.css` - Estilos dos perfis
- `css/club-profile.css` - Estilos dos clubes
- `css/tournament-profile.css` - Estilos dos torneios

## 🔄 Principais Mudanças

### 1. Autenticação
- **Antes:** Sistema simples com localStorage
- **Agora:** Autenticação real com email/senha via Supabase Auth

### 2. Armazenamento de Dados
- **Antes:** `localStorage.setItem()` / `localStorage.getItem()`
- **Agora:** Operações CRUD assíncronas com Supabase

### 3. Estrutura de Dados
- **Antes:** Arrays simples no localStorage
- **Agora:** Tabelas relacionais com chaves estrangeiras

### 4. Segurança
- **Antes:** Dados locais sem proteção
- **Agora:** Row Level Security (RLS) - usuários só veem seus dados

## 🛠️ Como Usar

### 1. Desenvolvimento Local
```bash
# Servir arquivos localmente (necessário para CORS)
python -m http.server 8000
# ou
npx serve .
```

### 2. Acessar a Aplicação
- Abra `http://localhost:8000/index-supabase.html`
- Crie uma conta com email/senha
- Use normalmente como antes

### 3. Migrar Dados Existentes (Opcional)
Se você tem dados no localStorage e quer migrar:

```javascript
// Execute no console do navegador na versão antiga
const data = {
  tournaments: JSON.parse(localStorage.getItem('tournaments') || '[]'),
  clubs: JSON.parse(localStorage.getItem('clubs') || '[]'),
  players: JSON.parse(localStorage.getItem('players') || '[]'),
  matches: JSON.parse(localStorage.getItem('matches') || '[]')
};
console.log('Dados para migração:', JSON.stringify(data, null, 2));
```

## 🔧 Vantagens da Migração

### ✅ Benefícios:
- **Dados na nuvem:** Acesso de qualquer dispositivo
- **Autenticação real:** Segurança adequada
- **Backup automático:** Dados não se perdem
- **Escalabilidade:** Suporta múltiplos usuários
- **Sincronização:** Dados sempre atualizados
- **Performance:** Queries otimizadas

### 📊 Comparação:

| Recurso | localStorage | Supabase |
|---------|-------------|----------|
| Armazenamento | Local (5-10MB) | Nuvem (500MB+) |
| Usuários | 1 por navegador | Ilimitados |
| Backup | Manual | Automático |
| Sincronização | Não | Sim |
| Segurança | Básica | Avançada |
| Offline | Sim | Limitado |

## 🚨 Considerações

### Limitações:
- Requer conexão com internet
- Dependência de serviço externo
- Curva de aprendizado maior

### Recomendações:
- Use para produção
- Mantenha versão localStorage para desenvolvimento offline
- Configure backup regular dos dados
- Monitore uso da quota do Supabase

## 📞 Suporte

Para dúvidas sobre a migração:
1. Consulte a [documentação do Supabase](https://supabase.com/docs)
2. Verifique os logs do console do navegador
3. Teste primeiro em ambiente de desenvolvimento