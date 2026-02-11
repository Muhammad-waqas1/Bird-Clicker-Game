// ==================== MENU & UI INTERACTIONS ====================

// Menu Toggle
function toggleMenu() {
    const menu = document.getElementById('menu-popup');
    if (menu) {
        menu.classList.toggle('-translate-x-full');
    }
}

const hamburgerBtn = document.getElementById('hamburger-menu');
if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMenu);
}



// Music Control
function toggleMusic() {
    const toggle = document.getElementById('musicToggle');
    if (toggle && toggle.checked) {
        audioFiles.bgMusic.play().catch(() => { });
    } else if (audioFiles.bgMusic) {
        audioFiles.bgMusic.pause();
    }
}

// Volume Control
function adjustVolume() {
    const slider = document.getElementById('volumeSlider');
    if (!slider) return;

    const volume = parseFloat(slider.value);
    Object.values(audioFiles).forEach(audio => {
        if (audio) audio.volume = volume;
    });
}

// Auto-play music on first user interaction
let musicStarted = false;
document.addEventListener('click', () => {
    if (!musicStarted) {
        const toggle = document.getElementById('musicToggle');
        if (toggle && toggle.checked) {
            audioFiles.bgMusic.play().catch(() => { });
        }
        musicStarted = true;
    }
}, { once: true });

// Dark Mode (already dark)
function toggleDarkMode() {
    showNotification("🌙 Dark mode is active by default!", 'info', 1500);
}

// Game Info
function showGameInfo() {
    const info = `🎮 HOW TO PLAY:
• Click the bird to earn coins
• Buy upgrades to boost earnings
• Level up by clicking
• Unlock achievements
• Play mini-games for bonus coins
• Prestige at Level 20 for permanent bonuses`;
    showNotification(info, 'info', 5000);
}

// Share on Twitter
function shareOnTwitter() {
    const text = `I reached Level ${level} with ${formatNumber(score)} coins in Bird Clicker Game! 🎮🐦 Can you beat my score?`;
    const url = 'https://muhammad-waqas1.github.io/Bird-Clicker-Game/';
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(tweetUrl, "_blank");
}

// Reset Game Confirmation
function resetGame() {
    const confirmDialog = document.getElementById('custom-confirm');
    if (confirmDialog) {
        confirmDialog.classList.remove('hidden');
        confirmDialog.style.display = 'flex';
    }
}

const confirmYes = document.getElementById('confirm-yes');
const confirmNo = document.getElementById('confirm-no');

if (confirmYes) {
    confirmYes.addEventListener('click', () => {
        localStorage.clear();
        location.reload();
    });
}

if (confirmNo) {
    confirmNo.addEventListener('click', () => {
        const confirmDialog = document.getElementById('custom-confirm');
        if (confirmDialog) {
            confirmDialog.classList.add('hidden');
            confirmDialog.style.display = 'none';
        }
    });
}

// ==================== STATISTICS MODAL ====================
const statsBtn = document.getElementById('stats-btn');
const statsModal = document.getElementById('stats-modal');
const closeStats = document.getElementById('close-stats');

if (statsBtn) {
    statsBtn.addEventListener('click', () => {
        updateStatisticsDisplay();
        if (statsModal) {
            statsModal.classList.remove('hidden');
            statsModal.style.display = 'flex';
        }
        toggleMenu();
    });
}

if (closeStats) {
    closeStats.addEventListener('click', () => {
        if (statsModal) {
            statsModal.classList.add('hidden');
            statsModal.style.display = 'none';
        }
    });
}

function updateStatisticsDisplay() {
    const elements = {
        'total-coins-stat': totalCoinsEarned,
        'total-clicks-stat': totalClicks,
        'highest-level-stat': highestLevel,
        'upgrades-purchased-stat': upgradesPurchased,
        'powerups-used-stat': powerupsUsed,
        'playtime-stat': Math.floor((Date.now() - startTime + playTime) / 60000) + 'm'
    };

    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = typeof value === 'number' && id !== 'playtime-stat'
                ? formatNumber(value)
                : value;
        }
    });
}

// ==================== EXTRAS MENU ====================
const extrasBtn = document.getElementById('extras-btn');
const extrasMenu = document.getElementById('extras-menu');
const closeExtras = document.getElementById('close-extras');

if (extrasBtn) {
    extrasBtn.addEventListener('click', () => {
        if (extrasMenu) {
            extrasMenu.classList.remove('hidden');
            extrasMenu.style.display = 'flex';
        }
        toggleMenu();
    });
}

if (closeExtras) {
    closeExtras.addEventListener('click', () => {
        if (extrasMenu) {
            extrasMenu.classList.add('hidden');
            extrasMenu.style.display = 'none';
        }
    });
}

// Background Theme Buttons
document.querySelectorAll('.background-btn').forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.getAttribute('data-bg');
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('selectedTheme', theme);
        showNotification(`🌄 Theme changed!`, 'success', 1000);
    });
});

// Load saved theme
const savedTheme = localStorage.getItem('selectedTheme');
if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
}

// ==================== EVOLUTION DISPLAY ====================
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

    const progressBar = document.getElementById('evolution-progress');
    const stageElement = document.getElementById('evolution-stage');

    if (progressBar) {
        progressBar.style.width = currentStage.progress + "%";
    }
    if (stageElement) {
        stageElement.textContent = currentStage.name;
    }
}

// Update evolution every second
setInterval(updateEvolution, 1000);

// ==================== MODAL CLOSE ON OUTSIDE CLICK ====================
window.addEventListener('click', (event) => {
    const modals = [
        'extras-menu', 'powerups-menu', 'stats-modal',
        'daily-reward-modal', 'premium-store-modal',
        'prestige-modal', 'achievements-popup'
    ];

    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && event.target === modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    });
});