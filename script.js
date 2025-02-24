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

// Adding Sounds
const clickSound = new Audio('assets/click.mp3');
const buySound = new Audio('assets/buy.mp3');
const ErrorSound = new Audio('assets/ErrorSound.mp3');
const modernClick = new Audio('assets/modernClick.mp3');
const backgroundMusic = new Audio('assets/Backgroundmusic.mp3');
backgroundMusic.loop = true;   // Loop the music
backgroundMusic.volume = 0.4;  // Set volume (0.0 - 1.0)



// ################ Loading and Saving Game ###################


function saveGame() {
    localStorage.setItem('birdClickerSave', JSON.stringify({
        score,
        coinsPerClick,
        coinsPerSecond,
        autoClickUpgrades,
        clickPowerUpgrades,
        mrClickerUpgrades,
        birdsNestUpgrades,
        upgrade1Cost,  // ✅ Saving upgrade costs
        upgrade2Cost,
        upgrade3Cost,
        upgrade4Cost
    }));
}


function loadGame() {
    let savedData = JSON.parse(localStorage.getItem('birdClickerSave'));
    if (savedData) {
        ({ score, coinsPerClick, coinsPerSecond, autoClickUpgrades, upgrade1Cost, upgrade2Cost, upgrade3Cost, upgrade4Cost, clickPowerUpgrades, mrClickerUpgrades, birdsNestUpgrades } = savedData);

        // Update UI elements with the loaded values
        scoreElement.innerText = score;
        document.querySelector('#UpgradeButton1 .click-count-num').innerText = autoClickUpgrades;
        document.querySelector('#UpgradeButton1 .cost-amount').innerText = upgrade1Cost;

        document.querySelector('#UpgradeButton2 .click-count-num').innerText = clickPowerUpgrades;
        document.querySelector('#UpgradeButton2 .cost-amount').innerText = upgrade2Cost;

        document.querySelector('#UpgradeButton3 .click-count-num').innerText = mrClickerUpgrades;
        document.querySelector('#UpgradeButton3 .cost-amount').innerText = upgrade3Cost;

        document.querySelector('#UpgradeButton4 .click-count-num').innerText = birdsNestUpgrades;
        document.querySelector('#UpgradeButton4 .cost-amount').innerText = upgrade4Cost;

        updateScore();
        updateCoinsPerSecond();  // ✅ Restart Auto Click function after loading
    }
}



// console.log(score, coinsPerClick, coinsPerSecond, autoClickUpgrades, upgrade1Cost, upgrade2Cost, upgrade3Cost, upgrade4Cost, clickPowerUpgrades, mrClickerUpgrades, birdsNestUpgrades);


loadGame();


// Play the music when the game starts
window.addEventListener('load', () => {
    backgroundMusic.play().catch(error => console.log("Autoplay blocked, user must interact first."));
});



function updateScore() {
    // Function to update score display
    scoreElement.innerText = score;
    // updateUpgradeButtons();
    checkUnlocks();
    checkMilestones(); // Call milestone function
}


// Function to update coins per second display
function updateCoinsPerSecond() {
    coinsPerSecondElement.innerText = `Coins per second: ${coinsPerSecond}`;

    // First, clear existing intervals to prevent multiple instances
    clearInterval(window.autoClickInterval);

    // Restart the interval if at least one auto click upgrade was purchased
    if (autoClickUpgrades > 0) {
        window.autoClickInterval = setInterval(() => {
            score += coinsPerSecond;
            updateScore();
        }, 1000);  // Runs every second
    }
}


function showAlert(message, duration = 700) {
    const alert = document.createElement('div');
    alert.className = 'game-alert';
    alert.textContent = message;
    document.body.appendChild(alert);
    ErrorSound.play();
    setTimeout(() => {
        alert.style.animation = 'fadeIn 0.3s ease-in-out reverse';
        setTimeout(() => alert.remove(), 500);
    }, duration);
}

function message(m1, duration = 1000) {
    const alert = document.createElement('div');
    alert.className = 'game-message';
    alert.textContent = m1;
    document.body.appendChild(alert);
    modernClick.play();
    setTimeout(() => {
        alert.style.animation = 'fadeIn 0.3s ease-in-out reverse';
        setTimeout(() => alert.remove(), 4000);
    }, duration);
}

