// Enhanced Bird Clicker Game v2.5
// Global variables
let score = 0;
let coinsPerSecond = 0;
let coinsPerClick = 1;

let upgrade1Cost = 50;
let upgrade2Cost = 125;
let upgrade3Cost = 500;
let upgrade4Cost = 1100;

let autoClickUpgrades = 0;
let clickPowerUpgrades = 0;
let mrClickerUpgrades = 0;
let birdsNestUpgrades = 0;

let level = 1;
let clicksForNextLevel = 50;
let clickCount = 0;

// Statistics
let totalCoinsEarned = 0;
let totalClicks = 0;
let highestLevel = 1;
let startTime = Date.now();
let playTime = 0;
let upgradesPurchased = 0;
let powerupsUsed = 0;

// Prestige system
let prestigePoints = 0;
let prestigeClickBonus = 0;
let prestigeAutoBonus = 0;

// Premium items
let premiumItems = {
    'golden-skin': false,
    'rainbow-skin': false,
    'auto-boost': false,
    'lucky-charm': false
};

// Combo system
let comboCount = 0;
let comboMultiplier = 1;
let lastClickTime = 0;
const comboTimeout = 2000;

// Daily reward
let lastDailyReward = 0;

// DOM Elements
const scoreElement = document.getElementById('score');
const coinsPerSecondElement = document.getElementById('coins-per-second');
const upgradeButton1 = document.getElementById('UpgradeButton1');
const upgradeButton2 = document.getElementById('UpgradeButton2');
const upgradeButton3 = document.getElementById('UpgradeButton3');
const upgradeButton4 = document.getElementById('UpgradeButton4');
const clickArea = document.getElementById('click-area');
const clickImage = document.getElementById('click-image');

// Audio
const clickSound = new Audio('assets/click.mp3');
const buySound = new Audio('assets/buy.mp3');
const ErrorSound = new Audio('assets/ErrorSound.mp3');
const modernClick = new Audio('assets/modernClick.mp3');
const hawk_squawk = new Audio('assets/hawk_squawk.mp3');
const level_up = new Audio('assets/level_passed.mp3');
const backgroundMusic = new Audio('assets/Backgroundmusic.mp3');

backgroundMusic.loop = true;
backgroundMusic.volume = 0.4;

[clickSound, buySound, ErrorSound, modernClick, hawk_squawk, level_up, backgroundMusic].forEach(audio => {
    audio.addEventListener('error', () => console.log('Audio file not found'));
});

// Save/Load System
function saveGame() {
    const saveData = {
        score, coinsPerClick, coinsPerSecond, autoClickUpgrades, clickPowerUpgrades,
        mrClickerUpgrades, birdsNestUpgrades, upgrade1Cost, upgrade2Cost, upgrade3Cost,
        upgrade4Cost, level, clicksForNextLevel, clickCount, totalCoinsEarned, totalClicks,
        highestLevel, playTime, upgradesPurchased, powerupsUsed, prestigePoints,
        prestigeClickBonus, prestigeAutoBonus, premiumItems, lastDailyReward
    };
    localStorage.setItem('birdClickerSave', JSON.stringify(saveData));
}

function loadGame() {
    const savedData = JSON.parse(localStorage.getItem('birdClickerSave'));
    if (savedData) {
        Object.assign(window, savedData);

        scoreElement.innerText = formatNumber(score);
        document.querySelector('#UpgradeButton1 .click-count-num').innerText = autoClickUpgrades;
        document.querySelector('#UpgradeButton1 .cost-amount').innerText = formatNumber(upgrade1Cost);
        document.querySelector('#UpgradeButton2 .click-count-num').innerText = clickPowerUpgrades;
        document.querySelector('#UpgradeButton2 .cost-amount').innerText = formatNumber(upgrade2Cost);
        document.querySelector('#UpgradeButton3 .click-count-num').innerText = mrClickerUpgrades;
        document.querySelector('#UpgradeButton3 .cost-amount').innerText = formatNumber(upgrade3Cost);
        document.querySelector('#UpgradeButton4 .click-count-num').innerText = birdsNestUpgrades;
        document.querySelector('#UpgradeButton4 .cost-amount').innerText = formatNumber(upgrade4Cost);

        document.getElementById("levelDisplay").textContent = level;
        updateProgressBar();
        updateScore();
        updateCoinsPerSecond();
        updateStatistics();
    }
}

function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return Math.floor(num).toString();
}

