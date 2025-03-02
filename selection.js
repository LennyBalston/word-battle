document.addEventListener("DOMContentLoaded", () => {
  // Available avatars
  const availableAvatars = [
    { name: "Godzilla", file: "godzilla.svg" },
    { name: "King Kong", file: "kong.svg" },
    { name: "Mothra", file: "mothra.svg" },
    { name: "Ghidorah", file: "ghidorah.svg" },
    { name: "Rodan", file: "rodan.svg" },
    { name: "Mecha", file: "mecha.svg" },
  ];

  // Player selections
  let player1Selection = 0; // Default to Godzilla
  let player2Selection = 1; // Default to King Kong

  // DOM elements
  const player1Preview = document.getElementById("player1-avatar-preview");
  const player2Preview = document.getElementById("player2-avatar-preview");
  const player1Name = document.getElementById("player1-avatar-name");
  const player2Name = document.getElementById("player2-avatar-name");
  const player1Options = document.getElementById("player1-options");
  const player2Options = document.getElementById("player2-options");
  const player1Prev = document.getElementById("player1-prev");
  const player1Next = document.getElementById("player1-next");
  const player2Prev = document.getElementById("player2-prev");
  const player2Next = document.getElementById("player2-next");
  const startBattleBtn = document.getElementById("start-battle");

  // Initialize the selection screen
  initSelectionScreen();

  // Initialize the selection screen
  function initSelectionScreen() {
    // Create avatar options
    createAvatarOptions();

    // Load initial previews
    updateAvatarPreview(1, player1Selection);
    updateAvatarPreview(2, player2Selection);

    // Add event listeners
    player1Prev.addEventListener("click", () => cycleAvatar(1, -1));
    player1Next.addEventListener("click", () => cycleAvatar(1, 1));
    player2Prev.addEventListener("click", () => cycleAvatar(2, -1));
    player2Next.addEventListener("click", () => cycleAvatar(2, 1));
    startBattleBtn.addEventListener("click", startBattle);

    // Add keyboard navigation
    document.addEventListener("keydown", handleKeyNavigation);
  }

  // Create avatar options
  function createAvatarOptions() {
    // Clear existing options
    player1Options.innerHTML = "";
    player2Options.innerHTML = "";

    // Create option elements for each avatar
    availableAvatars.forEach((avatar, index) => {
      // Player 1 option
      const p1Option = document.createElement("div");
      p1Option.className = "avatar-option";
      p1Option.dataset.index = index;
      if (index === player1Selection) {
        p1Option.classList.add("selected");
      }
      p1Option.addEventListener("click", () => selectAvatar(1, index));

      // Load SVG for player 1 option
      loadSVG(`assets/svg/${avatar.file}`, p1Option, true);
      player1Options.appendChild(p1Option);

      // Player 2 option
      const p2Option = document.createElement("div");
      p2Option.className = "avatar-option";
      p2Option.dataset.index = index;
      if (index === player2Selection) {
        p2Option.classList.add("selected");
      }
      p2Option.addEventListener("click", () => selectAvatar(2, index));

      // Load SVG for player 2 option
      loadSVG(`assets/svg/${avatar.file}`, p2Option, true);
      player2Options.appendChild(p2Option);
    });
  }

  // Load SVG from file
  function loadSVG(filePath, container, isSmall = false) {
    console.log(`Loading SVG from: ${filePath}`);

    // Create an img element
    const img = document.createElement("img");
    img.src = filePath;
    img.alt = filePath.split("/").pop().replace(".svg", "");

    // Set size based on whether it's a small preview or not
    if (isSmall) {
      img.width = 60;
      img.height = 60;
    } else {
      img.width = 120;
      img.height = 120;
    }

    // Clear the container and add the image
    container.innerHTML = "";
    container.appendChild(img);

    // Add error handling
    img.onerror = function () {
      console.error(`Error loading SVG from ${filePath}`);
      container.innerHTML = `<div class="error-avatar">!</div>`;
    };
  }

  // Update avatar preview
  function updateAvatarPreview(playerNum, selectionIndex) {
    const preview = playerNum === 1 ? player1Preview : player2Preview;
    const nameElement = playerNum === 1 ? player1Name : player2Name;
    const avatar = availableAvatars[selectionIndex];

    // Update preview image
    loadSVG(`assets/svg/${avatar.file}`, preview);

    // Update name
    nameElement.textContent = avatar.name;

    // Update selected option in carousel
    const options = playerNum === 1 ? player1Options : player2Options;

    // Remove selected class from all options
    Array.from(options.children).forEach((option) => {
      option.classList.remove("selected");
    });

    // Add selected class to current option
    if (options.children[selectionIndex]) {
      options.children[selectionIndex].classList.add("selected");
    }

    // Update player selection
    if (playerNum === 1) {
      player1Selection = selectionIndex;
    } else {
      player2Selection = selectionIndex;
    }

    // Apply background color based on avatar
    const selectionElement = document.querySelector(
      `.player-${playerNum}-selection`
    );
    if (selectionElement) {
      // Define color map for each avatar
      const avatarColors = {
        Godzilla: "rgba(15, 87, 56, 0.7)", // Green
        "King Kong": "rgba(93, 64, 55, 0.7)", // Brown
        Mothra: "rgba(156, 39, 176, 0.7)", // Purple
        Ghidorah: "rgba(255, 193, 7, 0.7)", // Gold
        Rodan: "rgba(244, 67, 54, 0.7)", // Red
        Mecha: "rgba(96, 125, 139, 0.7)", // Blue-gray
      };

      selectionElement.style.backgroundColor = avatarColors[avatar.name];
    }
  }

  // Cycle through avatars
  function cycleAvatar(playerNum, direction) {
    const currentSelection =
      playerNum === 1 ? player1Selection : player2Selection;
    let newSelection = (currentSelection + direction) % availableAvatars.length;

    // Handle negative index
    if (newSelection < 0) {
      newSelection = availableAvatars.length - 1;
    }

    // Update selection
    selectAvatar(playerNum, newSelection);
  }

  // Select avatar
  function selectAvatar(playerNum, index) {
    if (playerNum === 1) {
      player1Selection = index;
    } else {
      player2Selection = index;
    }

    // Update preview
    updateAvatarPreview(playerNum, index);
  }

  // Handle keyboard navigation
  function handleKeyNavigation(e) {
    switch (e.key) {
      case "ArrowLeft":
        if (e.target === player1Prev || e.target === player1Next) {
          cycleAvatar(1, -1);
        } else if (e.target === player2Prev || e.target === player2Next) {
          cycleAvatar(2, -1);
        }
        break;
      case "ArrowRight":
        if (e.target === player1Prev || e.target === player1Next) {
          cycleAvatar(1, 1);
        } else if (e.target === player2Prev || e.target === player2Next) {
          cycleAvatar(2, 1);
        }
        break;
      case "Enter":
        if (document.activeElement === startBattleBtn) {
          startBattle();
        }
        break;
    }
  }

  // Start the battle
  function startBattle() {
    // Save selections to localStorage
    localStorage.setItem("player1Avatar", player1Selection);
    localStorage.setItem("player2Avatar", player2Selection);

    // Redirect to the game page
    window.location.href = "index.html";
  }
});
