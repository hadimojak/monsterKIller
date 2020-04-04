const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 17;
const ATTACK_VALUE_S = 14;
const HEAL_VALUE = 20;
const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GGAME_OVER";

let battleLog = [];
let lastLoggedEvent;

function getMaxLifeValue() {
    const enteredNumber = parseInt(
        prompt("enter player and monster health:", "100")
    );
    const parsedValue = enteredNumber;
    if (isNaN(parsedValue) || parsedValue <= 0) {
        throw { massage: "invalid user input, not a number " };
    }
    return parsedValue;
}

let chosenMaxLife;
try {
    chosenMaxLife = getMaxLifeValue();
} catch (error) {
    console.log(error);
    chosenMaxLife = 100;
    alert("you entered a wrong value and default value 100 in enter");
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
    let logentry = {
        event: event,
        value: value,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    };

    switch (event) {
        case LOG_EVENT_PLAYER_ATTACK:
            logentry.target = "monster";
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logentry = {
                event: event,
                value: value,
                target: "monster",
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logentry = {
                event: event,
                value: value,
                target: "player",
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logentry = {
                event: event,
                value: value,
                target: "player",
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        case LOG_EVENT_GAME_OVER:
            logentry = {
                event: event,
                value: value,
                finalMonsterHealth: monsterHealth,
                finalPlayerHealth: playerHealth
            };
            break;
        default:
            logentry = { event: "bad event excute!!" };
            break;
    }

    // if (event === LOG_EVENT_PLAYER_ATTACK) {
    //     logentry.target = "monster";
    // } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    //     logentry = {
    //         event: event,
    //         value: value,
    //         target: "monster",
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
    // } else if (event === LOG_EVENT_MONSTER_ATTACK) {
    //     logentry = {
    //         event: event,
    //         value: value,
    //         target: "player",
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
    // } else if (event === LOG_EVENT_PLAYER_HEAL) {
    //     logentry = {
    //         event: event,
    //         value: value,
    //         target: "player",
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
    // } else if (LOG_EVENT_GAME_OVER) {
    //     logentry = {
    //         event: event,
    //         value: value,
    //         finalMonsterHealth: monsterHealth,
    //         finalPlayerHealth: playerHealth
    //     };
    // }
    battleLog.push(logentry);
}

function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound() {
    //when monster attack player
    const itinalPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentMonsterHealth,
        currentPlayerHealth
    );

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = itinalPlayerHealth;
        alert("time for bonus life");
        setPlayerHealth(itinalPlayerHealth);
    }
    //when games end
    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert("you won !");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            "player won",
            currentMonsterHealth,
            currentPlayerHealth
        );
        reset();
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert("you lose !!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            "monster won",
            currentMonsterHealth,
            currentPlayerHealth
        );
        reset();
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert("its draw !!!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            "a draw",
            currentMonsterHealth,
            currentPlayerHealth
        );
        reset();
    }
}

function attackMonster(mode) {
    //when player attack monster
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : ATTACK_VALUE_S;
    const logevent =
        mode === MODE_ATTACK
            ? LOG_EVENT_PLAYER_ATTACK
            : LOG_EVENT_PLAYER_STRONG_ATTACK;

    // if (mode === MODE_ATTACK) {
    //     maxDamage = ATTACK_VALUE;
    //     logevent = LOG_EVENT_PLAYER_ATTACK;
    // } else if (mode === MODE_STRONG_ATTACK) {
    //     maxDamage = ATTACK_VALUE_S;
    //     logevent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    // }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog(logevent, damage, currentMonsterHealth, currentPlayerHealth);
    endRound();
}

function attackHandler() {
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
    // when heal player
    let healValue;
    if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
        alert("you can't heal more your max heal value");
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endRound();
}

function prtinLogHandler() {
    let i = 0;
    for (const iterator of battleLog) {
        //with for_of by me
        // console.log(battleLog);
        console.log(`#${i}`);
        for (const key in iterator) {
            //for_in in a for
            // console.log(key);
            // console.log(iterator[key]);
            console.log(`${key} => ${iterator[key]}`);
        }
        lastLoggedEvent = i;
        i++;
    }
    console.log(battleLog);

    // let _battleLog = [];
    // for (let i = 0; i < battleLog.length; i++) {
    //     _battleLog.push(battleLog[i]);// with for by me
    // }
    // console.log(_battleLog);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", prtinLogHandler);
