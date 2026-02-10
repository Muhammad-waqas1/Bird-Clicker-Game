// ==================== POWER-UPS SYSTEM ====================

const POWERUP_COSTS = {
    doubleCoins: 1000,
    autoFrenzy: 2000,
    goldenBird: 5000,
    discountMode: 3000
};

// Power-ups Menu Toggle
const powerupsBtn = document.getElementById('powerups-btn');
const powerupsMenu = document.getElementById('powerups-menu');
const closePowerups = document.getElementById('close-powerups');

if (powerupsBtn) {
    powerupsBtn.addEventListener('click', () => {
        if (powerupsMenu) {
            powerupsMenu.classList.toggle('hidden');
            powerupsMenu.style.display = powerupsMenu.classList.contains('hidden') ? 'none' : 'flex';
        }
    });
}

if (closePowerups) {
    closePowerups.addEventListener('click', () => {
        if (powerupsMenu) {
            powerupsMenu.classList.add('hidden');
            powerupsMenu.style.display = 'none';
        }
    });
}

// ==================== INDIVIDUAL POWER-UPS ====================

// 2x Coins Power-up
const doubleCoinsBtn = document.getElementById('double-coins');
if (doubleCoinsBtn) {
    doubleCoinsBtn.addEventListener('click', () => {
        if (score < POWERUP_COSTS.doubleCoins) {
            showNotification("❌ Need " + formatNumber(POWERUP_COSTS.doubleCoins) + " coins!", 'error', 1500);
            playSound(audioFiles.error);
            return;
        }
        
        if (activePowerUps.doubleCoins) {
            showNotification("⏳ Already active!", 'error', 1500);
            return;
        }
        
        score -= POWERUP_COSTS.doubleCoins;
        activePowerUps.doubleCoins = true;
        powerupsUsed++;
        updateScore();
        
        coinsPerClick *= 2;
        coinsPerSecond *= 2;
        updateCoinsPerSecond();
        
        showNotification("💰 2x Coins for 20 seconds!", 'success', 2000);
        doubleCoinsBtn.disabled = true;
        doubleCoinsBtn.classList.add('opacity-50', 'cursor-not-allowed');
        
        setTimeout(() => {
            coinsPerClick /= 2;
            coinsPerSecond /= 2;
            updateCoinsPerSecond();
            activePowerUps.doubleCoins = false;
            doubleCoinsBtn.disabled = false;
            doubleCoinsBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            showNotification("💰 2x Coins ended", 'info', 1500);
        }, 20000);
    });
}

// Auto Click Frenzy
const autoFrenzyBtn = document.getElementById('auto-frenzy');
if (autoFrenzyBtn) {
    autoFrenzyBtn.addEventListener('click', () => {
        if (score < POWERUP_COSTS.autoFrenzy) {
            showNotification("❌ Need " + formatNumber(POWERUP_COSTS.autoFrenzy) + " coins!", 'error', 1500);
            playSound(audioFiles.error);
            return;
        }
        
        if (activePowerUps.autoFrenzy) {
            showNotification("⏳ Already active!", 'error', 1500);
            return;
        }
        
        score -= POWERUP_COSTS.autoFrenzy;
        activePowerUps.autoFrenzy = true;
        powerupsUsed++;
        updateScore();
        
        showNotification("🔥 Auto Frenzy for 10 seconds!", 'success', 2000);
        autoFrenzyBtn.disabled = true;
        autoFrenzyBtn.classList.add('opacity-50', 'cursor-not-allowed');
        
        const frenzyInterval = setInterval(() => {
            score += coinsPerClick * comboMultiplier;
            totalCoinsEarned += coinsPerClick * comboMultiplier;
            updateScore();
        }, 200);
        
        setTimeout(() => {
            clearInterval(frenzyInterval);
            activePowerUps.autoFrenzy = false;
            autoFrenzyBtn.disabled = false;
            autoFrenzyBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            showNotification("🔥 Auto Frenzy ended", 'info', 1500);
        }, 10000);
    });
}

