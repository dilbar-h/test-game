# Estonian Wordscapes - Learn Estonian Words

A desktop version of the popular Wordscapes word puzzle game, specifically designed for learning Estonian vocabulary. Built with HTML, CSS, and JavaScript.

## Features

- **Crossword-style Grid**: Fill in the crossword puzzle by finding Estonian words
- **Letter Wheel**: Swipe or click letters to form Estonian words
- **Word Validation**: Validates Estonian words against the level's word list
- **Bonus Words**: Find extra Estonian words for additional points
- **Progress Tracking**: Visual progress bar and score system
- **Definition-based Hints**: Get English definitions instead of direct translations
- **Category System**: Words are organized by categories (Family, Food, Nature, etc.)
- **Shuffle Feature**: Rearrange letters to help find new words
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations
- **Language Learning Focus**: Designed specifically for Estonian vocabulary acquisition

## How to Play

1. **Objective**: Find all the Estonian words in the crossword grid using the letters in the wheel
2. **Forming Words**: 
   - **Desktop**: Click and drag across letters to select them
   - **Mobile**: Touch and drag across letters to select them
3. **Word Submission**: Release to submit the word
4. **Valid Words**: Estonian words that fit in the crossword grid
5. **Bonus Words**: Extra Estonian words you can find for additional points
6. **Hints**: Use the hint button to get English definitions of Estonian words
7. **Level Completion**: Find all required words to advance to the next level

## Game Controls

- **Shuffle Button**: Rearrange the letters in the wheel
- **Hint Button**: Get an English definition for an unfound Estonian word
- **Next Level**: Continue to the next level after completion

## How to Run

### Option 1: Simple HTTP Server (Recommended)

1. Open your terminal/command prompt
2. Navigate to the game directory:
   ```bash
   cd /path/to/your/game
   ```
3. Start a simple HTTP server:

   **Python 3:**
   ```bash
   python -m http.server 8000
   ```

   **Python 2:**
   ```bash
   python -m SimpleHTTPServer 8000
   ```

   **Node.js (if you have it installed):**
   ```bash
   npx http-server -p 8000
   ```

4. Open your web browser and go to:
   ```
   http://localhost:8000
   ```

### Option 2: Direct File Opening

Simply double-click the `index.html` file to open it in your default web browser.

## Game Structure

- `index.html` - Main HTML structure
- `styles.css` - All styling and responsive design
- `script.js` - Game logic and functionality

## Current Levels

The game includes 10 pre-built levels with Estonian vocabulary, organized by themes:

1. **Level 1**: ISA, EMA (Family)
2. **Level 2**: KODU, LINN (Home & Geography)
3. **Level 3**: LEIB, VESI (Food & Nature)
4. **Level 4**: TULI, KOOL (Nature & Education)
5. **Level 5**: AUTO, TAKSI (Transport)
6. **Level 6**: KUNST, MUUSIKA (Culture)
7. **Level 7**: AED, METS (Nature)
8. **Level 8**: TÄNA, HOMNE, EILE (Time)
9. **Level 9**: HEA, HALB, SUUR, VÄIKE (Qualities & Size)
10. **Level 10**: KAKS, KOLM, NELI, VIIS (Numbers)

## Technical Details

- **Pure JavaScript**: No external dependencies
- **ES6 Classes**: Modern JavaScript architecture
- **CSS Grid & Flexbox**: Responsive layout
- **Touch & Mouse Support**: Works on both desktop and mobile
- **Local Storage**: Game progress is saved locally

## Future Enhancements

- More Estonian vocabulary levels with dynamic generation
- Integration with Estonian dictionary APIs for better word validation
- Audio pronunciation of Estonian words
- Sound effects and animations
- Additional language support (Finnish, Latvian, etc.)
- Leaderboard system
- Power-ups and special features
- Progress tracking and vocabulary review

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

If the game doesn't work properly:

1. Make sure you're running it through a web server (not just opening the HTML file)
2. Check that all three files (`index.html`, `styles.css`, `script.js`) are in the same directory
3. Clear your browser cache and refresh the page
4. Try a different browser

## License

This is a personal project created for educational purposes. The original Wordscapes game is developed by PeopleFun. 