// ==================== MINI-GAMES MODULE ====================

// ==================== DODGE GAME ====================
let dodgeGame = {
    canvas: null,
    ctx: null,
    player: { x: 280, y: 350, width: 40, height: 40, speed: 6 },
    obstacles: [],
    score: 0,
    highScore: parseInt(localStorage.getItem('dodgeHighScore')) || 0,
    gameLoop: null,
    running: false,
    keys: {},
    difficulty: 1
};

const playDodgeBtn = document.getElementById('play-dodge-game');
const dodgeModal = document.getElementById('dodge-game-modal');
const closeDodgeBtn = document.getElementById('close-dodge-game');
const startDodgeBtn = document.getElementById('start-dodge-game');

if (playDodgeBtn) {
    playDodgeBtn.addEventListener('click', () => {
        if (extrasMenu) {
            extrasMenu.classList.add('hidden');
            extrasMenu.style.display = 'none';
        }
        if (dodgeModal) {
            dodgeModal.classList.remove('hidden');
            dodgeModal.style.display = 'flex';
        }

        dodgeGame.canvas = document.getElementById('dodgeCanvas');
        if (dodgeGame.canvas) {
            dodgeGame.ctx = dodgeGame.canvas.getContext('2d');
            const highScoreElement = document.getElementById('dodge-high-score');
            if (highScoreElement) {
                highScoreElement.textContent = dodgeGame.highScore;
            }
        }
    });
}

if (closeDodgeBtn) {
    closeDodgeBtn.addEventListener('click', () => {
        stopDodgeGame();
        if (dodgeModal) {
            dodgeModal.classList.add('hidden');
            dodgeModal.style.display = 'none';
        }
    });
}

if (startDodgeBtn) {
    startDodgeBtn.addEventListener('click', startDodgeGame);
}

function startDodgeGame() {
    dodgeGame.player.x = 280;
    dodgeGame.player.y = 350;
    dodgeGame.obstacles = [];
    dodgeGame.score = 0;
    dodgeGame.difficulty = 1;
    dodgeGame.running = true;

    const scoreElement = document.getElementById('dodge-score');
    if (scoreElement) scoreElement.textContent = '0';

    document.addEventListener('keydown', handleDodgeKeyDown);
    document.addEventListener('keyup', handleDodgeKeyUp);

    if (dodgeGame.canvas) {
        dodgeGame.canvas.addEventListener('touchstart', handleDodgeTouch);
        dodgeGame.canvas.addEventListener('touchmove', handleDodgeTouch);
    }

    dodgeGame.gameLoop = setInterval(updateDodgeGame, 1000 / 60);
}

function stopDodgeGame() {
    dodgeGame.running = false;
    if (dodgeGame.gameLoop) {
        clearInterval(dodgeGame.gameLoop);
    }
    document.removeEventListener('keydown', handleDodgeKeyDown);
    document.removeEventListener('keyup', handleDodgeKeyUp);
}

function handleDodgeKeyDown(e) {
    dodgeGame.keys[e.key] = true;
    e.preventDefault();
}

function handleDodgeKeyUp(e) {
    dodgeGame.keys[e.key] = false;
    e.preventDefault();
}

function handleDodgeTouch(e) {
    e.preventDefault();
    if (!dodgeGame.canvas) return;

    const rect = dodgeGame.canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const scaledX = (x / rect.width) * dodgeGame.canvas.width;

    dodgeGame.player.x = Math.max(0, Math.min(scaledX - dodgeGame.player.width / 2,
        dodgeGame.canvas.width - dodgeGame.player.width));
}

function updateDodgeGame() {
    if (!dodgeGame.running || !dodgeGame.ctx) return;

    const ctx = dodgeGame.ctx;
    const canvas = dodgeGame.canvas;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Move player
    if (dodgeGame.keys['ArrowLeft'] || dodgeGame.keys['a'] || dodgeGame.keys['A']) {
        dodgeGame.player.x = Math.max(0, dodgeGame.player.x - dodgeGame.player.speed);
    }
    if (dodgeGame.keys['ArrowRight'] || dodgeGame.keys['d'] || dodgeGame.keys['D']) {
        dodgeGame.player.x = Math.min(canvas.width - dodgeGame.player.width,
            dodgeGame.player.x + dodgeGame.player.speed);
    }

    // Draw player (bird shape)
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.arc(dodgeGame.player.x + 20, dodgeGame.player.y + 20, 20, 0, Math.PI * 2);
    ctx.fill();

    // Spawn obstacles (difficulty increases over time)
    dodgeGame.difficulty = 1 + (dodgeGame.score / 50);
    if (Math.random() < 0.02 * dodgeGame.difficulty) {
        dodgeGame.obstacles.push({
            x: Math.random() * (canvas.width - 30),
            y: -30,
            width: 30,
            height: 30,
            speed: 2 + Math.random() * 2 + (dodgeGame.score / 100)
        });
    }

    // Update and draw obstacles
    for (let i = dodgeGame.obstacles.length - 1; i >= 0; i--) {
        const obs = dodgeGame.obstacles[i];
        obs.y += obs.speed;

        // Draw obstacle
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Check collision (circle-rectangle collision)
        const playerCenterX = dodgeGame.player.x + 20;
        const playerCenterY = dodgeGame.player.y + 20;
        const playerRadius = 20;

        const closestX = Math.max(obs.x, Math.min(playerCenterX, obs.x + obs.width));
        const closestY = Math.max(obs.y, Math.min(playerCenterY, obs.y + obs.height));

        const distanceX = playerCenterX - closestX;
        const distanceY = playerCenterY - closestY;
        const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);

        if (distanceSquared < (playerRadius * playerRadius)) {
            endDodgeGame();
            return;
        }

        // Remove off-screen obstacles and increment score
        if (obs.y > canvas.height) {
            dodgeGame.obstacles.splice(i, 1);
            dodgeGame.score++;
            const scoreElement = document.getElementById('dodge-score');
            if (scoreElement) scoreElement.textContent = dodgeGame.score;
        }
    }

    // Draw score
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Poppins';
    ctx.fillText(`Score: ${dodgeGame.score}`, 10, 30);
}

