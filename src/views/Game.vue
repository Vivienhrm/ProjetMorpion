<script>
import api from '@/api'

export default {
  name: 'GameActive',
  data() {
    return {
      game: null,
      currUser: null,
      ws: null,
      errorMessage: null,
      opponentLeft: false
    }
  },
  
  async beforeRouteEnter(to, from, next) {
    try {
      const [gameData, userData] = await Promise.all([
        api.get(`/api/games/${to.params.id}`),
        api.get('/api/profile')
      ])
      next(vm => {
        vm.game = gameData.data
        vm.currUser = userData.data
        
        vm.initGameSocket()
      })
    } catch (e) {
      console.error('Erreur init partie:', e)
      next(false)
    }
  },

  beforeUnmount() {
    this.closeSocket()
  },

  methods: {
    initGameSocket() {
      this.ws = new WebSocket('wss://morpion-api.edu.netlor.fr/websockets')

      this.ws.onopen = () => {
        this.ws.send(JSON.stringify({
          action: 'connect',
          game_id: this.game.id,
          player_id: this.currUser.id
        }))
      }

      this.ws.onmessage = (evt) => {
        const payload = JSON.parse(evt.data)
        switch (payload.action) {
          case 'opponent-join':
          case 'opponent-play':
            this.fetchGameInfo()
            break
          case 'opponent-quit':
            this.opponentLeft = true
            break
        }
      }
    },

    closeSocket() {
      if (this.ws) {
        this.ws.close()
        this.ws = null
      }
    },

    async fetchGameInfo() {
      try {
        const res = await api.get(`/api/games/${this.game.id}`)
        this.game = res.data
      } catch (e) {
        console.warn('Echec update game:', e)
      }
    },

    quitGame() {
      this.closeSocket()
      this.$router.push({ name: 'Home' })
    },

    resolveCellSymbol(r, c) {
      const key = `r${r}c${c}`
      const val = this.game[key]
      
      if (!val) return ''

      return val === this.game.owner_id ? 'X' : 'O'
    },

    async handleCellClick(r, c) {
      this.errorMessage = null
      
      if(this.game.state === 2 || this.opponentLeft) return;

      try {
        const res = await api.patch(`/api/games/${this.game.id}/play/${r}/${c}`)
        this.game = res.data
      } catch (err) {
        if (err.response?.data?.errors) {
          this.errorMessage = err.response.data.errors[0]
        } else {
          this.errorMessage = "Déplacement impossible"
        }
      }
    }
  }
}
</script>

<template>
  <div class="game" v-if="game">
    <div class="header">
      <h2 class="title">Partie {{ game.code }}</h2>
      <div class="header-controls">
        <span class="player-name" v-if="currUser">{{ currUser.name }}</span>
        <button class="btn-quit" @click="quitGame">Quitter</button>
      </div>
    </div>

    <div class="status-bar">
      <div class="player-badge" :class="{ 'is-active': game.next_player_id === game.owner_id }">
        X (Hôte): {{ game.owner.name }}
      </div>
      
      <div class="player-badge" :class="{ 'is-active': game.next_player_id === game.opponent_id }">
        O (Invité): {{ game.opponent ? game.opponent.name : '...' }}
      </div>
    </div>

    <div v-if="errorMessage" class="error-banner">
      {{ errorMessage }}
    </div>

    <!-- Message Adversaire Parti -->
    <div v-if="opponentLeft" class="opponent-left-banner">
      <h3>L'adversaire a quitté la partie !</h3>
      <p>La partie est terminée.</p>
    </div>

    <div v-if="game.opponent && game.state !== 2" class="grid">
      <div v-for="rowIdx in 3" :key="'r'+rowIdx" class="row">
        <div 
          v-for="colIdx in 3" 
          :key="'c'+colIdx" 
          class="cell" 
          @click="handleCellClick(rowIdx, colIdx)"
        >
          {{ resolveCellSymbol(rowIdx, colIdx) }}
        </div>
      </div>
    </div>

    <div v-if="game.opponent && game.state === 2" class="end-screen">
      <template v-if="game.winner_id">
        <h1 class="winner-text">
          VICTOIRE DE <br>
          {{ game.winner_id === game.owner_id ? game.owner.name : game.opponent.name }}
        </h1>
      </template>
      <h1 v-else class="draw-text">MATCH NUL</h1>
      
      <button class="btn-return" @click="quitGame">RETOUR MENU</button>
    </div>

    <div v-else-if="!game.opponent" class="waiting-screen">
      <p>En attente de l'adversaire...</p>
      <p class="code-display">CODE : {{ game.code }}</p>
    </div>
  </div>
</template>

<style scoped>
.game {
  text-align: center;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.title {
  margin: 0;
  color: #333;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.player-name {
  font-weight: bold;
  font-size: 1.1rem;
  color: #555;
  background: white;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.status-bar {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.player-badge {
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  background: #e9ecef;
  font-weight: bold;
  color: #495057;
  transition: all 0.3s;
}

.player-badge.is-active {
  background: #d4edda;
  color: #155724;
  border: 2px solid #c3e6cb;
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.grid {
  display: inline-flex;
  flex-direction: column;
  background: #343a40;
  padding: 10px;
  border-radius: 12px;
  gap: 10px;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.row {
  display: flex;
  gap: 10px;
}

.cell {
  width: 100px;
  height: 100px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  font-weight: bold;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  user-select: none;
}

.cell:hover {
  background-color: #f8f9fa;
  transform: scale(0.98);
}

.error-banner {
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
}

.opponent-left-banner {
  background: #fff3cd;
  color: #856404;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 2px solid #ffeeba;
  border-radius: 8px;
  animation: fadeIn 0.5s ease-in;
}

.opponent-left-banner h3 {
  margin: 0 0 10px 0;
  font-size: 1.5rem;
}

.end-screen, .waiting-screen {
  margin-top: 2rem;
  padding: 2rem;
  background: #fff3cd;
  border: 2px solid #ffeeba;
  border-radius: 8px;
}

.waiting-screen {
  background: #e3f2fd;
  border-color: #b3e5fc;
}

.code-display {
  font-size: 2rem;
  font-weight: bold;
  color: #0277bd;
  margin-top: 10px;
  letter-spacing: 2px;
}

.btn-quit, .btn-return {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
}

.btn-quit:hover {
  background: #c82333;
}

.btn-return {
  background: #0277bd;
  margin-top: 1rem;
}

.btn-return:hover {
  background: #1565C0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>