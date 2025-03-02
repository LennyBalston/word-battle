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
- Words must be real British English words (verified against a dictionary)
- If a player uses a word that's not in the dictionary, they score 0 damage and their turn ends
- Each word can only be used once per game
- Players take turns - Player 1 goes first

## Damage Calculation

- Base damage: Word length × 1.5 (rounded down)
- Bonus for uncommon letters (j, k, q, x, z): +3 damage each
- Bonus for word length:
  - 6-7 letters: +3 damage
  - 8+ letters: +5 damage
- Non-dictionary words: 0 damage

## Dictionary Validation

The game uses a combination of dictionary APIs to validate that words are real British English words:

1. **Primary API**: WordsAPI with British English support
2. **Fallback API**: Free Dictionary API with British English locale (en_GB)

If a word is not found in the dictionary:

- No damage is dealt
- The player's turn ends
- The word is still marked as used and cannot be tried again

The game also implements a word cache to improve performance and reduce API calls.

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
