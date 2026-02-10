// ==================== PREMIUM STORE ====================

const premiumStoreBtn = document.getElementById('premium-store-btn');
const premiumModal = document.getElementById('premium-store-modal');
const closePremium = document.getElementById('close-premium');

if (premiumStoreBtn) {
    premiumStoreBtn.addEventListener('click', () => {
        if (premiumModal) {
            premiumModal.classList.remove('hidden');
            premiumModal.style.display = 'flex';
            updatePremiumStoreUI();
        }
        toggleMenu();
    });
}

if (closePremium) {
    closePremium.addEventListener('click', () => {
        if (premiumModal) {
            premiumModal.classList.add('hidden');
            premiumModal.style.display = 'none';
        }
    });
}

function updatePremiumStoreUI() {
    document.querySelectorAll('.premium-buy-btn').forEach(btn => {
        const item = btn.closest('.premium-item');
        if (!item) return;
        
        const itemId = item.dataset.item;
        
        if (premiumItems[itemId]) {
            btn.textContent = 'Owned ✓';
            btn.disabled = true;
            btn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            btn.textContent = 'Purchase';
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    });
}

// Premium item purchases
document.querySelectorAll('.premium-buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const item = e.target.closest('.premium-item');
        if (!item) return;
        
        const itemId = item.dataset.item;
        const cost = parseInt(item.dataset.cost);
        
        if (premiumItems[itemId]) {
            showNotification("✓ Already owned!", 'info', 1500);
            return;
        }
        
        if (score < cost) {
            showNotification(`❌ Need ${formatNumber(cost)} coins!`, 'error', 1500);
            playSound(audioFiles.error);
            return;
        }
        
        score -= cost;
        premiumItems[itemId] = true;
        updateScore();
        saveGame();
        
        const itemNames = {
            'golden-skin': 'Golden Bird Skin',
            'rainbow-skin': 'Rainbow Bird Skin',
            'auto-boost': 'Auto Boost x2',
            'lucky-charm': 'Lucky Charm'
        };
        
        showNotification(`✨ Purchased ${itemNames[itemId]}!`, 'success', 2000);
        playSound(audioFiles.buy);
        
        // Update button
        e.target.textContent = 'Owned ✓';
        e.target.disabled = true;
        e.target.classList.add('opacity-50', 'cursor-not-allowed');
        
        // Apply effects for auto-boost
        if (itemId === 'auto-boost') {
            updateCoinsPerSecond();
        }
    });
});

// ==================== PRESTIGE SYSTEM ====================

const prestigeBtn = document.getElementById('prestige-btn');
const prestigeModal = document.getElementById('prestige-modal');
const closePrestige = document.getElementById('close-prestige');
const doPrestigeBtn = document.getElementById('do-prestige-btn');

if (prestigeBtn) {
    prestigeBtn.addEventListener('click', () => {
        if (prestigeModal) {
            const pointsElement = document.getElementById('prestige-points');
            if (pointsElement) {
                pointsElement.textContent = prestigePoints;
            }
            prestigeModal.classList.remove('hidden');
            prestigeModal.style.display = 'flex';
        }
        toggleMenu();
    });
}

if (closePrestige) {
    closePrestige.addEventListener('click', () => {
        if (prestigeModal) {
            prestigeModal.classList.add('hidden');
            prestigeModal.style.display = 'none';
        }
    });
}

if (doPrestigeBtn) {
    doPrestigeBtn.addEventListener('click', () => {
        if (level < 20) {
            showNotification("❌ Need Level 20 to prestige!", 'error', 2000);
            playSound(audioFiles.error);
            return;
        }
        
        const points = Math.floor(level / 20);
        prestigePoints += points;
        
        // Show confirmation
        const confirmed = confirm(`Prestige and reset your progress?\n\nYou will gain ${points} Prestige Point(s)\nand keep your prestige bonuses.\n\nThis cannot be undone!`);
        
        if (!confirmed) return;
        
        // Reset game state
        score = 0;
        level = 1;
        clickCount = 0;
        clicksForNextLevel = 50;
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
        upgradesPurchased = 0;
        
        // Update all UI
        updateAllUI();
        updateCoinsPerSecond();
        saveGame();
        
        showNotification(`✨ Prestiged! Gained ${points} point(s)!`, 'success', 3000);
        
        if (prestigeModal) {
            prestigeModal.classList.add('hidden');
            prestigeModal.style.display = 'none';
        }
        
        checkAchievements();
    });
}

// Prestige upgrade buttons
document.querySelectorAll('.prestige-upgrade-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const upgrade = e.target.dataset.upgrade;
        
        if (prestigePoints < 1) {
            showNotification("❌ Need 1 Prestige Point!", 'error', 1500);
            playSound(audioFiles.error);
            return;
        }
        
        prestigePoints--;
        
        if (upgrade === 'click') {
            prestigeClickBonus++;
            showNotification("⚡ Click power increased by 10%!", 'success', 2000);
        } else if (upgrade === 'auto') {
            prestigeAutoBonus++;
            showNotification("⚡ Auto income increased by 10%!", 'success', 2000);
            updateCoinsPerSecond();
        }
        
        playSound(audioFiles.buy);
        
        const pointsElement = document.getElementById('prestige-points');
        if (pointsElement) {
            pointsElement.textContent = prestigePoints;
        }
        
        saveGame();
    });
});