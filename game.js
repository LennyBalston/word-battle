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
  const player1Name = document.getElementById("player1-name");
  const player2Name = document.getElementById("player2-name");
  const playerTurn = document.getElementById("player-turn");
  const battleLog = document.getElementById("battle-log");
  const attackWord = document.getElementById("attack-word");
  const attackButton = document.getElementById("attack-button");
  const resetButton = document.getElementById("reset-game");
  const player1Element = document.querySelector(".player-1");
  const player2Element = document.querySelector(".player-2");

  // Available avatars
  const availableAvatars = [
    { name: "Godzilla", file: "godzilla.svg" },
    { name: "King Kong", file: "kong.svg" },
    { name: "Mothra", file: "mothra.svg" },
    { name: "Ghidorah", file: "ghidorah.svg" },
    { name: "Rodan", file: "rodan.svg" },
    { name: "Mecha", file: "mecha.svg" },
  ];

  // Game state
  let currentPlayer = 1;
  let player1HealthValue = 100;
  let player2HealthValue = 100;
  let gameOver = false;
  let usedWords = new Set();
  let isCheckingWord = false;
  let player1Avatar = availableAvatars[0]; // Default to Godzilla
  let player2Avatar = availableAvatars[1]; // Default to King Kong

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
    // Create avatar selection UI
    createAvatarSelectionUI();

    // Set player avatars
    setPlayerAvatars();

    // Update UI
    updateHealthBars();
    updatePlayerTurn();
  }

  // Create avatar selection UI
  function createAvatarSelectionUI() {
    // Create player 1 avatar selector
    const player1Selector = document.createElement("div");
    player1Selector.className = "avatar-selector";
    player1Selector.innerHTML = `
      <h3>Player 1 Avatar</h3>
      <div class="avatar-preview" id="player1-avatar-preview"></div>
      <select id="player1-avatar-select">
        ${availableAvatars
          .map(
            (avatar, index) =>
              `<option value="${index}" ${index === 0 ? "selected" : ""}>${
                avatar.name
              }</option>`
          )
          .join("")}
      </select>
    `;

    // Create player 2 avatar selector
    const player2Selector = document.createElement("div");
    player2Selector.className = "avatar-selector";
    player2Selector.innerHTML = `
      <h3>Player 2 Avatar</h3>
      <div class="avatar-preview" id="player2-avatar-preview"></div>
      <select id="player2-avatar-select">
        ${availableAvatars
          .map(
            (avatar, index) =>
              `<option value="${index}" ${index === 1 ? "selected" : ""}>${
                avatar.name
              }</option>`
          )
          .join("")}
      </select>
    `;

    // Add selectors to the game container
    const gameContainer = document.querySelector(".game-container");
    const gameControls = document.querySelector(".game-controls");
    gameContainer.insertBefore(player1Selector, gameControls);
    gameContainer.insertBefore(player2Selector, gameControls);

    // Load initial avatar previews
    loadSVG(
      `assets/svg/${player1Avatar.file}`,
      document.getElementById("player1-avatar-preview")
    );
    loadSVG(
      `assets/svg/${player2Avatar.file}`,
      document.getElementById("player2-avatar-preview")
    );

    // Add event listeners for avatar selection
    document
      .getElementById("player1-avatar-select")
      .addEventListener("change", (e) => {
        player1Avatar = availableAvatars[parseInt(e.target.value)];
        setPlayerAvatars();
        // Update preview
        loadSVG(
          `assets/svg/${player1Avatar.file}`,
          document.getElementById("player1-avatar-preview")
        );
        updatePlayerNames();
        updatePlayerTurn();
      });

    document
      .getElementById("player2-avatar-select")
      .addEventListener("change", (e) => {
        player2Avatar = availableAvatars[parseInt(e.target.value)];
        setPlayerAvatars();
        // Update preview
        loadSVG(
          `assets/svg/${player2Avatar.file}`,
          document.getElementById("player2-avatar-preview")
        );
        updatePlayerNames();
        updatePlayerTurn();
      });
  }

  // Set player avatars
  function setPlayerAvatars() {
    // Load SVGs from external files
    loadSVG(`assets/svg/${player1Avatar.file}`, player1AvatarContainer);
    loadSVG(`assets/svg/${player2Avatar.file}`, player2AvatarContainer);

    // Update player names
    updatePlayerNames();

    // Update player background colors based on avatar
    updatePlayerColors();
  }

  // Update player names
  function updatePlayerNames() {
    player1Name.textContent = player1Avatar.name;
    player2Name.textContent = player2Avatar.name;
  }

  // Update player background colors based on avatar
  function updatePlayerColors() {
    // Define color map for each avatar
    const avatarColors = {
      Godzilla: "rgba(15, 87, 56, 0.7)", // Green
      "King Kong": "rgba(93, 64, 55, 0.7)", // Brown
      Mothra: "rgba(156, 39, 176, 0.7)", // Purple
      Ghidorah: "rgba(255, 193, 7, 0.7)", // Gold
      Rodan: "rgba(244, 67, 54, 0.7)", // Red
      Mecha: "rgba(96, 125, 139, 0.7)", // Blue-gray
    };

    // Set background colors
    player1Element.style.backgroundColor = avatarColors[player1Avatar.name];
    player2Element.style.backgroundColor = avatarColors[player2Avatar.name];
  }

  // Load SVG from file
  function loadSVG(filePath, container) {
    console.log(`Attempting to load SVG from: ${filePath}`);

    // Create an img element approach
    const img = document.createElement("img");
    img.src = filePath;
    img.alt = filePath.split("/").pop().replace(".svg", "");
    img.width = 120;
    img.height = 120;

    // Clear the container and add the image
    container.innerHTML = "";
    container.appendChild(img);

    // Add error handling
    img.onerror = function () {
      console.error(`Error loading SVG from ${filePath}`);

      // Show error details in the container
      container.innerHTML = `<svg width="120" height="120" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#333" rx="10" ry="10"/>
        <circle cx="100" cy="100" r="50" fill="#666"/>
        <text x="100" y="90" text-anchor="middle" fill="white" font-size="16">Error</text>
        <text x="100" y="110" text-anchor="middle" fill="white" font-size="10">${filePath}</text>
      </svg>`;

      // Add error message to battle log
      addToBattleLog(
        `Failed to load avatar: ${filePath.split("/").pop()}`,
        "error"
      );
    };

    img.onload = function () {
      console.log(`Successfully loaded SVG from: ${filePath}`);
    };
  }

  // Handle attack
  async function handleAttack() {
    if (gameOver || isCheckingWord) return;

    const word = attackWord.value.trim().toLowerCase();

    // Validate input
    if (!word) {
      addToBattleLog("Please enter a word to attack!", "error");
      return;
    }

    // Check if word has been used
    if (usedWords.has(word)) {
      addToBattleLog(
        `"${word}" has already been used! Try another word.`,
        "error"
      );
      return;
    }

    // Disable controls during API check
    attackButton.disabled = true;
    attackWord.disabled = true;
    isCheckingWord = true;

    // Check if it's a real word
    const isRealWord = await checkIfRealWord(word);

    if (!isRealWord) {
      addToBattleLog(`"${word}" is not a valid word! Try again.`, "error");
      attackButton.disabled = false;
      attackWord.disabled = false;
      isCheckingWord = false;
      return;
    }

    // Add to used words
    usedWords.add(word);

    // Calculate damage based on word length
    const damage = Math.min(word.length * 2, 20);

    // Apply damage to opponent
    if (currentPlayer === 1) {
      player2HealthValue = Math.max(0, player2HealthValue - damage);
      animateAttack(player2Element, damage);
      logAttack(1, word, damage, true);
    } else {
      player1HealthValue = Math.max(0, player1HealthValue - damage);
      animateAttack(player1Element, damage);
      logAttack(2, word, damage, true);
    }

    // Update health bars
    updateHealthBars();

    // Check for game over
    if (player1HealthValue <= 0 || player2HealthValue <= 0) {
      gameOver = true;
      const winner =
        player1HealthValue <= 0 ? player2Avatar.name : player1Avatar.name;
      addToBattleLog(`Game over! ${winner} wins!`, "game-over");
      playerTurn.textContent = `${winner} wins!`;
    } else {
      // Switch player
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      updatePlayerTurn();
    }

    // Clear attack word
    attackWord.value = "";

    // Re-enable controls
    attackButton.disabled = false;
    attackWord.disabled = false;
    isCheckingWord = false;
  }

  // Check if word is a real word using Dictionary API
  async function checkIfRealWord(word) {
    // Check cache first
    if (wordCache.has(word)) {
      return wordCache.get(word);
    }

    try {
      // Show checking message
      addToBattleLog(`Checking if "${word}" is a valid word...`, "info");

      // Call Dictionary API
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );

      const isValid = response.ok;

      // Cache the result
      wordCache.set(word, isValid);

      return isValid;
    } catch (error) {
      console.error("Error checking word:", error);
      addToBattleLog("Error checking word. Please try again.", "error");
      return false;
    }
  }

  // Log attack in battle log
  function logAttack(player, word, damage, isValid) {
    const playerName = player === 1 ? player1Avatar.name : player2Avatar.name;
    const opponentName = player === 1 ? player2Avatar.name : player1Avatar.name;

    if (!isValid) {
      addToBattleLog(
        `${playerName} tried to use "${word}" but it's not a valid word!`,
        "error"
      );
      return;
    }

    // Define avatar-specific CSS classes for styling
    const avatarClasses = {
      Godzilla: "godzilla-attack",
      "King Kong": "kong-attack",
      Mothra: "mothra-attack",
      Ghidorah: "ghidorah-attack",
      Rodan: "rodan-attack",
      Mecha: "mecha-attack",
    };

    // Use avatar-specific class if available, otherwise fall back to player1/2-attack
    const cssClass = avatarClasses[playerName] || `player${player}-attack`;

    addToBattleLog(
      `${playerName} attacks with "${word}" and deals ${damage} damage to ${opponentName}!`,
      cssClass
    );
  }

  // Add message to battle log
  function addToBattleLog(message, className = "") {
    const logEntry = document.createElement("p");
    logEntry.textContent = message;
    if (className) {
      logEntry.className = className;
    }
    battleLog.appendChild(logEntry);
    battleLog.scrollTop = battleLog.scrollHeight;
  }

  // Animate attack
  function animateAttack(targetElement, damage) {
    // Shake animation
    targetElement.classList.add("attack-animation");
    setTimeout(() => {
      targetElement.classList.remove("attack-animation");
    }, 500);

    // Show damage text
    const damageText = document.createElement("div");
    damageText.className = "damage-text";
    damageText.textContent = `-${damage}`;

    // Position the damage text
    const avatarContainer = targetElement.querySelector(".player-avatar");
    avatarContainer.appendChild(damageText);

    // Remove damage text after animation
    setTimeout(() => {
      damageText.remove();
    }, 1000);

    // Show pain expression for significant damage
    if (damage > 10) {
      const targetAvatar = targetElement.querySelector(".player-avatar");

      // Show pain expression
      targetAvatar
        .querySelectorAll(".eyes-normal, .eyebrows-normal, .mouth-normal")
        .forEach((el) => {
          el.style.display = "none";
        });

      targetAvatar
        .querySelectorAll(".eyes-pain, .eyebrows-pain, .mouth-pain")
        .forEach((el) => {
          el.style.display = "block";
        });

      // Add sweat drops
      const sweatContainer = document.createElement("div");
      sweatContainer.className = "sweat-container";

      // Create three sweat drops
      for (let i = 0; i < 3; i++) {
        const sweatDrop = document.createElement("div");
        sweatDrop.className = "sweat-drop";
        sweatContainer.appendChild(sweatDrop);
      }

      targetAvatar.appendChild(sweatContainer);

      // Reset expressions after a delay
      setTimeout(() => {
        targetAvatar
          .querySelectorAll(".eyes-normal, .eyebrows-normal, .mouth-normal")
          .forEach((el) => {
            el.style.display = "block";
          });

        targetAvatar
          .querySelectorAll(".eyes-pain, .eyebrows-pain, .mouth-pain")
          .forEach((el) => {
            el.style.display = "none";
          });

        // Remove sweat drops
        sweatContainer.remove();
      }, 2000);
    }
  }

  // Update health bars
  function updateHealthBars() {
    // Update health bar widths
    player1Health.style.width = `${player1HealthValue}%`;
    player2Health.style.width = `${player2HealthValue}%`;

    // Update health text
    player1HealthText.textContent = player1HealthValue;
    player2HealthText.textContent = player2HealthValue;

    // Change color based on health
    player1Health.style.backgroundColor = getHealthColor(player1HealthValue);
    player2Health.style.backgroundColor = getHealthColor(player2HealthValue);
  }

  // Get health color based on health value
  function getHealthColor(health) {
    if (health > 60) return "#4CAF50"; // Green
    if (health > 30) return "#FFC107"; // Yellow
    return "#F44336"; // Red
  }

  // Update player turn display
  function updatePlayerTurn() {
    if (gameOver) {
      playerTurn.textContent = "Game Over!";
      return;
    }

    const currentPlayerName =
      currentPlayer === 1 ? player1Avatar.name : player2Avatar.name;
    playerTurn.textContent = `${currentPlayerName}'s turn`;

    // Highlight active player
    player1Element.classList.toggle("active", currentPlayer === 1);
    player2Element.classList.toggle("active", currentPlayer === 2);
  }

  // Reset the game
  function resetGame() {
    currentPlayer = 1;
    player1HealthValue = 100;
    player2HealthValue = 100;
    gameOver = false;
    usedWords = new Set();

    // Update UI
    updateHealthBars();
    updatePlayerTurn();
    updatePlayerColors(); // Ensure colors are reset properly

    // Enable attack controls
    attackWord.disabled = false;
    attackButton.disabled = false;

    // Clear attack word
    attackWord.value = "";

    // Add reset message to battle log
    addToBattleLog("Game reset! The battle begins anew!", "info");

    // Reset pain expressions if any
    document
      .querySelectorAll(".eyes-pain, .eyebrows-pain, .mouth-pain")
      .forEach((el) => {
        el.style.display = "none";
      });
    document
      .querySelectorAll(".eyes-normal, .eyebrows-normal, .mouth-normal")
      .forEach((el) => {
        el.style.display = "block";
      });

    // Remove any sweat drops
    document.querySelectorAll(".sweat-container").forEach((el) => {
      el.remove();
    });
  }
});