// Achievements
const achievements = [
    { id: "click100", name: "🐣 Newbie Clicker", description: "Click 100 times", condition: () => clickCount >= 100 },
    { id: "click1000", name: "🐥 Bird Enthusiast", description: "Click 1,000 times", condition: () => clickCount >= 1000 },
    { id: "click10000", name: "🦜 Bird Master", description: "Click 10,000 times", condition: () => clickCount >= 10000 },
    { id: "click100000", name: "🔥 Ultimate Clicker", description: "Click 100,000 times", condition: () => clickCount >= 100000 },
    { id: "coins50000", name: "💰 Wealthy Bird", description: "Earn 50,000 coins", condition: () => totalCoinsEarned >= 50000 },
    { id: "coins1m", name: "💎 Millionaire", description: "Earn 1,000,000 coins", condition: () => totalCoinsEarned >= 1000000 },
    { id: "level10", name: "🕊 Sky High", description: "Reach Level 10", condition: () => level >= 10 },
    { id: "level25", name: "🦅 Eagle Eye", description: "Reach Level 25", condition: () => level >= 25 },
    { id: "level50", name: "🔥 Phoenix Rising", description: "Reach Level 50", condition: () => level >= 50 },
    { id: "upgrade10", name: "🛒 Shopping Spree", description: "Purchase 10 upgrades", condition: () => upgradesPurchased >= 10 },
    { id: "combo50", name: "⚡ Combo Master", description: "Achieve 50x combo", condition: () => comboMultiplier >= 50 },
    { id: "prestige1", name: "✨ First Prestige", description: "Prestige once", condition: () => prestigePoints >= 1 }
];

let unlockedAchievements = JSON.parse(localStorage.getItem("unlockedAchievements")) || [];

loadGame();

// Music autoplay
let musicPlayed = false;
document.addEventListener('click', () => {
    if (!musicPlayed && document.getElementById('musicToggle').checked) {
        backgroundMusic.play().catch(() => { });
        musicPlayed = true;
    }
}, { once: true });

// Update functions
function updateScore() {
    scoreElement.innerText = formatNumber(score);
    checkUnlocks();
    updateProgressBar();
    levelUp();
    checkAchievements();
    updateStatistics();
    saveGame();
}

function updateStatistics() {
    document.getElementById('total-coins-stat').innerText = formatNumber(totalCoinsEarned);
    document.getElementById('total-clicks-stat').innerText = formatNumber(totalClicks);
    document.getElementById('highest-level-stat').innerText = highestLevel;
    document.getElementById('upgrades-purchased-stat').innerText = upgradesPurchased;
    document.getElementById('powerups-used-stat').innerText = powerupsUsed;

    const currentPlayTime = Math.floor((Date.now() - startTime + playTime) / 60000);
    document.getElementById('playtime-stat').innerText = currentPlayTime + 'm';
}

function spawnRewardBirds() {
    const birdCount = premiumItems['lucky-charm'] ? 6 : 4;
    for (let i = 0; i < birdCount; i++) {
        const rewardBird = document.createElement("img");
        rewardBird.src = "assets/golden-bird.png";
        rewardBird.classList.add("reward-bird");
        rewardBird.style.left = `${Math.random() * 80 + 10}vw`;
        rewardBird.style.top = `${Math.random() * 80 + 10}vh`;
        document.body.appendChild(rewardBird);

        rewardBird.addEventListener("click", () => {
            score += 100 * comboMultiplier;
            totalCoinsEarned += 100 * comboMultiplier;
            updateScore();
            rewardBird.remove();
            playSound(modernClick);
            createParticles(rewardBird.offsetLeft, rewardBird.offsetTop);
        });

        setTimeout(() => {
            rewardBird.style.transform = "translateX(100vw)";
            setTimeout(() => rewardBird.remove(), 4000);
        }, 300);
    }
}

function updateCoinsPerSecond() {
    let effectiveCoinsPerSecond = coinsPerSecond * (1 + prestigeAutoBonus * 0.1);
    if (premiumItems['auto-boost']) effectiveCoinsPerSecond *= 2;

    if (effectiveCoinsPerSecond > 0) {
        coinsPerSecondElement.innerText = `+${formatNumber(effectiveCoinsPerSecond)}/sec`;
        coinsPerSecondElement.classList.remove('hidden');
        coinsPerSecondElement.style.display = 'block';
    } else {
        coinsPerSecondElement.style.display = 'none';
    }

    clearInterval(window.autoClickInterval);

    if (autoClickUpgrades > 0) {
        window.autoClickInterval = setInterval(() => {
            score += effectiveCoinsPerSecond;
            totalCoinsEarned += effectiveCoinsPerSecond;
            updateScore();
        }, 1000);
    }
}

function updateProgressBar() {
    const progressPercent = (clickCount / clicksForNextLevel) * 100;
    document.getElementById("progressFill").style.width = progressPercent + "%";
}

