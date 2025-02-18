// Global variables to track score, upgrades, and costs
let score = 0;
let coinsPerSecond = 0;
let coinsPerClick = 1;

let upgrade1Cost = 50; // Auto Click upgrade cost
let upgrade2Cost = 125; // Click Power upgrade cost
let upgrade3Cost = 500; // Mr. Clicker upgrade cost
let upgrade4Cost = 1100; // Birds Nest upgrade cost

// Variables to track upgrade quantities
let autoClickUpgrades = 0;
let clickPowerUpgrades = 0;
let mrClickerUpgrades = 0;
let birdsNestUpgrades = 0;

// DOM Elements
const scoreElement = document.getElementById('score');
const coinsPerSecondElement = document.getElementById('coins-per-second');
const upgradeButton1 = document.getElementById('UpgradeButton1');
const upgradeButton2 = document.getElementById('UpgradeButton2');
const upgradeButton3 = document.getElementById('UpgradeButton3');
const upgradeButton4 = document.getElementById('UpgradeButton4');
const clickArea = document.getElementById('click-area');
const clickImage = document.getElementById('click-image');

// Function to update score display
function updateScore() {
    scoreElement.innerText = score;
}

// Function to handle image click and coin increment
clickImage.addEventListener('click', () => {
    score += 1;
    updateScore();

    // Coin animation
    const coin = document.createElement('img');
    coin.src = 'pngtree-glossy-golden-coin-icon-png-image_2898883-removebg-preview.png'; // Coin image source
    coin.classList.add('coin');
    document.body.appendChild(coin);

    // Set the starting position of the coin
    const clickImageRect = clickImage.getBoundingClientRect();
    coin.style.left = `${clickImageRect.left + clickImageRect.width / 2 - 15}px`;
    coin.style.top = `${clickImageRect.top + clickImageRect.height / 2 - 15}px`;

    // Coin animation for movement
    setTimeout(() => {
        coin.classList.add('coin-animation');
    }, 10); // Slight delay to apply the animation

    setTimeout(() => {
        coin.remove();
    }, 800); // Remove coin after animation is complete
});


// Function to update coins per second display
function updateCoinsPerSecond() {
    coinsPerSecondElement.innerText = `Coins per second: ${coinsPerSecond}`;
}

// Event Listener for clicking the bird
clickArea.addEventListener('click', () => {
    score += coinsPerClick; // Add coins per click to the score
    updateScore();
});

function showAlert(message, duration = 2000) {
    const alert = document.createElement('div');
    alert.className = 'game-alert';
    alert.textContent = message;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'fadeIn 0.3s ease-out reverse';
        setTimeout(() => alert.remove(), 300);
    }, duration);
}

