# Word Fight!

A fun two-player word battle game where players take turns attacking each other with words.

## How to Play

1. Open `index.html` in your web browser to start the game.
2. Players take turns entering words to attack their opponent.
3. Each word deals damage based on:
   - Word length (longer words deal more damage)
   - Use of uncommon letters (j, k, q, x, z add bonus damage)
   - Special bonuses for words 6+ and 8+ letters long
4. Each word can only be used once during the game.
5. The first player to reduce their opponent's health to zero wins!

## Game Rules

- Words must be at least 2 characters long
- Words can only contain letters (no numbers, spaces, or special characters)
- Each word can only be used once per game
- Players take turns - Player 1 goes first

## Damage Calculation

- Base damage: Word length × 1.5 (rounded down)
- Bonus for uncommon letters (j, k, q, x, z): +3 damage each
- Bonus for word length:
  - 6-7 letters: +3 damage
  - 8+ letters: +5 damage

## Files

- `index.html` - Main game HTML
- `styles.css` - Game styling
- `game.js` - Game logic
- `player1.png` & `player2.png` - Player avatars

## Development

This is a simple web-based game using vanilla HTML, CSS, and JavaScript. No build tools or dependencies are required.

To modify the game:

- Edit `game.js` to change game mechanics
- Edit `styles.css` to change the appearance
- Edit `index.html` to change the structure

## License

Feel free to use, modify, and share this game!
