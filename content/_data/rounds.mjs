class Round {
    #name;
    #amountOfAttackers;
    #tricksForSuccess;
    #successScore;
    #failurePenalty;
    #extraTrickBonus;
    #missingTrickPenalty;
    #canBePlayedSimultaneously;
    #bonusForAllTricks;
    #totalPlayersInRound = 4;
    #customPointsPerTeamMethod;

    constructor({
        name,
        amountOfAttackers,
        tricksForSuccess,
        successScore,
        failurePenalty,
        extraTrickBonus = 0,
        missingTrickPenalty = 0,
        canBePlayedSimultaneously = false,
        bonusForAllTricks = false,
        customPointsPerTeamMethod,
    }) {
        if (new.target === Round) {
            throw new TypeError("Cannot construct Round instances directly");
        }

        this.#name = name;
        this.#amountOfAttackers = amountOfAttackers;
        this.#tricksForSuccess = tricksForSuccess;
        this.#successScore = successScore;
        this.#failurePenalty = failurePenalty;
        this.#extraTrickBonus = extraTrickBonus;
        this.#missingTrickPenalty = missingTrickPenalty;
        this.#canBePlayedSimultaneously = canBePlayedSimultaneously;
        this.#bonusForAllTricks = bonusForAllTricks;
        this.#customPointsPerTeamMethod = customPointsPerTeamMethod;
    }

    get name() { return this.#name; }
    get amountOfAttackers() { return this.#amountOfAttackers; }
    get tricksForSuccess() { return this.#tricksForSuccess; }
    get canBePlayedSimultaneously() { return this.#canBePlayedSimultaneously; }

    #pointsPerTeam(tricks) {
        let points = 0;

        if (this.#customPointsPerTeamMethod) {
            points = this.#customPointsPerTeamMethod(tricks);
        } else {
            points = tricks >= this.#tricksForSuccess ?
                this.#successScore + (tricks - this.#tricksForSuccess) * this.#extraTrickBonus :
                this.#failurePenalty + (this.#tricksForSuccess - (tricks + 1)) * this.#missingTrickPenalty;
        }

        if (this.#bonusForAllTricks && tricks >= 13) {
            points *= 2;
        }

        return points;
    }

    pointsForAttacker(tricks) {
        return this.#pointsPerTeam(tricks) / this.#amountOfAttackers;
    }

    pointsForDefender(tricks) {
        return (this.#pointsPerTeam(tricks) * -1) / (this.#totalPlayersInRound - this.#amountOfAttackers);
    }
}

class Alleen extends Round {
    constructor() {
        super({
            name: 'Alleen',
            amountOfAttackers: 1,
            tricksForSuccess: 5,
            successScore: 6,
            failurePenalty: -12,
            extraTrickBonus: 3,
            missingTrickPenalty: -6,
            bonusForAllTricks: true,
        });
    }
}

class VragenEnMeegaan extends Round {
    constructor() {
        super({
            name: 'Vraag en mee',
            amountOfAttackers: 2,
            tricksForSuccess: 8,
            successScore: 4,
            failurePenalty: -12,
            extraTrickBonus: 2,
            missingTrickPenalty: -4,
            bonusForAllTricks: true,
        });
    }
}

class Abondance extends Round {
    constructor(target = 9) {
        if (target === 9) {
            super({
                name: 'Abondance 9',
                amountOfAttackers: 1,
                tricksForSuccess: 9,
                successScore: 15,
                failurePenalty: -15,
            });
        } else if (target === 10) {
            super({
                name: 'Abondance 10',
                amountOfAttackers: 1,
                tricksForSuccess: 10,
                successScore: 18,
                failurePenalty: -18,
            });
        } else if (target === 11) {
            super({
                name: 'Abondance 11',
                amountOfAttackers: 1,
                tricksForSuccess: 11,
                successScore: 24,
                failurePenalty: -24,
            });
        } else if (target === 12) {
            super({
                name: 'Abondance 12',
                amountOfAttackers: 1,
                tricksForSuccess: 12,
                successScore: 27,
                failurePenalty: -27,
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
            amountOfAttackers: 2,
            tricksForSuccess: 8,
            successScore: 8,
            failurePenalty: -12,
            extraTrickBonus: 4,
            missingTrickPenalty: -4,
            bonusForAllTricks: true,
        });
    }
}

class Troela extends Round {
    constructor() {
        super({
            name: 'Troela',
            amountOfAttackers: 2,
            tricksForSuccess: 9,
            successScore: 8,
            failurePenalty: -12,
            extraTrickBonus: 4,
            missingTrickPenalty: -4,
            bonusForAllTricks: true,
        });
    }
}

class Solo extends Round {
    constructor() {
        super({
            name: 'Solo',
            amountOfAttackers: 1,
            tricksForSuccess: 13,
            successScore: 75,
            failurePenalty: -75,
        });
    }
}

class SoloSlim extends Round {
    constructor() {
        super({
            name: 'Solo slim',
            amountOfAttackers: 1,
            tricksForSuccess: 13,
            successScore: 90,
            failurePenalty: -90,
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
            amountOfAttackers: 1,
            canBePlayedSimultaneously: true,
            customPointsPerTeamMethod: (tricks) => {
                return tricks > this.#tricksForSuccess ? this.#failurePenalty : this.#successScore;
            },
        });
    }
}

class OpenMisery extends Round {
    #tricksForSuccess = 0;
    #successScore = 42;
    #failurePenalty = -42;

    constructor() {
        super({
            name: 'Open miserie',
            amountOfAttackers: 1,
            canBePlayedSimultaneously: true,
            customPointsPerTeamMethod: (tricks) => {
                return tricks > this.#tricksForSuccess ? this.#failurePenalty : this.#successScore;
            },
        });
    }
}

const rounds = [
    {
        name: new Alleen().name,
        amountOfAttackers: new Alleen().amountOfAttackers,
        tricksForSuccess: new Alleen().tricksForSuccess,
        canBePlayedSimultaneously: new Alleen().canBePlayedSimultaneously,
        calculator: new Alleen(),
    },
    {
        name: new VragenEnMeegaan().name,
        amountOfAttackers: new VragenEnMeegaan().amountOfAttackers,
        tricksForSuccess: new VragenEnMeegaan().tricksForSuccess,
        canBePlayedSimultaneously: new VragenEnMeegaan().canBePlayedSimultaneously,
        calculator: new VragenEnMeegaan(),
    },
    {
        name: new Abondance(9).name,
        amountOfAttackers: new Abondance(9).amountOfAttackers,
        tricksForSuccess: new Abondance(9).tricksForSuccess,
        canBePlayedSimultaneously: new Abondance(9).canBePlayedSimultaneously,
        calculator: new Abondance(9),
    },
    {
        name: new Abondance(10).name,
        amountOfAttackers: new Abondance(10).amountOfAttackers,
        tricksForSuccess: new Abondance(10).tricksForSuccess,
        canBePlayedSimultaneously: new Abondance(10).canBePlayedSimultaneously,
        calculator: new Abondance(10),
    },
    {
        name: new Misery().name,
        amountOfAttackers: new Misery().amountOfAttackers,
        tricksForSuccess: new Misery().tricksForSuccess,
        canBePlayedSimultaneously: new Misery().canBePlayedSimultaneously,
        calculator: new Misery(),
    },
    {
        name: new Abondance(11).name,
        amountOfAttackers: new Abondance(11).amountOfAttackers,
        tricksForSuccess: new Abondance(11).tricksForSuccess,
        canBePlayedSimultaneously: new Abondance(11).canBePlayedSimultaneously,
        calculator: new Abondance(11),
    },
    {
        name: new Abondance(12).name,
        amountOfAttackers: new Abondance(12).amountOfAttackers,
        tricksForSuccess: new Abondance(12).tricksForSuccess,
        canBePlayedSimultaneously: new Abondance(12).canBePlayedSimultaneously,
        calculator: new Abondance(12),
    },
    {
        name: new Troel().name,
        amountOfAttackers: new Troel().amountOfAttackers,
        tricksForSuccess: new Troel().tricksForSuccess,
        canBePlayedSimultaneously: new Troel().canBePlayedSimultaneously,
        calculator: new Troel(),
    },
    {
        name: new Troela().name,
        amountOfAttackers: new Troela().amountOfAttackers,
        tricksForSuccess: new Troela().tricksForSuccess,
        canBePlayedSimultaneously: new Troela().canBePlayedSimultaneously,
        calculator: new Troela(),
    },
    {
        name: new OpenMisery().name,
        amountOfAttackers: new OpenMisery().amountOfAttackers,
        tricksForSuccess: new OpenMisery().tricksForSuccess,
        canBePlayedSimultaneously: new OpenMisery().canBePlayedSimultaneously,
        calculator: new OpenMisery(),
    },
    {
        name: new Solo().name,
        amountOfAttackers: new Solo().amountOfAttackers,
        tricksForSuccess: new Solo().tricksForSuccess,
        canBePlayedSimultaneously: new Solo().canBePlayedSimultaneously,
        calculator: new Solo(),
    },
    {
        name: new SoloSlim().name,
        amountOfAttackers: new SoloSlim().amountOfAttackers,
        tricksForSuccess: new SoloSlim().tricksForSuccess,
        canBePlayedSimultaneously: new SoloSlim().canBePlayedSimultaneously,
        calculator: new SoloSlim(),
    },
];

export default rounds;