// Function to handle purchase of upgrades
function handleUpgradePurchase(upgradeType) {
    switch(upgradeType) {
        case 'upgrade1': // Auto Click upgrade
            if (score >= upgrade1Cost) {
                score -= upgrade1Cost;
                autoClickUpgrades++;
                coinsPerSecond += 1; // Add 1 coin per second
                document.querySelector('#UpgradeButton1 .click-count-num').innerText = autoClickUpgrades;
                upgrade1Cost = Math.round(upgrade1Cost * 1.5); // Increase cost by 50% each time
                document.querySelector('#UpgradeButton1 .cost-amount').innerText = upgrade1Cost;
                updateCoinsPerSecond();
                coinsPerSecondElement.style.display = autoClickUpgrades === 0 ? 'none' : 'block';
            } else {
                showAlert('Not enough coins!');
            }
            break;

        case 'upgrade2': // Click Power upgrade
            if (score >= upgrade2Cost) {
                score -= upgrade2Cost;
                clickPowerUpgrades++;
                coinsPerClick += 1; // Add 1 coin per click
                document.querySelector('#UpgradeButton2 .click-count-num').innerText = clickPowerUpgrades;
                upgrade2Cost = Math.round(upgrade2Cost * 1.5); // Increase cost by 50% each time
                document.querySelector('#UpgradeButton2 .cost-amount').innerText = upgrade2Cost;
            } else {
                showAlert('Not enough coins!');
            }
            break;

        case 'upgrade3': // Mr. Clicker upgrade
            if (score >= upgrade3Cost) {
                score -= upgrade3Cost;
                mrClickerUpgrades++;
                coinsPerClick += 5; // Add 5 coins per click
                document.querySelector('#UpgradeButton3 .click-count-num').innerText = mrClickerUpgrades;
                upgrade3Cost = Math.round(upgrade3Cost * 1.5); // Increase cost by 50% each time
                document.querySelector('#UpgradeButton3 .cost-amount').innerText = upgrade3Cost;
            } else {
                showAlert('Not enough coins!');
            }
            break;

        case 'upgrade4': // Birds Nest upgrade
            if (score >= upgrade4Cost) {
                score -= upgrade4Cost;
                birdsNestUpgrades++;
                coinsPerClick += 6; // Add 6 coins per click
                document.querySelector('#UpgradeButton4 .click-count-num').innerText = birdsNestUpgrades;
                upgrade4Cost = Math.round(upgrade4Cost * 1.5); // Increase cost by 50% each time
                document.querySelector('#UpgradeButton4 .cost-amount').innerText = upgrade4Cost;
            } else {
                showAlert('Not enough coins!');
            }
            break;
    }
    
    updateScore();
}

// Event listeners for upgrade purchases
upgradeButton1.addEventListener('click', () => handleUpgradePurchase('upgrade1'));
upgradeButton2.addEventListener('click', () => handleUpgradePurchase('upgrade2'));
upgradeButton3.addEventListener('click', () => handleUpgradePurchase('upgrade3'));
upgradeButton4.addEventListener('click', () => handleUpgradePurchase('upgrade4'));

// Start coins per second interval
setInterval(() => {
    score += coinsPerSecond;
    updateScore();
}, 1000); // Update score every second based on coins per second


// Function to handle the "click" effect on the bird image
clickImage.addEventListener('click', () => {
    // Apply the clicked effect to the bird image (grow and fade)
    clickImage.classList.add('clicked');

    // Add coins to the score as usual
    score += coinsPerClick;
    updateScore();

    // Coin animation (already existing in your code)
    const coin = document.createElement('img');
    coin.src = 'pngtree-glossy-golden-coin-icon-png-image_2898883-removebg-preview.png'; // Coin image source
    coin.classList.add('coin');
    document.body.appendChild(coin);

    // Set the starting position of the coin
    const clickImageRect = clickImage.getBoundingClientRect();
    coin.style.left = `${clickImageRect.left + clickImageRect.width / 2 - 15}px`;
    coin.style.top = `${clickImageRect.top + clickImageRect.height / 2 - 15}px`;

    // Coin animation for movement
    setTimeout(() => {
        coin.classList.add('coin-animation');
    }, 10); // Slight delay to apply the animation

    setTimeout(() => {
        coin.remove();
    }, 800); // Remove coin after animation is complete

    // Remove the effect after a short duration
    setTimeout(() => {
        clickImage.classList.remove('clicked');
    }, 300); // Duration of the effect (300ms for quick bounce)
});

// Random movement for the bird image, test by uncommenting. Works with 1080p, but a canvas would be nice so the bird would bounce off the boundaries and that would work with all viewports.

// function moveRandomly() {
//     const bird = document.getElementById('click-image');
//     const gameArea = document.getElementById('game');
    
//     const minX = -800;
//     const maxX = gameArea.clientWidth - bird.clientWidth - 800;
//     const minY = -800;
//     const maxY = gameArea.clientHeight - bird.clientHeight - 100;
    
//     const randomX = minX + Math.random() * (maxX - minX);
//     const randomY = minY + Math.random() * (maxY - minY);
    
//     bird.style.transition = 'all 1s linear';
//     bird.style.left = `${randomX}px`;
//     bird.style.top = `${randomY}px`;
// }

// setInterval(moveRandomly, 1000);

