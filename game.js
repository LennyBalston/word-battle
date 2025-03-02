document.addEventListener("DOMContentLoaded", () => {
  // Game elements
  const player1Health = document.getElementById("player1-health");
  const player2Health = document.getElementById("player2-health");
  const player1HealthText = document.getElementById("player1-health-text");
  const player2HealthText = document.getElementById("player2-health-text");
  const player1Avatar = document.getElementById("player1-avatar");
  const player2Avatar = document.getElementById("player2-avatar");
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
    // Set default avatar images or use placeholders
    player1Avatar.src = "player1.png";
    player1Avatar.onerror = () => {
      player1Avatar.src =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%234CAF50"/><text x="50" y="60" font-size="30" text-anchor="middle" fill="white">P1</text></svg>';
    };

    player2Avatar.src = "player2.png";
    player2Avatar.onerror = () => {
      player2Avatar.src =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f44336"/><text x="50" y="60" font-size="30" text-anchor="middle" fill="white">P2</text></svg>';
    };

    // Update UI
    updateHealthBars();
    updatePlayerTurn();
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
