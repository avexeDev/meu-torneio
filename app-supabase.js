class TourneyProSupabase {
  constructor() {
    this.currentUser = null;
    this.data = {
      tournaments: [],
      clubs: [],
      players: [],
      matches: [],
      rounds: []
    };
    this.init();
  }

  async init() {
    // Verificar se usuário está logado
    const user = await db.getCurrentUser();
    if (user) {
      this.currentUser = user;
      await this.loadAllData();
      this.showDashboard();
    } else {
      this.showLogin();
    }

    // Listener para mudanças de autenticação
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        this.currentUser = session.user;
        await this.loadAllData();
        this.showDashboard();
      } else if (event === 'SIGNED_OUT') {
        this.currentUser = null;
        this.data = { tournaments: [], clubs: [], players: [], matches: [], rounds: [] };
        this.showLogin();
      }
    });
  }

  async loadAllData() {
    try {
      this.data.tournaments = await db.read('tournaments');
      this.data.clubs = await db.read('clubs');
      this.data.players = await db.read('players');
      this.data.matches = await db.read('matches');
      this.data.rounds = await db.read('rounds');
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }

  // Autenticação
  async login(email, password) {
    try {
      const { data, error } = await db.signIn(email, password);
      if (error) throw error;
      return true;
    } catch (error) {
      alert('Erro no login: ' + error.message);
      return false;
    }
  }

  async register(email, password, name) {
    try {
      const { data, error } = await db.signUp(email, password, { name });
      if (error) throw error;
      alert('Conta criada! Verifique seu email para confirmar.');
      return true;
    } catch (error) {
      alert('Erro no registro: ' + error.message);
      return false;
    }
  }

  async logout() {
    try {
      await db.signOut();
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  }

  // CRUD para Torneios
  async createTournament(data) {
    try {
      const tournament = await db.create('tournaments', {
        name: data.name,
        game: data.game,
        start_date: data.startDate,
        end_date: data.endDate,
        type: data.type || 'standard'
      });
      
      this.data.tournaments.push(tournament);
      this.loadTournaments();
    } catch (error) {
      alert('Erro ao criar torneio: ' + error.message);
    }
  }

  async deleteTournament(id) {
    if (!confirm('Tem certeza que deseja excluir este torneio? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      await db.delete('tournaments', id);
      this.data.tournaments = this.data.tournaments.filter(t => t.id !== id);
      this.loadTournaments();
    } catch (error) {
      alert('Erro ao excluir torneio: ' + error.message);
    }
  }

  // CRUD para Clubes
  async createClub(data) {
    try {
      const club = await db.create('clubs', {
        tournament_id: data.tournamentId,
        name: data.name,
        logo: data.logo
      });
      
      this.data.clubs.push(club);
      this.loadClubs();
    } catch (error) {
      alert('Erro ao criar clube: ' + error.message);
    }
  }

  // CRUD para Jogadores
  async createPlayer(data) {
    try {
      const player = await db.create('players', {
        club_id: data.clubId,
        name: data.name,
        age: data.age,
        position: data.position,
        nationality: data.nationality,
        photo: data.photo
      });
      
      this.data.players.push(player);
      this.loadPlayers();
    } catch (error) {
      alert('Erro ao criar jogador: ' + error.message);
    }
  }

  // CRUD para Partidas
  async createMatch(data) {
    try {
      const match = await db.create('matches', {
        tournament_id: data.tournamentId,
        home_team_id: data.homeTeamId,
        away_team_id: data.awayTeamId,
        round: data.round,
        date: data.date,
        home_score: data.homeScore || 0,
        away_score: data.awayScore || 0,
        status: data.status || 'scheduled',
        events: data.events || []
      });
      
      this.data.matches.push(match);
      this.loadMatches();
    } catch (error) {
      alert('Erro ao criar partida: ' + error.message);
    }
  }

  async updateMatch(id, data) {
    try {
      const match = await db.update('matches', id, data);
      const index = this.data.matches.findIndex(m => m.id === id);
      if (index !== -1) {
        this.data.matches[index] = match;
      }
      this.loadMatches();
    } catch (error) {
      alert('Erro ao atualizar partida: ' + error.message);
    }
  }

  async deleteMatch(id) {
    if (!confirm('Tem certeza que deseja excluir esta partida?')) {
      return;
    }
    
    try {
      await db.delete('matches', id);
      this.data.matches = this.data.matches.filter(m => m.id !== id);
      this.loadMatches();
    } catch (error) {
      alert('Erro ao excluir partida: ' + error.message);
    }
  }

  // Métodos de interface
  showLogin() {
    document.getElementById('app').innerHTML = `
      <div class="login-container">
        <div class="login-header">
          <i class="fas fa-trophy"></i>
          <h1>TourneyPro</h1>
          <p>Organize seus torneios de futebol virtual</p>
        </div>
        <form id="login-form">
          <input type="email" id="email" placeholder="Email" required>
          <input type="password" id="password" placeholder="Senha" required>
          <button type="submit">Entrar</button>
        </form>
        <p>Não tem conta? <a href="#" onclick="app.showRegister()">Criar conta</a></p>
      </div>
    `;

    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      await this.login(email, password);
    });
  }

  showRegister() {
    document.getElementById('app').innerHTML = `
      <div class="login-container">
        <div class="login-header">
          <i class="fas fa-trophy"></i>
          <h1>Criar Conta</h1>
          <p>Junte-se ao TourneyPro</p>
        </div>
        <form id="register-form">
          <input type="text" id="name" placeholder="Nome" required>
          <input type="email" id="email" placeholder="Email" required>
          <input type="password" id="password" placeholder="Senha" required>
          <button type="submit">Criar Conta</button>
        </form>
        <p>Já tem conta? <a href="#" onclick="app.showLogin()">Fazer login</a></p>
      </div>
    `;

    document.getElementById('register-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      await this.register(email, password, name);
    });
  }

  showDashboard() {
    document.getElementById('app').innerHTML = `
      <div class="dashboard">
        <nav class="sidebar">
          <div class="logo">TourneyPro</div>
          <ul class="nav-menu">
            <li><a href="#" onclick="app.showDashboard()" class="active">
              <i class="fas fa-home"></i> Dashboard
            </a></li>
            <li><a href="#" onclick="app.showTournaments()">
              <i class="fas fa-trophy"></i> Torneios
            </a></li>
            <li><a href="#" onclick="app.showClubs()">
              <i class="fas fa-shield-alt"></i> Clubes
            </a></li>
            <li><a href="#" onclick="app.showPlayers()">
              <i class="fas fa-users"></i> Jogadores
            </a></li>
            <li><a href="#" onclick="app.showMatches()">
              <i class="fas fa-futbol"></i> Partidas
            </a></li>
            <li><a href="#" onclick="app.showStandings()">
              <i class="fas fa-list-ol"></i> Classificação
            </a></li>
            <li><a href="#" onclick="app.logout()">
              <i class="fas fa-sign-out-alt"></i> Sair
            </a></li>
          </ul>
        </nav>
        <main class="main-content">
          <div class="stats-grid">
            <div class="stat-card">
              <i class="fas fa-trophy"></i>
              <div>
                <h3>${this.data.tournaments.length}</h3>
                <p>Torneios</p>
              </div>
            </div>
            <div class="stat-card">
              <i class="fas fa-shield-alt"></i>
              <div>
                <h3>${this.data.clubs.length}</h3>
                <p>Clubes</p>
              </div>
            </div>
            <div class="stat-card">
              <i class="fas fa-users"></i>
              <div>
                <h3>${this.data.players.length}</h3>
                <p>Jogadores</p>
              </div>
            </div>
            <div class="stat-card">
              <i class="fas fa-futbol"></i>
              <div>
                <h3>${this.data.matches.length}</h3>
                <p>Partidas</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    `;
  }

  showTournaments() {
    // Implementar interface de torneios
    console.log('Mostrar torneios');
  }

  showClubs() {
    // Implementar interface de clubes
    console.log('Mostrar clubes');
  }

  showPlayers() {
    // Implementar interface de jogadores
    console.log('Mostrar jogadores');
  }

  showMatches() {
    // Implementar interface de partidas
    console.log('Mostrar partidas');
  }

  showStandings() {
    // Implementar interface de classificação
    console.log('Mostrar classificação');
  }

  // Função para obter bandeira do país
  getCountryFlag(country) {
    const flags = {
      Brasil: "https://flagcdn.com/w20/br.png",
      Argentina: "https://flagcdn.com/w20/ar.png",
      Uruguai: "https://flagcdn.com/w20/uy.png",
      Chile: "https://flagcdn.com/w20/cl.png",
      Colômbia: "https://flagcdn.com/w20/co.png",
      Peru: "https://flagcdn.com/w20/pe.png",
      Equador: "https://flagcdn.com/w20/ec.png",
      Venezuela: "https://flagcdn.com/w20/ve.png",
      Bolívia: "https://flagcdn.com/w20/bo.png",
      Paraguai: "https://flagcdn.com/w20/py.png",
      Portugal: "https://flagcdn.com/w20/pt.png",
      Espanha: "https://flagcdn.com/w20/es.png",
      França: "https://flagcdn.com/w20/fr.png",
      Itália: "https://flagcdn.com/w20/it.png",
      Alemanha: "https://flagcdn.com/w20/de.png",
      Inglaterra: "https://flagcdn.com/w20/gb-eng.png",
      Holanda: "https://flagcdn.com/w20/nl.png",
      Bélgica: "https://flagcdn.com/w20/be.png",
      Croácia: "https://flagcdn.com/w20/hr.png",
      Sérvia: "https://flagcdn.com/w20/rs.png",
      Polônia: "https://flagcdn.com/w20/pl.png",
      "República Tcheca": "https://flagcdn.com/w20/cz.png",
      Dinamarca: "https://flagcdn.com/w20/dk.png",
      Suécia: "https://flagcdn.com/w20/se.png",
      Noruega: "https://flagcdn.com/w20/no.png",
      Finlândia: "https://flagcdn.com/w20/fi.png",
      Japão: "https://flagcdn.com/w20/jp.png",
      "Coreia do Sul": "https://flagcdn.com/w20/kr.png",
      Austrália: "https://flagcdn.com/w20/au.png",
      "Estados Unidos": "https://flagcdn.com/w20/us.png",
      Canadá: "https://flagcdn.com/w20/ca.png",
      México: "https://flagcdn.com/w20/mx.png",
      "Costa Rica": "https://flagcdn.com/w20/cr.png",
      Panamá: "https://flagcdn.com/w20/pa.png",
      Jamaica: "https://flagcdn.com/w20/jm.png",
      Marrocos: "https://flagcdn.com/w20/ma.png",
      Argélia: "https://flagcdn.com/w20/dz.png",
      Tunísia: "https://flagcdn.com/w20/tn.png",
      Egito: "https://flagcdn.com/w20/eg.png",
      Nigéria: "https://flagcdn.com/w20/ng.png",
      Gana: "https://flagcdn.com/w20/gh.png",
      Senegal: "https://flagcdn.com/w20/sn.png",
      Camarões: "https://flagcdn.com/w20/cm.png",
      "África do Sul": "https://flagcdn.com/w20/za.png",
      Escócia: "https://flagcdn.com/w20/gb-sct.png",
      Turquia: "https://flagcdn.com/w20/tr.png",
      Rússia: "https://flagcdn.com/w20/ru.png",
      Ucrânia: "https://flagcdn.com/w20/ua.png",
      Eslováquia: "https://flagcdn.com/w20/sk.png",
      "DR Congo": "https://flagcdn.com/w20/cd.png",
    };
    return flags[country] || "https://flagcdn.com/w20/xx.png";
  }
}

// Inicializar aplicação
const app = new TourneyProSupabase();