function levelUp() {
    if (clickCount >= clicksForNextLevel) {
        level++;
        clickCount = 0;
        clicksForNextLevel = Math.round(clicksForNextLevel * 1.5);

        if (level > highestLevel) highestLevel = level;

        document.getElementById("levelDisplay").textContent = level;
        document.getElementById("progressFill").style.width = "0%";

        playSound(level_up);
        const reward = 200 * level;
        score += reward;
        totalCoinsEarned += reward;
        updateScore();
        checkAchievements();
        spawnRewardBirds();

        showNotification(`🎉 Level ${level}! +${reward} coins!`, 'success');
    }
}

function showNotification(message, type = 'info', duration = 2000) {
    const notification = document.createElement('div');
    notification.className = `fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl z-50 font-bold text-white fade-in ${type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
            type === 'error' ? 'bg-gradient-to-r from-red-500 to-pink-600' :
                'bg-gradient-to-r from-blue-500 to-purple-600'
        }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

function showAlert(message) {
    showNotification(message, 'error', 700);
}

function message(msg) {
    showNotification(msg, 'success', 2000);
}

function playSound(audio) {
    audio.currentTime = 0;
    audio.play().catch(() => { });
}

// Particle effects
function createParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        const angle = (Math.PI * 2 * i) / 8;
        const velocity = 50 + Math.random() * 50;
        particle.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
        particle.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

// Combo system
function updateCombo() {
    const now = Date.now();
    if (now - lastClickTime < comboTimeout) {
        comboCount++;
        comboMultiplier = Math.min(Math.floor(comboCount / 5) + 1, 100);

        const comboDisplay = document.getElementById('combo-display');
        if (comboMultiplier > 1) {
            comboDisplay.classList.remove('hidden');
            document.getElementById('combo-multiplier').textContent = comboMultiplier;
            comboDisplay.classList.add('combo-badge');
            setTimeout(() => comboDisplay.classList.remove('combo-badge'), 500);
        }
    } else {
        comboCount = 0;
        comboMultiplier = 1;
        document.getElementById('combo-display').classList.add('hidden');
    }
    lastClickTime = now;
}

// Upgrade Purchase
function handleUpgradePurchase(upgradeType) {
    const purchases = {
        'upgrade1': { cost: upgrade1Cost, stat: 'autoClickUpgrades', effect: () => { coinsPerSecond += 1; updateCoinsPerSecond(); } },
        'upgrade2': { cost: upgrade2Cost, stat: 'clickPowerUpgrades', effect: () => coinsPerClick += 1 },
        'upgrade3': { cost: upgrade3Cost, stat: 'mrClickerUpgrades', effect: () => coinsPerClick += 5 },
        'upgrade4': { cost: upgrade4Cost, stat: 'birdsNestUpgrades', effect: () => coinsPerClick += 10 }
    };

    const upgrade = purchases[upgradeType];
    if (score >= upgrade.cost) {
        score -= upgrade.cost;
        playSound(buySound);
        window[upgrade.stat]++;
        upgradesPurchased++;
        upgrade.effect();

        const idx = parseInt(upgradeType.slice(-1));
        const costVar = 'upgrade' + idx + 'Cost';
        window[costVar] = Math.round(window[costVar] * 1.5);

        document.querySelector(`#UpgradeButton${idx} .click-count-num`).innerText = window[upgrade.stat];
        document.querySelector(`#UpgradeButton${idx} .cost-amount`).innerText = formatNumber(window[costVar]);

        updateScore();
    } else {
        showAlert("❌ Not enough coins!");
        playSound(ErrorSound);
    }
}

upgradeButton1.addEventListener('click', () => handleUpgradePurchase('upgrade1'));
upgradeButton2.addEventListener('click', () => handleUpgradePurchase('upgrade2'));
upgradeButton3.addEventListener('click', () => handleUpgradePurchase('upgrade3'));
upgradeButton4.addEventListener('click', () => handleUpgradePurchase('upgrade4'));

// Bird Click
clickImage.addEventListener('click', (e) => {
    let effectiveClickPower = coinsPerClick * (1 + prestigeClickBonus * 0.1);
    updateCombo();

    score += effectiveClickPower * comboMultiplier;
    totalCoinsEarned += effectiveClickPower * comboMultiplier;
    clickCount++;
    totalClicks++;

    clickImage.classList.add('click-animate');
    setTimeout(() => clickImage.classList.remove('click-animate'), 400);

    createCoinEffect(e.clientX, e.clientY);
    createParticles(e.clientX, e.clientY);

    playSound(clickSound);
    updateScore();
});

function createCoinEffect(x, y) {
    const coin = document.createElement('img');
    coin.src = 'assets/pngtree-glossy-golden-coin-icon-png-image_2898883-removebg-preview.png';
    coin.className = 'fixed w-16 h-16 pointer-events-none z-50 coin-fly';
    coin.style.left = x + 'px';
    coin.style.top = y + 'px';
    document.body.appendChild(coin);
    setTimeout(() => coin.remove(), 800);
}

