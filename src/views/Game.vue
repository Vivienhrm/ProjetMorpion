<template>
  <div class="game">
    <h1>Partie de Morpion</h1>
    <p v-if="game">ID de la partie : {{ game.id }}</p>
    <p v-if="game && game.code">Code de la partie : {{ game.code }}</p>
    <p v-if="game && !game.opponent">En attente d'un adversaire...</p>
    <p v-else-if="game && game.opponent">Adversaire : {{ game.opponent.name }}</p>
    <p v-if="game && game.next_player_id">
      {{ game.next_player_id === playerId ? 'C\'est à vous de jouer' : 'C\'est à l\'adversaire de jouer' }}
    </p>
    <div v-if="game && game.opponent" class="grid">
      <div class="row">
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
      </div>
      <div class="row">
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
      </div>
      <div class="row">
        <div class="cell"></div>
        <div class="cell"></div>
        <div class="cell"></div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  data() {
    return {
      game: null,
      playerId: null,
      ws: null
    }
  },
  beforeRouteEnter(to, from, next) {
    api.get('/api/profile').then(profileResponse => {
      const playerId = profileResponse.data.id
      return api.get(`/api/games/${to.params.id}`).then(gameResponse => {
        next(vm => {
          vm.game = gameResponse.data
          vm.playerId = playerId
          vm.waitForOpponentMove()
        })
      })
    }).catch(error => {
      console.error('Erreur:', error)
      next()
    })
  },
  methods: {
    waitForOpponentMove() {
      this.ws = new WebSocket('wss://morpion-api.edu.netlor.fr/websockets')
      this.ws.onopen = () => {
        this.ws.send(JSON.stringify({
          action: 'connect',
          game_id: this.game.id,
          player_id: this.playerId
        }))
      }
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'opponent-join') {
          this.fetchGame()
        } else if (data.type === 'opponent-play') {
          this.fetchGame()
        } else if (data.type === 'opponent-quit') {
          // handle quit
          console.log('Opponent quit')
        }
      }
    },
    fetchGame() {
      api.get(`/api/games/${this.game.id}`).then(response => {
        this.game = response.data
      }).catch(error => {
        console.error('Erreur lors de la récupération de la partie:', error)
      })
    }
  },
  beforeUnmount() {
    if (this.ws) {
      this.ws.close()
    }
  }
}
</script>

<style scoped>
.game {
  text-align: center;
  padding: 25px;
}
.grid {
  display: inline-block;
  margin-top: 20px;
}
.row {
  display: flex;
}
.cell {
  width: 50px;
  height: 50px;
  border: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
</style>
