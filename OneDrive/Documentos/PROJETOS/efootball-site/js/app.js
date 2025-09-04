// Sistema de Gerenciamento de Torneios
class TournamentManager {
  constructor() {
    this.currentUser = null;
    this.data = {
      users: JSON.parse(localStorage.getItem("users") || "[]"),
      tournaments: JSON.parse(localStorage.getItem("tournaments") || "[]"),
      clubs: JSON.parse(localStorage.getItem("clubs") || "[]"),
      players: JSON.parse(localStorage.getItem("players") || "[]"),
      coaches: JSON.parse(localStorage.getItem("coaches") || "[]"),
      matches: JSON.parse(localStorage.getItem("matches") || "[]"),
      rounds: JSON.parse(localStorage.getItem("rounds") || "[]"),
    };
    this.init();
  }

  init() {
    this.loadTheme();
    this.setupEventListeners();
    this.checkAuth();
  }

  // Autenticação
  checkAuth() {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      this.showDashboard();
    } else {
      document.getElementById("landing-screen").classList.add("active");
    }
  }

  login(username, password) {
    const user = this.data.users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      this.currentUser = user;
      localStorage.setItem("currentUser", JSON.stringify(user));
      this.showDashboard();
      return true;
    }
    return false;
  }

  register(username, password) {
    const existingUser = this.data.users.find((u) => u.username === username);
    if (existingUser) {
      return false;
    }

    const newUser = {
      id: Date.now(),
      username,
      password,
      createdAt: new Date().toISOString(),
    };

    this.data.users.push(newUser);
    localStorage.setItem("users", JSON.stringify(this.data.users));
    return true;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem("currentUser");
    this.showLogin();
  }

  // Interface
  showLogin() {
    document.getElementById("landing-screen").classList.remove("active");
    document.getElementById("login-screen").classList.add("active");
    document.getElementById("dashboard-screen").classList.remove("active");
  }

  showDashboard() {
    document.getElementById("landing-screen").classList.remove("active");
    document.getElementById("login-screen").classList.remove("active");
    document.getElementById("dashboard-screen").classList.add("active");
    document.getElementById("user-name").textContent = this.currentUser.username;
    this.updateStats();
    this.loadDashboardData();
  }

  showSection(sectionName) {
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.remove("active");
    });

    document.getElementById(`${sectionName}-content`).classList.add("active");

    document.querySelectorAll(".menu a").forEach((link) => {
      link.classList.remove("active");
    });
    document.querySelector(`[data-screen="${sectionName}"]`).classList.add("active");

    this.loadSectionData(sectionName);
  }

  // Dados
  saveData(type) {
    localStorage.setItem(type, JSON.stringify(this.data[type]));
  }

  getUserData(type) {
    return this.data[type].filter((item) => item.userId === this.currentUser.id);
  }

  updateStats() {
    const matches = this.getUserData("matches");
    const totalGoals = matches.reduce((total, match) => {
      if (match.events) {
        return total + match.events.filter((event) => event.type === "Gol").length;
      }
      return total;
    }, 0);

    document.getElementById("total-tournaments").textContent = this.getUserData("tournaments").length;
    document.getElementById("total-clubs").textContent = this.getUserData("clubs").length;
    document.getElementById("total-players").textContent = this.getUserData("players").length;
    document.getElementById("total-coaches").textContent = this.getUserData("coaches").length;
    document.getElementById("total-matches").textContent = matches.length;
    document.getElementById("total-goals").textContent = totalGoals;
  }

  loadDashboardData() {
    this.loadTournaments();
    this.loadClubs();
    this.loadPlayers();
    this.loadCoaches();
    this.loadMatches();
    this.loadScorers();
    this.loadStatistics();
    this.loadRounds();
  }

  loadSectionData(section) {
    switch (section) {
      case "tournaments":
        this.loadTournaments();
        break;
      case "clubs":
        this.loadClubs();
        break;
      case "players":
        this.loadPlayers();
        break;
      case "coaches":
        this.loadCoaches();
        break;
      case "matches":
        this.loadMatches();
        break;
      case "scorers":
        this.loadScorers();
        break;
      case "statistics":
        this.loadStatistics();
        break;
      case "rounds":
        this.loadRounds();
        break;
    }
  }

  // Torneios
  loadTournaments() {
    let tournaments = this.getUserData("tournaments");
    const searchTerm = document.getElementById("tournaments-search").value.toLowerCase();

    if (searchTerm) {
      tournaments = tournaments.filter(
        (tournament) =>
          tournament.name.toLowerCase().includes(searchTerm) ||
          tournament.description.toLowerCase().includes(searchTerm) ||
          tournament.game.toLowerCase().includes(searchTerm)
      );
    }

    const container = document.getElementById("tournaments-list");
    container.innerHTML = tournaments
      .map(
        (tournament) => `
        <div class="card">
          <h3>${tournament.name}</h3>
          <p><strong>Jogo:</strong> ${tournament.game === 'efootball' ? 'eFootball' : tournament.game === 'fifa' ? 'FIFA' : tournament.game}</p>
          <p><strong>Início:</strong> ${new Date(tournament.startDate).toLocaleDateString('pt-BR')}</p>
          <p><strong>Descrição:</strong> ${tournament.description || 'Sem descrição'}</p>
          <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button class="btn-primary" onclick="app.showTournamentProfile(${tournament.id})" style="flex: 1;">Ver Torneio</button>
            <button class="btn-edit" onclick="app.editTournament(${tournament.id})">Editar</button>
          </div>
        </div>
      `
      )
      .join("");

    this.updateTournamentSelects();
  }

  createTournament(data) {
    const tournament = {
      id: Date.now(),
      userId: this.currentUser.id,
      ...data,
      createdAt: new Date().toISOString(),
      status: "Ativo",
    };

    this.data.tournaments.push(tournament);
    this.saveData("tournaments");
    this.loadTournaments();
    this.updateStats();
  }

  editTournament(tournamentId) {
    const tournament = this.data.tournaments.find((t) => t.id === tournamentId);
    if (!tournament) return;

    document.getElementById("tournament-name").value = tournament.name;
    document.getElementById("tournament-logo").value = tournament.logo || "";
    document.getElementById("tournament-game").value = tournament.game;
    document.getElementById("tournament-start").value = tournament.startDate;
    document.getElementById("tournament-description").value = tournament.description || "";

    document.getElementById("tournament-modal").style.display = "block";

    const form = document.getElementById("tournament-form");
    form.dataset.editId = tournamentId;

    document.querySelector("#tournament-modal h3").textContent = "Editar Torneio";
  }

  updateTournament(tournamentId, data) {
    const tournamentIndex = this.data.tournaments.findIndex((t) => t.id == tournamentId);
    if (tournamentIndex !== -1) {
      this.data.tournaments[tournamentIndex] = {
        ...this.data.tournaments[tournamentIndex],
        ...data,
      };
      this.saveData("tournaments");
      this.loadTournaments();

      document.querySelector("#tournament-modal h3").textContent = "Novo Torneio";
    }
  }

  updateTournamentSelects() {
    const tournaments = this.getUserData("tournaments");
    const selects = [
      "club-tournament",
      "tournament-scorers-filter",
      "tournament-statistics-filter",
      "match-tournament",
      "tournament-rounds-filter",
    ];

    selects.forEach((selectId) => {
      const select = document.getElementById(selectId);
      if (select) {
        const currentValue = select.value;
        select.innerHTML =
          '<option value="">Selecione um torneio</option>' +
          tournaments.map((t) => `<option value="${t.id}">${t.name}</option>`).join("");
        select.value = currentValue;
      }
    });
  }

  // Clubes
  loadClubs() {
    let clubs = this.getUserData("clubs");
    const searchTerm = document.getElementById("clubs-search").value.toLowerCase();

    if (searchTerm) {
      clubs = clubs.filter(
        (club) =>
          club.name.toLowerCase().includes(searchTerm) ||
          club.country.toLowerCase().includes(searchTerm)
      );
    }

    const container = document.getElementById("clubs-list");
    container.innerHTML = clubs
      .map((club) => {
        const tournament = this.data.tournaments.find((t) => t.id == club.tournamentId);
        return `
        <div class="card">
          <img src="${club.logo || 'https://via.placeholder.com/50'}" alt="${club.name}" style="width: 50px; height: 50px; object-fit: cover;">
          <h3>${club.name}</h3>
          <p><strong>País:</strong> ${club.country}</p>
          <p><strong>Torneio:</strong> ${tournament?.name || 'Nenhum'}</p>
          <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button class="btn-primary" onclick="app.showClubProfile(${club.id})" style="flex: 1;">Ver Clube</button>
            <button class="btn-edit" onclick="app.editClub(${club.id})">Editar</button>
          </div>
        </div>
      `;
      })
      .join("");

    this.updateClubSelects();
  }

  createClub(data) {
    const club = {
      id: Date.now(),
      userId: this.currentUser.id,
      ...data,
      createdAt: new Date().toISOString(),
    };

    this.data.clubs.push(club);
    this.saveData("clubs");
    this.loadClubs();
    this.updateStats();
  }

  editClub(clubId) {
    const club = this.data.clubs.find((c) => c.id === clubId);
    if (!club) return;

    document.getElementById("club-name").value = club.name;
    document.getElementById("club-country").value = club.country;
    document.getElementById("club-logo").value = club.logo || "";
    document.getElementById("club-tournament").value = club.tournamentId || "";

    document.getElementById("club-modal").style.display = "block";

    const form = document.getElementById("club-form");
    form.dataset.editId = clubId;

    document.querySelector("#club-modal h3").textContent = "Editar Clube";
  }

  updateClub(clubId, data) {
    const clubIndex = this.data.clubs.findIndex((c) => c.id == clubId);
    if (clubIndex !== -1) {
      this.data.clubs[clubIndex] = {
        ...this.data.clubs[clubIndex],
        ...data,
      };
      this.saveData("clubs");
      this.loadClubs();

      document.querySelector("#club-modal h3").textContent = "Novo Clube";
    }
  }

  updateClubSelects() {
    const clubs = this.getUserData("clubs");
    const selects = ["player-club", "coach-club", "club-filter", "coaches-club-filter", "home-team", "away-team"];

    selects.forEach((selectId) => {
      const select = document.getElementById(selectId);
      if (select) {
        const currentValue = select.value;
        const baseOptions =
          selectId === "club-filter" || selectId === "coaches-club-filter"
            ? '<option value="">Todos os clubes</option>'
            : '<option value="">Selecione o clube</option>';

        select.innerHTML =
          baseOptions +
          clubs.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");
        select.value = currentValue;
      }
    });
  }

  // Jogadores
  loadPlayers() {
    let players = this.getUserData("players");
    const clubFilter = document.getElementById("club-filter").value;
    const searchTerm = document.getElementById("players-search").value.toLowerCase();

    if (clubFilter) {
      players = players.filter((p) => p.clubId == clubFilter);
    }

    if (searchTerm) {
      players = players.filter(
        (player) =>
          player.name.toLowerCase().includes(searchTerm) ||
          player.position.toLowerCase().includes(searchTerm) ||
          player.nationality.toLowerCase().includes(searchTerm)
      );
    }

    const container = document.getElementById("players-list");
    container.innerHTML = players
      .map((player) => {
        const club = this.data.clubs.find((c) => c.id == player.clubId);
        return `
        <div class="card">
          <img src="${player.photo || 'https://via.placeholder.com/60'}" alt="${player.name}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;">
          <h3>${player.name}</h3>
          <p><strong>Posição:</strong> ${player.position}</p>
          <p><strong>Idade:</strong> ${player.age || 'N/A'} anos</p>
          <p><strong>Nacionalidade:</strong> ${player.nationality}</p>
          <p><strong>Clube:</strong> ${club ? club.name : 'Sem clube'}</p>
          <div style="display: flex; gap: 10px; margin-top: 15px;">
            <button class="btn-primary" onclick="app.showPlayerProfile(${player.id})" style="flex: 1;">Ver Perfil</button>
            <button class="btn-edit" onclick="app.editPlayer(${player.id})">Editar</button>
          </div>
        </div>
      `;
      })
      .join("");
  }

  createPlayer(data) {
    const player = {
      id: Date.now(),
      userId: this.currentUser.id,
      ...data,
      createdAt: new Date().toISOString(),
    };

    this.data.players.push(player);
    this.saveData("players");
    this.loadPlayers();
    this.updateStats();
  }

  editPlayer(playerId) {
    const player = this.data.players.find((p) => p.id === playerId);
    if (!player) return;

    document.getElementById("player-name").value = player.name;
    document.getElementById("player-birthdate").value = player.birthdate || "";
    document.getElementById("player-position").value = player.position;
    document.getElementById("player-nationality").value = player.nationality;
    document.getElementById("player-number").value = player.number || "";
    document.getElementById("player-height").value = player.height || "";
    document.getElementById("player-photo").value = player.photo || "";
    document.getElementById("player-club").value = player.clubId;

    document.getElementById("player-modal").style.display = "block";

    const form = document.getElementById("player-form");
    form.dataset.editId = playerId;

    document.querySelector("#player-modal h3").textContent = "Editar Jogador";
  }

  updatePlayer(playerId, data) {
    const playerIndex = this.data.players.findIndex((p) => p.id == playerId);
    if (playerIndex !== -1) {
      this.data.players[playerIndex] = {
        ...this.data.players[playerIndex],
        ...data,
      };
      this.saveData("players");
      this.loadPlayers();

      document.querySelector("#player-modal h3").textContent = "Novo Jogador";
    }
  }

  // Treinadores
  loadCoaches() {
    let coaches = this.getUserData("coaches");
    const clubFilter = document.getElementById("coaches-club-filter").value;
    const searchTerm = document.getElementById("coaches-search").value.toLowerCase();

    if (clubFilter) {
      coaches = coaches.filter((c) => c.clubId == clubFilter);
    }

    if (searchTerm) {
      coaches = coaches.filter(
        (coach) =>
          coach.name.toLowerCase().includes(searchTerm) ||
          coach.nationality.toLowerCase().includes(searchTerm) ||
          coach.formation.toLowerCase().includes(searchTerm)
      );
    }

    const container = document.getElementById("coaches-list");
    container.innerHTML = coaches
      .map((coach) => {
        const club = this.data.clubs.find((c) => c.id == coach.clubId);
        return `
        <div class="card">
          <img src="${coach.photo || 'https://via.placeholder.com/60'}" alt="${coach.name}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;">
          <h3>${coach.name}</h3>
          <p><strong>Nacionalidade:</strong> ${coach.nationality}</p>
          <p><strong>Experiência:</strong> ${coach.experience || 'N/A'} anos</p>
          <p><strong>Formação:</strong> ${coach.formation || 'N/A'}</p>
          <p><strong>Clube:</strong> ${club ? club.name : 'Sem clube'}</p>
          <button class="btn-edit" onclick="app.editCoach(${coach.id})">Editar</button>
        </div>
      `;
      })
      .join("");
  }

  createCoach(data) {
    const coach = {
      id: Date.now(),
      userId: this.currentUser.id,
      ...data,
      createdAt: new Date().toISOString(),
    };

    this.data.coaches.push(coach);
    this.saveData("coaches");
    this.loadCoaches();
    this.updateStats();
  }

  editCoach(coachId) {
    const coach = this.data.coaches.find((c) => c.id === coachId);
    if (!coach) return;

    document.getElementById("coach-name").value = coach.name;
    document.getElementById("coach-birthdate").value = coach.birthdate || "";
    document.getElementById("coach-nationality").value = coach.nationality;
    document.getElementById("coach-experience").value = coach.experience || "";
    document.getElementById("coach-formation").value = coach.formation || "";
    document.getElementById("coach-photo").value = coach.photo || "";
    document.getElementById("coach-club").value = coach.clubId;

    document.getElementById("coach-modal").style.display = "block";

    const form = document.getElementById("coach-form");
    form.dataset.editId = coachId;

    document.querySelector("#coach-modal h3").textContent = "Editar Treinador";
  }

  updateCoach(coachId, data) {
    const coachIndex = this.data.coaches.findIndex((c) => c.id == coachId);
    if (coachIndex !== -1) {
      this.data.coaches[coachIndex] = {
        ...this.data.coaches[coachIndex],
        ...data,
      };
      this.saveData("coaches");
      this.loadCoaches();

      document.querySelector("#coach-modal h3").textContent = "Novo Treinador";
    }
  }

  // Partidas
  loadMatches() {
    let matches = this.getUserData("matches");
    const searchTerm = document.getElementById("matches-search").value.toLowerCase();

    if (searchTerm) {
      matches = matches.filter((match) => {
        const homeTeam = this.data.clubs.find((c) => c.id == match.homeTeamId);
        const awayTeam = this.data.clubs.find((c) => c.id == match.awayTeamId);
        const tournament = this.data.tournaments.find((t) => t.id == match.tournamentId);

        return (
          homeTeam?.name.toLowerCase().includes(searchTerm) ||
          awayTeam?.name.toLowerCase().includes(searchTerm) ||
          tournament?.name.toLowerCase().includes(searchTerm) ||
          `rodada ${match.round}`.includes(searchTerm)
        );
      });
    }

    const container = document.getElementById("matches-list");
    container.innerHTML = matches
      .map((match) => {
        const homeTeam = this.data.clubs.find((c) => c.id == match.homeTeamId);
        const awayTeam = this.data.clubs.find((c) => c.id == match.awayTeamId);
        const tournament = this.data.tournaments.find((t) => t.id == match.tournamentId);
        const isFinished = match.status === "finished";

        return `
        <div class="card match-card ${isFinished ? 'finished' : 'scheduled'}">
          <div class="match-header">
            <h3>${homeTeam?.name || 'Time'} vs ${awayTeam?.name || 'Time'}</h3>
            <span class="match-status">${isFinished ? 'Finalizada' : 'Agendada'}</span>
          </div>
          <div class="match-details">
            <p><strong>Placar:</strong> ${isFinished ? `${match.homeScore} - ${match.awayScore}` : 'A definir'}</p>
            <p><strong>Rodada:</strong> ${match.round}</p>
            <p><strong>Data:</strong> ${new Date(match.date).toLocaleDateString('pt-BR')}</p>
            <p><strong>Torneio:</strong> ${tournament?.name || 'Torneio'}</p>
          </div>
          ${!isFinished ? `<button class="btn-edit" onclick="app.editMatch(${match.id})">Editar</button>` : ''}
        </div>
      `;
      })
      .join("");
  }

  createMatch(data) {
    const match = {
      id: Date.now(),
      userId: this.currentUser.id,
      ...data,
      status: data.homeScore !== undefined && data.awayScore !== undefined ? "finished" : "scheduled",
      createdAt: new Date().toISOString(),
    };

    this.data.matches.push(match);
    this.saveData("matches");
    this.loadMatches();
    this.updateStats();
  }

  editMatch(matchId) {
    const match = this.data.matches.find((m) => m.id === matchId);
    if (!match) return;

    document.getElementById("home-team").value = match.homeTeamId;
    document.getElementById("away-team").value = match.awayTeamId;
    document.getElementById("match-tournament").value = match.tournamentId;
    document.getElementById("match-round").value = match.round;
    const dateValue = match.date.includes("T") ? match.date.split("T")[0] + "T" + match.date.split("T")[1].substring(0, 5) : match.date;
    document.getElementById("match-date").value = dateValue;

    if (match.homeScore !== undefined && match.awayScore !== undefined) {
      document.getElementById("match-played").checked = true;
      document.getElementById("home-score").value = match.homeScore;
      document.getElementById("away-score").value = match.awayScore;
      document.getElementById("match-events-section").style.display = "block";
      document.getElementById("home-score").required = true;
      document.getElementById("away-score").required = true;
    }

    document.getElementById("match-modal").style.display = "block";

    const form = document.getElementById("match-form");
    form.dataset.editId = matchId;

    document.querySelector("#match-modal h3").textContent = "Editar Partida";
  }

  updateMatch(matchId, data) {
    const matchIndex = this.data.matches.findIndex((m) => m.id == matchId);
    if (matchIndex !== -1) {
      const updatedMatch = {
        ...this.data.matches[matchIndex],
        ...data,
        id: parseInt(matchId),
        status: data.homeScore !== undefined && data.awayScore !== undefined ? "finished" : "scheduled",
      };

      this.data.matches[matchIndex] = updatedMatch;
      this.saveData("matches");
      this.loadMatches();
      this.updateStats();

      document.querySelector("#match-modal h3").textContent = "Nova Partida";
    }
  }

  // Artilharia
  loadScorers() {
    const tournamentId = document.getElementById("tournament-scorers-filter").value;
    if (!tournamentId) {
      document.getElementById("scorers-table").innerHTML = "<p>Selecione um torneio para ver a artilharia.</p>";
      return;
    }

    const matches = this.getUserData("matches").filter(
      (m) => m.tournamentId == tournamentId && m.status === "finished"
    );

    const scorers = {};

    matches.forEach((match) => {
      if (match.events) {
        match.events.forEach((event) => {
          if (event.type === "Gol") {
            const playerId = event.playerId || event.player;
            if (!scorers[playerId]) {
              const player = this.data.players.find((p) => p.id == playerId || p.name === event.player);
              const club = this.data.clubs.find((c) => c.id == player?.clubId);
              scorers[playerId] = {
                name: player?.name || event.player,
                club: club?.name || event.team,
                goals: 0,
              };
            }
            scorers[playerId].goals++;
          }
        });
      }
    });

    const scorersList = Object.values(scorers).sort((a, b) => b.goals - a.goals);

    const container = document.getElementById("scorers-table");
    container.innerHTML = `
      <div class="standings-table">
        <table>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Jogador</th>
              <th>Clube</th>
              <th>Gols</th>
            </tr>
          </thead>
          <tbody>
            ${scorersList
              .map(
                (scorer, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td><strong>${scorer.name}</strong></td>
                  <td>${scorer.club}</td>
                  <td><strong>${scorer.goals}</strong></td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  // Estatísticas
  loadStatistics() {
    const tournamentId = document.getElementById("tournament-statistics-filter").value;
    if (!tournamentId) {
      document.getElementById("statistics-container").innerHTML = "<p>Selecione um torneio para ver as estatísticas dos jogadores.</p>";
      return;
    }

    const clubs = this.getUserData("clubs").filter((c) => c.tournamentId == tournamentId);
    const players = this.getUserData("players").filter((p) => {
      const club = clubs.find((c) => c.id == p.clubId);
      return club;
    });
    const matches = this.getUserData("matches").filter(
      (m) => m.tournamentId == tournamentId && m.status === "finished"
    );

    const playerStats = players.map((player) => {
      const club = clubs.find((c) => c.id == player.clubId);
      const stats = {
        id: player.id,
        name: player.name,
        club: club?.name || "N/A",
        position: player.position,
        matches: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        totalEvents: 0,
      };

      matches.forEach((match) => {
        const isPlayerInMatch = match.events?.some(
          (event) => event.playerId == player.id || event.player === player.name
        );
        if (isPlayerInMatch) {
          stats.matches++;
        }
      });

      matches.forEach((match) => {
        if (match.events) {
          match.events.forEach((event) => {
            if (event.playerId == player.id || event.player === player.name) {
              stats.totalEvents++;
              switch (event.type) {
                case "Gol":
                  stats.goals++;
                  break;
                case "Assistência":
                  stats.assists++;
                  break;
                case "Cartão Amarelo":
                  stats.yellowCards++;
                  break;
                case "Cartão Vermelho":
                  stats.redCards++;
                  break;
              }
            }
          });
        }
      });

      return stats;
    });

    const activePlayerStats = playerStats.filter((stats) => stats.totalEvents > 0);
    activePlayerStats.sort((a, b) => {
      if (b.goals !== a.goals) return b.goals - a.goals;
      if (b.assists !== a.assists) return b.assists - a.assists;
      return b.matches - a.matches;
    });

    const container = document.getElementById("statistics-container");

    if (activePlayerStats.length === 0) {
      container.innerHTML = "<p>Nenhuma estatística encontrada para este torneio.</p>";
      return;
    }

    container.innerHTML = `
      <div class="statistics-table">
        <table>
          <thead>
            <tr>
              <th>Pos</th>
              <th>Jogador</th>
              <th>Clube</th>
              <th>Posição</th>
              <th>Jogos</th>
              <th>Gols</th>
              <th>Assists</th>
              <th>🟨</th>
              <th>🟥</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${activePlayerStats
              .map(
                (stats, index) => `
              <tr>
                <td>${index + 1}</td>
                <td><strong>${stats.name}</strong></td>
                <td>${stats.club}</td>
                <td><span class="position-badge">${stats.position}</span></td>
                <td>${stats.matches}</td>
                <td><strong style="color: #4CAF50;">${stats.goals}</strong></td>
                <td><strong style="color: #2196F3;">${stats.assists}</strong></td>
                <td>${stats.yellowCards > 0 ? stats.yellowCards : "-"}</td>
                <td>${stats.redCards > 0 ? stats.redCards : "-"}</td>
                <td><strong>${stats.totalEvents}</strong></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  // Rodadas
  loadRounds() {
    const tournamentId = document.getElementById("tournament-rounds-filter").value;
    const container = document.getElementById("rounds-container");

    if (!tournamentId) {
      container.innerHTML = "<p>Selecione um torneio para gerenciar as rodadas.</p>";
      return;
    }

    const rounds = this.getUserData("rounds").filter((r) => r.tournamentId == tournamentId);
    const clubs = this.getUserData("clubs").filter((c) => c.tournamentId == tournamentId);

    if (clubs.length < 2) {
      container.innerHTML = "<p>Adicione pelo menos 2 clubes ao torneio para criar rodadas.</p>";
      return;
    }

    container.innerHTML = `
      <div class="rounds-header">
        <button class="btn-primary" onclick="app.showCreateRoundModal(${tournamentId})">
          <i class="fas fa-plus"></i> Nova Rodada
        </button>
      </div>
      <div class="rounds-list">
        ${
          rounds.length === 0
            ? "<p>Nenhuma rodada criada ainda.</p>"
            : rounds
                .map(
                  (round) => `
                  <div class="round-card">
                    <div class="round-header">
                      <h3>Rodada ${round.number}</h3>
                      <span class="round-date">${new Date(round.date).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <div class="round-matches">
                      ${round.matches
                        .map((match) => {
                          const homeTeam = clubs.find((c) => c.id == match.homeTeamId);
                          const awayTeam = clubs.find((c) => c.id == match.awayTeamId);
                          return `
                            <div class="round-match">
                              <span class="team">${homeTeam?.name || "Time"}</span>
                              <span class="vs">-</span>
                              <span class="team">${awayTeam?.name || "Time"}</span>
                            </div>
                          `;
                        })
                        .join("")}
                    </div>
                  </div>
                `
                )
                .join("")
        }
      </div>
    `;
  }

  showCreateRoundModal(tournamentId) {
    document.getElementById("round-modal").style.display = "block";
    document.getElementById("round-form").dataset.tournamentId = tournamentId;

    const rounds = this.getUserData("rounds").filter((r) => r.tournamentId == tournamentId);
    const nextRound = rounds.length > 0 ? Math.max(...rounds.map((r) => r.number)) + 1 : 1;
    document.getElementById("round-number").value = nextRound;
  }

  generateMatches() {
    const tournamentId = document.getElementById("round-form").dataset.tournamentId;
    const clubs = this.getUserData("clubs").filter((c) => c.tournamentId == tournamentId);
    const container = document.getElementById("round-matches");

    if (clubs.length < 2) {
      alert("Adicione pelo menos 2 times ao torneio!");
      return;
    }

    const matches = [];
    for (let i = 0; i < clubs.length; i += 2) {
      if (i + 1 < clubs.length) {
        matches.push({
          homeTeamId: clubs[i].id,
          awayTeamId: clubs[i + 1].id,
        });
      }
    }

    container.innerHTML =
      matches
        .map((match, index) => {
          const homeTeam = clubs.find((c) => c.id == match.homeTeamId);
          const awayTeam = clubs.find((c) => c.id == match.awayTeamId);
          return `
            <div class="match-pair">
              <select name="homeTeam_${index}" required>
                ${clubs
                  .map(
                    (c) =>
                      `<option value="${c.id}" ${c.id == match.homeTeamId ? "selected" : ""}>${c.name}</option>`
                  )
                  .join("")}
              </select>
              <span class="vs">-</span>
              <select name="awayTeam_${index}" required>
                ${clubs
                  .map(
                    (c) =>
                      `<option value="${c.id}" ${c.id == match.awayTeamId ? "selected" : ""}>${c.name}</option>`
                  )
                  .join("")}
              </select>
              <button type="button" onclick="this.parentElement.remove()">Remover</button>
            </div>
          `;
        })
        .join("") +
      `
        <button type="button" onclick="app.addMatchPair()">Adicionar Jogo</button>
      `;
  }

  addMatchPair() {
    const tournamentId = document.getElementById("round-form").dataset.tournamentId;
    const clubs = this.getUserData("clubs").filter((c) => c.tournamentId == tournamentId);
    const container = document.getElementById("round-matches");
    const index = container.querySelectorAll(".match-pair").length;

    const matchDiv = document.createElement("div");
    matchDiv.className = "match-pair";
    matchDiv.innerHTML = `
      <select name="homeTeam_${index}" required>
        <option value="">Selecione o time da casa</option>
        ${clubs.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}
      </select>
      <span class="vs">-</span>
      <select name="awayTeam_${index}" required>
        <option value="">Selecione o time visitante</option>
        ${clubs.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}
      </select>
      <button type="button" onclick="this.parentElement.remove()">Remover</button>
    `;

    container.insertBefore(matchDiv, container.lastElementChild);
  }

  createRound(data) {
    const round = {
      id: Date.now(),
      userId: this.currentUser.id,
      ...data,
      createdAt: new Date().toISOString(),
    };

    this.data.rounds.push(round);
    this.saveData("rounds");

    data.matches.forEach((match) => {
      this.createMatch({
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
        tournamentId: data.tournamentId,
        round: data.number,
        date: data.date + "T20:00:00",
      });
    });

    this.loadRounds();
  }

  // Perfil do Jogador
  showPlayerProfile(playerId) {
    const player = this.data.players.find(p => p.id === playerId);
    if (!player) return;

    const club = this.data.clubs.find(c => c.id == player.clubId);
    const matches = this.getUserData("matches").filter(m => m.status === "finished");
    
    // Calcular estatísticas do jogador
    const playerStats = {
      matches: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      matchHistory: []
    };

    matches.forEach(match => {
      let playerInMatch = false;
      const matchEvents = [];
      
      if (match.events) {
        match.events.forEach(event => {
          if (event.playerId == player.id || event.player === player.name) {
            playerInMatch = true;
            matchEvents.push(event);
            
            switch (event.type) {
              case "Gol":
                playerStats.goals++;
                break;
              case "Assistência":
                playerStats.assists++;
                break;
              case "Cartão Amarelo":
                playerStats.yellowCards++;
                break;
              case "Cartão Vermelho":
                playerStats.redCards++;
                break;
            }
          }
        });
      }
      
      if (playerInMatch) {
        playerStats.matches++;
        const homeTeam = this.data.clubs.find(c => c.id == match.homeTeamId);
        const awayTeam = this.data.clubs.find(c => c.id == match.awayTeamId);
        
        playerStats.matchHistory.push({
          date: match.date,
          homeTeam: homeTeam,
          awayTeam: awayTeam,
          score: `${match.homeScore} - ${match.awayScore}`,
          events: matchEvents
        });
      }
    });

    // Preencher dados do modal
    document.getElementById("profile-photo").src = player.photo || 'https://via.placeholder.com/120';
    document.getElementById("profile-name").textContent = player.name;
    document.getElementById("profile-position").textContent = player.position;
    document.getElementById("profile-club-logo").src = club?.logo || 'https://via.placeholder.com/30';
    document.getElementById("profile-club-name").textContent = club?.name || 'Sem clube';
    document.getElementById("profile-age").textContent = player.age ? `${player.age} anos` : '-';
    document.getElementById("profile-birthdate").textContent = player.birthdate ? new Date(player.birthdate).toLocaleDateString('pt-BR') : '-';
    document.getElementById("profile-nationality").textContent = player.nationality || '-';
    document.getElementById("profile-height").textContent = player.height ? `${player.height} cm` : '-';
    document.getElementById("profile-number").textContent = player.number || '-';
    
    // Estatísticas
    document.getElementById("profile-matches").textContent = playerStats.matches;
    document.getElementById("profile-goals").textContent = playerStats.goals;
    document.getElementById("profile-assists").textContent = playerStats.assists;
    document.getElementById("profile-yellow-cards").textContent = playerStats.yellowCards;
    document.getElementById("profile-red-cards").textContent = playerStats.redCards;
    document.getElementById("profile-rating").textContent = playerStats.matches > 0 ? ((playerStats.goals * 2 + playerStats.assists) / playerStats.matches).toFixed(1) : '-';
    
    // Histórico de partidas
    const timeline = document.getElementById("profile-matches-timeline");
    if (playerStats.matchHistory.length === 0) {
      timeline.innerHTML = '<div class="no-matches">Nenhuma partida encontrada</div>';
    } else {
      timeline.innerHTML = playerStats.matchHistory.map(match => `
        <div class="match-timeline-item">
          <div class="match-date">${new Date(match.date).toLocaleDateString('pt-BR')}</div>
          <div class="match-teams">
            <div class="match-team-logos">
              <img src="${match.homeTeam?.logo || 'https://via.placeholder.com/25'}" class="match-team-logo" alt="${match.homeTeam?.name}">
              <span class="match-vs">vs</span>
              <img src="${match.awayTeam?.logo || 'https://via.placeholder.com/25'}" class="match-team-logo" alt="${match.awayTeam?.name}">
            </div>
          </div>
          <div class="match-result">${match.score}</div>
          <div class="match-events">
            ${match.events.map(event => {
              let className = '';
              let icon = '';
              switch (event.type) {
                case 'Gol':
                  className = 'event-goal';
                  icon = '⚽';
                  break;
                case 'Assistência':
                  className = 'event-assist';
                  icon = '🅰️';
                  break;
                case 'Cartão Amarelo':
                  className = 'event-yellow';
                  icon = '🟨';
                  break;
                case 'Cartão Vermelho':
                  className = 'event-red';
                  icon = '🟥';
                  break;
                default:
                  return '';
              }
              return `<span class="event-badge ${className}">${icon}</span>`;
            }).join('')}
          </div>
        </div>
      `).join('');
    }
    
    document.getElementById("player-profile-modal").style.display = "block";
  }

  closePlayerProfile() {
    document.getElementById("player-profile-modal").style.display = "none";
  }

  // Perfil do Clube
  showClubProfile(clubId) {
    const club = this.data.clubs.find(c => c.id === clubId);
    if (!club) return;

    const tournament = this.data.tournaments.find(t => t.id == club.tournamentId);
    const clubPlayers = this.getUserData("players").filter(p => p.clubId == club.id);
    const clubMatches = this.getUserData("matches").filter(m => 
      (m.homeTeamId == club.id || m.awayTeamId == club.id) && m.status === "finished"
    );

    // Calcular estatísticas do clube
    const clubStats = {
      matches: clubMatches.length,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0
    };

    clubMatches.forEach(match => {
      const isHome = match.homeTeamId == club.id;
      const clubScore = isHome ? match.homeScore : match.awayScore;
      const opponentScore = isHome ? match.awayScore : match.homeScore;
      
      clubStats.goalsFor += clubScore;
      clubStats.goalsAgainst += opponentScore;
      
      if (clubScore > opponentScore) {
        clubStats.wins++;
      } else if (clubScore === opponentScore) {
        clubStats.draws++;
      } else {
        clubStats.losses++;
      }
    });

    // Preencher dados do modal
    document.getElementById("club-profile-logo").src = club.logo || 'https://via.placeholder.com/120';
    document.getElementById("club-profile-name").textContent = club.name;
    document.getElementById("club-profile-country").textContent = club.country;
    document.getElementById("club-profile-tournament").textContent = tournament?.name || 'Nenhum torneio';
    
    // Estatísticas gerais
    document.getElementById("club-total-matches").textContent = clubStats.matches;
    document.getElementById("club-wins").textContent = clubStats.wins;
    document.getElementById("club-draws").textContent = clubStats.draws;
    document.getElementById("club-losses").textContent = clubStats.losses;
    document.getElementById("club-goals-for").textContent = clubStats.goalsFor;
    document.getElementById("club-goals-against").textContent = clubStats.goalsAgainst;
    
    // Informações do elenco
    document.getElementById("club-total-players").textContent = clubPlayers.length;
    const avgAge = clubPlayers.length > 0 ? 
      Math.round(clubPlayers.reduce((sum, p) => sum + (p.age || 0), 0) / clubPlayers.length) : 0;
    document.getElementById("club-avg-age").textContent = avgAge;
    const foreignPlayers = clubPlayers.filter(p => p.nationality !== club.country).length;
    document.getElementById("club-foreign-players").textContent = foreignPlayers;
    
    this.loadClubSquad(clubPlayers);
    this.loadClubMatches(clubMatches, club);
    this.loadClubStatistics(clubPlayers, clubMatches);
    
    document.getElementById("club-profile-modal").style.display = "block";
  }

  loadClubSquad(players) {
    const container = document.getElementById("club-squad-list");
    if (players.length === 0) {
      container.innerHTML = '<div class="no-data">Nenhum jogador encontrado</div>';
      return;
    }

    container.innerHTML = players.map(player => `
      <div class="squad-player-card" onclick="app.showPlayerProfile(${player.id})">
        <div class="squad-player-header">
          <img src="${player.photo || 'https://via.placeholder.com/60'}" class="squad-player-photo" alt="${player.name}">
          <div class="squad-player-info">
            <h4>${player.name}</h4>
            <span class="squad-player-position">${player.position}</span>
          </div>
        </div>
        <div class="squad-player-details">
          <div class="squad-player-detail">
            <span>Idade</span>
            <span>${player.age || '-'}</span>
          </div>
          <div class="squad-player-detail">
            <span>Número</span>
            <span>${player.number || '-'}</span>
          </div>
          <div class="squad-player-detail">
            <span>Nacionalidade</span>
            <span>${player.nationality || '-'}</span>
          </div>
          <div class="squad-player-detail">
            <span>Altura</span>
            <span>${player.height ? player.height + ' cm' : '-'}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  loadClubMatches(matches, club) {
    const container = document.getElementById("club-matches-list");
    if (matches.length === 0) {
      container.innerHTML = '<div class="no-data">Nenhuma partida encontrada</div>';
      return;
    }

    container.innerHTML = matches.map(match => {
      const homeTeam = this.data.clubs.find(c => c.id == match.homeTeamId);
      const awayTeam = this.data.clubs.find(c => c.id == match.awayTeamId);
      const isHome = match.homeTeamId == club.id;
      const clubScore = isHome ? match.homeScore : match.awayScore;
      const opponentScore = isHome ? match.awayScore : match.homeScore;
      
      let resultClass = 'result-draw';
      let resultText = 'E';
      if (clubScore > opponentScore) {
        resultClass = 'result-win';
        resultText = 'V';
      } else if (clubScore < opponentScore) {
        resultClass = 'result-loss';
        resultText = 'D';
      }
      
      return `
        <div class="club-match-item">
          <div class="club-match-date">${new Date(match.date).toLocaleDateString('pt-BR')}</div>
          <div class="club-match-teams">
            <div class="club-match-team home">
              <span class="club-match-team-name">${homeTeam?.name}</span>
              <img src="${homeTeam?.logo || 'https://via.placeholder.com/30'}" class="club-match-team-logo" alt="${homeTeam?.name}">
            </div>
            <div class="club-match-score">${match.homeScore} - ${match.awayScore}</div>
            <div class="club-match-team">
              <img src="${awayTeam?.logo || 'https://via.placeholder.com/30'}" class="club-match-team-logo" alt="${awayTeam?.name}">
              <span class="club-match-team-name">${awayTeam?.name}</span>
            </div>
          </div>
          <div class="club-match-result ${resultClass}">${resultText}</div>
        </div>
      `;
    }).join('');
  }

  loadClubStatistics(players, matches) {
    // Artilheiros do clube
    const scorers = {};
    const assists = {};
    
    matches.forEach(match => {
      if (match.events) {
        match.events.forEach(event => {
          const player = players.find(p => p.id == event.playerId || p.name === event.player);
          if (player) {
            if (event.type === "Gol") {
              scorers[player.id] = scorers[player.id] || { player, goals: 0 };
              scorers[player.id].goals++;
            } else if (event.type === "Assistência") {
              assists[player.id] = assists[player.id] || { player, assists: 0 };
              assists[player.id].assists++;
            }
          }
        });
      }
    });
    
    // Top scorers
    const topScorers = Object.values(scorers).sort((a, b) => b.goals - a.goals).slice(0, 5);
    const scorersContainer = document.getElementById("club-top-scorers");
    if (topScorers.length === 0) {
      scorersContainer.innerHTML = '<div class="no-data">Nenhum artilheiro encontrado</div>';
    } else {
      scorersContainer.innerHTML = topScorers.map(scorer => `
        <div class="top-player-item" onclick="app.showPlayerProfile(${scorer.player.id})">
          <div class="top-player-info">
            <img src="${scorer.player.photo || 'https://via.placeholder.com/40'}" class="top-player-photo" alt="${scorer.player.name}">
            <div>
              <div class="top-player-name">${scorer.player.name}</div>
              <div class="top-player-position">${scorer.player.position}</div>
            </div>
          </div>
          <div class="top-player-stat">${scorer.goals}</div>
        </div>
      `).join('');
    }
    
    // Top assists
    const topAssists = Object.values(assists).sort((a, b) => b.assists - a.assists).slice(0, 5);
    const assistsContainer = document.getElementById("club-top-assists");
    if (topAssists.length === 0) {
      assistsContainer.innerHTML = '<div class="no-data">Nenhuma assistência encontrada</div>';
    } else {
      assistsContainer.innerHTML = topAssists.map(assist => `
        <div class="top-player-item" onclick="app.showPlayerProfile(${assist.player.id})">
          <div class="top-player-info">
            <img src="${assist.player.photo || 'https://via.placeholder.com/40'}" class="top-player-photo" alt="${assist.player.name}">
            <div>
              <div class="top-player-name">${assist.player.name}</div>
              <div class="top-player-position">${assist.player.position}</div>
            </div>
          </div>
          <div class="top-player-stat">${assist.assists}</div>
        </div>
      `).join('');
    }
  }

  showClubTab(tabName) {
    // Remover classe active de todas as abas
    document.querySelectorAll('.club-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.club-tab-content').forEach(content => content.classList.remove('active'));
    
    // Ativar aba selecionada
    event.target.classList.add('active');
    document.getElementById(`club-${tabName}`).classList.add('active');
  }

  closeClubProfile() {
    document.getElementById("club-profile-modal").style.display = "none";
  }

  // Perfil do Torneio
  showTournamentProfile(tournamentId) {
    const tournament = this.data.tournaments.find(t => t.id === tournamentId);
    if (!tournament) return;

    const tournamentClubs = this.getUserData("clubs").filter(c => c.tournamentId == tournament.id);
    const tournamentMatches = this.getUserData("matches").filter(m => m.tournamentId == tournament.id);
    
    // Preencher dados do modal
    document.getElementById("tournament-profile-logo").src = tournament.logo || 'https://via.placeholder.com/120';
    document.getElementById("tournament-profile-name").textContent = tournament.name;
    document.getElementById("tournament-profile-game").textContent = tournament.game === 'efootball' ? 'eFootball' : tournament.game === 'fifa' ? 'FIFA' : tournament.game;
    document.getElementById("tournament-profile-dates").textContent = `Início: ${new Date(tournament.startDate).toLocaleDateString('pt-BR')}`;
    
    this.loadTournamentStandings(tournamentClubs, tournamentMatches);
    this.loadTournamentMatches(tournamentMatches);
    this.loadTournamentStatistics(tournamentMatches);
    this.loadTournamentClubs(tournamentClubs, tournamentMatches);
    
    document.getElementById("tournament-profile-modal").style.display = "block";
  }

  loadTournamentStandings(clubs, matches) {
    if (clubs.length === 0) {
      document.querySelector("#tournament-standings-table tbody").innerHTML = 
        '<tr><td colspan="10" class="no-data">Nenhum clube encontrado</td></tr>';
      return;
    }

    // Calcular classificação
    const standings = clubs.map(club => {
      const clubMatches = matches.filter(m => 
        (m.homeTeamId == club.id || m.awayTeamId == club.id) && m.status === "finished"
      );
      
      const stats = {
        club,
        matches: clubMatches.length,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      };
      
      clubMatches.forEach(match => {
        const isHome = match.homeTeamId == club.id;
        const clubScore = isHome ? match.homeScore : match.awayScore;
        const opponentScore = isHome ? match.awayScore : match.homeScore;
        
        stats.goalsFor += clubScore;
        stats.goalsAgainst += opponentScore;
        
        if (clubScore > opponentScore) {
          stats.wins++;
          stats.points += 3;
        } else if (clubScore === opponentScore) {
          stats.draws++;
          stats.points += 1;
        } else {
          stats.losses++;
        }
      });
      
      stats.goalDifference = stats.goalsFor - stats.goalsAgainst;
      return stats;
    });
    
    // Ordenar por pontos, saldo de gols, gols pró
    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
    
    const tbody = document.querySelector("#tournament-standings-table tbody");
    tbody.innerHTML = standings.map((team, index) => {
      let positionClass = '';
      if (index === 0) positionClass = 'position-champion';
      else if (index < 4) positionClass = 'position-qualified';
      else if (index >= standings.length - 2) positionClass = 'position-relegation';
      
      return `
        <tr>
          <td><div class="standings-position ${positionClass}">${index + 1}</div></td>
          <td>
            <div class="team-info" onclick="app.showClubProfile(${team.club.id})">
              <img src="${team.club.logo || 'https://via.placeholder.com/30'}" class="team-logo" alt="${team.club.name}">
              <span class="team-name">${team.club.name}</span>
            </div>
          </td>
          <td class="stat-number">${team.matches}</td>
          <td class="stat-number">${team.wins}</td>
          <td class="stat-number">${team.draws}</td>
          <td class="stat-number">${team.losses}</td>
          <td class="stat-number">${team.goalsFor}</td>
          <td class="stat-number">${team.goalsAgainst}</td>
          <td class="stat-number">${team.goalDifference > 0 ? '+' : ''}${team.goalDifference}</td>
          <td class="stat-number" style="font-weight: 700; color: var(--primary-color);">${team.points}</td>
        </tr>
      `;
    }).join('');
  }

  loadTournamentMatches(matches) {
    const container = document.getElementById("tournament-matches-container");
    if (matches.length === 0) {
      container.innerHTML = '<div class="no-data">Nenhuma partida encontrada</div>';
      return;
    }

    // Agrupar por rodada
    const matchesByRound = {};
    matches.forEach(match => {
      if (!matchesByRound[match.round]) {
        matchesByRound[match.round] = [];
      }
      matchesByRound[match.round].push(match);
    });

    container.innerHTML = Object.keys(matchesByRound)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(round => {
        const roundMatches = matchesByRound[round];
        return `
          <div class="round-section">
            <div class="round-header">
              <div class="round-title">Rodada ${round}</div>
            </div>
            <div class="round-matches">
              ${roundMatches.map(match => {
                const homeTeam = this.data.clubs.find(c => c.id == match.homeTeamId);
                const awayTeam = this.data.clubs.find(c => c.id == match.awayTeamId);
                const isFinished = match.status === "finished";
                
                return `
                  <div class="tournament-match-item">
                    <div class="tournament-match-time">${new Date(match.date).toLocaleDateString('pt-BR')}</div>
                    <div class="tournament-match-teams">
                      <div class="tournament-match-team home">
                        <span class="tournament-match-team-name">${homeTeam?.name}</span>
                        <img src="${homeTeam?.logo || 'https://via.placeholder.com/25'}" class="tournament-match-team-logo" alt="${homeTeam?.name}">
                      </div>
                      <div class="tournament-match-score">
                        ${isFinished ? `${match.homeScore} - ${match.awayScore}` : 'vs'}
                      </div>
                      <div class="tournament-match-team">
                        <img src="${awayTeam?.logo || 'https://via.placeholder.com/25'}" class="tournament-match-team-logo" alt="${awayTeam?.name}">
                        <span class="tournament-match-team-name">${awayTeam?.name}</span>
                      </div>
                    </div>
                    <div class="match-status-badge ${isFinished ? 'status-finished' : 'status-scheduled'}">
                      ${isFinished ? 'Finalizada' : 'Agendada'}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('');
  }

  loadTournamentStatistics(matches) {
    const scorers = {};
    const assists = {};
    
    matches.forEach(match => {
      if (match.events) {
        match.events.forEach(event => {
          const player = this.data.players.find(p => p.id == event.playerId || p.name === event.player);
          const club = this.data.clubs.find(c => c.id == player?.clubId);
          
          if (player && event.type === "Gol") {
            scorers[player.id] = scorers[player.id] || { player, club, goals: 0 };
            scorers[player.id].goals++;
          } else if (player && event.type === "Assistência") {
            assists[player.id] = assists[player.id] || { player, club, assists: 0 };
            assists[player.id].assists++;
          }
        });
      }
    });
    
    // Top scorers
    const topScorers = Object.values(scorers).sort((a, b) => b.goals - a.goals).slice(0, 10);
    const scorersContainer = document.getElementById("tournament-top-scorers-list");
    if (topScorers.length === 0) {
      scorersContainer.innerHTML = '<div class="no-data">Nenhum artilheiro encontrado</div>';
    } else {
      scorersContainer.innerHTML = topScorers.map(scorer => `
        <div class="tournament-player-item" onclick="app.showPlayerProfile(${scorer.player.id})">
          <div class="tournament-player-info">
            <img src="${scorer.player.photo || 'https://via.placeholder.com/40'}" class="tournament-player-photo" alt="${scorer.player.name}">
            <div class="tournament-player-details">
              <div class="tournament-player-name">${scorer.player.name}</div>
              <div class="tournament-player-club">${scorer.club?.name || 'Sem clube'}</div>
            </div>
          </div>
          <div class="tournament-player-stat">${scorer.goals}</div>
        </div>
      `).join('');
    }
    
    // Top assists
    const topAssists = Object.values(assists).sort((a, b) => b.assists - a.assists).slice(0, 10);
    const assistsContainer = document.getElementById("tournament-top-assists-list");
    if (topAssists.length === 0) {
      assistsContainer.innerHTML = '<div class="no-data">Nenhuma assistência encontrada</div>';
    } else {
      assistsContainer.innerHTML = topAssists.map(assist => `
        <div class="tournament-player-item" onclick="app.showPlayerProfile(${assist.player.id})">
          <div class="tournament-player-info">
            <img src="${assist.player.photo || 'https://via.placeholder.com/40'}" class="tournament-player-photo" alt="${assist.player.name}">
            <div class="tournament-player-details">
              <div class="tournament-player-name">${assist.player.name}</div>
              <div class="tournament-player-club">${assist.club?.name || 'Sem clube'}</div>
            </div>
          </div>
          <div class="tournament-player-stat">${assist.assists}</div>
        </div>
      `).join('');
    }
  }

  loadTournamentClubs(clubs, matches) {
    const container = document.getElementById("tournament-clubs-list");
    if (clubs.length === 0) {
      container.innerHTML = '<div class="no-data">Nenhum clube encontrado</div>';
      return;
    }

    container.innerHTML = clubs.map(club => {
      const clubMatches = matches.filter(m => 
        (m.homeTeamId == club.id || m.awayTeamId == club.id) && m.status === "finished"
      );
      const clubPlayers = this.getUserData("players").filter(p => p.clubId == club.id);
      
      let wins = 0;
      clubMatches.forEach(match => {
        const isHome = match.homeTeamId == club.id;
        const clubScore = isHome ? match.homeScore : match.awayScore;
        const opponentScore = isHome ? match.awayScore : match.homeScore;
        if (clubScore > opponentScore) wins++;
      });
      
      return `
        <div class="tournament-club-card" onclick="app.showClubProfile(${club.id})">
          <div class="tournament-club-header">
            <img src="${club.logo || 'https://via.placeholder.com/60'}" class="tournament-club-logo" alt="${club.name}">
            <div class="tournament-club-info">
              <h4>${club.name}</h4>
              <div class="tournament-club-country">${club.country}</div>
            </div>
          </div>
          <div class="tournament-club-stats">
            <div class="tournament-club-stat">
              <div class="tournament-club-stat-number">${clubMatches.length}</div>
              <div class="tournament-club-stat-label">Jogos</div>
            </div>
            <div class="tournament-club-stat">
              <div class="tournament-club-stat-number">${wins}</div>
              <div class="tournament-club-stat-label">Vitórias</div>
            </div>
            <div class="tournament-club-stat">
              <div class="tournament-club-stat-number">${clubPlayers.length}</div>
              <div class="tournament-club-stat-label">Jogadores</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  showTournamentTab(tabName) {
    document.querySelectorAll('.tournament-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tournament-tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`tournament-${tabName}`).classList.add('active');
  }

  closeTournamentProfile() {
    document.getElementById("tournament-profile-modal").style.display = "none";
  }

  // Theme
  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    const themeIcon = document.querySelector("#theme-toggle i");
    themeIcon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
  }

  loadTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const themeIcon = document.querySelector("#theme-toggle i");
    if (themeIcon) {
      themeIcon.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }
  }

  resetModalForms(modal) {
    if (modal.id === "tournament-modal") {
      const form = modal.querySelector("form");
      if (form.dataset.editId) {
        delete form.dataset.editId;
        modal.querySelector("h3").textContent = "Novo Torneio";
      }
    } else if (modal.id === "player-modal") {
      const form = modal.querySelector("form");
      if (form.dataset.editId) {
        delete form.dataset.editId;
        modal.querySelector("h3").textContent = "Novo Jogador";
      }
    } else if (modal.id === "coach-modal") {
      const form = modal.querySelector("form");
      if (form.dataset.editId) {
        delete form.dataset.editId;
        modal.querySelector("h3").textContent = "Novo Treinador";
      }
    } else if (modal.id === "match-modal") {
      const form = modal.querySelector("form");
      if (form.dataset.editId) {
        delete form.dataset.editId;
        modal.querySelector("h3").textContent = "Nova Partida";
      }
    } else if (modal.id === "club-modal") {
      const form = modal.querySelector("form");
      if (form.dataset.editId) {
        delete form.dataset.editId;
        modal.querySelector("h3").textContent = "Novo Clube";
      }
    }
  }

  // Event Listeners
  setupEventListeners() {
    // Login
    document.getElementById("login-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      if (this.login(username, password)) {
        document.getElementById("login-form").reset();
      } else {
        alert("Usuário ou senha incorretos!");
      }
    });

    document.getElementById("register-btn").addEventListener("click", () => {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      if (!username || !password) {
        alert("Preencha todos os campos!");
        return;
      }

      if (this.register(username, password)) {
        alert("Conta criada com sucesso! Faça login.");
        document.getElementById("login-form").reset();
      } else {
        alert("Nome de usuário já existe!");
      }
    });

    document.getElementById("logout-btn").addEventListener("click", () => {
      this.logout();
    });

    // Theme toggle
    document.getElementById("theme-toggle").addEventListener("click", () => {
      this.toggleTheme();
    });

    // Menu
    document.querySelectorAll(".menu a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const screen = e.target.closest("a").dataset.screen;
        this.showSection(screen);
      });
    });

    // Modais
    this.setupModalListeners();

    // Formulários
    this.setupFormListeners();

    // Filtros
    document.getElementById("club-filter").addEventListener("change", () => {
      this.loadPlayers();
    });

    document.getElementById("coaches-club-filter").addEventListener("change", () => {
      this.loadCoaches();
    });

    // Filtros de busca
    document.getElementById("tournaments-search").addEventListener("input", () => {
      this.loadTournaments();
    });

    document.getElementById("clubs-search").addEventListener("input", () => {
      this.loadClubs();
    });

    document.getElementById("players-search").addEventListener("input", () => {
      this.loadPlayers();
    });

    document.getElementById("coaches-search").addEventListener("input", () => {
      this.loadCoaches();
    });

    document.getElementById("matches-search").addEventListener("input", () => {
      this.loadMatches();
    });

    document.getElementById("tournament-scorers-filter").addEventListener("change", () => {
      this.loadScorers();
    });

    document.getElementById("tournament-statistics-filter").addEventListener("change", () => {
      this.loadStatistics();
    });

    document.getElementById("tournament-rounds-filter").addEventListener("change", () => {
      this.loadRounds();
    });

    document.getElementById("match-played").addEventListener("change", (e) => {
      const eventsSection = document.getElementById("match-events-section");
      const homeScore = document.getElementById("home-score");
      const awayScore = document.getElementById("away-score");

      if (e.target.checked) {
        eventsSection.style.display = "block";
        homeScore.required = true;
        awayScore.required = true;
      } else {
        eventsSection.style.display = "none";
        homeScore.required = false;
        awayScore.required = false;
        homeScore.value = "";
        awayScore.value = "";
        document.getElementById("events-container").innerHTML = "";
      }
    });
  }

  setupModalListeners() {
    const modals = [
      "tournament-modal",
      "club-modal",
      "player-modal",
      "coach-modal",
      "match-modal",
      "round-modal",
    ];
    const buttons = [
      "add-tournament-btn",
      "add-club-btn",
      "add-player-btn",
      "add-coach-btn",
      "add-match-btn",
    ];

    buttons.forEach((btnId, index) => {
      document.getElementById(btnId).addEventListener("click", () => {
        document.getElementById(modals[index]).style.display = "block";
      });
    });

    document.querySelectorAll(".close").forEach((closeBtn) => {
      closeBtn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal");
        modal.style.display = "none";
        this.resetModalForms(modal);
      });
    });

    window.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal")) {
        e.target.style.display = "none";
        this.resetModalForms(e.target);
      }
      if (e.target.classList.contains("player-profile-modal")) {
        this.closePlayerProfile();
      }
      if (e.target.classList.contains("club-profile-modal")) {
        this.closeClubProfile();
      }
      if (e.target.classList.contains("tournament-profile-modal")) {
        this.closeTournamentProfile();
      }
    });

    document.getElementById("generate-matches-btn").addEventListener("click", () => {
      this.generateMatches();
    });
  }

  setupFormListeners() {
    // Tournament form
    document.getElementById("tournament-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById("tournament-name").value,
        logo: document.getElementById("tournament-logo").value,
        game: document.getElementById("tournament-game").value,
        startDate: document.getElementById("tournament-start").value,
        description: document.getElementById("tournament-description").value
      };

      const editId = e.target.dataset.editId;
      if (editId) {
        this.updateTournament(parseInt(editId), data);
        delete e.target.dataset.editId;
      } else {
        this.createTournament(data);
      }

      document.getElementById("tournament-modal").style.display = "none";
      e.target.reset();
    });

    // Club form
    document.getElementById("club-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById("club-name").value,
        country: document.getElementById("club-country").value,
        logo: document.getElementById("club-logo").value,
        tournamentId: parseInt(document.getElementById("club-tournament").value) || null
      };

      const editId = e.target.dataset.editId;
      if (editId) {
        this.updateClub(parseInt(editId), data);
        delete e.target.dataset.editId;
      } else {
        this.createClub(data);
      }

      document.getElementById("club-modal").style.display = "none";
      e.target.reset();
    });

    // Player form
    document.getElementById("player-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const birthdate = document.getElementById("player-birthdate").value;
      const age = birthdate ? new Date().getFullYear() - new Date(birthdate).getFullYear() : null;
      
      const data = {
        name: document.getElementById("player-name").value,
        birthdate: birthdate,
        age: age,
        position: document.getElementById("player-position").value,
        nationality: document.getElementById("player-nationality").value,
        number: parseInt(document.getElementById("player-number").value) || null,
        height: parseInt(document.getElementById("player-height").value) || null,
        photo: document.getElementById("player-photo").value,
        clubId: parseInt(document.getElementById("player-club").value) || null
      };

      const editId = e.target.dataset.editId;
      if (editId) {
        this.updatePlayer(parseInt(editId), data);
        delete e.target.dataset.editId;
      } else {
        this.createPlayer(data);
      }

      document.getElementById("player-modal").style.display = "none";
      e.target.reset();
    });

    // Coach form
    document.getElementById("coach-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById("coach-name").value,
        birthdate: document.getElementById("coach-birthdate").value,
        nationality: document.getElementById("coach-nationality").value,
        experience: parseInt(document.getElementById("coach-experience").value) || null,
        formation: document.getElementById("coach-formation").value,
        photo: document.getElementById("coach-photo").value,
        clubId: parseInt(document.getElementById("coach-club").value) || null
      };

      const editId = e.target.dataset.editId;
      if (editId) {
        this.updateCoach(parseInt(editId), data);
        delete e.target.dataset.editId;
      } else {
        this.createCoach(data);
      }

      document.getElementById("coach-modal").style.display = "none";
      e.target.reset();
    });

    // Match form
    document.getElementById("match-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        homeTeamId: parseInt(document.getElementById("home-team").value),
        awayTeamId: parseInt(document.getElementById("away-team").value),
        homeScore: document.getElementById("home-score").value ? parseInt(document.getElementById("home-score").value) : undefined,
        awayScore: document.getElementById("away-score").value ? parseInt(document.getElementById("away-score").value) : undefined,
        round: parseInt(document.getElementById("match-round").value),
        date: document.getElementById("match-date").value,
        tournamentId: parseInt(document.getElementById("match-tournament").value)
      };

      const editId = e.target.dataset.editId;
      if (editId) {
        this.updateMatch(parseInt(editId), data);
        delete e.target.dataset.editId;
      } else {
        this.createMatch(data);
      }

      document.getElementById("match-modal").style.display = "none";
      e.target.reset();
    });

    // Round form
    document.getElementById("round-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        tournamentId: parseInt(e.target.dataset.tournamentId),
        number: parseInt(formData.get("round-number")),
        date: formData.get("round-date"),
        matches: [],
      };

      const matchPairs = e.target.querySelectorAll(".match-pair");
      matchPairs.forEach((pair) => {
        const homeSelect = pair.querySelector("select[name^='homeTeam_']");
        const awaySelect = pair.querySelector("select[name^='awayTeam_']");
        if (homeSelect.value && awaySelect.value) {
          data.matches.push({
            homeTeamId: parseInt(homeSelect.value),
            awayTeamId: parseInt(awaySelect.value),
          });
        }
      });

      this.createRound(data);
      document.getElementById("round-modal").style.display = "none";
      e.target.reset();
      document.getElementById("round-matches").innerHTML = "";
    });
  }
}

// Funções globais
function showLogin() {
  document.getElementById("landing-screen").classList.remove("active");
  document.getElementById("login-screen").classList.add("active");
}

function loadSampleData() {
  if (typeof sampleData !== "undefined") {
    Object.keys(sampleData).forEach((key) => {
      localStorage.setItem(key, JSON.stringify(sampleData[key]));
    });
    alert("Dados de exemplo carregados! Faça login com: admin / 123456");
    location.reload();
  }
}

// Inicializar aplicação
const app = new TournamentManager();

// Adicionar botão para carregar dados de exemplo
document.addEventListener("DOMContentLoaded", () => {
  const landingScreen = document.getElementById("landing-screen");
  if (landingScreen) {
    const sampleDataBtn = document.createElement("button");
    sampleDataBtn.textContent = "Carregar Dados de Exemplo";
    sampleDataBtn.className = "sample-data-btn";
    sampleDataBtn.onclick = loadSampleData;
    sampleDataBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.9rem;
      z-index: 1000;
    `;
    document.body.appendChild(sampleDataBtn);
  }
});