function checkUnlocks() {
    [upgradeButton1, upgradeButton2, upgradeButton3, upgradeButton4].forEach((btn, index) => {
        const costs = [upgrade1Cost, upgrade2Cost, upgrade3Cost, upgrade4Cost];
        if (score >= costs[index]) {
            btn.classList.add('ring-2', 'ring-amber-400');
        } else {
            btn.classList.remove('ring-2', 'ring-amber-400');
        }
    });
}

function checkAchievements() {
    achievements.forEach(achievement => {
        if (!unlockedAchievements.includes(achievement.id) && achievement.condition()) {
            unlockedAchievements.push(achievement.id);
            localStorage.setItem("unlockedAchievements", JSON.stringify(unlockedAchievements));
            showAchievementNotification(achievement.name);
        }
    });
}

function showAchievementNotification(name) {
    const popup = document.getElementById("achievement-popup");
    document.getElementById("achievement-text").textContent = `🏆 ${name}`;
    popup.classList.remove('hidden');
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.classList.add('hidden');
            popup.style.display = 'none';
            popup.style.opacity = '1';
        }, 300);
    }, 3000);
}

function showAchievements() {
    const popup = document.getElementById("achievements-popup");
    const list = document.getElementById("achievements-list");
    list.innerHTML = "";

    achievements.forEach(achievement => {
        const li = document.createElement("li");
        const unlocked = unlockedAchievements.includes(achievement.id);
        li.className = `glass p-4 rounded-lg ${unlocked ? 'bg-amber-500/20' : 'bg-white/10'}`;
        li.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <div class="font-bold text-lg text-white">${achievement.name}</div>
                    <div class="text-sm opacity-80 text-white">${achievement.description}</div>
                </div>
                <div class="text-2xl">${unlocked ? '✅' : '🔒'}</div>
            </div>
        `;
        list.appendChild(li);
    });

    popup.classList.remove('hidden');
    popup.style.display = 'flex';
}

function closeAchievements() {
    document.getElementById("achievements-popup").classList.add('hidden');
    document.getElementById("achievements-popup").style.display = 'none';
}


// Menu functions
function toggleMenu() {
    document.getElementById('menu-popup').classList.toggle('-translate-x-full');
}

document.getElementById('hamburger-menu').addEventListener('click', toggleMenu);

function toggleMusic() {
    const toggle = document.getElementById('musicToggle');
    if (toggle.checked) {
        backgroundMusic.play().catch(() => { });
    } else {
        backgroundMusic.pause();
    }
}

function adjustVolume() {
    const volume = document.getElementById('volumeSlider').value;
    backgroundMusic.volume = volume;
    [clickSound, buySound, ErrorSound, modernClick, hawk_squawk, level_up].forEach(audio => {
        audio.volume = volume;
    });
}

function toggleDarkMode() {
    message("🌙 Dark mode is always active!");
}

function showGameInfo() {
    showNotification("🎮 Click the bird to earn coins! Buy upgrades and unlock achievements!", 'info', 4000);
}

function shareOnTwitter() {
    const text = `I reached Level ${level} and earned ${formatNumber(score)} coins in Bird Clicker Game! 🎮🐦`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(tweetUrl, "_blank");
}

function resetGame() {
    document.getElementById('custom-confirm').classList.remove('hidden');
    document.getElementById('custom-confirm').style.display = 'flex';
}

document.getElementById('confirm-yes').addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

document.getElementById('confirm-no').addEventListener('click', () => {
    document.getElementById('custom-confirm').classList.add('hidden');
    document.getElementById('custom-confirm').style.display = 'none';
});

// Power-Ups
const powerUpCosts = {
    doubleCoins: 1000,
    autoFrenzy: 2000,
    goldenBird: 5000,
    discountMode: 3000
};

let activePowerUps = {
    doubleCoins: false,
    autoFrenzy: false,
    goldenBird: false,
    discountMode: false
};

document.getElementById("powerups-btn").addEventListener("click", () => {
    const menu = document.getElementById("powerups-menu");
    menu.classList.toggle("hidden");
    menu.style.display = menu.classList.contains('hidden') ? 'none' : 'flex';
});

document.getElementById("close-powerups").addEventListener("click", () => {
    document.getElementById("powerups-menu").classList.add("hidden");
    document.getElementById("powerups-menu").style.display = 'none';
});

document.getElementById("double-coins").addEventListener("click", () => {
    if (score >= powerUpCosts.doubleCoins && !activePowerUps.doubleCoins) {
        score -= powerUpCosts.doubleCoins;
        activePowerUps.doubleCoins = true;
        powerupsUsed++;
        updateScore();

        coinsPerClick *= 2;
        coinsPerSecond *= 2;
        updateCoinsPerSecond();

        message("💰 2x Coins for 20s!");
        document.getElementById("double-coins").disabled = true;

        setTimeout(() => {
            coinsPerClick /= 2;
            coinsPerSecond /= 2;
            updateCoinsPerSecond();
            activePowerUps.doubleCoins = false;
            document.getElementById("double-coins").disabled = false;
            message("💰 2x Coins ended!");
        }, 20000);
    } else {
        showAlert("❌ Not enough coins or active!");
        playSound(ErrorSound);
    }
});

document.getElementById("auto-frenzy").addEventListener("click", () => {
    if (score >= powerUpCosts.autoFrenzy && !activePowerUps.autoFrenzy) {
        score -= powerUpCosts.autoFrenzy;
        activePowerUps.autoFrenzy = true;
        powerupsUsed++;
        updateScore();

        message("🔥 Auto Click Frenzy!");
        document.getElementById("auto-frenzy").disabled = true;

        const frenzyInterval = setInterval(() => {
            score += coinsPerClick * comboMultiplier;
            totalCoinsEarned += coinsPerClick * comboMultiplier;
            updateScore();
        }, 200);

        setTimeout(() => {
            clearInterval(frenzyInterval);
            activePowerUps.autoFrenzy = false;
            document.getElementById("auto-frenzy").disabled = false;
            message("🔥 Frenzy ended!");
        }, 10000);
    } else {
        showAlert("❌ Not enough coins or active!");
        playSound(ErrorSound);
    }
});

document.getElementById("golden-bird").addEventListener("click", () => {
    if (score >= powerUpCosts.goldenBird && !activePowerUps.goldenBird) {
        score -= powerUpCosts.goldenBird;
        activePowerUps.goldenBird = true;
        powerupsUsed++;
        updateScore();

        playSound(hawk_squawk);
        message("✨ Golden Bird Mode!");
        document.getElementById("golden-bird").disabled = true;

        document.body.classList.add("golden-mode");
        spawnRewardBirds();

        setTimeout(() => {
            document.body.classList.remove("golden-mode");
            activePowerUps.goldenBird = false;
            document.getElementById("golden-bird").disabled = false;
            message("✨ Mode ended!");
        }, 30000);
    } else {
        showAlert("❌ Not enough coins or active!");
        playSound(ErrorSound);
    }
});

document.getElementById("discount-mode").addEventListener("click", () => {
    if (score >= powerUpCosts.discountMode && !activePowerUps.discountMode) {
        score -= powerUpCosts.discountMode;
        activePowerUps.discountMode = true;
        powerupsUsed++;
        updateScore();

        message("💸 50% discount for 15s!");
        document.getElementById("discount-mode").disabled = true;

        const oldCosts = [upgrade1Cost, upgrade2Cost, upgrade3Cost, upgrade4Cost];

        upgrade1Cost = Math.floor(upgrade1Cost / 2);
        upgrade2Cost = Math.floor(upgrade2Cost / 2);
        upgrade3Cost = Math.floor(upgrade3Cost / 2);
        upgrade4Cost = Math.floor(upgrade4Cost / 2);

        [1, 2, 3, 4].forEach(i => {
            document.querySelector(`#UpgradeButton${i} .cost-amount`).innerText =
                formatNumber(window[`upgrade${i}Cost`]);
        });

        setTimeout(() => {
            [upgrade1Cost, upgrade2Cost, upgrade3Cost, upgrade4Cost] = oldCosts;
            [1, 2, 3, 4].forEach(i => {
                document.querySelector(`#UpgradeButton${i} .cost-amount`).innerText =
                    formatNumber(window[`upgrade${i}Cost`]);
            });
            activePowerUps.discountMode = false;
            document.getElementById("discount-mode").disabled = false;
            message("💸 Costs restored!");
        }, 15000);
    } else {
        showAlert("❌ Not enough coins or active!");
        playSound(ErrorSound);
    }
});

