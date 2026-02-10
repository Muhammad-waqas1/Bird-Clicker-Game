// ==================== GAME CORE v2.5 FIXED ====================
// Core Variables
let score = 0;
let coinsPerSecond = 0;
let coinsPerClick = 1;

// Upgrade Costs
let upgrade1Cost = 50;
let upgrade2Cost = 200;
let upgrade3Cost = 600;
let upgrade4Cost = 2000;

// Upgrade Counts
let autoClickUpgrades = 0;
let clickPowerUpgrades = 0;
let mrClickerUpgrades = 0;
let birdsNestUpgrades = 0;

// Level System
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

// Prestige System
let prestigePoints = 0;
let prestigeClickBonus = 0;
let prestigeAutoBonus = 0;

// Premium Items
let premiumItems = {
    'golden-skin': false,
    'rainbow-skin': false,
    'auto-boost': false,
    'lucky-charm': false
};

// Combo System
let comboCount = 0;
let comboMultiplier = 1;
let lastClickTime = 0;
const COMBO_TIMEOUT = 2000;

// Daily Reward
let lastDailyReward = 0;

// Power-ups State
let activePowerUps = {
    doubleCoins: false,
    autoFrenzy: false,
    goldenBird: false,
    discountMode: false
};

// DOM Elements
const scoreElement = document.getElementById('score');
const coinsPerSecondElement = document.getElementById('coins-per-second');
const upgradeButton1 = document.getElementById('UpgradeButton1');
const upgradeButton2 = document.getElementById('UpgradeButton2');
const upgradeButton3 = document.getElementById('UpgradeButton3');
const upgradeButton4 = document.getElementById('UpgradeButton4');
const clickImage = document.getElementById('click-image');
const levelDisplay = document.getElementById('levelDisplay');
const progressFill = document.getElementById('progressFill');

// ==================== AUDIO SYSTEM ====================
const audioFiles = {
    click: new Audio('assets/click.mp3'),
    buy: new Audio('assets/buy.mp3'),
    error: new Audio('assets/ErrorSound.mp3'),
    modernClick: new Audio('assets/modernClick.mp3'),
    hawk: new Audio('assets/hawk_squawk.mp3'),
    levelUp: new Audio('assets/level_passed.mp3'),
    bgMusic: new Audio('assets/Backgroundmusic.mp3')
};

// Setup audio
audioFiles.bgMusic.loop = true;
audioFiles.bgMusic.volume = 0.4;

// Prevent audio errors from breaking game
Object.values(audioFiles).forEach(audio => {
    audio.addEventListener('error', () => {});
});

function playSound(audio) {
    if (audio && audio.play) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }
}

// ==================== SAVE/LOAD SYSTEM ====================
function saveGame() {
    const saveData = {
        version: '2.5',
        score,
        coinsPerClick,
        coinsPerSecond,
        autoClickUpgrades,
        clickPowerUpgrades,
        mrClickerUpgrades,
        birdsNestUpgrades,
        upgrade1Cost,
        upgrade2Cost,
        upgrade3Cost,
        upgrade4Cost,
        level,
        clicksForNextLevel,
        clickCount,
        totalCoinsEarned,
        totalClicks,
        highestLevel,
        playTime,
        upgradesPurchased,
        powerupsUsed,
        prestigePoints,
        prestigeClickBonus,
        prestigeAutoBonus,
        premiumItems,
        lastDailyReward
    };
    
    localStorage.setItem('birdClickerSave', JSON.stringify(saveData));
}

