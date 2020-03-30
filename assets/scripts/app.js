const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const ATTACK_VALUE_S = 20;
const chosenMaxLife = 100;

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;

adjustHealthBars(chosenMaxLife);

function attackMonster(mode) {
    let maxDamage;
    if (mode === "ATTACK") {
        maxDamage = ATTACK_VALUE;
    } else if (mode === "STRONG_ATTACK") {
        maxDamage = ATTACK_VALUE_S;
    }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
        alert("you won !");
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert("you lose !!");
    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
        alert("its draw !!!");
    }
}

function attackHandler() {
    attackMonster("ATTACK");
}
function strongAttackHandler() {
    attackMonster("STRONG_ATTACK");
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