// Statistics Modal
document.getElementById('stats-btn').addEventListener('click', () => {
    updateStatistics();
    document.getElementById('stats-modal').classList.remove('hidden');
    document.getElementById('stats-modal').style.display = 'flex';
    toggleMenu();
});

document.getElementById('close-stats').addEventListener('click', () => {
    document.getElementById('stats-modal').classList.add('hidden');
    document.getElementById('stats-modal').style.display = 'none';
});

// Daily Reward System
function checkDailyReward() {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (now - lastDailyReward >= oneDay) {
        const reward = 1000 + (level * 100);
        document.getElementById('daily-reward-amount').textContent = formatNumber(reward) + ' Coins!';
        document.getElementById('daily-reward-modal').classList.remove('hidden');
        document.getElementById('daily-reward-modal').style.display = 'flex';

        document.getElementById('claim-daily-reward').onclick = () => {
            score += reward;
            totalCoinsEarned += reward;
            lastDailyReward = now;
            updateScore();
            message(`🎁 Claimed ${formatNumber(reward)} coins!`);
            document.getElementById('daily-reward-modal').classList.add('hidden');
            document.getElementById('daily-reward-modal').style.display = 'none';
        };
    }
}

document.getElementById('daily-reward-btn').addEventListener('click', () => {
    checkDailyReward();
    toggleMenu();
});

