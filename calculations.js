var app = new Vue({
    el: '#app',
    data: {
        prileaAtk: 1600,
        prileaCDmg: 180,
        prileaSpd: 84,
        prileaArtefact: [{ selected: "addDmgAtk", value: 8 }, { selected: "waterDmg", value: 10 }, { selected: "s1CDmg", value: 15 }],
        prileaSU1: 30,

        tesharAtk: 2650,
        tesharCDmg: 250,
        tesharSpd: 47,
        tesharArtefact: [{ selected: "atkBuffBoost", value: 8 }, { selected: "waterDmg", value: 10 }, { selected: "s3CDmg", value: 15 }, { selected: "cDmgHighHp", value: 18 }],
        tesharSU1: 30,
        tesharSU3: 30,

        konamiyaSpd: 66,

        lunaAtk: 2115,
        lunaCDmg: 250,
        lunaSpd: 51,
        lunaArtefact: [{ selected: "addDmgAtk", value: 8 }, { selected: "waterDmg", value: 15 }, { selected: "cDmgLowHp", value: 45 }],
        lunaSU1: 30,
        lunaSU3: 20,

        homunculusAtk: 2000,
        homunculusCDmg: 240,
        homunculusSpd: 0,
        homunculusArtefact: [{ selected: "addDmgAtk", value: 8 }, { selected: "waterDmg", value: 10 }, { selected: "cDmgLowHp", value: 45 }],
        homunculusSU2: 30,

        totemAtk: 20,
        totemAtkWind: 21,
        totemAtkDark: 21,
        totemSpd: 15,
        totemCDmg: 25,

        fightsAmount: 6,

        reducedAllTicks: [],
        correct_turn_order: false,
        reason: "",

        allDmgPrilea: [[0], [0]],
        columnPrilea: ["S2"],
        rowPrilea: ["W2", "W4"],

        allDmgTeshar: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
        columnTeshar: ["S1", "S3", "S1", "S3", "Total"],
        rowTeshar: ["W1", "W2", "W3", "W4"],

        allDmgLuna: [[0, 0], [0, 0], [0, 0]],
        columnLuna: ["S3", "S1"],
        rowLuna: ["W2", "W3", "W4"],

        allDmgHomunculus: [[0], [0]],
        columnHomunculus: ["S2"],
        rowHomunculus: ["W2", "W4"],

        options: [
            { value: 's1CDmg', text: 'S1 CDmg' },
            { value: 's2CDmg', text: 'S2 CDmg' },
            { value: 's3CDmg', text: 'S3 CDmg' },
            { value: 'ownTurnCDmg', text: 'Own Turn CDmg' },
            { value: 'cDmgLowHp', text: 'CDmg Low Hp' },
            { value: 'cDmgHighHp', text: 'CDmg High Hp' },
            { value: 'firstAtkCDmg', text: 'First Atk CDmg' },
            { value: 'waterDmg', text: 'Dmg On Water' },
            { value: 'addDmgAtk', text: 'Add Dmg ATK' },
            { value: 'atkBuffBoost', text: 'ATK Buff Boost' }
        ],

        golemStats: [[49455, 1224], [177765, 1963], [49365, 1231], [499800, 1700]]
    },
    computed: {
        prileaAtkTotal() {
            return Math.ceil(736 * (1 + (this.totemAtk + this.totemAtkWind + 8 * this.fightsAmount) / 100) + this.prileaAtk);
        },
        prileaCDmgTotal() {
            return Math.ceil(this.prileaCDmg + this.totemCDmg);
        },
        prileaSpdTotal() {
            return Math.ceil(105 * (1 + this.totemSpd / 100) + this.prileaSpd);
        },
        tesharAtkTotal() {
            return Math.ceil(1098 * (1 + (this.totemAtk + this.totemAtkWind + 8 * this.fightsAmount) / 100) + this.tesharAtk);
        },
        tesharCDmgTotal() {
            return Math.ceil(this.tesharCDmg + this.totemCDmg);
        },
        tesharSpdTotal() {
            return Math.ceil(114 * (1 + this.totemSpd / 100) + this.tesharSpd);
        },
        konamiyaSpdTotal() {
            return Math.ceil(91 * (1 + this.totemSpd / 100) + this.konamiyaSpd);
        },
        lunaAtkTotal() {
            return Math.ceil(878 * (1 + (this.totemAtk + this.totemAtkDark + 8 * this.fightsAmount) / 100) + this.lunaAtk);
        },
        lunaCDmgTotal() {
            return Math.ceil(this.lunaCDmg + this.totemCDmg);
        },
        lunaSpdTotal() {
            return Math.ceil(103 * (1 + this.totemSpd / 100) + this.lunaSpd);
        },
        homunculusAtkTotal() {
            return Math.ceil(823 * (1 + (this.totemAtk + this.totemAtkWind + 8 * this.fightsAmount) / 100) + this.homunculusAtk);
        },
        homunculusCDmgTotal() {
            return Math.ceil(this.homunculusCDmg + this.totemCDmg);
        },
        homunculusSpdTotal() {
            return Math.ceil(101 * (1 + this.totemSpd / 100) + this.homunculusSpd);
        },
        
        homunculusSpdComparison() {
            let homunculusSpd = this.homunculusSpdTotal;
            let prileaSpd = this.prileaSpdTotal / 2;
            let lunaSpd = this.lunaSpdTotal;
            let minSpeed = prileaSpd > 90 ? prileaSpd : 90;
            let conditionMet = homunculusSpd <= lunaSpd && homunculusSpd > minSpeed;
            let displayText = `- Homunculus : ${homunculusSpd} must be in [${minSpeed + 1}, ${lunaSpd - 1}]`;

            return {
                text: displayText,
                conditionMet: conditionMet
            }
        },
        lunaSpdComparison() {
            let lunaSpd = this.lunaSpdTotal;
            let konamiyaSpd = this.konamiyaSpdTotal;
            let conditionMet = lunaSpd >= 169 && lunaSpd < konamiyaSpd;
            let displayText = `- Luna : ${lunaSpd}, must be in [169, ${konamiyaSpd - 1}]`;

            return {
                text: displayText,
                conditionMet: conditionMet
            }
        },
        konamiyaSpdComparison() {
            let konamiyaSpd = this.konamiyaSpdTotal;
            let tesharSpd = this.tesharSpdTotal;
            let lunaSpd = this.lunaSpdTotal;
            let conditionMet = konamiyaSpd > lunaSpd && konamiyaSpd < tesharSpd;
            let displayText = `- Konamiya : ${konamiyaSpd}, must be in [${lunaSpd + 1}, ${tesharSpd - 1}]`;

            return {
                text: displayText,
                conditionMet: conditionMet
            }
        },
        tesharSpdComparison() {
            let tesharSpd = this.tesharSpdTotal;
            let prileaSpd = this.prileaSpdTotal;
            let konamiyaSpd = this.konamiyaSpdTotal;
            let conditionMet = tesharSpd > konamiyaSpd && tesharSpd < prileaSpd;
            let displayText = `- Teshar : ${tesharSpd}, must be in [${konamiyaSpd + 1}, ${prileaSpd - 1}]`;

            return {
                text: displayText,
                conditionMet: conditionMet
            }
        },

        prileaSpdComparison() {
            let tesharSpd = this.tesharSpdTotal;
            let prileaSpd = this.prileaSpdTotal;
            let conditionMet = prileaSpd > tesharSpd;
            let displayText = `- Prilea : ${prileaSpd}, must be more than ${tesharSpd + 1}`;

            return {
                text: displayText,
                conditionMet: conditionMet
            }
        },

        tickSpdOrder() {
            const tickPrecision = 7/100;
            const max_ticks = 100 * Math.ceil(1 / tickPrecision);
            const monstersSpeed = [this.prileaSpdTotal, this.tesharSpdTotal, this.konamiyaSpdTotal, this.lunaSpdTotal, 169, this.homunculusSpdTotal, 90];
            let monstersAllTicks = [];
            this.reducedAllTicks = []

            let monstersTicks = new Array(monstersSpeed.length).fill(0);
            for (let m = 0; m < monstersTicks.length; ++m) {
                monstersTicks[m] = monstersSpeed[m] * tickPrecision;
            }
            monstersAllTicks.push(monstersTicks);
            if (monstersTicks.some(x => x > 100)) {
                this.reducedAllTicks.push([1].concat(monstersTicks))
            }

            let boostAtb = new Array(monstersSpeed.length).fill(0);
            let lunaMoves = 0;
            let homunculusMoved = false;
            for (let t = 1; t < max_ticks; ++t) {
                monstersTicks = new Array(monstersSpeed.length).fill(0);

                oldTicks = monstersAllTicks[monstersAllTicks.length - 1];
                const maxOldTick = Math.max(...oldTicks);
                for (let m = 0; m < monstersTicks.length; ++m) {
                    if (maxOldTick >= 100 && maxOldTick == oldTicks[m])
                        monstersTicks[m] = monstersSpeed[m] * tickPrecision + boostAtb[m];
                    else
                        monstersTicks[m] = oldTicks[m] + monstersSpeed[m] * tickPrecision + boostAtb[m];
                    
                    boostAtb[m] = 0;
                }

                monstersAllTicks.push(monstersTicks);
                if (monstersTicks.some(function(nombre) {return nombre > 100;})) {
                    this.reducedAllTicks.push([t+1].concat(monstersTicks));
                }

                const maxTick = Math.max(...monstersTicks);
                // Kona boosts atb teshar
                if (monstersTicks[2] >= 100 && monstersTicks[2] == maxTick)
                    boostAtb[1] = 100;
                
                // Luna boosts atb herself
                if (monstersTicks[3] >= 100 && monstersTicks[3] == maxTick && lunaMoves === 0) {
                    lunaMoves = 1;
                    boostAtb[3] = 100;
                }

                if (monstersTicks[3] >= 100 && monstersTicks[3] == maxTick && lunaMoves === 1) {
                    lunaMoves = 2;
                }

                if (monstersTicks[5] >= 100 && monstersTicks[5] == maxTick) {
                    homunculusMoved = true;
                }

                if (lunaMoves === 2 && homunculusMoved) {
                    break;
                }
            }
            
            const correct_turn_order = [0, 1, 2, 1, 3];

            const monstersName = ["Prilea", "Teshar", "Konamiya", "Luna", "Golem", "Homunculus"];
            for (let i = 0; i < correct_turn_order.length; ++i) {
                const maxIndex = monstersAllTicks[this.reducedAllTicks[i][0] - 1].reduce((maxIndex, current, currentIndex, arr) => { return current > arr[maxIndex] ? currentIndex : maxIndex;}, 0);
                if (maxIndex != correct_turn_order[i]) {
                    this.correct_turn_order = false;
                    this.reason = `Tick ${this.reducedAllTicks[i][0]} : ${monstersName[maxIndex]} moves but it should be ${monstersName[correct_turn_order[i]]}`
                    return;
                }
            }

            this.correct_turn_order = true;
            this.reason = "Good turn order";
        },
    },
    methods: {
        addItem(listName) {
            this[listName].push({ selected: null, value: 0 });
        },
        removeItem(listName, index) {
            if (this[listName].length == 1)
                return;
            this[listName].splice(index, 1);
        },
        getMaxColumn(index) {
            return Math.max(...this.reducedAllTicks[index])
        },
        getArtefactStatAmount(artefactStats, stat) {
            return artefactStats.reduce((acc, curr) => {
                if (curr.selected === stat)
                    return acc + parseFloat(curr.value);
                else
                    return acc;
            }, 0);
        },
        dmgS1Prilea(currentHp, maxHp, def, hasDmgReduction) {
            let finalAmount = 0;
            for (let i = 0; i < 2; ++i) {
                let ratioHp = currentHp / maxHp;
                const sCDmg = this.getArtefactStatAmount(this.prileaArtefact, "s1CDmg");
                const ownTurnCDmg = this.getArtefactStatAmount(this.prileaArtefact, "ownTurnCDmg");
                const firstSkillDmg = this.getArtefactStatAmount(this.prileaArtefact, "firstAtkCDmg");
                const lowCDmg = (1 - ratioHp) * this.getArtefactStatAmount(this.prileaArtefact, "cDmgLowHp");
                const highCDmg = ratioHp * this.getArtefactStatAmount(this.prileaArtefact, "cDmgHighHp");
                const totalCDmg = this.prileaCDmgTotal + sCDmg + ownTurnCDmg + firstSkillDmg + lowCDmg + highCDmg;

                const waterDmg = this.getArtefactStatAmount(this.prileaArtefact, "waterDmg");

                const defenseDmgReduction = 1000 / (1140 + 3.5 * def);

                const passiveDmgReduction = ratioHp <= 0.5 && hasDmgReduction ? 0.6 : 1;

                const addAtk = this.prileaAtkTotal * this.getArtefactStatAmount(this.prileaArtefact, "waterDmg") / 100;

                let damages = Math.floor(passiveDmgReduction * (1 + waterDmg / 100) * (0.98 * this.prileaAtkTotal * defenseDmgReduction * 1.85 * (100 + this.prileaSU1 + totalCDmg) / 100 + addAtk));
                currentHp -= damages;
                
                finalAmount += damages;
            }

            return finalAmount;
        },
        dmgTeshar(ratioHp, def, firstSkill, atkBuff, hasDmgReduction, skill) {
            const sCDmg = skill === 1 ? this.getArtefactStatAmount(this.tesharArtefact, "s1CDmg") : this.getArtefactStatAmount(this.tesharArtefact, "s3CDmg");
            const ownTurnCDmg = this.getArtefactStatAmount(this.tesharArtefact, "ownTurnCDmg");
            const firstSkillDmg = firstSkill ? this.getArtefactStatAmount(this.tesharArtefact, "firstAtkCDmg") : 0;
            const lowCDmg = (1 - ratioHp) * this.getArtefactStatAmount(this.tesharArtefact, "cDmgLowHp");
            const highCDmg = ratioHp * this.getArtefactStatAmount(this.tesharArtefact, "cDmgHighHp");
            const totalCDmg = this.tesharCDmgTotal + sCDmg + ownTurnCDmg + firstSkillDmg + lowCDmg + highCDmg;

            const waterDmg = this.getArtefactStatAmount(this.tesharArtefact, "waterDmg");

            const defenseDmgReduction = 1000 / (1140 + 3.5 * def);

            const passiveDmgReduction = ratioHp <= 0.5 && hasDmgReduction ? 0.6 : 1;

            const realAtk = atkBuff ? (1.5 * (1 + this.getArtefactStatAmount(this.tesharArtefact, "atkBuffBoost") / 100)) * this.tesharAtkTotal : this.tesharAtkTotal;
            const addAtk = realAtk * this.getArtefactStatAmount(this.tesharArtefact, "addDmgAtk") / 100;

            const atkRatio = skill === 1 ? 4.2 : 3.9;
            const skillUp = skill === 1 ? this.tesharSU1 : this.tesharSU3;

            return Math.floor(passiveDmgReduction * (1 + waterDmg / 100) * (0.98 * realAtk * defenseDmgReduction * atkRatio * (100 + skillUp + totalCDmg) / 100 + addAtk));
        },

        dmgS1Luna(currentHp, maxHp, def, firstSkill, hasDmgReduction) {
            let finalAmount = 0;
            for (let i = 0; i < 2; ++i) {
                let ratioHp = currentHp / maxHp;
                const s1CDmg = this.getArtefactStatAmount(this.lunaArtefact, "s1CDmg")
                const ownTurnCDmg = this.getArtefactStatAmount(this.lunaArtefact, "ownTurnCDmg");
                const firstSkillDmg = firstSkill == 1 ? this.getArtefactStatAmount(this.lunaArtefact, "firstAtkCDmg") : 0;
                const lowCDmg = (1 - ratioHp) * this.getArtefactStatAmount(this.lunaArtefact, "cDmgLowHp");
                const highCDmg = ratioHp * this.getArtefactStatAmount(this.lunaArtefact, "cDmgHighHp");
                const totalCDmg = this.lunaCDmgTotal + s1CDmg + ownTurnCDmg + firstSkillDmg + lowCDmg + highCDmg;

                const waterDmg = this.getArtefactStatAmount(this.lunaArtefact, "waterDmg");

                const defenseDmgReduction = 1000 / (1140 + 3.5 * def);
                const passiveDmgReduction = ratioHp <= 0.5 && hasDmgReduction ? 0.6 : 1;

                const addAtk = this.lunaAtkTotal * this.getArtefactStatAmount(this.lunaArtefact, "addDmgAtk") / 100;

                let damages = Math.floor(passiveDmgReduction * (1 + waterDmg / 100) * (0.98 * this.lunaAtkTotal * defenseDmgReduction * 1.9 * (100 + this.lunaSU1 + totalCDmg) / 100 + addAtk));
                currentHp -= damages;
                
                finalAmount += damages;
            }

            return finalAmount;
        },
        dmgS3Luna(currentHp, maxHp, def, hasDmgReduction) {
            const ratioHp = currentHp / maxHp;

            const s3CDmg = this.getArtefactStatAmount(this.lunaArtefact, "s3CDmg");
            const ownTurnCDmg = this.getArtefactStatAmount(this.lunaArtefact, "ownTurnCDmg");
            const firstSkillDmg = this.getArtefactStatAmount(this.lunaArtefact, "firstAtkCDmg");
            const lowCDmg = (1 - ratioHp) * this.getArtefactStatAmount(this.lunaArtefact, "cDmgLowHp");
            const highCDmg = ratioHp * this.getArtefactStatAmount(this.lunaArtefact, "cDmgHighHp");
            const totalCDmg = this.lunaCDmgTotal + s3CDmg + ownTurnCDmg + firstSkillDmg + lowCDmg + highCDmg;

            const waterDmg = this.getArtefactStatAmount(this.lunaArtefact, "waterDmg");

            const defenseDmgReduction = 1000 / (1140 + 3.5 * def);
            const passiveDmgReduction = ratioHp <= 0.5 && hasDmgReduction ? 0.6 : 1;

            const addAtk = this.lunaAtkTotal * this.getArtefactStatAmount(this.lunaArtefact, "addDmgAtk") / 100;

            return Math.floor(passiveDmgReduction * (1 + waterDmg / 100) * (0.98 * defenseDmgReduction * (this.lunaAtkTotal * 7.2 + maxHp * 0.15) * (100 + this.lunaSU3 + totalCDmg) / 100 + addAtk));
        },
        dmgS2Homunculus(currentHp, maxHp, def, hasDmgReduction) {
            const ratioHp = currentHp / maxHp;

            const s2CDmg = this.getArtefactStatAmount(this.homunculusArtefact, "s2CDmg");
            const ownTurnCDmg = this.getArtefactStatAmount(this.homunculusArtefact, "ownTurnCDmg");
            const firstSkillDmg = this.getArtefactStatAmount(this.homunculusArtefact, "firstAtkCDmg");
            const lowCDmg = (1 - ratioHp) * this.getArtefactStatAmount(this.homunculusArtefact, "cDmgLowHp");
            const highCDmg = ratioHp * this.getArtefactStatAmount(this.homunculusArtefact, "cDmgHighHp");
            const totalCDmg = this.homunculusCDmgTotal + s2CDmg + ownTurnCDmg + firstSkillDmg + lowCDmg + highCDmg;

            const waterDmg = this.getArtefactStatAmount(this.homunculusArtefact, "waterDmg");

            const defenseDmgReduction = 1000 / (1140 + 3.5 * def);
            const passiveDmgReduction = ratioHp <= 0.5 && hasDmgReduction ? 0.6 : 1;

            const addAtk = this.homunculusAtkTotal * this.getArtefactStatAmount(this.homunculusArtefact, "addDmgAtk") / 100;

            return Math.floor(2 * (1 + waterDmg / 100) * (0.98 * defenseDmgReduction * (this.homunculusAtkTotal * 5 + maxHp * 0.05) * (100 + this.homunculusSU2 + totalCDmg) / 100 + addAtk));
        },

        calculateAllDmg() {
            // All teshar skills go on 1 target
            let i = 1;
            let golemHpLeft = 0;
            for (; i < this.golemStats.length; i += 2) {
                golemHpLeft = this.golemStats[i][0];
                let hasDmgReduction = i === 3 ? true : false;
                this.allDmgPrilea[Math.floor(i / 2)][0] = this.dmgS1Prilea(golemHpLeft, this.golemStats[i][0], this.golemStats[i][1], hasDmgReduction)
                golemHpLeft -= this.allDmgPrilea[Math.floor(i / 2)][0];

                this.allDmgTeshar[i][0] = this.dmgTeshar(golemHpLeft / this.golemStats[i][0], 0.3 * this.golemStats[i][1], true, false, hasDmgReduction, 1);
                golemHpLeft -= this.allDmgTeshar[i][1];
                this.allDmgTeshar[i][1] = this.dmgTeshar(golemHpLeft / this.golemStats[i][0], 0.3 * this.golemStats[i][1], false, true, hasDmgReduction, 3);
                golemHpLeft -= this.allDmgTeshar[i][1];
                this.allDmgTeshar[i][2] = this.dmgTeshar(golemHpLeft / this.golemStats[i][0], 0.3 * this.golemStats[i][1], false, false, hasDmgReduction, 1);
                golemHpLeft -= this.allDmgTeshar[i][2];
                this.allDmgTeshar[i][3] = 0;
                this.allDmgTeshar[i][4] = this.allDmgTeshar[i][0] + this.allDmgTeshar[i][1] + this.allDmgTeshar[i][2];
                
                this.allDmgLuna[i - 1][0] = this.dmgS3Luna(golemHpLeft, this.golemStats[i][0], 0.3 * this.golemStats[i][1], hasDmgReduction)
                golemHpLeft -= this.allDmgLuna[i - 1][0];

                this.allDmgHomunculus[Math.floor(i / 2)][0] = this.dmgS2Homunculus(golemHpLeft, this.golemStats[i][0], 0.3 * this.golemStats[i][1], hasDmgReduction)
                    golemHpLeft -= this.allDmgHomunculus[Math.floor(i / 2)][0];

                if (!hasDmgReduction) {
                    this.allDmgLuna[2][1] = this.dmgS1Luna(golemHpLeft, this.golemStats[i][0], 0.3 * this.golemStats[i][1], false, false);
                    golemHpLeft -= this.allDmgLuna[2][1];
                }
            }

            // Case wave 1 were a golem must be killed with S1 S3 so last golem takes S3, S1, S3
            i = 0;
            golemHpLeft = this.golemStats[i][0];
            this.allDmgTeshar[i][0] = 0;
            this.allDmgTeshar[i][1] = this.dmgTeshar(golemHpLeft / this.golemStats[i][0], this.golemStats[i][1], false, true, true, 3);
            golemHpLeft -= this.allDmgTeshar[i][1];
            this.allDmgTeshar[i][2] = this.dmgTeshar(golemHpLeft / this.golemStats[i][0], this.golemStats[i][1], false, false, true, 1);
            golemHpLeft -= this.allDmgTeshar[i][2];
            this.allDmgTeshar[i][3] = this.dmgTeshar(golemHpLeft / this.golemStats[i][0], this.golemStats[i][1], false, true, true, 3);
            golemHpLeft -= this.allDmgTeshar[i][3];
            this.allDmgTeshar[i][4] = this.allDmgTeshar[i][1] + this.allDmgTeshar[i][2] + this.allDmgTeshar[i][3];

            // Case wave 3 were a golem must not be killed so last golem takes S3, S1, S3
            i = 2;
            golemHpLeft = this.golemStats[i][0];
            this.allDmgTeshar[i][0] = 0;
            this.allDmgTeshar[i][1] = this.dmgTeshar(golemHpLeft / this.golemStats[i][0], this.golemStats[i][1], false, true, true, 3);
            golemHpLeft -= this.allDmgTeshar[i][1];
            this.allDmgTeshar[i][2] = 0;
            this.allDmgTeshar[i][3] = this.dmgTeshar(golemHpLeft / this.golemStats[i][0], this.golemStats[i][1], false, true, true, 3);
            golemHpLeft -= this.allDmgTeshar[i][3];
            this.allDmgTeshar[i][4] = this.allDmgTeshar[i][1] + this.allDmgTeshar[i][3];
            this.allDmgLuna[i - 1][1] = this.dmgS1Luna(golemHpLeft, this.golemStats[i][0], this.golemStats[i][1], true, true);
            golemHpLeft -= this.allDmgLuna[i - 1][1];
        },
        w1Dmg() {
            return {
                dmgEnough: this.allDmgTeshar[0][4] >= this.golemStats[0][0],
                detail: `Teshar S3+S1+S3 : ${this.allDmgTeshar[0][4]}, must be more than ${this.golemStats[0][0]}`
            };
        },

        w2Dmg() {
            let damages = this.allDmgPrilea[0][0] + this.allDmgTeshar[1][4] + this.allDmgLuna[0][0];
            if (damages >= this.golemStats[1][0])
                return {
                    dmgEnough: true,
                    detail: `Prilea S1 + Teshar S1+S3+S1+S3 and Luna S3 : ${damages}, must be more than ${this.golemStats[1][0]}`
                };
            
            if (self.homunculusSpdTotal <= 168)
                return {
                    dmgEnough: false,
                    detail: `Teshar S1+S3+S1+S3 and Luna S3 : ${damages}, must be more than ${this.golemStats[1][0]} (maybe put homunculus before ?)`
                };
            
            damages += this.allDmgHomunculus[0][0];
            return {
                dmgEnough: damages >= this.golemStats[1][0],
                detail: `Teshar S1+S3+S1+S3 and Luna S3 and Homunculus S2 : ${damages}, must be more than ${this.golemStats[1][0]}`
            };
        },
        w3Dmg() {
            if (this.allDmgTeshar[2][4] >= this.golemStats[2][0])
                return {
                    dmgEnough: false,
                    detail: `Teshar S3+S3 : ${this.allDmgTeshar[2][4]}, must be less than ${this.golemStats[2][0] - 1}`
                };
            let damages = this.allDmgTeshar[2][4] + this.allDmgLuna[1][1];
            return {
                dmgEnough: damages >= this.golemStats[2][0],
                detail: `Teshar S3+S3 and Luna S1 : ${damages}, must be more than ${this.golemStats[2][0]}`
            };
        },
        w4Dmg() {
            let damages = this.allDmgPrilea[1][0] + this.allDmgTeshar[3][4] + this.allDmgLuna[2][0] + this.allDmgLuna[2][1] + this.allDmgHomunculus[1][0];
            return {
                dmgEnough: damages >= 425000,
                detail: `Prilea S1 + Teshar S1+S3+S1+S3 and Luna S1+S3 and Homunculus S2 : ${damages}, must be more than ~ 425000 (${this.golemStats[3][0]} is optimal)`
            };
        }
    },
});

function toggleDarkTheme() {
    var body = document.body;
    var icon = document.getElementById('theme-icon');
    var cards = document.querySelectorAll('.card');
    var internalCards = document.querySelectorAll('.card-body');

    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        icon.classList.remove('fas', 'fa-moon');
        icon.classList.add('fas', 'fa-sun');

        cards.forEach(card => {
            card.classList.remove('dark-theme');
        });

        internalCards.forEach(internalCard => {
            internalCard.classList.remove('dark-theme-card');
        });
    } else {
        body.classList.add('dark-theme');
        icon.classList.remove('fas', 'fa-sun');
        icon.classList.add('fas', 'fa-moon');

        cards.forEach(card => {
            card.classList.add('dark-theme');
        });

        internalCards.forEach(internalCard => {
            internalCard.classList.add('dark-theme-card');
        });
    }
}