// Function to handle purchase of upgrades
function handleUpgradePurchase(upgradeType) {

    switch (upgradeType) {
        case 'upgrade1': // Auto Click upgrade
            if (score >= upgrade1Cost) {
                score -= upgrade1Cost;
                buySound.play();
                autoClickUpgrades++;
                coinsPerSecond += 1;
                document.querySelector('#UpgradeButton1 .click-count-num').innerText = autoClickUpgrades;
                upgrade1Cost = Math.round(upgrade1Cost * 1.5);
                document.querySelector('#UpgradeButton1 .cost-amount').innerText = upgrade1Cost;
                updateCoinsPerSecond();  // ✅ Ensure auto click restarts
                saveGame(); // ✅ Save after purchase
            } else {
                showAlert('Not enough coins!');
            }
            break;

        case 'upgrade2': // Click Power upgrade    
            if (score >= upgrade2Cost) {
                score -= upgrade2Cost;
                buySound.play();  // Play sound when buying an upgrade
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
                buySound.play();  // Play sound when buying an upgrade
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
                buySound.play();  // Play sound when buying an upgrade
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


function checkUnlocks() {
    if (score >= upgrade1Cost) {
        upgradeButton1.style.background = 'rgb(27 255 0 / 40%)'; // Green when affordable
    } else {
        upgradeButton1.style.background = ''; // Reset when not affordable
    }

    if (score >= upgrade2Cost) {
        upgradeButton2.style.background = 'rgb(27 255 0 / 40%)'; // Green when affordable
    } else {
        upgradeButton2.style.background = ''; // Reset when not affordable
    }

    if (score >= upgrade3Cost) {
        upgradeButton3.style.background = 'rgb(27 255 0 / 40%)'; // Green when affordable
    } else {
        upgradeButton3.style.background = ''; // Reset when not affordable
    }

    if (score >= upgrade4Cost) {
        upgradeButton4.style.background = 'rgb(27 255 0 / 40%)'; // Green when affordable
    } else {
        upgradeButton4.style.background = ''; // Reset when not affordable
    }
}


function checkMilestones() {
    if (score >= 1000 && !localStorage.getItem("milestone1k")) {
        showAlert("🎉 Milestone: 1,000 Coins! 🎉");
        localStorage.setItem("milestone1k", true);
    }
    if (score >= 10000 && !localStorage.getItem("milestone10k")) {
        showAlert("🔥 Milestone: 10,000 Coins! 🔥");
        localStorage.setItem("milestone10k", true);
    }
}



// Function to handle the "click" effect on the bird image

clickImage.addEventListener('click', () => {
    // Apply the clicked effect to the bird image (grow and fade)
    clickImage.classList.add('clicked');
    clickSound.play();  // Play sound when clicking the bird
    // Add coins to the score as usual
    score += coinsPerClick;
    updateScore();

    // Coin animation (already existing in your code)
    const coin = document.createElement('img');
    coin.src = 'assets/pngtree-glossy-golden-coin-icon-png-image_2898883-removebg-preview.png'; // Coin image source
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



function spawnGoldenBird() {
    const goldenBird = document.createElement('img');
    goldenBird.src = 'assets/golden-bird.png';
    goldenBird.style.position = 'absolute';
    goldenBird.style.width = '150px';
    goldenBird.style.left = `${Math.random() * 80}vw`;
    goldenBird.style.top = `${Math.random() * 80}vh`;
    goldenBird.style.cursor = 'pointer';
    
    goldenBird.style.transition = 'opacity 0.5s ease-in-out';
    document.body.appendChild(goldenBird);

    goldenBird.addEventListener('click', () => {
        score += 500; // Give bonus coins
        updateScore();
        goldenBird.style.opacity = 0;
        setTimeout(() => goldenBird.remove(), 500);
    });

    // Remove if not clicked in 5 seconds
    setTimeout(() => {
        goldenBird.style.opacity = 0;
        setTimeout(() => goldenBird.remove(), 500);
    }, 4000);
}

// Make it appear every 60-120 seconds
setInterval(spawnGoldenBird, Math.random() * 60000 + 60000);







// Function to Toggle Hamburger Menu
function toggleMenu() {
    const menu = document.getElementById("menu-popup");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Function to Close Menu When Clicking Outside
document.addEventListener("click", function (event) {
    const menu = document.getElementById("menu-popup");
    const hamburger = document.getElementById("hamburger-menu");

    if (!menu.contains(event.target) && !hamburger.contains(event.target)) {
        menu.style.display = "none";
    }
});




// Function to Show Custom Confirm Dialog
function showConfirmDialog(callback) {
    const confirmOverlay = document.getElementById("custom-confirm");
    confirmOverlay.style.display = "flex";

    // Handle Yes Button Click
    document.getElementById("confirm-yes").onclick = function () {
        confirmOverlay.style.display = "none";
        callback(true);
    };

    // Handle No Button Click
    document.getElementById("confirm-no").onclick = function () {
        confirmOverlay.style.display = "none";
        callback(false);
    };
}

// Function to Reset the Game
function resetGame() {
    showConfirmDialog((confirmed) => {
        if (confirmed) {
            // ✅ Reset all game variables
            score = 0;
            coinsPerSecond = 0;
            coinsPerClick = 1;
            autoClickUpgrades = 0;
            clickPowerUpgrades = 0;
            mrClickerUpgrades = 0;
            birdsNestUpgrades = 0;

            upgrade1Cost = 50;
            upgrade2Cost = 125;
            upgrade3Cost = 500;
            upgrade4Cost = 1100;

            // ✅ Clear localStorage
            localStorage.removeItem('birdClickerSave');

            // ✅ Save reset state before reloading
            saveGame();

            // ✅ Reload the game
            location.reload();
        }
    });
}



// Function to Toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    // showAlert("Dark mode is now " + (document.body.classList.contains("dark-mode") ? "ON" : "OFF"));
    showAlert("Not avaliable right now!");
}

// Function to Show Game Info
function showGameInfo() {
    message("🐦 Welcome to Bird Clicker!\nClick the bird, buy upgrades, and become rich!\n\n🔄 Reset progress anytime from this menu.");
}






window.addEventListener('beforeunload', saveGame);