function loadGame() {
    const savedData = localStorage.getItem('birdClickerSave');
    if (!savedData) return;
    
    try {
        const data = JSON.parse(savedData);
        
        // Load all data
        score = data.score || 0;
        coinsPerClick = data.coinsPerClick || 1;
        coinsPerSecond = data.coinsPerSecond || 0;
        autoClickUpgrades = data.autoClickUpgrades || 0;
        clickPowerUpgrades = data.clickPowerUpgrades || 0;
        mrClickerUpgrades = data.mrClickerUpgrades || 0;
        birdsNestUpgrades = data.birdsNestUpgrades || 0;
        upgrade1Cost = data.upgrade1Cost || 50;
        upgrade2Cost = data.upgrade2Cost || 200;
        upgrade3Cost = data.upgrade3Cost || 600;
        upgrade4Cost = data.upgrade4Cost || 2000;
        level = data.level || 1;
        clicksForNextLevel = data.clicksForNextLevel || 50;
        clickCount = data.clickCount || 0;
        totalCoinsEarned = data.totalCoinsEarned || 0;
        totalClicks = data.totalClicks || 0;
        highestLevel = data.highestLevel || 1;
        playTime = data.playTime || 0;
        upgradesPurchased = data.upgradesPurchased || 0;
        powerupsUsed = data.powerupsUsed || 0;
        prestigePoints = data.prestigePoints || 0;
        prestigeClickBonus = data.prestigeClickBonus || 0;
        prestigeAutoBonus = data.prestigeAutoBonus || 0;
        premiumItems = data.premiumItems || premiumItems;
        lastDailyReward = data.lastDailyReward || 0;
        
        // Update UI
        updateAllUI();
        updateCoinsPerSecond();
        
    } catch (error) {
        console.error('Error loading save:', error);
    }
}

// ==================== NUMBER FORMATTING ====================
function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return Math.floor(num).toString();
}

// ==================== UI UPDATE FUNCTIONS ====================
function updateScore() {
    scoreElement.textContent = formatNumber(score);
    updateAffordability();
    updateProgressBar();
    checkLevelUp();
    checkAchievements();
    saveGame();
}

function updateAllUI() {
    // Update score display
    scoreElement.textContent = formatNumber(score);
    levelDisplay.textContent = level;
    
    // Update all upgrade displays
    updateUpgradeDisplay(1, autoClickUpgrades, upgrade1Cost);
    updateUpgradeDisplay(2, clickPowerUpgrades, upgrade2Cost);
    updateUpgradeDisplay(3, mrClickerUpgrades, upgrade3Cost);
    updateUpgradeDisplay(4, birdsNestUpgrades, upgrade4Cost);
    
    // Update progress bar
    updateProgressBar();
    
    // Update affordability
    updateAffordability();
}

function updateUpgradeDisplay(upgradeNum, count, cost) {
    const button = document.getElementById(`UpgradeButton${upgradeNum}`);
    if (!button) return;
    
    const countElement = button.querySelector('.click-count-num');
    const costElement = button.querySelector('.cost-amount');
    
    if (countElement) countElement.textContent = count;
    if (costElement) costElement.textContent = formatNumber(cost);
}

function updateAffordability() {
    // Clear all highlights first
    [upgradeButton1, upgradeButton2, upgradeButton3, upgradeButton4].forEach(btn => {
        if (btn) {
            btn.classList.remove('ring-2', 'ring-amber-400', 'ring-offset-2');
        }
    });
    
    // Add highlights only to affordable upgrades
    const upgradeCosts = [upgrade1Cost, upgrade2Cost, upgrade3Cost, upgrade4Cost];
    const upgradeButtons = [upgradeButton1, upgradeButton2, upgradeButton3, upgradeButton4];
    
    upgradeButtons.forEach((btn, index) => {
        if (btn && score >= upgradeCosts[index]) {
            btn.classList.add('ring-2', 'ring-amber-400');
        }
    });
}

function updateProgressBar() {
    const progressPercent = Math.min((clickCount / clicksForNextLevel) * 100, 100);
    if (progressFill) {
        progressFill.style.width = progressPercent + "%";
    }
}