// Golden Bird Mode
const goldenBirdBtn = document.getElementById('golden-bird');
if (goldenBirdBtn) {
    goldenBirdBtn.addEventListener('click', () => {
        if (score < POWERUP_COSTS.goldenBird) {
            showNotification("❌ Need " + formatNumber(POWERUP_COSTS.goldenBird) + " coins!", 'error', 1500);
            playSound(audioFiles.error);
            return;
        }
        
        if (activePowerUps.goldenBird) {
            showNotification("⏳ Already active!", 'error', 1500);
            return;
        }
        
        score -= POWERUP_COSTS.goldenBird;
        activePowerUps.goldenBird = true;
        powerupsUsed++;
        updateScore();
        
        playSound(audioFiles.hawk);
        showNotification("✨ Golden Bird Mode for 30 seconds!", 'success', 2000);
        goldenBirdBtn.disabled = true;
        goldenBirdBtn.classList.add('opacity-50', 'cursor-not-allowed');
        
        document.body.classList.add('golden-mode');
        spawnRewardBirds();
        
        setTimeout(() => {
            document.body.classList.remove('golden-mode');
            activePowerUps.goldenBird = false;
            goldenBirdBtn.disabled = false;
            goldenBirdBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            showNotification("✨ Golden Bird Mode ended", 'info', 1500);
        }, 30000);
    });
}

// Discount Mode
const discountBtn = document.getElementById('discount-mode');
if (discountBtn) {
    discountBtn.addEventListener('click', () => {
        if (score < POWERUP_COSTS.discountMode) {
            showNotification("❌ Need " + formatNumber(POWERUP_COSTS.discountMode) + " coins!", 'error', 1500);
            playSound(audioFiles.error);
            return;
        }
        
        if (activePowerUps.discountMode) {
            showNotification("⏳ Already active!", 'error', 1500);
            return;
        }
        
        score -= POWERUP_COSTS.discountMode;
        activePowerUps.discountMode = true;
        powerupsUsed++;
        updateScore();
        
        showNotification("💸 50% Discount for 15 seconds!", 'success', 2000);
        discountBtn.disabled = true;
        discountBtn.classList.add('opacity-50', 'cursor-not-allowed');
        
        // Save original costs
        const originalCosts = {
            upgrade1: upgrade1Cost,
            upgrade2: upgrade2Cost,
            upgrade3: upgrade3Cost,
            upgrade4: upgrade4Cost
        };
        
        // Apply discount
        upgrade1Cost = Math.floor(upgrade1Cost / 2);
        upgrade2Cost = Math.floor(upgrade2Cost / 2);
        upgrade3Cost = Math.floor(upgrade3Cost / 2);
        upgrade4Cost = Math.floor(upgrade4Cost / 2);
        
        // Update display
        updateUpgradeDisplay(1, autoClickUpgrades, upgrade1Cost);
        updateUpgradeDisplay(2, clickPowerUpgrades, upgrade2Cost);
        updateUpgradeDisplay(3, mrClickerUpgrades, upgrade3Cost);
        updateUpgradeDisplay(4, birdsNestUpgrades, upgrade4Cost);
        updateAffordability();
        
        setTimeout(() => {
            // Restore original costs
            upgrade1Cost = originalCosts.upgrade1;
            upgrade2Cost = originalCosts.upgrade2;
            upgrade3Cost = originalCosts.upgrade3;
            upgrade4Cost = originalCosts.upgrade4;
            
            // Update display
            updateUpgradeDisplay(1, autoClickUpgrades, upgrade1Cost);
            updateUpgradeDisplay(2, clickPowerUpgrades, upgrade2Cost);
            updateUpgradeDisplay(3, mrClickerUpgrades, upgrade3Cost);
            updateUpgradeDisplay(4, birdsNestUpgrades, upgrade4Cost);
            updateAffordability();
            
            activePowerUps.discountMode = false;
            discountBtn.disabled = false;
            discountBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            showNotification("💸 Discount ended", 'info', 1500);
        }, 15000);
    });
}