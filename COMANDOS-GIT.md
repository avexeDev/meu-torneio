# Comandos para Subir ao GitHub

Execute estes comandos no terminal dentro da pasta do projeto:

## 1. Verificar se o Git está configurado
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@gmail.com"
```

## 2. Verificar status do repositório
```bash
git status
```

## 3. Fazer push para o GitHub
```bash
git push -u origin main
```

Se der erro de autenticação, use um dos métodos:

### Método 1: Token de Acesso Pessoal
1. Vá em GitHub > Settings > Developer settings > Personal access tokens
2. Gere um novo token com permissões de repositório
3. Use o token como senha quando solicitado

### Método 2: GitHub CLI
```bash
gh auth login
git push -u origin main
```

### Método 3: SSH (Recomendado)
```bash
# Gerar chave SSH
ssh-keygen -t ed25519 -C "seu-email@gmail.com"

# Adicionar ao ssh-agent
ssh-add ~/.ssh/id_ed25519

# Copiar chave pública e adicionar no GitHub
cat ~/.ssh/id_ed25519.pub

# Mudar remote para SSH
git remote set-url origin git@github.com:thiagogagliaridev/meu-torneio.git
git push -u origin main
```

## 4. Verificar se subiu
Acesse: https://github.com/thiagogagliaridev/meu-torneio

## 5. Deploy no Vercel
1. Acesse https://vercel.com
2. Conecte com GitHub
3. Importe o repositório `meu-torneio`
4. Configure:
   - Framework: Other
   - Root Directory: ./
   - Build Command: (vazio)
   - Output Directory: ./
5. Deploy!

## Arquivos Prontos para Deploy:
✅ index.html (página principal)
✅ style.css (estilos)
✅ supabase-config.js (configuração)
✅ app-supabase.js (aplicação)
✅ vercel.json (config Vercel)
✅ README-DEPLOY.md (guia completo)