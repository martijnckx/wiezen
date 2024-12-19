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

const rounds = [
    {
        name: new Alleen().name,
        amountOfPlayers: new Alleen().amountOfPlayers,
        tricksForSuccess: new Alleen().tricksForSuccess,
        canBePlayedSimultaneously: new Alleen().canBePlayedSimultaneously,
        calculator: new Alleen(),
    },
    {
        name: new VragenEnMeegaan().name,
        amountOfPlayers: new VragenEnMeegaan().amountOfPlayers,
        tricksForSuccess: new VragenEnMeegaan().tricksForSuccess,
        canBePlayedSimultaneously: new VragenEnMeegaan().canBePlayedSimultaneously,
        calculator: new VragenEnMeegaan(),
    },
    {
        name: new Abondance(9).name,
        amountOfPlayers: new Abondance(9).amountOfPlayers,
        tricksForSuccess: new Abondance(9).tricksForSuccess,
        canBePlayedSimultaneously: new Abondance(9).canBePlayedSimultaneously,
        calculator: new Abondance(9),
    },
    {
        name: new Abondance(10).name,
        amountOfPlayers: new Abondance(10).amountOfPlayers,
        tricksForSuccess: new Abondance(10).tricksForSuccess,
        canBePlayedSimultaneously: new Abondance(10).canBePlayedSimultaneously,
        calculator: new Abondance(10),
    },
    {
        name: new Misery().name,
        amountOfPlayers: new Misery().amountOfPlayers,
        tricksForSuccess: new Misery().tricksForSuccess,
        canBePlayedSimultaneously: new Misery().canBePlayedSimultaneously,
        calculator: new Misery(),
    },
    {
        name: new Abondance(11).name,
        amountOfPlayers: new Abondance(11).amountOfPlayers,
        tricksForSuccess: new Abondance(11).tricksForSuccess,
        canBePlayedSimultaneously: new Abondance(11).canBePlayedSimultaneously,
        calculator: new Abondance(11),
    },
    {
        name: new Abondance(12).name,
        amountOfPlayers: new Abondance(12).amountOfPlayers,
        tricksForSuccess: new Abondance(12).tricksForSuccess,
        canBePlayedSimultaneously: new Abondance(12).canBePlayedSimultaneously,
        calculator: new Abondance(12),
    },
    {
        name: new Troel().name,
        amountOfPlayers: new Troel().amountOfPlayers,
        tricksForSuccess: new Troel().tricksForSuccess,
        canBePlayedSimultaneously: new Troel().canBePlayedSimultaneously,
        calculator: new Troel(),
    },
    {
        name: new Troela().name,
        amountOfPlayers: new Troela().amountOfPlayers,
        tricksForSuccess: new Troela().tricksForSuccess,
        canBePlayedSimultaneously: new Troela().canBePlayedSimultaneously,
        calculator: new Troela(),
    },
    {
        name: new OpenMisery().name,
        amountOfPlayers: new OpenMisery().amountOfPlayers,
        tricksForSuccess: new OpenMisery().tricksForSuccess,
        canBePlayedSimultaneously: new OpenMisery().canBePlayedSimultaneously,
        calculator: new OpenMisery(),
    },
    {
        name: new Solo().name,
        amountOfPlayers: new Solo().amountOfPlayers,
        tricksForSuccess: new Solo().tricksForSuccess,
        canBePlayedSimultaneously: new Solo().canBePlayedSimultaneously,
        calculator: new Solo(),
    },
    {
        name: new SoloSlim().name,
        amountOfPlayers: new SoloSlim().amountOfPlayers,
        tricksForSuccess: new SoloSlim().tricksForSuccess,
        canBePlayedSimultaneously: new SoloSlim().canBePlayedSimultaneously,
        calculator: new SoloSlim(),
    },
];

export default rounds;
