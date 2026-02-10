// ==================== ACHIEVEMENTS SYSTEM ====================

const achievements = [
    { id: "click100", name: "🐣 Newbie Clicker", description: "Click 100 times", condition: () => totalClicks >= 100 },
    { id: "click1000", name: "🐥 Bird Enthusiast", description: "Click 1,000 times", condition: () => totalClicks >= 1000 },
    { id: "click10000", name: "🦜 Bird Master", description: "Click 10,000 times", condition: () => totalClicks >= 10000 },
    { id: "click100000", name: "🔥 Ultimate Clicker", description: "Click 100,000 times", condition: () => totalClicks >= 100000 },
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
    const text = document.getElementById("achievement-text");
    
    if (popup && text) {
        text.textContent = `🏆 Achievement: ${name}`;
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
}

function showAchievements() {
    const popup = document.getElementById("achievements-popup");
    const list = document.getElementById("achievements-list");
    
    if (!popup || !list) return;
    
    list.innerHTML = "";
    
    achievements.forEach(achievement => {
        const li = document.createElement("li");
        const unlocked = unlockedAchievements.includes(achievement.id);
        li.className = `glass p-4 rounded-lg transition-all ${unlocked ? 'bg-amber-500/20 border-2 border-amber-400' : 'bg-white/10'}`;
        li.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <div class="font-bold text-lg text-white">${achievement.name}</div>
                    <div class="text-sm opacity-80 text-white">${achievement.description}</div>
                </div>
                <div class="text-3xl ml-4">${unlocked ? '✅' : '🔒'}</div>
            </div>
        `;
        list.appendChild(li);
    });
    
    popup.classList.remove('hidden');
    popup.style.display = 'flex';
}

function closeAchievements() {
    const popup = document.getElementById("achievements-popup");
    if (popup) {
        popup.classList.add('hidden');
        popup.style.display = 'none';
    }
}

// ==================== DAILY REWARD SYSTEM ====================

function checkDailyReward() {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (now - lastDailyReward < oneDay) {
        showNotification("🎁 Come back tomorrow for your daily reward!", 'info', 2000);
        return;
    }
    
    const reward = 1000 + (level * 100);
    const rewardAmountElement = document.getElementById('daily-reward-amount');
    const dailyModal = document.getElementById('daily-reward-modal');
    const claimBtn = document.getElementById('claim-daily-reward');
    
    if (rewardAmountElement) {
        rewardAmountElement.textContent = formatNumber(reward) + ' Coins!';
    }
    
    if (dailyModal) {
        dailyModal.classList.remove('hidden');
        dailyModal.style.display = 'flex';
    }
    
    if (claimBtn) {
        // Remove old listeners
        const newClaimBtn = claimBtn.cloneNode(true);
        claimBtn.parentNode.replaceChild(newClaimBtn, claimBtn);
        
        newClaimBtn.addEventListener('click', () => {
            score += reward;
            totalCoinsEarned += reward;
            lastDailyReward = now;
            updateScore();
            saveGame();
            
            showNotification(`🎁 Claimed ${formatNumber(reward)} coins!`, 'success', 2000);
            
            if (dailyModal) {
                dailyModal.classList.add('hidden');
                dailyModal.style.display = 'none';
            }
        });
    }
}

const dailyRewardBtn = document.getElementById('daily-reward-btn');
if (dailyRewardBtn) {
    dailyRewardBtn.addEventListener('click', () => {
        checkDailyReward();
        toggleMenu();
    });
}

// Check for daily reward on game load (after 2 seconds)
setTimeout(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (now - lastDailyReward >= oneDay) {
        checkDailyReward();
    }
}, 2000);