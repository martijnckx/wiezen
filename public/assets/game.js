class Player {
  #scores = [];
  #name = '';

  constructor(name) {
    this.#name = name;
  }

  get name() { return this.#name; }

  set name(name) {
    if (typeof name !== 'string') {
      throw new TypeError('Name must be a string');
    }
    this.#name = name;
    game.forceTriggerChange();
  }

  get score() {
    return this.#scores.reduce((a, b) => a + b, 0);
  }

  get history() {
    return this.#scores;
  }

  addScore(value) {
    if (Number.isInteger(value)) {
      this.#scores.push(value);
    } else {
      console.error('Score must be an integer');
    }
  }

  removeLastScore() {
    return this.#scores.pop();
  }

  toJSON() {
    return {
      name: this.name,
      scores: this.#scores,
    };
  }

  static fromJSON(json) {
    const player = new Player(json.name);
    player.#scores = json.scores;
    return player;
  }
}

class Game {
  #rounds = [];
  #dealer = 0;
  #onChangeCallback = null;

  constructor() {
    this.players = [
      new Player('Speler 1'),
      new Player('Speler 2'),
      new Player('Speler 3'),
      new Player('Speler 4'),
    ];
  }

  forceTriggerChange() {
    this.#triggerChange();
  }

  #triggerChange() {
    if (this.#onChangeCallback) {
      this.#onChangeCallback();
    }
    localStorage.setItem('game', JSON.stringify(this));
  }

  onChange(callback) {
    if (typeof callback === 'function') {
      this.#onChangeCallback = callback;
    } else {
      throw new Error('Callback must be a function');
    }
  }

  removeLastRound() {
    this.#rounds.pop();
    this.players.forEach(player => {
      player.removeLastScore();
    });
    this.#triggerChange();
  }

  addRound(round, ...simultaneousResults) {
    // simultaneousResults is an array of objects, each object is of the form {attackers: number[], tricks: number}.

    if (simultaneousResults.length <= 0) {
      throw new Error('No results provided');
    }

    if (simultaneousResults.length === 1) {
      const result = simultaneousResults[0];
      if (result.attackers.length !== round.amountOfAttackers) {
        throw new Error(`${round.name} needs exactly ${round.amountOfAttackers} attackers`);
      }
      for (let playerIndex = 0; playerIndex < this.players.length; playerIndex++) {
        const score = result.attackers.includes(playerIndex) ?
          round.pointsForAttacker(result.tricks) :
          round.pointsForDefender(result.tricks);
        this.players[playerIndex].addScore(score);
      }
      this.#rounds.push(round.name);
      this.assignNextDealer();
    } else {
      if (!round.canBePlayedSimultaneously) {
        throw new Error(`${round.name} cannot be played simultaneously`);
      }
      const oldDealer = this.#dealer;
      for (let i = 0; i < simultaneousResults.length; i++) {
        try {
          this.addRound(round, simultaneousResults[i]);
        } catch (error) {
          for (let j = 0; j < i; j++) {
            this.removeLastRound();
          }
          throw error;
        }
      }
      this.assignNextDealer();
      this.players.forEach(player => {
        let totalScore = 0;
        for (let i = 0; i < simultaneousResults.length; i++) {
          totalScore += player.removeLastScore();
        }
        player.addScore(totalScore);
      });
      for (let i = 0; i < simultaneousResults.length; i++) {
        this.#rounds.pop();
      }
      this.#rounds.push(`${round.name} × ${simultaneousResults.length}`);
      this.#triggerChange();
    }
  }

  toJSON() {
    return {
      players: this.players,
      rounds: this.#rounds,
      dealer: this.#dealer,
    }
  }

  reset() {
    const newPlayers = [];
    this.players.forEach(player => {
      newPlayers.push(new Player(player.name));
    });
    this.players = newPlayers;
    this.#rounds = [];
    this.#dealer = 0;
    this.#triggerChange();
  }

  static fromJSON(json) {
    const game = new Game();
    game.players = json.players.map(player => Player.fromJSON(player));
    game.#rounds = json.rounds;
    game.#dealer = json.dealer;
    return game;
  }

  get rounds() { return this.#rounds; }
  get dealer() { return this.#dealer; }

  assignNextDealer() {
    this.#dealer = (this.#dealer + 1) % this.players.length;
    this.#triggerChange();
  }
}

let game;

function newGame() {
  if (game) {
    game.reset();
  } else {
    game = new Game();
  }
}

function loadGame() {
  try {
    const savedGame = localStorage.getItem('game');
    if (savedGame) {
      game = Game.fromJSON(JSON.parse(savedGame));
    } else {
      newGame();
    }
  } catch (error) {
    console.log('Error loading game, starting new game', error);
    newGame();
  }
}

loadGame();