function endDodgeGame() {
    stopDodgeGame();

    // Update high score
    if (dodgeGame.score > dodgeGame.highScore) {
        dodgeGame.highScore = dodgeGame.score;
        localStorage.setItem('dodgeHighScore', dodgeGame.highScore);
        const highScoreElement = document.getElementById('dodge-high-score');
        if (highScoreElement) {
            highScoreElement.textContent = dodgeGame.highScore;
        }
    }

    // Award coins
    const reward = dodgeGame.score * 10;
    score += reward;
    totalCoinsEarned += reward;
    updateScore();

    showNotification(`🎯 Game Over! Score: ${dodgeGame.score}\n+${formatNumber(reward)} coins!`, 'info', 3000);
}

// ==================== MEMORY GAME ====================
let memoryGame = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    canFlip: true,
    symbols: ['🐦', '🦅', '🦜', '🐥', '🦉', '🦆', '🐧', '🦩']
};

const playMemoryBtn = document.getElementById('play-memory-game');
const memoryModal = document.getElementById('memory-game-modal');
const closeMemoryBtn = document.getElementById('close-memory-game');
const startMemoryBtn = document.getElementById('start-memory-game');

if (playMemoryBtn) {
    playMemoryBtn.addEventListener('click', () => {
        if (extrasMenu) {
            extrasMenu.classList.add('hidden');
            extrasMenu.style.display = 'none';
        }
        if (memoryModal) {
            memoryModal.classList.remove('hidden');
            memoryModal.style.display = 'flex';
        }
        initMemoryGame();
    });
}

if (closeMemoryBtn) {
    closeMemoryBtn.addEventListener('click', () => {
        if (memoryModal) {
            memoryModal.classList.add('hidden');
            memoryModal.style.display = 'none';
        }
    });
}

if (startMemoryBtn) {
    startMemoryBtn.addEventListener('click', initMemoryGame);
}

function initMemoryGame() {
    memoryGame.cards = [];
    memoryGame.flippedCards = [];
    memoryGame.matchedPairs = 0;
    memoryGame.moves = 0;
    memoryGame.canFlip = true;

    const movesElement = document.getElementById('memory-moves');
    const matchesElement = document.getElementById('memory-matches');
    if (movesElement) movesElement.textContent = '0';
    if (matchesElement) matchesElement.textContent = '0/8';

    const grid = document.getElementById('memory-grid');
    if (!grid) return;

    grid.innerHTML = '';

    // Create card pairs
    const symbols = [...memoryGame.symbols, ...memoryGame.symbols];
    symbols.sort(() => Math.random() - 0.5);

    symbols.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'glass p-6 rounded-xl cursor-pointer flex items-center justify-center text-4xl transform transition-all hover:scale-105 aspect-square';
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
        memoryGame.flippedCards.includes(card)) {
        return;
    }

    card.textContent = card.dataset.symbol;
    card.classList.add('bg-blue-500/50');
    memoryGame.flippedCards.push(card);

    if (memoryGame.flippedCards.length === 2) {
        memoryGame.canFlip = false;
        memoryGame.moves++;
        const movesElement = document.getElementById('memory-moves');
        if (movesElement) movesElement.textContent = memoryGame.moves;

        setTimeout(checkMemoryMatch, 800);
    }
}

function checkMemoryMatch() {
    const [card1, card2] = memoryGame.flippedCards;

    if (card1.dataset.symbol === card2.dataset.symbol) {
        // Match found
        card1.classList.add('matched', 'bg-green-500/50');
        card2.classList.add('matched', 'bg-green-500/50');
        card1.classList.remove('bg-blue-500/50');
        card2.classList.remove('bg-blue-500/50');

        memoryGame.matchedPairs++;
        const matchesElement = document.getElementById('memory-matches');
        if (matchesElement) {
            matchesElement.textContent = `${memoryGame.matchedPairs}/8`;
        }

        // Check if game complete
        if (memoryGame.matchedPairs === 8) {
            const baseReward = 500;
            const movesPenalty = memoryGame.moves * 10;
            const reward = Math.max(baseReward - movesPenalty, 100);

            score += reward;
            totalCoinsEarned += reward;
            updateScore();

            setTimeout(() => {
                showNotification(`🧠 Complete in ${memoryGame.moves} moves!\n+${formatNumber(reward)} coins!`, 'success', 3000);
            }, 500);
        }
    } else {
        // No match
        card1.textContent = '❓';
        card2.textContent = '❓';
        card1.classList.remove('bg-blue-500/50');
        card2.classList.remove('bg-blue-500/50');
    }

    memoryGame.flippedCards = [];
    memoryGame.canFlip = true;
}