function updateCoinsPerSecond() {
    let effectiveCoinsPerSecond = coinsPerSecond * (1 + prestigeAutoBonus * 0.1);
    if (premiumItems['auto-boost']) effectiveCoinsPerSecond *= 2;
    
    if (effectiveCoinsPerSecond > 0) {
        coinsPerSecondElement.textContent = `+${formatNumber(effectiveCoinsPerSecond)}/sec`;
        coinsPerSecondElement.classList.remove('hidden');
        coinsPerSecondElement.style.display = 'block';
    } else {
        coinsPerSecondElement.style.display = 'none';
    }

    // Clear existing interval
    if (window.autoClickInterval) {
        clearInterval(window.autoClickInterval);
    }

    // Start new interval if we have auto income
    if (autoClickUpgrades > 0) {
        window.autoClickInterval = setInterval(() => {
            score += effectiveCoinsPerSecond;
            totalCoinsEarned += effectiveCoinsPerSecond;
            updateScore();
        }, 1000);
    }
}

// ==================== UPGRADE PURCHASE SYSTEM ====================
function canAffordUpgrade(cost) {
    return score >= cost;
}

function purchaseUpgrade(upgradeNum, currentCost, upgradeEffect) {
    if (!canAffordUpgrade(currentCost)) {
        showNotification("❌ Not enough coins!", 'error', 1000);
        playSound(audioFiles.error);
        return false;
    }
    
    // Deduct cost
    score -= currentCost;
    upgradesPurchased++;
    
    // Apply effect
    upgradeEffect();
    
    // Calculate new cost
    const newCost = Math.floor(currentCost * 1.5);
    
    // Play sound
    playSound(audioFiles.buy);
    
    // Update UI
    updateScore();
    
    return newCost;
}

// Upgrade button event listeners
if (upgradeButton1) {
    upgradeButton1.addEventListener('click', () => {
        const newCost = purchaseUpgrade(1, upgrade1Cost, () => {
            autoClickUpgrades++;
            coinsPerSecond += 1;
            updateCoinsPerSecond();
        });
        if (newCost !== false) {
            upgrade1Cost = newCost;
            updateUpgradeDisplay(1, autoClickUpgrades, upgrade1Cost);
            updateAffordability();
        }
    });
}

if (upgradeButton2) {
    upgradeButton2.addEventListener('click', () => {
        const newCost = purchaseUpgrade(2, upgrade2Cost, () => {
            clickPowerUpgrades++;
            coinsPerClick += 1;
        });
        if (newCost !== false) {
            upgrade2Cost = newCost;
            updateUpgradeDisplay(2, clickPowerUpgrades, upgrade2Cost);
            updateAffordability();
        }
    });
}

if (upgradeButton3) {
    upgradeButton3.addEventListener('click', () => {
        const newCost = purchaseUpgrade(3, upgrade3Cost, () => {
            mrClickerUpgrades++;
            coinsPerClick += 5;
        });
        if (newCost !== false) {
            upgrade3Cost = newCost;
            updateUpgradeDisplay(3, mrClickerUpgrades, upgrade3Cost);
            updateAffordability();
        }
    });
}

if (upgradeButton4) {
    upgradeButton4.addEventListener('click', () => {
        const newCost = purchaseUpgrade(4, upgrade4Cost, () => {
            birdsNestUpgrades++;
            coinsPerClick += 10;
        });
        if (newCost !== false) {
            upgrade4Cost = newCost;
            updateUpgradeDisplay(4, birdsNestUpgrades, upgrade4Cost);
            updateAffordability();
        }
    });
}

// ==================== CLICK SYSTEM ====================
function updateCombo() {
    const now = Date.now();
    if (now - lastClickTime < COMBO_TIMEOUT) {
        comboCount++;
        comboMultiplier = Math.min(Math.floor(comboCount / 5) + 1, 100);
        
        const comboDisplay = document.getElementById('combo-display');
        if (comboDisplay && comboMultiplier > 1) {
            comboDisplay.classList.remove('hidden');
            const multiplierElement = document.getElementById('combo-multiplier');
            if (multiplierElement) {
                multiplierElement.textContent = comboMultiplier;
            }
        }
    } else {
        comboCount = 0;
        comboMultiplier = 1;
        const comboDisplay = document.getElementById('combo-display');
        if (comboDisplay) {
            comboDisplay.classList.add('hidden');
        }
    }
    lastClickTime = now;
}

