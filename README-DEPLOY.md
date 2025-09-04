# Deploy no Vercel - TourneyPro

## 📁 Estrutura para Deploy

Todos os arquivos foram reorganizados na raiz do projeto para compatibilidade com o Vercel:

```
efootball-site/
├── index.html              # Página principal
├── style.css               # Estilos principais
├── supabase-config.js      # Configuração do Supabase
├── app-supabase.js         # Aplicação principal
├── vercel.json             # Configuração do Vercel
├── supabase-schema.sql     # Schema do banco
└── README-DEPLOY.md        # Este arquivo
```

## 🚀 Passos para Deploy

### 1. Configurar Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Execute o SQL do arquivo `supabase-schema.sql`
4. Copie a URL e chave anônima do projeto

### 2. Atualizar Configurações
No arquivo `supabase-config.js`, substitua:
```javascript
const SUPABASE_URL = "SUA_URL_AQUI";
const SUPABASE_ANON_KEY = "SUA_CHAVE_AQUI";
```

### 3. Deploy no Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure o projeto:
   - **Framework Preset:** Other
   - **Root Directory:** ./
   - **Build Command:** (deixe vazio)
   - **Output Directory:** ./

### 4. Configurações do Vercel
O arquivo `vercel.json` já está configurado para:
- Servir o `index.html` como SPA
- Redirecionar todas as rotas para a página principal

## 🔧 Funcionalidades

### ✅ Implementadas:
- Autenticação com Supabase Auth
- Dashboard básico com estatísticas
- Estrutura CRUD para todas as entidades
- Interface responsiva

### 🚧 Para Implementar:
- Interfaces completas de torneios, clubes, jogadores
- Sistema de partidas e classificação
- Upload de imagens
- Notificações em tempo real

## 🌐 Acesso

Após o deploy, sua aplicação estará disponível em:
`https://seu-projeto.vercel.app`

## 📱 Teste Local

Para testar localmente:
```bash
# Servir arquivos estáticos
python -m http.server 8000
# ou
npx serve .

# Acessar em http://localhost:8000
```

## 🔐 Segurança

- RLS (Row Level Security) ativado no Supabase
- Usuários só acessam seus próprios dados
- Autenticação obrigatória para todas as operações

## 📊 Monitoramento

- Logs disponíveis no painel do Vercel
- Métricas de uso no Supabase Dashboard
- Backup automático dos dados

## 🆘 Troubleshooting

### Erro de CORS:
- Verifique se a URL do Vercel está nas configurações do Supabase
- Adicione `https://seu-projeto.vercel.app` nas URLs permitidas

### Erro de Autenticação:
- Confirme se as chaves do Supabase estão corretas
- Verifique se o RLS está configurado corretamente

### Erro 404:
- Confirme se o `vercel.json` está na raiz
- Verifique se todas as rotas redirecionam para `/index.html`

## 📞 Suporte

Para dúvidas:
1. Verifique os logs no Vercel Dashboard
2. Consulte a documentação do Supabase
3. Teste localmente primeiro