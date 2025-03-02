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
  let isCheckingWord = false;

  // Dictionary cache to reduce API calls
  const wordCache = new Map();

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
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 200 200" class="player-svg">
        <!-- Background -->
        <rect width="200" height="200" fill="#4CAF50" rx="10" ry="10"/>
        
        <!-- Body -->
        <rect x="75" y="110" width="50" height="70" fill="#FFF" rx="5" ry="5"/>
        
        <!-- Head -->
        <circle cx="100" cy="70" r="40" fill="#FFE0B2"/>
        
        <!-- Hair -->
        <path d="M60 70 Q 70 30 100 40 Q 130 30 140 70" fill="#5D4037"/>
        <path d="M60 70 Q 70 40 100 50 Q 130 40 140 70" fill="#5D4037"/>
        
        <!-- Eyes - Normal -->
        <g class="eyes-normal">
          <ellipse cx="85" cy="65" rx="5" ry="7" fill="#FFF"/>
          <ellipse cx="115" cy="65" rx="5" ry="7" fill="#FFF"/>
          <circle cx="85" cy="65" r="3" fill="#263238"/>
          <circle cx="115" cy="65" r="3" fill="#263238"/>
        </g>
        
        <!-- Eyes - Pain (initially hidden) -->
        <g class="eyes-pain" style="display: none;">
          <path d="M80 65 L 90 65" stroke="#263238" stroke-width="2"/>
          <path d="M110 65 L 120 65" stroke="#263238" stroke-width="2"/>
        </g>
        
        <!-- Eyebrows - Normal -->
        <g class="eyebrows-normal">
          <path d="M80 55 Q 85 52 90 55" stroke="#5D4037" stroke-width="2" fill="none"/>
          <path d="M110 55 Q 115 52 120 55" stroke="#5D4037" stroke-width="2" fill="none"/>
        </g>
        
        <!-- Eyebrows - Pain (initially hidden) -->
        <g class="eyebrows-pain" style="display: none;">
          <path d="M80 50 Q 85 55 90 50" stroke="#5D4037" stroke-width="2" fill="none"/>
          <path d="M110 50 Q 115 55 120 50" stroke="#5D4037" stroke-width="2" fill="none"/>
        </g>
        
        <!-- Mouth - Normal -->
        <g class="mouth-normal">
          <path d="M90 90 Q 100 100 110 90" stroke="#263238" stroke-width="2" fill="none"/>
        </g>
        
        <!-- Mouth - Pain (initially hidden) -->
        <g class="mouth-pain" style="display: none;">
          <path d="M90 95 Q 100 85 110 95" stroke="#263238" stroke-width="2" fill="none"/>
          <path d="M95 90 L 105 90" stroke="#263238" stroke-width="1" fill="none"/>
        </g>
        
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
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 200 200" class="player-svg">
        <!-- Background -->
        <rect width="200" height="200" fill="#F44336" rx="10" ry="10"/>
        
        <!-- Body -->
        <rect x="75" y="110" width="50" height="70" fill="#FFF" rx="5" ry="5"/>
        
        <!-- Head -->
        <circle cx="100" cy="70" r="40" fill="#FFE0B2"/>
        
        <!-- Hair -->
        <path d="M60 50 L 60 70 L 140 70 L 140 50 Q 100 20 60 50" fill="#263238"/>
        <path d="M60 50 L 60 70 L 140 70 L 140 50 Q 100 30 60 50" fill="#263238"/>
        
        <!-- Eyes - Normal -->
        <g class="eyes-normal">
          <ellipse cx="85" cy="65" rx="5" ry="7" fill="#FFF"/>
          <ellipse cx="115" cy="65" rx="5" ry="7" fill="#FFF"/>
          <circle cx="85" cy="65" r="3" fill="#263238"/>
          <circle cx="115" cy="65" r="3" fill="#263238"/>
        </g>
        
        <!-- Eyes - Pain (initially hidden) -->
        <g class="eyes-pain" style="display: none;">
          <path d="M80 65 L 90 65" stroke="#263238" stroke-width="2"/>
          <path d="M110 65 L 120 65" stroke="#263238" stroke-width="2"/>
        </g>
        
        <!-- Eyebrows - Normal -->
        <g class="eyebrows-normal">
          <path d="M80 55 Q 85 50 90 55" stroke="#263238" stroke-width="2" fill="none"/>
          <path d="M110 55 Q 115 50 120 55" stroke="#263238" stroke-width="2" fill="none"/>
        </g>
        
        <!-- Eyebrows - Pain (initially hidden) -->
        <g class="eyebrows-pain" style="display: none;">
          <path d="M80 50 Q 85 55 90 50" stroke="#263238" stroke-width="2" fill="none"/>
          <path d="M110 50 Q 115 55 120 50" stroke="#263238" stroke-width="2" fill="none"/>
        </g>
        
        <!-- Mouth - Normal -->
        <g class="mouth-normal">
          <path d="M90 85 Q 100 80 110 85" stroke="#263238" stroke-width="2" fill="none"/>
          <path d="M90 85 Q 100 90 110 85" stroke="#263238" stroke-width="2" fill="none"/>
        </g>
        
        <!-- Mouth - Pain (initially hidden) -->
        <g class="mouth-pain" style="display: none;">
          <path d="M90 95 Q 100 85 110 95" stroke="#263238" stroke-width="2" fill="none"/>
          <path d="M95 90 L 105 90" stroke="#263238" stroke-width="1" fill="none"/>
        </g>
        
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
  async function handleAttack() {
    if (gameOver || isCheckingWord) return;

    const word = attackWord.value.trim().toLowerCase();

    // Basic validation
    if (!isBasicValidWord(word)) return;

    // Set checking state to prevent multiple submissions
    isCheckingWord = true;
    attackButton.disabled = true;
    attackWord.disabled = true;

    // Show checking message
    addToBattleLog(
      `Checking if "${word}" is a valid British English word...`,
      "info"
    );

    try {
      // Check if it's a real British English word
      const isRealWord = await checkIfRealWord(word);

      if (!isRealWord) {
        addToBattleLog(
          `"${word}" is not a valid British English word! No damage dealt.`,
          "error"
        );

        // Switch player without dealing damage
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updatePlayerTurn();

        // Add to used words so it can't be tried again
        usedWords.add(word);

        // Clear input and re-enable controls
        attackWord.value = "";
        attackWord.disabled = false;
        attackButton.disabled = false;
        attackWord.focus();
        isCheckingWord = false;
        return;
      }

      // Word is valid, calculate damage
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
        isCheckingWord = false;
        return;
      }

      // Switch player
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      updatePlayerTurn();
    } catch (error) {
      console.error("Error checking word:", error);
      addToBattleLog("Error checking word. Please try again.", "error");
    } finally {
      // Clear input and re-enable controls
      attackWord.value = "";
      attackWord.disabled = false;
      attackButton.disabled = false;
      attackWord.focus();
      isCheckingWord = false;
    }
  }

  // Check if word is a real British English word using a dictionary API
  async function checkIfRealWord(word) {
    // Check cache first
    if (wordCache.has(word)) {
      return wordCache.get(word);
    }

    try {
      // Using the WordsAPI which supports British English
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "3c9c7f9f9dmsh9a0c4e2a3c0c8c1p1c9f8fjsn3d6f9c1c1c1c",
          "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
        },
      };

      const response = await fetch(
        `https://wordsapiv1.p.rapidapi.com/words/${word}`,
        options
      );

      // If we can't use the API, fall back to the free dictionary API
      if (!response.ok) {
        // Fallback to the Free Dictionary API
        const fallbackResponse = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en_GB/${word}`
        );
        const isValid = fallbackResponse.ok;
        wordCache.set(word, isValid);
        return isValid;
      }

      const data = await response.json();

      // Check if the word has British English definitions or pronunciations
      const isValid = data && (data.results || data.pronunciation);

      // Cache the result
      wordCache.set(word, isValid);
      return isValid;
    } catch (error) {
      console.error("Dictionary API error:", error);

      try {
        // Fallback to the Free Dictionary API with British English locale
        const fallbackResponse = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en_GB/${word}`
        );
        const isValid = fallbackResponse.ok;
        wordCache.set(word, isValid);
        return isValid;
      } catch (fallbackError) {
        console.error("Fallback dictionary API error:", fallbackError);
        // If both APIs fail, we'll assume the word is valid to keep the game going
        return true;
      }
    }
  }

  // Basic word validation (before dictionary check)
  function isBasicValidWord(word) {
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

    // Only allow letters
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

    // Get the avatar SVG
    const avatarSvg = targetElement.querySelector(".player-svg");

    // Get the avatar container
    const avatarContainer = targetElement.querySelector(".player-avatar");

    // Show pain expression
    showPainExpression(avatarSvg, true);

    // Add sweat drops for higher damage
    if (damage > 10) {
      addSweatDrops(avatarContainer);
    }

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

    // Reset animations after delay
    setTimeout(() => {
      targetElement.classList.remove("attack-animation");
      showPainExpression(avatarSvg, false);
      removeSweatDrops(avatarContainer);
    }, 1000);

    setTimeout(() => {
      document.body.removeChild(damageText);
    }, 1000);
  }

  // Show pain expression on avatar
  function showPainExpression(avatarSvg, showPain) {
    if (!avatarSvg) return;

    // Get facial expression elements
    const eyesNormal = avatarSvg.querySelector(".eyes-normal");
    const eyesPain = avatarSvg.querySelector(".eyes-pain");
    const eyebrowsNormal = avatarSvg.querySelector(".eyebrows-normal");
    const eyebrowsPain = avatarSvg.querySelector(".eyebrows-pain");
    const mouthNormal = avatarSvg.querySelector(".mouth-normal");
    const mouthPain = avatarSvg.querySelector(".mouth-pain");

    if (showPain) {
      // Show pain expression
      if (eyesNormal) eyesNormal.style.display = "none";
      if (eyesPain) eyesPain.style.display = "block";
      if (eyebrowsNormal) eyebrowsNormal.style.display = "none";
      if (eyebrowsPain) eyebrowsPain.style.display = "block";
      if (mouthNormal) mouthNormal.style.display = "none";
      if (mouthPain) mouthPain.style.display = "block";
    } else {
      // Show normal expression
      if (eyesNormal) eyesNormal.style.display = "block";
      if (eyesPain) eyesPain.style.display = "none";
      if (eyebrowsNormal) eyebrowsNormal.style.display = "block";
      if (eyebrowsPain) eyebrowsPain.style.display = "none";
      if (mouthNormal) mouthNormal.style.display = "block";
      if (mouthPain) mouthPain.style.display = "none";
    }
  }

  // Add sweat drops for high damage
  function addSweatDrops(targetElement) {
    // Create sweat drops
    const sweatContainer = document.createElement("div");
    sweatContainer.className = "sweat-container";

    // Add multiple sweat drops
    for (let i = 0; i < 3; i++) {
      const sweatDrop = document.createElement("div");
      sweatDrop.className = "sweat-drop";
      sweatDrop.style.left = `${30 + i * 20}px`;
      sweatDrop.style.animationDelay = `${i * 0.2}s`;
      sweatContainer.appendChild(sweatDrop);
    }

    // Remove any existing sweat drops
    removeSweatDrops(targetElement);

    // Add to the target element
    targetElement.appendChild(sweatContainer);
  }

  // Remove sweat drops
  function removeSweatDrops(targetElement) {
    const existingSweat = targetElement.querySelector(".sweat-container");
    if (existingSweat) {
      targetElement.removeChild(existingSweat);
    }
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