if (clickImage) {
    clickImage.addEventListener('click', (e) => {
        // Calculate effective click power
        let effectiveClickPower = coinsPerClick * (1 + prestigeClickBonus * 0.1);
        
        // Update combo
        updateCombo();
        
        // Add coins
        const coinsEarned = effectiveClickPower * comboMultiplier;
        score += coinsEarned;
        totalCoinsEarned += coinsEarned;
        clickCount++;
        totalClicks++;
        
        // Animation
        clickImage.classList.add('click-animate');
        setTimeout(() => clickImage.classList.remove('click-animate'), 400);
        
        // Effects
        createCoinEffect(e.clientX, e.clientY);
        createParticles(e.clientX, e.clientY);
        
        // Sound
        playSound(audioFiles.click);
        
        // Update
        updateScore();
    });
}

function createCoinEffect(x, y) {
    const coin = document.createElement('img');
    coin.src = 'assets/pngtree-glossy-golden-coin-icon-png-image_2898883-removebg-preview.png';
    coin.className = 'fixed w-16 h-16 pointer-events-none z-50 coin-fly';
    coin.style.left = x + 'px';
    coin.style.top = y + 'px';
    document.body.appendChild(coin);
    setTimeout(() => coin.remove(), 800);
}

function createParticles(x, y) {
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        const angle = (Math.PI * 2 * i) / 6;
        const velocity = 30 + Math.random() * 30;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        particle.style.transform = `translate(${tx}px, ${ty}px)`;
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}

// ==================== LEVEL SYSTEM ====================
function checkLevelUp() {
    if (clickCount >= clicksForNextLevel) {
        level++;
        clickCount = 0;
        clicksForNextLevel = Math.floor(clicksForNextLevel * 1.5);
        
        if (level > highestLevel) {
            highestLevel = level;
        }

        levelDisplay.textContent = level;
        progressFill.style.width = "0%";

        playSound(audioFiles.levelUp);
        
        const reward = 200 * level;
        score += reward;
        totalCoinsEarned += reward;
        
        updateScore();
        checkAchievements();
        spawnRewardBirds();
        
        showNotification(`🎉 Level ${level}! +${formatNumber(reward)} coins!`, 'success', 2000);
    }
}

function spawnRewardBirds() {
    const birdCount = premiumItems['lucky-charm'] ? 6 : 4;
    for (let i = 0; i < birdCount; i++) {
        setTimeout(() => {
            const bird = document.createElement("img");
            bird.src = "assets/golden-bird.png";
            bird.className = "reward-bird";
            bird.style.left = `${Math.random() * 80 + 10}vw`;
            bird.style.top = `${Math.random() * 80 + 10}vh`;
            document.body.appendChild(bird);

            bird.addEventListener("click", () => {
                const reward = 100 * comboMultiplier;
                score += reward;
                totalCoinsEarned += reward;
                updateScore();
                bird.remove();
                playSound(audioFiles.modernClick);
                createParticles(bird.offsetLeft + 30, bird.offsetTop + 30);
            });

            setTimeout(() => {
                bird.style.transform = "translateX(100vw)";
                setTimeout(() => bird.remove(), 4000);
            }, 300);
        }, i * 500);
    }
}

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message, type = 'info', duration = 2000) {
    const notification = document.createElement('div');
    notification.className = `fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-2xl z-50 font-bold text-white fade-in ${
        type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
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

// ==================== INITIALIZATION ====================
function initGame() {
    loadGame();
    updateAllUI();
    updateCoinsPerSecond();
    
    // Start playtime tracker
    setInterval(() => {
        playTime += 10000;
    }, 10000);
    
    // Auto-save every 10 seconds
    setInterval(saveGame, 10000);
    
    console.log('🐦 Bird Clicker Game v2.5 - Loaded successfully!');
}

// Save on page unload
window.addEventListener('beforeunload', () => {
    playTime += Date.now() - startTime;
    saveGame();
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}