// Premium Store
document.getElementById('premium-store-btn').addEventListener('click', () => {
    document.getElementById('premium-store-modal').classList.remove('hidden');
    document.getElementById('premium-store-modal').style.display = 'flex';
    toggleMenu();
});

document.getElementById('close-premium').addEventListener('click', () => {
    document.getElementById('premium-store-modal').classList.add('hidden');
    document.getElementById('premium-store-modal').style.display = 'none';
});

document.querySelectorAll('.premium-buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const item = e.target.closest('.premium-item');
        const itemId = item.dataset.item;
        const cost = parseInt(item.dataset.cost);

        if (!premiumItems[itemId] && score >= cost) {
            score -= cost;
            premiumItems[itemId] = true;
            updateScore();
            message(`✨ Purchased ${itemId}!`);
            e.target.textContent = 'Owned ✓';
            e.target.disabled = true;
            e.target.classList.add('opacity-50');
        } else if (premiumItems[itemId]) {
            message("Already owned!");
        } else {
            showAlert("Not enough coins!");
        }
    });
});

// Prestige System
document.getElementById('prestige-btn').addEventListener('click', () => {
    document.getElementById('prestige-points').textContent = Math.floor(level / 20);
    document.getElementById('prestige-modal').classList.remove('hidden');
    document.getElementById('prestige-modal').style.display = 'flex';
    toggleMenu();
});

document.getElementById('close-prestige').addEventListener('click', () => {
    document.getElementById('prestige-modal').classList.add('hidden');
    document.getElementById('prestige-modal').style.display = 'none';
});

document.getElementById('do-prestige-btn').addEventListener('click', () => {
    if (level >= 20) {
        const points = Math.floor(level / 20);
        prestigePoints += points;

        // Reset game but keep prestige bonuses
        score = 0;
        level = 1;
        clickCount = 0;
        coinsPerClick = 1;
        coinsPerSecond = 0;
        autoClickUpgrades = 0;
        clickPowerUpgrades = 0;
        mrClickerUpgrades = 0;
        birdsNestUpgrades = 0;
        upgrade1Cost = 50;
        upgrade2Cost = 125;
        upgrade3Cost = 500;
        upgrade4Cost = 1100;

        message(`✨ Prestiged! +${points} points!`);
        document.getElementById('prestige-modal').classList.add('hidden');
        document.getElementById('prestige-modal').style.display = 'none';
        updateScore();
        updateCoinsPerSecond();
    } else {
        showAlert("Need Level 20!");
    }
});

document.querySelectorAll('.prestige-upgrade-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const upgrade = e.target.dataset.upgrade;
        if (prestigePoints >= 1) {
            prestigePoints--;
            if (upgrade === 'click') {
                prestigeClickBonus++;
                message("Click power increased!");
            } else {
                prestigeAutoBonus++;
                message("Auto income increased!");
                updateCoinsPerSecond();
            }
            document.getElementById('prestige-points').textContent = prestigePoints;
        } else {
            showAlert("Not enough prestige points!");
        }
    });
});

// Extras Menu
document.getElementById("extras-btn").addEventListener("click", () => {
    document.getElementById("extras-menu").classList.remove('hidden');
    document.getElementById("extras-menu").style.display = "flex";
    toggleMenu();
});

document.getElementById("close-extras").addEventListener("click", () => {
    document.getElementById("extras-menu").classList.add('hidden');
    document.getElementById("extras-menu").style.display = "none";
});

// Background themes
document.querySelectorAll(".background-btn").forEach(button => {
    button.addEventListener("click", () => {
        const theme = button.getAttribute("data-bg");
        document.body.setAttribute("data-theme", theme);
        localStorage.setItem("selectedTheme", theme);
        message(`🌄 Theme: ${button.textContent}!`);
    });
});

const savedTheme = localStorage.getItem("selectedTheme");
if (savedTheme) document.body.setAttribute("data-theme", savedTheme);

// Evolution System
const evolutionStages = [
    { level: 1, name: "🐣 Newbie Bird", progress: 0 },
    { level: 4, name: "🐥 Growing Sparrow", progress: 25 },
    { level: 7, name: "🦜 Skilled Parrot", progress: 50 },
    { level: 10, name: "🦅 Master Falcon", progress: 75 },
    { level: 15, name: "🔥 Legendary Phoenix", progress: 100 }
];

