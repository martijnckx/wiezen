class Round {
  #name;
  #amountOfPlayers;
  #tricksForSuccess;
  #successScore;
  #failurePenalty;
  #extraTrickBonus;
  #missingTrickPenalty;
  #pointsShouldBeDivided;
  #canBePlayedSimultaneously;
  #bonusForAllTricks;

  constructor({
    name,
    amountOfPlayers,
    tricksForSuccess,
    successScore,
    failurePenalty,
    extraTrickBonus = 0,
    missingTrickPenalty = 0,
    pointsShouldBeDivided = false,
    canBePlayedSimultaneously = false,
    bonusForAllTricks = false,
  }) {
    if (new.target === Round) {
      throw new TypeError("Cannot construct Round instances directly");
    }

    this.#name = name;
    this.#amountOfPlayers = amountOfPlayers;
    this.#tricksForSuccess = tricksForSuccess;
    this.#successScore = successScore;
    this.#failurePenalty = failurePenalty;
    this.#extraTrickBonus = extraTrickBonus;
    this.#missingTrickPenalty = missingTrickPenalty;
    this.#pointsShouldBeDivided = pointsShouldBeDivided;
    this.#canBePlayedSimultaneously = canBePlayedSimultaneously;
    this.#bonusForAllTricks = bonusForAllTricks;
  }

  get name() { return this.#name; }
  get amountOfPlayers() { return this.#amountOfPlayers; }
  get tricksForSuccess() { return this.#tricksForSuccess; }
  get canBePlayedSimultaneously() { return this.#canBePlayedSimultaneously; }

  pointsForAttackers(tricks) {
    const basePoints = tricks >= this.#tricksForSuccess ?
      this.#successScore + (tricks - this.#tricksForSuccess) * this.#extraTrickBonus :
      this.#failurePenalty + (this.#tricksForSuccess - (tricks + 1)) * this.#missingTrickPenalty;

    return (this.#bonusForAllTricks && tricks >= 13) ? basePoints * 2 : basePoints;
  }

  pointsForDefenders(tricks) {
    return this.pointsForAttackers(tricks) * -1 / (this.#pointsShouldBeDivided ? (4 - this.#amountOfPlayers) : 1);
  }
}

class Alleen extends Round {
  constructor() {
    super({
      name: 'Alleen',
      amountOfPlayers: 1,
      tricksForSuccess: 5,
      successScore: 6,
      failurePenalty: -12,
      extraTrickBonus: 3,
      missingTrickPenalty: -6,
      pointsShouldBeDivided: true,
      bonusForAllTricks: true,
    });
  }
}

class VragenEnMeegaan extends Round {
  constructor() {
    super({
      name: 'Vraag en mee',
      amountOfPlayers: 2,
      tricksForSuccess: 8,
      successScore: 2,
      failurePenalty: -6,
      extraTrickBonus: 1,
      missingTrickPenalty: -2,
      bonusForAllTricks: true,
    });
  }
}

class Abondance extends Round {
  constructor(target = 9) {
    if (target === 9) {
      super({
        name: 'Abondance 9',
        amountOfPlayers: 1,
        tricksForSuccess: 9,
        successScore: 15,
        failurePenalty: -15,
        pointsShouldBeDivided: true,
      });
    } else if (target === 10) {
      super({
        name: 'Abondance 10',
        amountOfPlayers: 1,
        tricksForSuccess: 10,
        successScore: 18,
        failurePenalty: -18,
        pointsShouldBeDivided: true,
      });
    } else if (target === 11) {
      super({
        name: 'Abondance 11',
        amountOfPlayers: 1,
        tricksForSuccess: 11,
        successScore: 24,
        failurePenalty: -24,
        pointsShouldBeDivided: true,
      });
    } else if (target === 12) {
      super({
        name: 'Abondance 12',
        amountOfPlayers: 1,
        tricksForSuccess: 12,
        successScore: 27,
        failurePenalty: -27,
        pointsShouldBeDivided: true,
      });
    } else {
      throw new Error('Invalid target for Abondance');
    }
  }
}

class Troel extends Round {
  constructor() {
    super({
      name: 'Troel',
      amountOfPlayers: 2,
      tricksForSuccess: 8,
      successScore: 4,
      failurePenalty: -6,
      extraTrickBonus: 2,
      missingTrickPenalty: -2,
      pointsShouldBeDivided: true,
      bonusForAllTricks: true,
    });
  }
}

class Troela extends Round {
  constructor() {
    super({
      name: 'Troela',
      amountOfPlayers: 2,
      tricksForSuccess: 9,
      successScore: 4,
      failurePenalty: -6,
      extraTrickBonus: 2,
      missingTrickPenalty: -2,
      pointsShouldBeDivided: true,
      bonusForAllTricks: true,
    });
  }
}

class Solo extends Round {
  constructor() {
    super({
      name: 'Solo',
      amountOfPlayers: 1,
      tricksForSuccess: 13,
      successScore: 75,
      failurePenalty: -75,
      pointsShouldBeDivided: true,
    });
  }
}

class SoloSlim extends Round {
  constructor() {
    super({
      name: 'Solo slim',
      amountOfPlayers: 1,
      tricksForSuccess: 13,
      successScore: 90,
      failurePenalty: -90,
      pointsShouldBeDivided: true,
    });
  }
}

class Misery extends Round {
  #tricksForSuccess = 0;
  #successScore = 21;
  #failurePenalty = -21;

  constructor() {
    super({
      name: 'Miserie',
      amountOfPlayers: 1,
      tricksForSuccess: 0,
      successScore: 0,
      failurePenalty: 0,
      pointsShouldBeDivided: true,
      canBePlayedSimultaneously: true,
    });
  }

  pointsForAttackers(tricks) {
    return tricks > this.#tricksForSuccess ? this.#failurePenalty : this.#successScore;
  }
}

class OpenMisery extends Round {
  #tricksForSuccess = 0;
  #successScore = 42;
  #failurePenalty = -42;

  constructor() {
    super({
      name: 'Open miserie',
      amountOfPlayers: 1,
      tricksForSuccess: 0,
      successScore: 0,
      failurePenalty: 0,
      pointsShouldBeDivided: true,
      canBePlayedSimultaneously: true,
    });
  }

  pointsForAttackers(tricks) {
    return tricks > this.#tricksForSuccess ? this.#failurePenalty : this.#successScore;
  }
}

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
      if (result.attackers.length !== round.amountOfPlayers) {
        throw new Error(`${round.name} needs exactly ${round.amountOfPlayers} attackers`);
      }
      for (let playerIndex = 0; playerIndex < this.players.length; playerIndex++) {
        const score = result.attackers.includes(playerIndex) ?
          round.pointsForAttackers(result.tricks) :
          round.pointsForDefenders(result.tricks);
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