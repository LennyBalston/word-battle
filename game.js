document.addEventListener("DOMContentLoaded", () => {
  // Game elements
  const player1Health = document.getElementById("player1-health");
  const player2Health = document.getElementById("player2-health");
  const player1HealthText = document.getElementById("player1-health-text");
  const player2HealthText = document.getElementById("player2-health-text");
  const player1AvatarContainer = document.getElementById(
    "player1-avatar-container"
  );
  const player2AvatarContainer = document.getElementById(
    "player2-avatar-container"
  );
  const playerTurn = document.getElementById("player-turn");
  const battleLog = document.getElementById("battle-log");
  const attackWord = document.getElementById("attack-word");
  const attackButton = document.getElementById("attack-button");
  const resetButton = document.getElementById("reset-game");
  const player1Element = document.querySelector(".player-1");
  const player2Element = document.querySelector(".player-2");

  // Game state
  let currentPlayer = 1;
  let player1HealthValue = 100;
  let player2HealthValue = 100;
  let gameOver = false;
  let usedWords = new Set();

  // Initialize the game
  initGame();

  // Event listeners
  attackButton.addEventListener("click", handleAttack);
  attackWord.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleAttack();
    }
  });
  resetButton.addEventListener("click", resetGame);

  // Initialize the game
  function initGame() {
    // Set player avatars using inline SVG
    setPlayerAvatars();

    // Update UI
    updateHealthBars();
    updatePlayerTurn();
  }

  // Set player avatars
  function setPlayerAvatars() {
    // Player 1 SVG
    const player1SVG = `
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 200 200">
        <!-- Background -->
        <rect width="200" height="200" fill="#4CAF50" rx="10" ry="10"/>
        
        <!-- Body -->
        <rect x="75" y="110" width="50" height="70" fill="#FFF" rx="5" ry="5"/>
        
        <!-- Head -->
        <circle cx="100" cy="70" r="40" fill="#FFE0B2"/>
        
        <!-- Hair -->
        <path d="M60 70 Q 70 30 100 40 Q 130 30 140 70" fill="#5D4037"/>
        <path d="M60 70 Q 70 40 100 50 Q 130 40 140 70" fill="#5D4037"/>
        
        <!-- Eyes -->
        <ellipse cx="85" cy="65" rx="5" ry="7" fill="#FFF"/>
        <ellipse cx="115" cy="65" rx="5" ry="7" fill="#FFF"/>
        <circle cx="85" cy="65" r="3" fill="#263238"/>
        <circle cx="115" cy="65" r="3" fill="#263238"/>
        
        <!-- Eyebrows -->
        <path d="M80 55 Q 85 52 90 55" stroke="#5D4037" stroke-width="2" fill="none"/>
        <path d="M110 55 Q 115 52 120 55" stroke="#5D4037" stroke-width="2" fill="none"/>
        
        <!-- Mouth -->
        <path d="M90 90 Q 100 100 110 90" stroke="#263238" stroke-width="2" fill="none"/>
        
        <!-- Nose -->
        <path d="M100 70 L 97 80 L 103 80 Z" fill="#FFD0A1"/>
        
        <!-- Arms -->
        <rect x="55" y="115" width="20" height="50" fill="#FFE0B2" rx="10" ry="10"/>
        <rect x="125" y="115" width="20" height="50" fill="#FFE0B2" rx="10" ry="10"/>
        
        <!-- Hands -->
        <circle cx="65" cy="165" r="10" fill="#FFE0B2"/>
        <circle cx="135" cy="165" r="10" fill="#FFE0B2"/>
        
        <!-- Collar -->
        <path d="M75 110 L 85 120 L 115 120 L 125 110" fill="#E0E0E0"/>
      </svg>
    `;

    // Player 2 SVG
    const player2SVG = `
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 200 200">
        <!-- Background -->
        <rect width="200" height="200" fill="#F44336" rx="10" ry="10"/>
        
        <!-- Body -->
        <rect x="75" y="110" width="50" height="70" fill="#FFF" rx="5" ry="5"/>
        
        <!-- Head -->
        <circle cx="100" cy="70" r="40" fill="#FFE0B2"/>
        
        <!-- Hair -->
        <path d="M60 50 L 60 70 L 140 70 L 140 50 Q 100 20 60 50" fill="#263238"/>
        <path d="M60 50 L 60 70 L 140 70 L 140 50 Q 100 30 60 50" fill="#263238"/>
        
        <!-- Eyes -->
        <ellipse cx="85" cy="65" rx="5" ry="7" fill="#FFF"/>
        <ellipse cx="115" cy="65" rx="5" ry="7" fill="#FFF"/>
        <circle cx="85" cy="65" r="3" fill="#263238"/>
        <circle cx="115" cy="65" r="3" fill="#263238"/>
        
        <!-- Eyebrows -->
        <path d="M80 55 Q 85 50 90 55" stroke="#263238" stroke-width="2" fill="none"/>
        <path d="M110 55 Q 115 50 120 55" stroke="#263238" stroke-width="2" fill="none"/>
        
        <!-- Mouth -->
        <path d="M90 85 Q 100 80 110 85" stroke="#263238" stroke-width="2" fill="none"/>
        <path d="M90 85 Q 100 90 110 85" stroke="#263238" stroke-width="2" fill="none"/>
        
        <!-- Nose -->
        <path d="M100 70 L 97 80 L 103 80 Z" fill="#FFD0A1"/>
        
        <!-- Arms -->
        <rect x="55" y="115" width="20" height="50" fill="#FFE0B2" rx="10" ry="10"/>
        <rect x="125" y="115" width="20" height="50" fill="#FFE0B2" rx="10" ry="10"/>
        
        <!-- Hands -->
        <circle cx="65" cy="165" r="10" fill="#FFE0B2"/>
        <circle cx="135" cy="165" r="10" fill="#FFE0B2"/>
        
        <!-- Collar -->
        <path d="M75 110 L 85 120 L 115 120 L 125 110" fill="#E0E0E0"/>
      </svg>
    `;

    // Insert SVG content into containers
    player1AvatarContainer.innerHTML = player1SVG;
    player2AvatarContainer.innerHTML = player2SVG;
  }

  // Handle attack
  function handleAttack() {
    if (gameOver) return;

    const word = attackWord.value.trim().toLowerCase();

    // Validate the word
    if (!isValidWord(word)) return;

    // Calculate damage based on word
    const damage = calculateDamage(word);

    // Apply damage to the opponent
    if (currentPlayer === 1) {
      player2HealthValue = Math.max(0, player2HealthValue - damage);
      animateAttack(player2Element, damage);
      logAttack(1, word, damage);
    } else {
      player1HealthValue = Math.max(0, player1HealthValue - damage);
      animateAttack(player1Element, damage);
      logAttack(2, word, damage);
    }

    // Add word to used words
    usedWords.add(word);

    // Update UI
    updateHealthBars();

    // Check for game over
    if (player1HealthValue <= 0 || player2HealthValue <= 0) {
      endGame();
      return;
    }

    // Switch player
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updatePlayerTurn();

    // Clear input
    attackWord.value = "";
    attackWord.focus();
  }

  // Validate word
  function isValidWord(word) {
    if (!word) {
      addToBattleLog("Please enter a word!", "error");
      return false;
    }

    if (word.length < 2) {
      addToBattleLog("Word must be at least 2 characters long!", "error");
      return false;
    }

    if (usedWords.has(word)) {
      addToBattleLog("This word has already been used!", "error");
      return false;
    }

    // Only allow letters and basic punctuation
    if (!/^[a-z]+$/i.test(word)) {
      addToBattleLog("Word must contain only letters!", "error");
      return false;
    }

    return true;
  }

  // Calculate damage based on word
  function calculateDamage(word) {
    // Base damage
    let damage = Math.floor(word.length * 1.5);

    // Bonus for using uncommon letters (j, k, q, x, z)
    const uncommonLetters = ["j", "k", "q", "x", "z"];
    for (const letter of word) {
      if (uncommonLetters.includes(letter.toLowerCase())) {
        damage += 3;
      }
    }

    // Bonus for word length
    if (word.length >= 8) {
      damage += 5;
    } else if (word.length >= 6) {
      damage += 3;
    }

    return damage;
  }

  // Log attack in battle log
  function logAttack(playerNum, word, damage) {
    const playerName = `Player ${playerNum}`;
    const message = `${playerName} attacks with "${word}" dealing ${damage} damage!`;
    addToBattleLog(message, `player${playerNum}-attack`);
  }

  // Add message to battle log
  function addToBattleLog(message, className = "") {
    const p = document.createElement("p");
    p.textContent = message;
    if (className) p.classList.add(className);
    battleLog.appendChild(p);
    battleLog.scrollTop = battleLog.scrollHeight;
  }

  // Animate attack
  function animateAttack(targetElement, damage) {
    // Shake animation
    targetElement.classList.add("attack-animation");
    setTimeout(() => {
      targetElement.classList.remove("attack-animation");
    }, 500);

    // Damage text animation
    const damageText = document.createElement("div");
    damageText.textContent = `-${damage}`;
    damageText.classList.add("damage-text");
    damageText.style.left = `${
      targetElement.offsetLeft + targetElement.offsetWidth / 2
    }px`;
    damageText.style.top = `${
      targetElement.offsetTop + targetElement.offsetHeight / 3
    }px`;
    document.body.appendChild(damageText);

    setTimeout(() => {
      document.body.removeChild(damageText);
    }, 1000);
  }

  // Update health bars
  function updateHealthBars() {
    player1Health.style.width = `${player1HealthValue}%`;
    player2Health.style.width = `${player2HealthValue}%`;
    player1HealthText.textContent = player1HealthValue;
    player2HealthText.textContent = player2HealthValue;

    // Change color based on health
    updateHealthBarColor(player1Health, player1HealthValue);
    updateHealthBarColor(player2Health, player2HealthValue);
  }

  // Update health bar color
  function updateHealthBarColor(healthBar, value) {
    if (value > 60) {
      healthBar.style.backgroundColor = "#4CAF50"; // Green
    } else if (value > 30) {
      healthBar.style.backgroundColor = "#FFC107"; // Yellow
    } else {
      healthBar.style.backgroundColor = "#F44336"; // Red
    }
  }

  // Update player turn indicator
  function updatePlayerTurn() {
    playerTurn.textContent = `Player ${currentPlayer}'s turn`;

    // Highlight active player
    if (currentPlayer === 1) {
      player1Element.classList.add("active");
      player2Element.classList.remove("active");
    } else {
      player1Element.classList.remove("active");
      player2Element.classList.add("active");
    }
  }

  // End game
  function endGame() {
    gameOver = true;
    const winner = player1HealthValue <= 0 ? 2 : 1;
    addToBattleLog(`Game Over! Player ${winner} wins!`, "game-over");
    playerTurn.textContent = `Player ${winner} wins!`;
    attackButton.disabled = true;
    attackWord.disabled = true;
  }

  // Reset game
  function resetGame() {
    player1HealthValue = 100;
    player2HealthValue = 100;
    currentPlayer = 1;
    gameOver = false;
    usedWords.clear();

    // Clear battle log
    battleLog.innerHTML =
      "<p>The battle begins! Type a word and hit attack!</p>";

    // Enable controls
    attackButton.disabled = false;
    attackWord.disabled = false;
    attackWord.value = "";

    // Update UI
    updateHealthBars();
    updatePlayerTurn();
  }
});