function updateEvolution() {
    let currentStage = evolutionStages[0];
    for (let i = evolutionStages.length - 1; i >= 0; i--) {
        if (level >= evolutionStages[i].level) {
            currentStage = evolutionStages[i];
            break;
        }
    }
    document.getElementById("evolution-progress").style.width = currentStage.progress + "%";
    document.getElementById("evolution-stage").innerText = currentStage.name;
}

setInterval(updateEvolution, 1000);


// ==================== MINI-GAMES ====================

// Dodge Game
let dodgeGame = {
    canvas: null,
    ctx: null,
    player: { x: 300, y: 350, width: 40, height: 40, speed: 5 },
    obstacles: [],
    score: 0,
    highScore: localStorage.getItem('dodgeHighScore') || 0,
    gameLoop: null,
    running: false,
    keys: {}
};

document.getElementById('play-dodge-game').addEventListener('click', () => {
    document.getElementById('extras-menu').classList.add('hidden');
    document.getElementById('extras-menu').style.display = 'none';
    document.getElementById('dodge-game-modal').classList.remove('hidden');
    document.getElementById('dodge-game-modal').style.display = 'flex';

    dodgeGame.canvas = document.getElementById('dodgeCanvas');
    dodgeGame.ctx = dodgeGame.canvas.getContext('2d');
    document.getElementById('dodge-high-score').textContent = dodgeGame.highScore;
});

document.getElementById('close-dodge-game').addEventListener('click', () => {
    stopDodgeGame();
    document.getElementById('dodge-game-modal').classList.add('hidden');
    document.getElementById('dodge-game-modal').style.display = 'none';
});

document.getElementById('start-dodge-game').addEventListener('click', () => {
    startDodgeGame();
});

function startDodgeGame() {
    dodgeGame.player.x = 300;
    dodgeGame.player.y = 350;
    dodgeGame.obstacles = [];
    dodgeGame.score = 0;
    dodgeGame.running = true;
    document.getElementById('dodge-score').textContent = '0';

    document.addEventListener('keydown', handleDodgeKeyDown);
    document.addEventListener('keyup', handleDodgeKeyUp);

    dodgeGame.canvas.addEventListener('touchstart', handleDodgeTouch);
    dodgeGame.canvas.addEventListener('touchmove', handleDodgeTouch);

    dodgeGame.gameLoop = setInterval(updateDodgeGame, 1000 / 60);
}

function stopDodgeGame() {
    dodgeGame.running = false;
    clearInterval(dodgeGame.gameLoop);
    document.removeEventListener('keydown', handleDodgeKeyDown);
    document.removeEventListener('keyup', handleDodgeKeyUp);
}

function handleDodgeKeyDown(e) {
    dodgeGame.keys[e.key] = true;
}

function handleDodgeKeyUp(e) {
    dodgeGame.keys[e.key] = false;
}

function handleDodgeTouch(e) {
    e.preventDefault();
    const rect = dodgeGame.canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    dodgeGame.player.x = Math.max(0, Math.min(x - dodgeGame.player.width / 2,
        dodgeGame.canvas.width - dodgeGame.player.width));
}

function updateDodgeGame() {
    if (!dodgeGame.running) return;

    const ctx = dodgeGame.ctx;
    const canvas = dodgeGame.canvas;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Move player
    if (dodgeGame.keys['ArrowLeft'] || dodgeGame.keys['a']) {
        dodgeGame.player.x = Math.max(0, dodgeGame.player.x - dodgeGame.player.speed);
    }
    if (dodgeGame.keys['ArrowRight'] || dodgeGame.keys['d']) {
        dodgeGame.player.x = Math.min(canvas.width - dodgeGame.player.width,
            dodgeGame.player.x + dodgeGame.player.speed);
    }

    // Draw player
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(dodgeGame.player.x, dodgeGame.player.y,
        dodgeGame.player.width, dodgeGame.player.height);

    // Spawn obstacles
    if (Math.random() < 0.02) {
        dodgeGame.obstacles.push({
            x: Math.random() * (canvas.width - 30),
            y: -30,
            width: 30,
            height: 30,
            speed: 2 + Math.random() * 3
        });
    }

    // Update and draw obstacles
    dodgeGame.obstacles.forEach((obs, index) => {
        obs.y += obs.speed;

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Check collision
        if (obs.x < dodgeGame.player.x + dodgeGame.player.width &&
            obs.x + obs.width > dodgeGame.player.x &&
            obs.y < dodgeGame.player.y + dodgeGame.player.height &&
            obs.y + obs.height > dodgeGame.player.y) {
            gameOver();
        }

        // Remove off-screen obstacles
        if (obs.y > canvas.height) {
            dodgeGame.obstacles.splice(index, 1);
            dodgeGame.score++;
            document.getElementById('dodge-score').textContent = dodgeGame.score;
        }
    });
}

