// Pixel Quest Online - Game Logic

document.addEventListener('DOMContentLoaded', () => {
    // Game state
    const gameState = {
        coins: 0,
        level: 1,
        inventory: [],
        playerPosition: { x: 50, y: 50 },
        puzzles: [
            { 
                id: 1, 
                question: "What color is the sky?",
                answer: "blue",
                solved: false 
            },
            { 
                id: 2, 
                question: "How many coins are in a dollar?",
                answer: "100",
                solved: false 
            }
        ]
    };

    // DOM Elements
    const player = document.getElementById('player');
    const coinsDisplay = document.getElementById('coins');
    const levelDisplay = document.getElementById('level');
    const inventoryItems = document.getElementById('inventory-items');
    const puzzlePanel = document.getElementById('puzzle-panel');
    const puzzleText = document.getElementById('puzzle-text');
    const puzzleContent = document.getElementById('puzzle-content');
    const puzzleSubmit = document.getElementById('puzzle-submit');

    // Initialize game
    function initGame() {
        updateStats();
        setupEventListeners();
    }

    // Update game stats display
    function updateStats() {
        coinsDisplay.textContent = gameState.coins;
        levelDisplay.textContent = gameState.level;
    }

    // Update inventory display
    function updateInventory() {
        inventoryItems.innerHTML = '';
        if (gameState.inventory.length === 0) {
            inventoryItems.innerHTML = '<p>Empty</p>';
        } else {
            gameState.inventory.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'inventory-item';
                itemElement.textContent = item;
                inventoryItems.appendChild(itemElement);
            });
        }
    }

    // Move player
    function movePlayer(dx, dy) {
        const newX = Math.max(0, Math.min(550, gameState.playerPosition.x + dx));
        const newY = Math.max(0, Math.min(450, gameState.playerPosition.y + dy));
        
        gameState.playerPosition.x = newX;
        gameState.playerPosition.y = newY;
        
        player.style.left = `${newX}px`;
        player.style.top = `${newY}px`;
        
        checkCollisions();
    }

    // Check for collisions with collectibles and puzzles
    function checkCollisions() {
        // Simple collision detection with collectibles
        const collectibles = document.querySelectorAll('.collectible');
        collectibles.forEach((collectible, index) => {
            const rect1 = player.getBoundingClientRect();
            const rect2 = collectible.getBoundingClientRect();
            
            if (rect1.left < rect2.right && 
                rect1.right > rect2.left && 
                rect1.top < rect2.bottom && 
                rect1.bottom > rect2.top) {
                
                // Collect item
                gameState.coins += 10;
                updateStats();
                collectible.style.display = 'none';
                gameState.inventory.push(`Coin Bundle ${index + 1}`);
                updateInventory();
            }
        });
        
        // Check puzzle collisions
        const puzzles = document.querySelectorAll('.puzzle');
        puzzles.forEach((puzzle, index) => {
            const rect1 = player.getBoundingClientRect();
            const rect2 = puzzle.getBoundingClientRect();
            
            if (rect1.left < rect2.right && 
                rect1.right > rect2.left && 
                rect1.top < rect2.bottom && 
                rect1.bottom > rect2.top) {
                
                // Show puzzle
                showPuzzle(index);
            }
        });
    }

    // Show puzzle challenge
    function showPuzzle(puzzleIndex) {
        const puzzle = gameState.puzzles[puzzleIndex];
        if (puzzle.solved) return;
        
        puzzleText.textContent = puzzle.question;
        puzzleContent.innerHTML = `<input type="text" id="puzzle-input" placeholder="Enter your answer">`;
        puzzlePanel.classList.add('active');
    }

    // Setup event listeners
    function setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    movePlayer(0, -20);
                    break;
                case 'ArrowDown':
                    movePlayer(0, 20);
                    break;
                case 'ArrowLeft':
                    movePlayer(-20, 0);
                    break;
                case 'ArrowRight':
                    movePlayer(20, 0);
                    break;
            }
        });
        
        // Puzzle submit
        puzzleSubmit.addEventListener('click', () => {
            const input = document.getElementById('puzzle-input');
            if (!input) return;
            
            const userAnswer = input.value.toLowerCase().trim();
            const activePuzzle = gameState.puzzles.find(p => !p.solved);
            
            if (activePuzzle && userAnswer === activePuzzle.answer.toLowerCase()) {
                activePuzzle.solved = true;
                gameState.coins += 50;
                gameState.level += 1;
                updateStats();
                gameState.inventory.push(`Puzzle Reward ${activePuzzle.id}`);
                updateInventory();
                puzzlePanel.classList.remove('active');
                alert('Puzzle solved! You gained 50 coins and leveled up!');
            } else {
                alert('Incorrect answer. Try again!');
            }
        });
    }

    // Initialize the game
    initGame();
});