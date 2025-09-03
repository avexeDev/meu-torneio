# TourneyPro - Sistema de Gerenciamento de Torneios

## 📋 Sobre o Projeto

TourneyPro é um MVP (Produto Mínimo Viável) desenvolvido para organizadores de torneios de futebol virtual (eFootball e FIFA). O sistema permite gerenciar campeonatos amadores de forma completa e profissional.

## 🚀 Funcionalidades

### ✅ Autenticação
- Sistema de login e registro de usuários
- Dados salvos localmente no navegador

### 🏆 Gestão de Torneios
- Criar e gerenciar múltiplos torneios
- Suporte para eFootball e FIFA
- Informações detalhadas de cada campeonato

### 🛡️ Gestão de Clubes
- Cadastro de times participantes
- Upload de escudos dos clubes
- Organização por torneio

### 👥 Gestão de Jogadores
- Cadastro completo de atletas
- Fotos dos jogadores (estilo SofaScore)
- Informações detalhadas (idade, posição, nacionalidade)
- Filtros por clube

### ⚽ Gestão de Partidas
- Registro de jogos por rodada
- Placar detalhado
- Eventos da partida (gols, assistências, cartões)
- Data e horário das partidas

### 📊 Classificação Automática
- Tabela de classificação atualizada automaticamente
- Cálculo de pontos, saldo de gols e estatísticas
- Ordenação por critérios oficiais

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura da aplicação
- **CSS3** - Estilização moderna e responsiva
- **JavaScript (ES6+)** - Lógica da aplicação
- **LocalStorage** - Armazenamento local dos dados
- **Font Awesome** - Ícones

## 📱 Interface

- Design moderno e responsivo
- Interface intuitiva e fácil de usar
- Tema profissional com gradientes
- Compatível com desktop e mobile

## 🎯 Como Usar

### 1. Primeiro Acesso
1. Abra o arquivo `index.html` no navegador
2. Clique em "Carregar Dados de Exemplo" (canto inferior direito)
3. Faça login com:
   - **Usuário:** admin
   - **Senha:** 123456

### 2. Criando seu Próprio Torneio
1. Clique em "Criar Conta" na tela de login
2. Faça login com suas credenciais
3. Navegue pelo menu lateral:
   - **Dashboard:** Visão geral
   - **Torneios:** Criar e gerenciar campeonatos
   - **Clubes:** Adicionar times
   - **Jogadores:** Cadastrar atletas
   - **Partidas:** Registrar jogos
   - **Classificação:** Ver tabela

### 3. Fluxo Recomendado
1. **Criar Torneio** - Defina nome, jogo e data
2. **Adicionar Clubes** - Cadastre os times participantes
3. **Cadastrar Jogadores** - Adicione atletas aos clubes
4. **Registrar Partidas** - Insira resultados e eventos
5. **Acompanhar Classificação** - Veja a tabela atualizada

## 📊 Dados de Exemplo

O sistema inclui dados de exemplo com:
- 1 usuário (admin/123456)
- 2 torneios (Liga Brasileira eFootball e Copa FIFA Champions)
- 4 clubes brasileiros (Flamengo, Palmeiras, Corinthians, São Paulo)
- 9 jogadores com dados reais
- 3 partidas com eventos detalhados

## 💾 Armazenamento

- Todos os dados são salvos no **LocalStorage** do navegador
- Não requer servidor ou banco de dados externo
- Dados persistem entre sessões
- Para backup, exporte os dados do LocalStorage

## 🔧 Personalização

### Adicionando Fotos de Jogadores
- Use URLs de imagens (recomendado: SofaScore API)
- Formato sugerido: `https://img.sofascore.com/api/v1/player/ID/image`
- Imagens são redimensionadas automaticamente

### Escudos de Clubes
- Aceita URLs de imagens
- Formato circular automático
- Fallback para ícone padrão

## 📈 Funcionalidades Futuras

- [ ] Exportação de dados (PDF/Excel)
- [ ] Estatísticas avançadas de jogadores
- [ ] Sistema de playoffs
- [ ] Integração com APIs de jogos
- [ ] Modo offline completo
- [ ] Backup na nuvem

## 🤝 Contribuição

Este é um MVP desenvolvido para demonstração. Sugestões e melhorias são bem-vindas!

## 📄 Licença

Projeto desenvolvido para fins educacionais e demonstração de conceito.

---

**Desenvolvido para organizadores de torneios de futebol virtual** ⚽🎮