function gameOver() {
    stopDodgeGame();

    if (dodgeGame.score > dodgeGame.highScore) {
        dodgeGame.highScore = dodgeGame.score;
        localStorage.setItem('dodgeHighScore', dodgeGame.highScore);
        document.getElementById('dodge-high-score').textContent = dodgeGame.highScore;
    }

    const reward = dodgeGame.score * 10;
    score += reward;
    totalCoinsEarned += reward;
    updateScore();

    showNotification(`Game Over! Score: ${dodgeGame.score} | +${reward} coins!`, 'info', 3000);
}

// Memory Game
let memoryGame = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    canFlip: true,
    symbols: ['🐦', '🦅', '🦜', '🐥', '🦉', '🦆', '🐧', '🦩']
};

document.getElementById('play-memory-game').addEventListener('click', () => {
    document.getElementById('extras-menu').classList.add('hidden');
    document.getElementById('extras-menu').style.display = 'none';
    document.getElementById('memory-game-modal').classList.remove('hidden');
    document.getElementById('memory-game-modal').style.display = 'flex';
    initMemoryGame();
});

document.getElementById('close-memory-game').addEventListener('click', () => {
    document.getElementById('memory-game-modal').classList.add('hidden');
    document.getElementById('memory-game-modal').style.display = 'none';
});

document.getElementById('start-memory-game').addEventListener('click', () => {
    initMemoryGame();
});

function initMemoryGame() {
    memoryGame.cards = [];
    memoryGame.flippedCards = [];
    memoryGame.matchedPairs = 0;
    memoryGame.moves = 0;
    memoryGame.canFlip = true;

    document.getElementById('memory-moves').textContent = '0';
    document.getElementById('memory-matches').textContent = '0/8';

    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';

    // Create pairs
    const symbols = [...memoryGame.symbols, ...memoryGame.symbols];
    symbols.sort(() => Math.random() - 0.5);

    symbols.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'glass p-6 rounded-xl cursor-pointer flex items-center justify-center text-4xl transform transition-all hover:scale-105';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.textContent = '❓';
        card.addEventListener('click', () => flipMemoryCard(card));
        grid.appendChild(card);
        memoryGame.cards.push(card);
    });
}

function flipMemoryCard(card) {
    if (!memoryGame.canFlip || card.classList.contains('matched') ||
        memoryGame.flippedCards.includes(card)) return;

    card.textContent = card.dataset.symbol;
    card.classList.add('bg-blue-500/50');
    memoryGame.flippedCards.push(card);

    if (memoryGame.flippedCards.length === 2) {
        memoryGame.canFlip = false;
        memoryGame.moves++;
        document.getElementById('memory-moves').textContent = memoryGame.moves;

        setTimeout(checkMemoryMatch, 800);
    }
}

function checkMemoryMatch() {
    const [card1, card2] = memoryGame.flippedCards;

    if (card1.dataset.symbol === card2.dataset.symbol) {
        card1.classList.add('matched', 'bg-green-500/50');
        card2.classList.add('matched', 'bg-green-500/50');
        card1.classList.remove('bg-blue-500/50');
        card2.classList.remove('bg-blue-500/50');

        memoryGame.matchedPairs++;
        document.getElementById('memory-matches').textContent = `${memoryGame.matchedPairs}/8`;

        if (memoryGame.matchedPairs === 8) {
            const reward = Math.max(500 - (memoryGame.moves * 10), 100);
            score += reward;
            totalCoinsEarned += reward;
            updateScore();
            showNotification(`🎉 Complete in ${memoryGame.moves} moves! +${reward} coins!`, 'success', 3000);
        }
    } else {
        card1.textContent = '❓';
        card2.textContent = '❓';
        card1.classList.remove('bg-blue-500/50');
        card2.classList.remove('bg-blue-500/50');
    }

    memoryGame.flippedCards = [];
    memoryGame.canFlip = true;
}

// Modal close on outside click
window.addEventListener("click", (event) => {
    const modals = [
        'extras-menu', 'powerups-menu', 'stats-modal', 'daily-reward-modal',
        'premium-store-modal', 'prestige-modal', 'achievements-popup'
    ];

    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    });
});

// Auto-save and periodic updates
setInterval(saveGame, 10000);
setInterval(() => {
    playTime += 10000;
    if (Math.random() < 0.01) checkDailyReward();
}, 10000);

window.addEventListener('beforeunload', () => {
    playTime += Date.now() - startTime;
    saveGame();
});

// Initial setup
updateEvolution();
checkUnlocks();
updateStatistics();

// Check daily reward on load
setTimeout(checkDailyReward, 2000);

console.log('Made with love by WAQAS !');