// --- INITIALIZE ALL SCRIPTS ONCE THE DOCUMENT IS LOADED ---
document.addEventListener('DOMContentLoaded', () => {

	// --- THEME TOGGLE LOGIC ---
	const themeToggle = document.getElementById('theme-toggle');
	const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
	const currentTheme = localStorage.getItem('theme');

	if (currentTheme) {
		document.documentElement.setAttribute('data-theme', currentTheme);
	} else if (prefersDarkScheme.matches) {
		document.documentElement.setAttribute('data-theme', 'dark');
	}

	themeToggle.addEventListener('click', () => {
		let theme = document.documentElement.getAttribute('data-theme') !== 'dark' ? 'dark' : 'light';
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
		
		updateSnakeColors();
	});

	// --- TAB SWITCHING LOGIC ---
	const tabLinks = document.querySelectorAll('.tab-link');
	const tabPanes = document.querySelectorAll('.tab-pane');

	tabLinks.forEach(link => {
		link.addEventListener('click', e => {
			const targetTab = e.target.getAttribute('data-tab');

			tabLinks.forEach(item => item.classList.remove('active'));
			tabPanes.forEach(pane => pane.classList.remove('active'));

			e.target.classList.add('active');
			document.getElementById(targetTab).classList.add('active');

			// If the user has clicked on a game tab, initialize the Games.
			if (targetTab === 'resources') {
				initializeCanvas();
			} else if (targetTab === 'DND') {
				initialiseDicerRoller();
				initializeSettlementGenerator();
			} else if (targetTab === 'etchpage') {
				initializeEtchASketch();
			} else if (targetTab === 'snakepage') {
				initializeSnakeGame();
			} else if (targetTab === 'tetrispage') {
                initializeTetrisGame();
            } else if (targetTab === 'smolgames') {
                initializeHangmanGame();
				initializeQuizGame();
                initializeTicTacToeGame();
				RPS_initializeGame();
            }

			// Update the URL hash to match the current tab
			// This changes the URL without reloading the page, e.g., to #google-links
			window.location.hash = targetTab;
		});
	});
	
	// --- TAB SCROLLING LOGIC ---
	const tabsContainer = document.querySelector('.tabs');
	const tabsWrapper = tabsContainer ? tabsContainer.querySelector('.tabs-wrapper') : null;
	const tabsUl = tabsWrapper ? tabsWrapper.querySelector('ul') : null;
	const scrollLeftBtn = tabsContainer ? tabsContainer.querySelector('#scroll-left-btn') : null;
	const scrollRightBtn = tabsContainer ? tabsContainer.querySelector('#scroll-right-btn') : null;
	const SCROLL_AMOUNT = 200;

	function updateScrollButtons() {
		// Added more robust safety checks
		if (!tabsContainer || !tabsWrapper || !tabsUl || !scrollLeftBtn || !scrollRightBtn) {
			return;
		}

		const hasOverflow = tabsUl.scrollWidth > tabsWrapper.clientWidth;

		if (!hasOverflow) {
			scrollLeftBtn.classList.add('hidden');
			scrollRightBtn.classList.add('hidden');
			return;
		}

		const scrollLeft = tabsWrapper.scrollLeft;
		const maxScrollLeft = tabsUl.scrollWidth - tabsWrapper.clientWidth;

		if (scrollLeft > 0) {
			scrollLeftBtn.classList.remove('hidden');
		} else {
			scrollLeftBtn.classList.add('hidden');
		}

		if (scrollLeft < (maxScrollLeft - 1)) {
			scrollRightBtn.classList.remove('hidden');
		} else {
			scrollRightBtn.classList.add('hidden');
		}
	}

	if (tabsContainer) { // Only add listeners if the elements exist
		scrollLeftBtn.addEventListener('click', () => {
			tabsWrapper.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
		});

		scrollRightBtn.addEventListener('click', () => {
			tabsWrapper.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
		});

		tabsWrapper.addEventListener('scroll', updateScrollButtons);
		window.addEventListener('resize', updateScrollButtons);
		
		// Initial check after a short delay for rendering
		setTimeout(updateScrollButtons, 100);
	}
	// --- END TAB SCROLLING LOGIC ---

	// --- EXTERNAL LINK HANDLING ---
	document.addEventListener('click', e => {
		if (e.target.tagName === 'A' && e.target.href.startsWith('http') && !e.target.classList.contains('tab-link')) {
			e.preventDefault();
			const linkCard = e.target.closest('a.link-card');
			if (linkCard) {
				window.open(linkCard.href, '_blank');
			}
		}
	});

	// --- SCROLL ANIMATION SCRIPT ---
	const jayImg = document.getElementById('jay-img');
	const callumImg = document.getElementById('callum-img');
	const centerImg = document.getElementById('center-img');

	function handleScroll() {
		const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
		if (scrollableHeight <= 0) return;

		const scrollFraction = window.scrollY / scrollableHeight;
		const translation = Math.min(scrollFraction * 100, 35);
		jayImg.style.transform = `translateX(${translation}vw)`;
		callumImg.style.transform = `translateX(-${translation}vw)`;

		const fadeStartFraction = 0.5;
		const fadeProgress = (scrollFraction - fadeStartFraction) / (1 - fadeStartFraction);

		if (scrollFraction < fadeStartFraction) {
			jayImg.style.opacity = 1;
			callumImg.style.opacity = 1;
			centerImg.style.opacity = 0;
		} else {
			jayImg.style.opacity = 1 - fadeProgress;
			callumImg.style.opacity = 1 - fadeProgress;
			centerImg.style.opacity = fadeProgress;
		}
	}
	window.addEventListener('scroll', handleScroll);


	// --- DYNAMIC LINK GRID & MODAL SCRIPT ---
	let quickLinksData = [];
	let googleLinksData = [];
	let draggedItem = null;

	const quickLinksGrid = document.getElementById('quick-links-grid');
	const googleLinksGrid = document.getElementById('google-links-grid');
	const deleteZone = document.getElementById('delete-zone');

	const addLinkModal = document.getElementById('add-link-modal');
	const exportModal = document.getElementById('export-modal');
	const addLinkForm = document.getElementById('add-link-form');
	const exportTextarea = document.getElementById('export-textarea');

	function loadLinkData(key, initialData) {
		const storedData = localStorage.getItem(key);
		if (storedData) {
			const parsedStoredData = JSON.parse(storedData);
			if (parsedStoredData.length < initialData.length) {
				localStorage.setItem(key, JSON.stringify(initialData));
				return initialData;
			}
			return parsedStoredData;
		} else {
			localStorage.setItem(key, JSON.stringify(initialData));
			return initialData;
		}
	}

	function renderGrid(gridElement, data, gridKey) {
		gridElement.innerHTML = '';
		data.forEach((link, index) => {
			const linkCard = document.createElement('a');
			linkCard.href = link.url;
			linkCard.className = 'link-card';
			linkCard.draggable = true;
			linkCard.dataset.index = index;
			linkCard.dataset.gridKey = gridKey;

			const img = document.createElement('img');
			img.src = link.icon;

			if (link.name === "NotebookLM" && link.icon.includes("notebooklm")) {
				img.style.filter = 'invert(1)';
			} else if (link.invert) {
				img.classList.add('inverted');
			}

			const h3 = document.createElement('h3');
			h3.textContent = link.name;

			linkCard.append(img, h3);
			gridElement.appendChild(linkCard);
		});
		addDragAndDropListeners(gridElement);
	}

	function saveData(key, data) {
		localStorage.setItem(key, JSON.stringify(data));
	}

	function addDragAndDropListeners(gridElement) {
		gridElement.querySelectorAll('.link-card').forEach(item => {
			item.addEventListener('dragstart', handleDragStart);
			item.addEventListener('dragend', handleDragEnd);
			item.addEventListener('dragover', e => e.preventDefault());
			item.addEventListener('drop', handleDrop);
		});
	}

	function handleDragStart(e) {
		draggedItem = this;
		setTimeout(() => {
			this.classList.add('dragging');
			deleteZone.classList.add('visible');
		}, 0);
	}

	function handleDragEnd() {
		if (draggedItem) {
			draggedItem.classList.remove('dragging');
		}
		draggedItem = null;
		deleteZone.classList.remove('visible', 'drag-over');
	}

	function handleDrop(e) {
		e.preventDefault();
		if (!draggedItem || this === draggedItem || this.dataset.gridKey !== draggedItem.dataset.gridKey) return;

		const gridKey = this.dataset.gridKey;
		const dataArray = gridKey === 'quick' ? quickLinksData : googleLinksData;
		const gridElement = gridKey === 'quick' ? quickLinksGrid : googleLinksGrid;

		const fromIndex = parseInt(draggedItem.dataset.index);
		const toIndex = parseInt(this.dataset.index);

		const [movedItem] = dataArray.splice(fromIndex, 1);
		dataArray.splice(toIndex, 0, movedItem);

		saveData(gridKey, dataArray);
		renderGrid(gridElement, dataArray, gridKey);
	}

	deleteZone.addEventListener('dragover', e => {
		e.preventDefault();
		deleteZone.classList.add('drag-over');
	});
	deleteZone.addEventListener('dragleave', () => deleteZone.classList.remove('drag-over'));
	deleteZone.addEventListener('drop', e => {
		e.preventDefault();
		if (!draggedItem) return;

		const gridKey = draggedItem.dataset.gridKey;
		const index = parseInt(draggedItem.dataset.index);

		if (gridKey === 'quick') {
			quickLinksData.splice(index, 1);
			saveData('quick', quickLinksData);
			renderGrid(quickLinksGrid, quickLinksData, 'quick');
		} else {
			googleLinksData.splice(index, 1);
			saveData('google', googleLinksData);
			renderGrid(googleLinksGrid, googleLinksData, 'google');
		}
	});

	document.querySelectorAll('.add-link-btn').forEach(btn => btn.addEventListener('click', e => {
		addLinkForm.reset();
		addLinkForm.querySelector('#modal-grid-target').value = e.currentTarget.dataset.grid;
		addLinkModal.classList.add('active');
	}));

	document.querySelectorAll('.share-link-btn').forEach(btn => btn.addEventListener('click', e => {
		const gridKey = e.currentTarget.dataset.grid;
		const data = gridKey === 'quick' ? quickLinksData : googleLinksData;
		const varName = gridKey === 'quick' ? 'initialQuickLinksData' : 'initialGoogleLinksData';
		exportTextarea.value = `const ${varName} = ${JSON.stringify(data, null, 2)};`;
		exportModal.classList.add('active');
	}));

	addLinkModal.querySelector('#modal-cancel-btn').addEventListener('click', () => addLinkModal.classList.remove('active'));
	addLinkModal.addEventListener('click', e => {
		if (e.target === addLinkModal) addLinkModal.classList.remove('active');
	});
	exportModal.querySelector('#modal-close-btn').addEventListener('click', () => exportModal.classList.remove('active'));
	exportModal.addEventListener('click', e => {
		if (e.target === exportModal) exportModal.classList.remove('active');
	});

	addLinkForm.addEventListener('submit', e => {
		e.preventDefault();
		const newLink = {
			name: addLinkForm.querySelector('#link-name').value,
			url: addLinkForm.querySelector('#link-url').value,
			icon: addLinkForm.querySelector('#link-icon').value,
			invert: addLinkForm.querySelector('#link-invert').checked,
		};
		const gridKey = addLinkForm.querySelector('#modal-grid-target').value;

		if (gridKey === 'quick') {
			quickLinksData.push(newLink);
			saveData('quick', quickLinksData);
			renderGrid(quickLinksGrid, quickLinksData, 'quick');
		} else {
			googleLinksData.push(newLink);
			saveData('google', googleLinksData);
			renderGrid(googleLinksGrid, googleLinksData, 'google');
		}
		addLinkModal.classList.remove('active');
	});

	exportModal.querySelector('#modal-copy-btn').addEventListener('click', e => {
		exportTextarea.select();
		navigator.clipboard.writeText(exportTextarea.value);
		e.currentTarget.textContent = 'Copied!';
		setTimeout(() => {
			e.currentTarget.textContent = 'Copy to Clipboard';
		}, 2000);
	});

	function initializeGrids() {
		quickLinksData = loadLinkData('quick', initialQuickLinksData);
		googleLinksData = loadLinkData('google', initialGoogleLinksData);
		renderGrid(quickLinksGrid, quickLinksData, 'quick');
		renderGrid(googleLinksGrid, googleLinksData, 'google');
	}
	initializeGrids();

	// ACTIVATE TAB FROM URL HASH ON PAGE LOAD ---
	const currentHash = window.location.hash.substring(1); // Get hash without the '#'
	if (currentHash) {
		const tabToActivate = document.querySelector(`.tab-link[data-tab="${currentHash}"]`);
		if (tabToActivate) {
			// Programmatically click the tab that matches the hash
			// This reuses the existing click handler logic to switch tabs
			tabToActivate.click();
		}
	}
});

//  STANDALONE UTILITY & INITIALIZATION FUNCTIONS ---

function copyToClipboard(text) {
	navigator.clipboard.writeText(text).then(() => {
		alert("Text copied to clipboard!");
	}).catch(err => {
		console.error('Failed to copy: ', err);
	});
}

//==========================================================================
// ETCH-A-SKETCH
//==========================================================================
let canvasInitialized = false; // Flag to check if we've run this before

function initializeCanvas() {
	if (canvasInitialized) return; // Don't run again if already initialized

	const canvas = document.getElementById('particle-canvas');
	if (!canvas) return; // Safety check
	const ctx = canvas.getContext('2d');

	// Now, offsetWidth and offsetHeight will have correct values because the tab is visible
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;

	let isDrawing = false;
	let lastX = 0;
	let lastY = 0;

	function draw(e) {
		if (!isDrawing) return;
		const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();

		ctx.strokeStyle = primaryColor;
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
		ctx.lineWidth = 10;

		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(e.offsetX, e.offsetY);
		ctx.stroke();
		[lastX, lastY] = [e.offsetX, e.offsetY];
	}

	canvas.addEventListener('mousedown', (e) => {
		isDrawing = true;
		[lastX, lastY] = [e.offsetX, e.offsetY];
	});
	canvas.addEventListener('mousemove', draw);
	canvas.addEventListener('mouseup', () => isDrawing = false);
	canvas.addEventListener('mouseout', () => isDrawing = false);

	canvasInitialized = true; // Set the flag so we don't re-initialize
}

let etchASketchInitialized = false; // Flag to prevent re-initialization

function initializeEtchASketch() {
    if (etchASketchInitialized) return;

    const canvas = document.getElementById('etch-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const penBtn = document.getElementById('btn-pen');
    const shakeBtn = document.getElementById('btn-shake');
    const stepSlider = document.getElementById('step-slider');
    const stepValueSpan = document.getElementById('step-value');
    const etchBody = document.querySelector('.etch-a-sketch-body');
    const etchContainer = document.querySelector('.etch-a-sketch-container');
    
    // Get the new display element for coordinates
    const coordsDisplay = document.getElementById('etch-coords-display');

    let x, y;
    // Start with isDrawing as false so the initial toggle sets it correctly to true. ---
    let isDrawing = false;
    let step = parseInt(stepSlider.value, 10);

	let initialX = null;
	let initialY = null;

	function updateCoordsDisplay() {
		// On the very first run, capture the starting coordinates
		if (initialX === null) {
			initialX = x;
			initialY = y;
		}

		// Calculate the position relative to the start
		const relativeX = x - initialX;
		const relativeY = y - initialY;

		if (coordsDisplay) {
			// Display the relative coordinates
			coordsDisplay.textContent = `X: ${Math.round(relativeX)}, Y: ${Math.round(relativeY*-1)}`;
		}
	}

    function setEtchBodySize() {
        // Temporarily set body to 65% to measure its container accurately
        etchBody.style.width = '65%';
        const availableWidth = etchContainer.offsetWidth;
        
        // Calculate the new width by rounding down to the nearest multiple of 20
        const newWidth = Math.floor(availableWidth / 20) * 20;

        // Apply the new, calculated width
        etchBody.style.width = `${newWidth}px`;
    }

    function setCanvasSize() {
        const oldImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.putImageData(oldImage, 0, 0); // Restore drawing
        if (x === undefined || y === undefined) {
            x = canvas.width / 2;
            y = canvas.height / 2;
        }
    }

    function draw(newX, newY) {
        if (isDrawing) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(newX, newY);
            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
        }
        x = newX;
        y = newY;
        // Update the coordinates display after drawing
        updateCoordsDisplay();
    }

    function move(dx, dy) {
        const newX = Math.max(0, Math.min(canvas.width, x + dx * step));
        const newY = Math.max(0, Math.min(canvas.height, y + dy * step));
        draw(newX, newY);
    }

    function togglePen() {
        isDrawing = !isDrawing;
        // Flipped the text logic. ---
        // If drawing is now TRUE, the button should offer the option to lift the pen ("Pen Up").
        penBtn.textContent = isDrawing ? 'Pen Up' : 'Pen Down';
        penBtn.classList.toggle('drawing', isDrawing);
    }

    function shake() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        x = canvas.width / 2;
        y = canvas.height / 2;
        etchBody.classList.add('animate-shake');
        setTimeout(() => etchBody.classList.remove('animate-shake'), 500);
        // Update the coordinates display after shaking (resetting)
        updateCoordsDisplay();
    }

    function handleKeyDown(e) {
        e.preventDefault();
        switch (e.key) {
            case 'ArrowUp': move(0, -1); break;
            case 'ArrowDown': move(0, 1); break;
            case 'ArrowLeft': move(-1, 0); break;
            case 'ArrowRight': move(1, 0); break;
        }
    }

    // Initial setup
    setEtchBodySize();
    setCanvasSize();
    shake(); 
    togglePen();

    // Event Listeners
    document.getElementById('btn-up').addEventListener('click', () => move(0, -1));
    document.getElementById('btn-down').addEventListener('click', () => move(0, 1));
    document.getElementById('btn-left').addEventListener('click', () => move(-1, 0));
    document.getElementById('btn-right').addEventListener('click', () => move(1, 0));
    penBtn.addEventListener('click', togglePen);
    shakeBtn.addEventListener('click', shake);
    stepSlider.addEventListener('input', (e) => {
        step = parseInt(e.target.value, 10);
        stepValueSpan.textContent = step;
    });

    window.addEventListener('keydown', handleKeyDown);

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setEtchBodySize();
            setCanvasSize();
        }, 100);
    });

    etchASketchInitialized = true;
}

//==========================================================================
// SNAKE GAME
//==========================================================================
let snakeGameInitialized = false;
// Create a placeholder function in the outer scope.
// This allows the theme toggler to call it safely even before the game is initialized.
let updateSnakeColors = () => {};

function initializeSnakeGame() {
    if (snakeGameInitialized) return;

    const canvas = document.getElementById('snakeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const scoreEl = document.getElementById('score');
    const gameOverModal = document.getElementById('gameOverModal');
    const startModal = document.getElementById('startModal');
    const finalScoreEl = document.getElementById('finalScore');
    const restartButton = document.getElementById('restartButton');
    const startButton = document.getElementById('startButton');
	const pauseModal = document.getElementById('snakepauseModal');
    const speedSlider = document.getElementById('snake-speed-slider');
    const speedValueSpan = document.getElementById('snake-speed-value');
	const wallsCheckbox = document.getElementById('snake-walls-setting');
    // --- Get slider and span elements ---
    const sizeSlider = document.getElementById('snake-size-slider');
    const sizeValueSpan = document.getElementById('snake-grid-size');

    // On-screen buttons
    const upBtn = document.getElementById('upBtn');
    const downBtn = document.getElementById('downBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');

    const hiscoreDisplayEl = document.getElementById('snakehiscoredisplay');

    // --- gridSize is now a 'let' and initialized from the slider ---
    let gridSize = parseInt(sizeSlider.value, 10);
    let tileCount;

    const HIGH_SCORES_KEY = 'snakeHighScores';
    const MAX_HIGH_SCORES = 15;

    // Variables to cache the parsed gradient colors.
    let snakeStartColorRGB = {};
    let snakeEndColorRGB = {};

    // Assign the actual logic to the placeholder function.
    updateSnakeColors = function() {
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
        snakeStartColorRGB = hexToRgb(primaryColor);
        snakeEndColorRGB = hexToRgb(secondaryColor);
    };

    // Game state
    let snake = [{ x: 10, y: 10 }]; // This will be overwritten in startGame
    let food = {};
    let dx = 0;
    let dy = 0;
    let score = 0;
    let changingDirection = false;
    let gameLoop;
    let gameSpeed; // Removed initial value
	let isPaused = false;
	let highlightedAxis = null;
    let highlightTimer = null; 

    // --- High Score Functions ---
    function getHighScores() {
        const scoresJSON = localStorage.getItem(HIGH_SCORES_KEY);
        return scoresJSON ? JSON.parse(scoresJSON) : [];
    }

    function saveHighScores(scores) {
        localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(scores));
    }
	function displayHighScores() {
		const highScores = getHighScores();
		hiscoreDisplayEl.innerHTML = '';

		if (highScores.length === 0) {
			const p = document.createElement('p');
			p.textContent = 'No scores recorded yet!';
			hiscoreDisplayEl.appendChild(p);
			return;
		}

		const table = document.createElement('table');
		const thead = document.createElement('thead');
		const tbody = document.createElement('tbody');

		// Add a class to the table for external styling
		table.className = 'hiscore-table';

		// --- Create Table Header ---
		const headerRow = document.createElement('tr');
		const headers = ['Rank', 'Name', 'Score', 'Date'];

		headers.forEach(headerText => {
			const th = document.createElement('th');
			th.textContent = headerText;
			headerRow.appendChild(th);
		});
		thead.appendChild(headerRow);
		table.appendChild(thead);

		// --- Create Table Body with Scores ---
		highScores.forEach((scoreItem, index) => {
			const row = document.createElement('tr');

			// Create and append cells for the row
			const rankCell = document.createElement('td');
			rankCell.textContent = index + 1;
			row.appendChild(rankCell);

			const nameCell = document.createElement('td');
			nameCell.textContent = scoreItem.name;
			row.appendChild(nameCell);

			const scoreCell = document.createElement('td');
			scoreCell.textContent = scoreItem.score;
			row.appendChild(scoreCell);

			const dateCell = document.createElement('td');
			dateCell.textContent = scoreItem.timestamp || 'N/A'; // Use 'N/A' if no timestamp
			row.appendChild(dateCell);

			tbody.appendChild(row);
		});

		table.appendChild(tbody);
		hiscoreDisplayEl.appendChild(table);
	}

    function isHighScore(newScore) {
        if (newScore === 0) return false;
        const highScores = getHighScores();
        const lowestScore = highScores[MAX_HIGH_SCORES - 1]?.score ?? 0;
        return highScores.length < MAX_HIGH_SCORES || newScore > lowestScore;
    }
    
    // Download certificate canvas as a PNG
    function downloadCanvasAsImage(canvas, filename) {
        const link = document.createElement('a');
        link.download = filename;
        // Convert canvas to a Blob for better browser support and performance
        canvas.toBlob(function(blob) {
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href); // Clean up the object URL
        }, 'image/png');
    }

	// Generate the high score certificate
    function generateCertificate(newScoreEntry, allHighScores, gameCanvas) {
        // Create a NEW canvas for the certificate
        const certCanvas = document.createElement('canvas'); 
        const scale = 2; // Draw at 2x resolution for sharpness
        
        // --- MODIFICATION: New width is 800 (cert) + 800 (game) = 1600 ---
        const certWidth = 800;
        const gameWidth = 800;
        const totalWidth = certWidth + gameWidth;

        // Calculate height dynamically
        const baseHeight = 480; // Height of the certificate content above the score list
        const lineHeight = 30;  // Pixels required for each score line
        const bottomPadding = 50; // Extra space at the bottom
        const dynamicHeight = baseHeight + (allHighScores.length * lineHeight) + bottomPadding;

        // --- MODIFICATION: Apply new total width ---
        certCanvas.width = totalWidth * scale;
        certCanvas.height = dynamicHeight * scale;
        
        const ctx = certCanvas.getContext('2d');
        ctx.scale(scale, scale);

        const fontFamily = '"Quicksand", sans-serif';
        
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--header-bg').trim();
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
        
        // --- Draw Left Side: Certificate ---

        // Background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, certWidth, dynamicHeight); // Only fill the left half

        // Border
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 15;
        ctx.strokeRect(7.5, 7.5, certWidth - 15, dynamicHeight - 15);

        // Inner decorative border
        ctx.strokeStyle = '#fbc02d'; // Gold/Yellow
        ctx.lineWidth = 3;
        ctx.strokeRect(20, 20, certWidth - 40, dynamicHeight - 40);

        // Title (Centered in the 800px left-half)
        ctx.textAlign = 'center';
        ctx.fillStyle = primaryColor;
        ctx.font = `bold 60px ${fontFamily}`;
        ctx.fillText('HIGH SCORE', 400, 100); // 400 is center of 800

        // Game Title
        ctx.font = `bold 40px ${fontFamily}`;
        ctx.fillStyle = primaryColor;
        ctx.fillText('SNAKE', 400, 150);

        // Star separator
        ctx.fillStyle = '#fbc02d';
        ctx.fillText('★', 400, 190);

        // Player Name
        ctx.font = `32px ${fontFamily}`;
        ctx.fillStyle = textColor;
        ctx.fillText('ACHIEVED BY', 400, 240);
        ctx.font = `bold 48px ${fontFamily}`;
        ctx.fillStyle = primaryColor;
        ctx.fillText(newScoreEntry.name, 400, 300);

        // Score
        ctx.font = `bold 52px ${fontFamily}`;
        ctx.fillStyle = '#d84315'; // A nice orange/red for the score
        ctx.fillText(newScoreEntry.score, 400, 370);

        // Date
        ctx.font = `20px ${fontFamily}`;
        ctx.fillStyle = textColor;
        ctx.fillText(newScoreEntry.timestamp, 400, 405);

        // High Scores List Title
        ctx.textAlign = 'left';
        ctx.font = `bold 24px ${fontFamily}`;
        ctx.fillStyle = primaryColor;
        ctx.fillText('Top Scores:', 100, 460);

        // High Scores List
        ctx.font = `20px ${fontFamily}`;
        let yPos = 495;
        allHighScores.forEach((scoreItem, index) => {
            const isNewScore = scoreItem.name === newScoreEntry.name && scoreItem.score === newScoreEntry.score && scoreItem.timestamp === newScoreEntry.timestamp;
            
            if (isNewScore) {
                ctx.fillStyle = primaryColor; 
                ctx.font = `bold 22px ${fontFamily}`;
            } else {
                ctx.fillStyle = textColor;
                ctx.font = `20px ${fontFamily}`;
            }
            
            const rank = `${index + 1}.`;
            const name = scoreItem.name;
            const score = scoreItem.score;

            ctx.textAlign = 'left';
            ctx.fillText(rank, 100, yPos);
            ctx.fillText(name, 140, yPos);

            ctx.textAlign = 'right';
            // --- MODIFICATION: Draw score aligned right, within the left 800px block ---
            ctx.fillText(score, certWidth - 100, yPos); // 700 (which is 800 - 100)

            yPos += 30;
        });

        // --- Draw Right Side: Game Board ---
        // We draw the passed-in gameCanvas onto the right half of our certCanvas
        // Destination (dx, dy, dWidth, dHeight)
        // dx = 800 (start of right half)
        // dy = 0
        // dWidth = 800 (width of right half)
        // dHeight = dynamicHeight (to match the certificate height)
        ctx.drawImage(gameCanvas, 800, 0, 800, dynamicHeight);

        // --- Download the combined canvas ---
        downloadCanvasAsImage(certCanvas, 'snake-highscore-certificate.png');
    }

	// addHighScore now generates the certificate
	function addHighScore(name, score) {
        const timestamp = new Date().toLocaleString(); 
        const newScoreEntry = { name, score, timestamp };
        const highScores = getHighScores();
        highScores.push(newScoreEntry);
        highScores.sort((a, b) => b.score - a.score);
        highScores.splice(MAX_HIGH_SCORES);
        saveHighScores(highScores);
        displayHighScores();
        
        // --- MODIFICATION: Pass the main game 'canvas' to the generator ---
        generateCertificate(newScoreEntry, highScores, canvas);
    }

    function resizeCanvas() {
        const parent = canvas.parentElement;
        if (!parent) return;
        const size = Math.min(parent.clientWidth, parent.clientHeight);
        canvas.width = size;
        canvas.height = size;
        tileCount = canvas.width / gridSize;
        if (gameLoop) {
            clearCanvas();
            drawFood();
            drawSnake();
        }
    }

    function init() {
        window.addEventListener('resize', resizeCanvas);
        document.addEventListener('keydown', handleKeyPress);
        restartButton.addEventListener('click', startGame);
        startButton.addEventListener('click', startGame);

        upBtn.addEventListener('click', () => changeDirection({ keyCode: 38 }));
        downBtn.addEventListener('click', () => changeDirection({ keyCode: 40 }));
        leftBtn.addEventListener('click', () => changeDirection({ keyCode: 37 }));
        rightBtn.addEventListener('click', () => changeDirection({ keyCode: 39 }));
        
        // --- Set initial text for size slider ---
        sizeValueSpan.textContent = `${gridSize} x ${gridSize}`;
        
        // --- Add event listener for the size slider ---
        sizeSlider.addEventListener('input', () => {
            gridSize = parseInt(sizeSlider.value, 10);
            sizeValueSpan.textContent = `${gridSize} x ${gridSize}`;
            resizeCanvas(); // Recalculate tileCount
            clearCanvas(); // Redraw the grid
        });
        
        // --- Add event listener for the speed slider ---
        speedSlider.addEventListener('input', () => {
            speedValueSpan.textContent = speedSlider.value;
        });

        resizeCanvas();
        updateSnakeColors();
        showStartScreen();
        displayHighScores();
    }

    function startGame() {
        // --- Ensure gridSize is set from the slider value ---
        gridSize = parseInt(sizeSlider.value, 10);
        
        // --- Calculate a dynamic start position based on grid size ---
        let startPos = Math.floor(gridSize / 2);
        snake = [{ x: startPos, y: startPos }];
        
        dx = 0;
        dy = 0;
        score = 0;
        scoreEl.textContent = score;
        isPaused = false;
        
        //Set game speed based on slider and disable it ---
        const speedLevel = parseInt(speedSlider.value, 10);
        switch (speedLevel) {
            case 1: gameSpeed = 500; break;
            case 2: gameSpeed = 300; break;
            case 3: gameSpeed = 150; break;
            default: gameSpeed = 300; // Fallback
        }
        
        // --- Disable all sliders ---
        speedSlider.disabled = true;
		wallsCheckbox.disabled = true;
        sizeSlider.disabled = true;

        gameOverModal.classList.add('hidden');
        gameOverModal.classList.remove('flex');
        startModal.classList.add('hidden');
        startModal.classList.remove('flex');
        pauseModal.classList.add('hidden');
        pauseModal.classList.remove('flex');

        createFood();

        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(main, gameSpeed);
    }

    function showStartScreen() {
        startModal.classList.remove('hidden');
        startModal.classList.add('flex');
        // --- Ensure all sliders are enabled ---
        speedSlider.disabled = false;
		wallsCheckbox.disabled = false;
        sizeSlider.disabled = false;
        
        // --- Draw the initial empty grid ---
        clearCanvas();
    }

    function main() {
        if (hasGameEnded()) {
            clearInterval(gameLoop);
            finalScoreEl.textContent = score;
            if (isHighScore(score)) {
                const playerName = prompt(`New High Score of ${score}!\nEnter your name:`);
                if (playerName && playerName.trim() !== '') {
                    addHighScore(playerName.trim(), score);
                }
            }
            
            // --- Re-enable all sliders on game over ---
            speedSlider.disabled = false;
			wallsCheckbox.disabled = false;
            sizeSlider.disabled = false;
            
            gameOverModal.classList.remove('hidden');
            gameOverModal.classList.add('flex');
            return;
        }
        changingDirection = false;
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
    }
	
	function togglePause() {
        if (!startModal.classList.contains('hidden') || !gameOverModal.classList.contains('hidden')) {
            return;
        }

        isPaused = !isPaused;

        if (isPaused) {
            clearInterval(gameLoop);
            pauseModal.classList.remove('hidden');
            pauseModal.classList.add('flex');
        } else {
            gameLoop = setInterval(main, gameSpeed);
            pauseModal.classList.add('hidden');
            pauseModal.classList.remove('flex');
        }
    }

	function clearCanvas() {
		const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--header-bg').trim();
		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		const snakeGridColor = getComputedStyle(document.documentElement).getPropertyValue('--snake-grid').trim();
		const snakeGridHighlightColor = getComputedStyle(document.documentElement).getPropertyValue('--snake-grid-highlight').trim();

		for (let i = 0; i < gridSize; i++) {
			ctx.strokeStyle = (highlightedAxis === 'vertical') ? snakeGridHighlightColor : snakeGridColor;
			ctx.beginPath();
			ctx.moveTo(i * tileCount, 0);
			ctx.lineTo(i * tileCount, canvas.height);
			ctx.stroke();
			
			ctx.strokeStyle = (highlightedAxis === 'horizontal') ? snakeGridHighlightColor : snakeGridColor;
			ctx.beginPath();
			ctx.moveTo(0, i * tileCount);
			ctx.lineTo(canvas.width, i * tileCount);
			ctx.stroke();
		}
	}

    function hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
	
function drawSnake() {
        if (!snakeStartColorRGB || !snakeEndColorRGB) {
            console.error("Snake colors could not be parsed.");
            return;
        }

        const halfTile = tileCount / 2; // For corner radius
        const fullTile = tileCount;

        snake.forEach((part, index) => {
            const ratio = snake.length > 1 ? index / (snake.length - 1) : 0;
            const r = Math.round(snakeStartColorRGB.r + (snakeEndColorRGB.r - snakeStartColorRGB.r) * ratio);
            const g = Math.round(snakeStartColorRGB.g + (snakeEndColorRGB.g - snakeStartColorRGB.g) * ratio);
            const b = Math.round(snakeStartColorRGB.b + (snakeEndColorRGB.b - snakeStartColorRGB.b) * ratio);

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            
            // --- Border properties removed ---
            // ctx.strokeStyle = '#1a202c';
            // ctx.lineWidth = 2;

            const x = part.x * tileCount;
            const y = part.y * tileCount;
            
            let r_tl = 0, r_tr = 0, r_br = 0, r_bl = 0; // Corner radii

            // Check if it's the head
            if (index === 0) {
                let nextPart = snake[index + 1]; // The part "behind" the head
                
                if (!nextPart) { // Snake is length 1
                    r_tl = r_tr = r_br = r_bl = halfTile;
                } else {
                    let dx = part.x - nextPart.x;
                    let dy = part.y - nextPart.y;

                    // Handle wrap-around
                    if (Math.abs(dx) > 1) dx = -Math.sign(dx);
                    if (Math.abs(dy) > 1) dy = -Math.sign(dy);
                    
                    // Round the "front" corners
                    r_tl = (dx === -1 || dy === -1) ? halfTile : 0;
                    r_tr = (dx === 1 || dy === -1) ? halfTile : 0;
                    r_br = (dx === 1 || dy === 1) ? halfTile : 0;
                    r_bl = (dx === -1 || dy === 1) ? halfTile : 0;
                }
                
            // Check if it's the tail
            } else if (index === snake.length - 1) {
                let prevPart = snake[index - 1]; // The part "in front" of the tail
                
                let dx = prevPart.x - part.x; // Direction from tail to body
                let dy = prevPart.y - part.y;
                
                // Handle wrap-around
                if (Math.abs(dx) > 1) dx = -Math.sign(dx);
                if (Math.abs(dy) > 1) dy = -Math.sign(dy);
                
                // Round the "back" corners
                r_tl = (dx === 1 || dy === 1) ? halfTile : 0;
                r_tr = (dx === -1 || dy === 1) ? halfTile : 0;
                r_br = (dx === -1 || dy === -1) ? halfTile : 0;
                r_bl = (dx === 1 || dy === -1) ? halfTile : 0;
                
            } else {
                // Body: Just draw a rectangle (no rounding)
                ctx.fillRect(x, y, tileCount, tileCount);
                return; // Skip the path drawing
            }

            // --- Draw the rounded path for head or tail ---
            ctx.beginPath();
            ctx.moveTo(x + r_tl, y);
            ctx.arcTo(x + fullTile, y, x + fullTile, y + fullTile, r_tr); // Top-right corner
            ctx.arcTo(x + fullTile, y + fullTile, x, y + fullTile, r_br); // Bottom-right corner
            ctx.arcTo(x, y + fullTile, x, y, r_bl); // Bottom-left corner
            ctx.arcTo(x, y, x + fullTile, y, r_tl); // Top-left corner
            ctx.closePath();
            ctx.fill();
            
            // --- Border drawing line removed ---
            // ctx.stroke();
        });
    }

    function drawFood() {
        ctx.fillStyle = '#e53e3e';
        ctx.strokeStyle = '#9b2c2c';
        ctx.lineWidth = 2;
        // --- MODIFICATION: Draw food as a circle ---
        const radius = tileCount / 2;
        ctx.beginPath();
        ctx.arc(food.x * tileCount + radius, food.y * tileCount + radius, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        // ctx.fillRect(food.x * tileCount, food.y * tileCount, tileCount, tileCount);
        // ctx.strokeRect(food.x * tileCount, food.y * tileCount, tileCount, tileCount);
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
		
		// If walls are off, wrap the snake around to the other side
		if (!wallsCheckbox.checked) {
			if (head.x < 0) head.x = gridSize - 1;
			if (head.x >= gridSize) head.x = 0;
			if (head.y < 0) head.y = gridSize - 1;
			if (head.y >= gridSize) head.y = 0;
		}

        snake.unshift(head);
        const hasEatenFood = snake[0].x === food.x && snake[0].y === food.y;
        if (hasEatenFood) {
            score += 10;
            scoreEl.textContent = score;
            if (gameSpeed > 60) {
                gameSpeed -= 2;
                clearInterval(gameLoop);
                gameLoop = setInterval(main, gameSpeed);
            }
            createFood();
        } else {
            snake.pop();
        }
    }

    function createFood() {
        food.x = Math.floor(Math.random() * gridSize);
        food.y = Math.floor(Math.random() * gridSize);
        snake.forEach(part => {
            if (part.x === food.x && part.y === food.y) {
                createFood();
            }
        });
    }

    function handleKeyPress(event) {
        const SPACE_BAR = 32;
        const ESCAPE_KEY = 27;
        const isArrowKey = event.keyCode >= 37 && event.keyCode <= 40;

        if (isArrowKey || event.keyCode === SPACE_BAR || event.keyCode === ESCAPE_KEY) {
            event.preventDefault();
        }

        const isStartScreenVisible = !startModal.classList.contains('hidden');
        const isGameOverScreenVisible = !gameOverModal.classList.contains('hidden');

        if (event.keyCode === ESCAPE_KEY) {
            togglePause();
            return;
        }
        
        if (isPaused) return;

        if (event.keyCode === SPACE_BAR && (isStartScreenVisible || isGameOverScreenVisible)) {
            startGame();
            return;
        }

        if (isArrowKey && isStartScreenVisible) {
            startGame();
        }

        if (!isStartScreenVisible && !isGameOverScreenVisible) {
            changeDirection(event);
        }
    }

    function changeDirection(event) {
        const LEFT_KEY = 37, RIGHT_KEY = 39, UP_KEY = 38, DOWN_KEY = 40;
        if (changingDirection) return;
        changingDirection = true;
        const keyPressed = event.keyCode;
        const goingUp = dy === -1, goingDown = dy === 1, goingRight = dx === 1, goingLeft = dx === -1;
		clearTimeout(highlightTimer);

		if (keyPressed === UP_KEY || keyPressed === DOWN_KEY) {
			highlightedAxis = 'horizontal';
		} else if (keyPressed === LEFT_KEY || keyPressed === RIGHT_KEY) {
			highlightedAxis = 'vertical';
		}
		
		highlightTimer = setTimeout(() => {
			highlightedAxis = null;
		}, 3000);
        if (keyPressed === LEFT_KEY && !goingRight) { dx = -1; dy = 0; }
        if (keyPressed === UP_KEY && !goingDown) { dx = 0; dy = -1; }
        if (keyPressed === RIGHT_KEY && !goingLeft) { dx = 1; dy = 0; }
        if (keyPressed === DOWN_KEY && !goingUp) { dx = 0; dy = 1; }
    }

    function hasGameEnded() {
		// Check for collision with self (always runs)
        for (let i = 4; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
        }
		
		// Only check for wall collisions if the walls setting is enabled
		if (wallsCheckbox.checked) {
			const hitLeftWall = snake[0].x < 0;
			const hitRightWall = snake[0].x >= gridSize;
			const hitTopWall = snake[0].y < 0;
			const hitBottomWall = snake[0].y >= gridSize;
			return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
		}
		
		// If walls are off, no wall collision can happen
        return false;
    }

    init();
    snakeGameInitialized = true;
}

// ==========================================================================
// TETRIS GAME
// ==========================================================================
let tetrisGameInitialized = false;

function initializeTetrisGame() {
    if (tetrisGameInitialized) return;

    // --- DOM Elements ---
    const boardCanvas = document.getElementById('tetris-board');
    if (!boardCanvas) return; // Exit if the canvas isn't on the page
    const boardCtx = boardCanvas.getContext('2d');
    
    const holdCanvas = document.getElementById('tetris-hold-canvas');
    const holdCtx = holdCanvas.getContext('2d');
    
    const nextCanvas = document.getElementById('tetris-next-canvas');
    const nextCtx = nextCanvas.getContext('2d');

    const scoreDisplay = document.getElementById('tetris-score-display');
    const linesDisplay = document.getElementById('tetris-lines-display');
    const levelDisplay = document.getElementById('tetris-level-display');
    
    const modalOverlay = document.getElementById('tetris-modal-overlay');
    const modalTitle = document.getElementById('tetris-modal-title');
    const modalText = document.getElementById('tetris-modal-text');
    const startButton = document.getElementById('tetris-modal-start-button');
    const tetrisPauseModal = document.getElementById('tetrispauseModal'); // Added
    
    // High Score Display Element ---
    const hiscoreDisplayEl = document.getElementById('tetrishiscoredisplay');

    // --- Game Constants ---
    const COLS = 15;
    const ROWS = 30;
    const BLOCK_SIZE = 30; // size of each block in pixels
    const NEXT_PIECE_COUNT = 4;
    const TETRIS_HIGH_SCORES_KEY = 'tetrisHighScores';
    const MAX_HIGH_SCORES = 15;

    // Adjust canvas sizes based on constants
    boardCanvas.width = COLS * BLOCK_SIZE;
    boardCanvas.height = ROWS * BLOCK_SIZE;
    
    // --- Tetrominoes (Pieces) ---
    const COLORS = [
        null,       // 0 is empty
        '#FF0D72',  // T
        '#0DC2FF',  // I
        '#0DFF72',  // O
        '#F538FF',  // L
        '#FF8E0D',  // J
        '#FFE138',  // S
        '#3877FF'   // Z
    ];

    const PIECES = [
        [], // 0 is empty
        [[0, 1, 0], [1, 1, 1], [0, 0, 0]], // T
        [[0, 0, 0, 0], [2, 2, 2, 2], [0, 0, 0, 0], [0, 0, 0, 0]], // I
        [[3, 3], [3, 3]], // O
        [[0, 0, 4], [4, 4, 4], [0, 0, 0]], // L
        [[5, 0, 0], [5, 5, 5], [0, 0, 0]], // J
        [[0, 6, 6], [6, 6, 0], [0, 0, 0]], // S
        [[7, 7, 0], [0, 7, 7], [0, 0, 0]], // Z
    ];

    // --- Game State ---
    let board = createEmptyBoard();
    let currentPiece;
    let nextPieces = [];
    let heldPiece = null;
    let canHold = true;
    let score = 0;
    let lines = 0;
    let level = 0;
    let gameOver = false;
    let isPaused = false; // Added
    let gameLoopTimeout;
    let gameSpeed;


    // --- NEW: High Score Functions ---

    function getTetrisHighScores() {
        const scoresJSON = localStorage.getItem(TETRIS_HIGH_SCORES_KEY);
        return scoresJSON ? JSON.parse(scoresJSON) : [];
    }

    function saveTetrisHighScores(scores) {
        localStorage.setItem(TETRIS_HIGH_SCORES_KEY, JSON.stringify(scores));
    }
	
    function displayTetrisHighScores() {
    const highScores = getTetrisHighScores();
    hiscoreDisplayEl.innerHTML = ''; // Clear previous content

    // Handle case with no high scores
    if (highScores.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'No high scores yet! 🙁';
        hiscoreDisplayEl.appendChild(p);
        return;
    }

    // Create table and its main sections
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Add a class to the table so it can be styled by external CSS
    table.className = 'hiscore-table';

    // --- Create Table Header ---
    const headerRow = document.createElement('tr');
    const headers = ['Rank', 'Name', 'Score', 'Lines', 'Level', 'Date'];

    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // --- Create Table Body with Scores ---
    highScores.forEach((scoreItem, index) => {
        const row = document.createElement('tr');

        // Create a cell for each piece of data
        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;

        const nameCell = document.createElement('td');
        nameCell.textContent = scoreItem.name;

        const scoreCell = document.createElement('td');
        scoreCell.textContent = scoreItem.score;

        const linesCell = document.createElement('td');
        linesCell.textContent = scoreItem.lines;

        const levelCell = document.createElement('td');
        levelCell.textContent = scoreItem.level;

        const dateCell = document.createElement('td');
        dateCell.textContent = scoreItem.timestamp;

        // Append all cells to the row
        row.appendChild(rankCell);
        row.appendChild(nameCell);
        row.appendChild(scoreCell);
        row.appendChild(linesCell);
        row.appendChild(levelCell);
        row.appendChild(dateCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    hiscoreDisplayEl.appendChild(table);
}

    function isTetrisHighScore(newScore) {
        if (newScore === 0) return false;
        const highScores = getTetrisHighScores();
        const lowestScore = highScores[MAX_HIGH_SCORES - 1]?.score ?? 0;
        return highScores.length < MAX_HIGH_SCORES || newScore > lowestScore;
    }
    
    // Utility to download canvas as a PNG
    function downloadCanvasAsImage(canvas, filename) {
        const link = document.createElement('a');
        link.download = filename;
        canvas.toBlob(function(blob) {
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        }, 'image/png');
    }

    // Generate the high score certificate
    function generateTetrisCertificate(newScoreEntry, allHighScores, gameCanvas) {
        const certCanvas = document.createElement('canvas');
        const scale = 2;
        const certWidth = 800;
        
        // --- MODIFICATION: Calculate final dimensions based on aspect ratio ---
        
        // 1. Calculate dynamic height of the certificate
        const baseHeight = 520;
        const lineHeight = 30;
        const bottomPadding = 50;
        const dynamicHeight = baseHeight + (allHighScores.length * lineHeight) + bottomPadding;
        
        // 2. Get game board aspect ratio
        const sourceWidth = gameCanvas.width;
        const sourceHeight = gameCanvas.height;
        const aspectRatio = sourceWidth / sourceHeight; // e.g., 450 / 900 = 0.5

        // 3. Calculate scaled game width based on matching the cert's dynamic height
        const gameDestHeight = dynamicHeight;
        const gameDestWidth = gameDestHeight * aspectRatio; // This is the new, correct width

        // 4. Calculate total canvas width
        const totalWidth = certWidth + gameDestWidth;

        // 5. Set final canvas dimensions
        certCanvas.width = totalWidth * scale; 
        certCanvas.height = dynamicHeight * scale;
        
        const ctx = certCanvas.getContext('2d');
        ctx.scale(scale, scale);
        // --- END MODIFICATION ---


        const fontFamily = '"Press Start 2P", cursive';
		
		const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
		const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--header-bg').trim();
		const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
        
        // --- DRAW LEFT HALF (CERTIFICATE) ---
        
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, certWidth, dynamicHeight); // Fill left half

        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 15;
        ctx.strokeRect(7.5, 7.5, certWidth - 15, dynamicHeight - 15); // Border on left half

        ctx.strokeStyle = '#fbc02d';
        ctx.lineWidth = 3;
        ctx.strokeRect(20, 20, certWidth - 40, dynamicHeight - 40); // Inner border on left half

        ctx.textAlign = 'center';
        ctx.fillStyle = primaryColor;
        ctx.font = `bold 50px ${fontFamily}`;
        ctx.fillText('HIGH SCORE', 400, 100); // 400 is center of 800

        ctx.font = `bold 35px ${fontFamily}`;
        ctx.fillStyle = primaryColor;
        ctx.fillText('TETRIS', 400, 150);

        ctx.fillStyle = '#fbc02d';
        ctx.font = `bold 40px ${fontFamily}`;
        ctx.fillText('★', 400, 190);

        ctx.font = `28px ${fontFamily}`;
        ctx.fillStyle = textColor;
        ctx.fillText('ACHIEVED BY', 400, 240);
        ctx.font = `bold 42px ${fontFamily}`;
        ctx.fillStyle = primaryColor;
        ctx.fillText(newScoreEntry.name, 400, 300);

        ctx.font = `bold 48px ${fontFamily}`;
        ctx.fillStyle = '#d84315';
        ctx.fillText(newScoreEntry.score, 400, 370);

        ctx.font = `20px "Quicksand", sans-serif`;
        ctx.fillStyle = textColor;
        ctx.fillText(`Lines: ${newScoreEntry.lines} | Level: ${newScoreEntry.level}`, 400, 405);
        ctx.fillText(newScoreEntry.timestamp, 400, 435);

        ctx.textAlign = 'left';
        ctx.font = `bold 22px ${fontFamily}`;
        ctx.fillStyle = primaryColor;
        ctx.fillText('Top Scores:', 100, 500);

        ctx.font = `18px ${fontFamily}`;
        let yPos = 535;
        allHighScores.forEach((scoreItem, index) => {
            const isNewScore = scoreItem.timestamp === newScoreEntry.timestamp;
            
            if (isNewScore) {
                ctx.fillStyle = primaryColor; 
                ctx.font = `bold 20px ${fontFamily}`;
            } else {
                ctx.fillStyle = textColor;
                ctx.font = `18px ${fontFamily}`;
            }
            
            const rank = `${index + 1}.`;
            const name = scoreItem.name;
            const scoreDetails = `${scoreItem.score} - ${scoreItem.lines} - ${scoreItem.level}`;

            ctx.textAlign = 'left';
            ctx.fillText(rank, 100, yPos);
            ctx.fillText(name, 140, yPos);

            ctx.textAlign = 'right';
            ctx.fillText(scoreDetails, certWidth - 100, yPos); // 700 (which is 800 - 100)

            yPos += 30;
        });

        // --- DRAW RIGHT HALF (GAME BOARD) ---
        // --- MODIFICATION: Draw the game board starting at certWidth and using the calculated dimensions ---
        ctx.drawImage(gameCanvas, certWidth, 0, gameDestWidth, gameDestHeight);


        // --- Download the combined canvas ---
        downloadCanvasAsImage(certCanvas, 'tetris-highscore-certificate.png');
    }

	function addTetrisHighScore(name, score, lines, level) {
        const timestamp = new Date().toLocaleString(); 
        const newScoreEntry = { name, score, lines, level, timestamp };
        const highScores = getTetrisHighScores();
        highScores.push(newScoreEntry);
        highScores.sort((a, b) => b.score - a.score);
        highScores.splice(MAX_HIGH_SCORES);
        saveTetrisHighScores(highScores);
        displayTetrisHighScores();
        
        // --- MODIFICATION: Pass the 'boardCanvas' element ---
        generateTetrisCertificate(newScoreEntry, highScores, boardCanvas);
    }

    // --- Game Logic ---

    function createEmptyBoard() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }
    
    function generatePieceBag() {
         const pieceIndices = [1, 2, 3, 4, 5, 6, 7];
         for (let i = pieceIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pieceIndices[i], pieceIndices[j]] = [pieceIndices[j], pieceIndices[i]];
         }
         return pieceIndices;
    }

    function fillNextPieces() {
        while(nextPieces.length < NEXT_PIECE_COUNT + 1) {
            generatePieceBag().forEach(index => nextPieces.push(createPiece(index)));
        }
    }
    
    function createPiece(typeIndex) {
         return {
            x: Math.floor(COLS / 2) - 1,
            y: typeIndex === 2 ? -1 : 0, // 'I' piece spawns higher
            shape: PIECES[typeIndex],
            color: COLORS[typeIndex],
            typeIndex: typeIndex
        };
    }

    function spawnNewPiece() {
        fillNextPieces();
        currentPiece = nextPieces.shift();
        
        if (!isValidMove(currentPiece.x, currentPiece.y, currentPiece.shape)) {
            gameOver = true;
            handleGameOver();
        }
    }

    function isValidMove(x, y, shape) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] > 0) {
                    const boardX = x + col;
                    const boardY = y + row;
                    if (boardX < 0 || boardX >= COLS || boardY >= ROWS || (boardY >= 0 && board[boardY][boardX] > 0)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    function rotate(piece) {
        const shape = piece.shape;
        const N = shape.length;
        const newShape = Array.from({ length: N }, () => Array(N).fill(0));

        for (let row = 0; row < N; row++) {
            for (let col = 0; col < N; col++) {
                newShape[col][N - 1 - row] = shape[row][col];
            }
        }
        return newShape;
    }

    function lockPiece() {
        currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                     if (currentPiece.y + y >= 0) {
                        board[currentPiece.y + y][currentPiece.x + x] = currentPiece.typeIndex;
                     }
                }
            });
        });
    }

    function clearLines() {
        let linesCleared = 0;
        for (let y = ROWS - 1; y >= 0; y--) {
            if (board[y].every(value => value > 0)) {
                linesCleared++;
                board.splice(y, 1);
                board.unshift(Array(COLS).fill(0));
                y++; // Re-check the same row index since a new row has been inserted
            }
        }
        if (linesCleared > 0) {
            updateScore(linesCleared);
        }
    }

    function updateScore(linesCleared) {
        const linePoints = [0, 40, 100, 300, 1200]; // 0, 1, 2, 3, 4 lines
        score += linePoints[linesCleared] * (level + 1);
        lines += linesCleared;
        level = Math.floor(lines / 10);
        
        // Update game speed based on level
        gameSpeed = Math.max(100, 500 - level * 50);

        updateUI();
    }

    function updateUI() {
        scoreDisplay.textContent = score;
        linesDisplay.textContent = lines;
        levelDisplay.textContent = level;
    }

    // --- Drawing Functions ---
    function draw() {
        if (gameOver) return;
        
        // Clear all canvases
        boardCtx.clearRect(0, 0, boardCanvas.width, boardCanvas.height);
        holdCtx.clearRect(0, 0, holdCanvas.width, holdCanvas.height);
        nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);

        drawBoard();
        drawPiece(currentPiece, boardCtx);
        drawSidePanels();
    }
	function drawBoard() {
		// --- START: ADDED CODE FOR GRID LINES ---
		boardCtx.strokeStyle = 'rgba(0, 0, 0, 0.5)'; // A subtle dark color for the grid lines
		boardCtx.lineWidth = 1;

		// Loop through each column and draw a vertical line
		for (let x = 1; x < COLS; x++) {
			boardCtx.beginPath();
			boardCtx.moveTo(x * BLOCK_SIZE, 0); // Start at the top of the canvas
			boardCtx.lineTo(x * BLOCK_SIZE, boardCanvas.height); // End at the bottom
			boardCtx.stroke();
		}
		// --- END: ADDED CODE FOR GRID LINES ---

		// This is the original code to draw the blocks
		board.forEach((row, y) => {
			row.forEach((value, x) => {
				if (value > 0) {
					drawBlock(x, y, COLORS[value], boardCtx);
				}
			});
		});
	}

    function drawPiece(piece, ctx) {
        if (!piece) return;
        ctx.fillStyle = piece.color;
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                     // Only draw blocks that are within the visible board area
                     if (piece.y + y >= 0) {
                        drawBlock(piece.x + x, piece.y + y, piece.color, ctx);
                     }
                }
            });
        });
    }
    
    function drawSidePanels() {
        // Draw Held Piece
        if (heldPiece) {
            const N = heldPiece.shape.length;
            const scale = 0.75;
            // Center the piece in the hold canvas
            const offsetX = (holdCanvas.width - N * BLOCK_SIZE * scale) / 2;
            const offsetY = (holdCanvas.height - N * BLOCK_SIZE * scale) / 2;
            
            heldPiece.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value > 0) {
                        drawBlock(x, y, heldPiece.color, holdCtx, offsetX, offsetY, scale);
                    }
                });
            });
        }
        
        // Draw Next Pieces
        let yOffset = 0;
         for (let i = 0; i < NEXT_PIECE_COUNT; i++) {
             const piece = nextPieces[i];
             if(piece) {
                const N = piece.shape.length;
                const scale = 0.75;
                const blockScaled = BLOCK_SIZE * scale;
                const pieceWidth = N * blockScaled;
                const pieceHeight = N * blockScaled;
                
                // Center the piece horizontally
                const offsetX = (nextCanvas.width - pieceWidth) / 2;
                
                piece.shape.forEach((row, y) => {
                    row.forEach((value, x) => {
                        if (value > 0) {
                            drawBlock(x, y, piece.color, nextCtx, offsetX, yOffset + 15, scale);
                        }
                    });
                });
                yOffset += pieceHeight + 15; // Add padding between pieces
             }
         }
    }

    function drawBlock(x, y, color, ctx, offsetX = 0, offsetY = 0, scale = 1) {
        ctx.fillStyle = color;
        const size = BLOCK_SIZE * scale;
        ctx.fillRect(x * size + offsetX, y * size + offsetY, size, size);
        ctx.strokeStyle = '#000'; // Black border for definition
        ctx.lineWidth = 2;
        ctx.strokeRect(x * size + offsetX, y * size + offsetY, size, size);
    }

    // --- Game Loop ---
    function gameLoop() {
        if (gameOver) return;

        // Move piece down
        if (isValidMove(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
            currentPiece.y++;
        } else {
            // Lock piece and spawn a new one
            lockPiece();
            clearLines();
            spawnNewPiece();
            canHold = true; // Allow holding a new piece
        }

        draw();
        gameLoopTimeout = setTimeout(gameLoop, gameSpeed);
    }
    
    function togglePause() {
        // Can't pause if the game is over or the start/gameover modal is showing
        if (gameOver || modalOverlay.style.display === 'flex') {
            return;
        }

        isPaused = !isPaused;

        if (isPaused) {
            clearTimeout(gameLoopTimeout);
            tetrisPauseModal.classList.remove('hidden');
            tetrisPauseModal.classList.add('flex');
        } else {
            tetrisPauseModal.classList.add('hidden');
            tetrisPauseModal.classList.remove('flex');
            gameLoop(); // Resume the game loop
        }
    }

    function handlePlayerInput(e) {
        // Only handle input if the Tetris tab is active and start modal is not shown
        if (document.getElementById('tetrispage').classList.contains('active') && modalOverlay.style.display === 'none') {
			const keyCode = e.keyCode;
			const SPACE_BAR = 32;
            const ESCAPE_KEY = 27;
			const isArrowKey = keyCode >= 37 && keyCode <= 40;
            const C_KEY = 67;
            
            if (keyCode === ESCAPE_KEY) {
                e.preventDefault();
                togglePause();
                return;
            }
            
            if (isPaused) return;

			if (isArrowKey || keyCode === SPACE_BAR || keyCode === C_KEY) {
				e.preventDefault();
			}
            if (gameOver) return;
				
            switch (keyCode) {
                case 37: // Left Arrow
                    if (isValidMove(currentPiece.x - 1, currentPiece.y, currentPiece.shape)) { currentPiece.x--; }
                    break;
                case 39: // Right Arrow
                    if (isValidMove(currentPiece.x + 1, currentPiece.y, currentPiece.shape)) { currentPiece.x++; }
                    break;
                case 40: // Down Arrow
                    if (isValidMove(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
                        currentPiece.y++;
                        score += 1; // Add score for soft drop
                        updateUI();
                    }
                    break;
                case 38: // Up Arrow (Rotate)
                    const rotatedShape = rotate(currentPiece);
                    if (isValidMove(currentPiece.x, currentPiece.y, rotatedShape)) {
                        currentPiece.shape = rotatedShape;
                    } else { // Basic wall kick
                        if (isValidMove(currentPiece.x + 1, currentPiece.y, rotatedShape)) {
                            currentPiece.x++;
                            currentPiece.shape = rotatedShape;
                        } else if (isValidMove(currentPiece.x - 1, currentPiece.y, rotatedShape)) {
                            currentPiece.x--;
                            currentPiece.shape = rotatedShape;
                        }
                    }
                    break;
                case 32: // Space (Hard Drop)
                    while(isValidMove(currentPiece.x, currentPiece.y + 1, currentPiece.shape)) {
                        currentPiece.y++;
                        score += 2; // Add more score for hard drop
                    }
                    lockPiece();
                    clearLines();
                    spawnNewPiece();
                    canHold = true;
                    updateUI();
                    break;
                case C_KEY: // 'C' key (Hold)
                     if(canHold) {
                        if (heldPiece) {
                            [currentPiece, heldPiece] = [heldPiece, currentPiece];
                            currentPiece.x = Math.floor(COLS / 2) - 1;
                            currentPiece.y = currentPiece.typeIndex === 2 ? -1 : 0;
                        } else {
                            heldPiece = currentPiece;
                            spawnNewPiece();
                        }
                        canHold = false;
                    }
                    break;
            }
            draw();
        }
    }
    
    // --- Game State Management ---
    function startGame() {
        modalOverlay.style.display = 'none';
        tetrisPauseModal.classList.add('hidden');
        tetrisPauseModal.classList.remove('flex');
        resetGame();
        gameLoop();
    }

    function resetGame() {
        clearTimeout(gameLoopTimeout);
        gameOver = false;
        isPaused = false;
        board = createEmptyBoard();
        nextPieces = [];
        heldPiece = null;
        canHold = true;
        score = 0;
        lines = 0;
        level = 0;
        gameSpeed = 500;
        
        spawnNewPiece();
        updateUI();
        draw(); // Initial draw
    }
    
    function handleGameOver() {
        clearTimeout(gameLoopTimeout);
        tetrisPauseModal.classList.add('hidden');
        tetrisPauseModal.classList.remove('flex');

        // --- NEW: High Score Check ---
        if (isTetrisHighScore(score)) {
            const playerName = prompt(`New High Score of ${score}!\nEnter your name:`);
            if (playerName && playerName.trim() !== '') {
                addTetrisHighScore(playerName.trim(), score, lines, level);
            }
        }
        
        modalTitle.textContent = "Game Over";
        modalText.innerHTML = `Your Score: ${score}<br>Play Again?`;
        startButton.textContent = "Restart";
        modalOverlay.style.display = 'flex';
    }

    // --- Event Listeners and Initial Setup ---
    document.addEventListener('keydown', handlePlayerInput);
    startButton.addEventListener('click', startGame);

    displayTetrisHighScores(); // Display scores on initial load
    
    tetrisGameInitialized = true;
}

// ==========================================================================
// HANGMAN GAME
// ==========================================================================
let hangmanGameInitialized = false; // <-- NEW LINE

function initializeHangmanGame() {
    if (hangmanGameInitialized) return; // <-- NEW LINE

    // --- DOM Element Selection ---
    const wordDisplay = document.querySelector(".hangman-word-display");
    const guessesText = document.querySelector(".hangman-guesses-text b");
    const keyboardDiv = document.querySelector(".hangman-keyboard");
    const hangmanImage = document.querySelector(".hangman-box img");
    const gameModal = document.querySelector(".hangman-modal");
    const playAgainBtn = gameModal.querySelector("button");

    // --- Game State Variables ---
    let currentWord, correctLetters, wrongGuessCount;
    const maxGuesses = 6;

    // --- Game Functions ---
    const resetGame = () => {
        // Reset all game variables and UI elements for a new round
        correctLetters = [];
        wrongGuessCount = 0;
        hangmanImage.src = "images/hangman-0.svg";
        guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
        wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
        keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
        gameModal.classList.remove("show");
    }

    const getRandomWord = () => {
        // Select a random word and hint from the wordList
        const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
        currentWord = word;
        // Ensure the hint element exists before setting its text
        const hintElement = document.querySelector(".hangman-hint-text b");
        if (hintElement) {
            hintElement.innerText = hint;
        }
        resetGame();
    }

    const gameOver = (isVictory) => {
        // Show the game over modal with victory or loss details
        const modalText = isVictory ? `You found the word:` : 'The correct word was:';
        gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
        gameModal.querySelector("h4").innerText = isVictory ? 'Congrats!' : 'Game Over!';
        gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
        gameModal.classList.add("show");
    }

    const initGame = (button, clickedLetter) => {
        // Check if the clicked letter is in the current word
        if (currentWord.includes(clickedLetter)) {
            // Update the display for all matching correct letters
            [...currentWord].forEach((letter, index) => {
                if (letter === clickedLetter) {
                    correctLetters.push(letter);
                    wordDisplay.querySelectorAll("li")[index].innerText = letter;
                    wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
                }
            });
        } else {
            // Increment wrong guess count and update the hangman image
            wrongGuessCount++;
            hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
        }

        button.disabled = true; // Disable the clicked letter button
        guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

        // Check for game over conditions
        if (wrongGuessCount === maxGuesses) return gameOver(false);
        if (correctLetters.length === currentWord.length) return gameOver(true);
    }

    // --- Initial Setup ---
    
    // Create keyboard buttons and add event listeners
    keyboardDiv.innerHTML = ''; // Clear keyboard to prevent duplicating buttons
    for (let i = 97; i <= 122; i++) {
        const button = document.createElement("button");
        const letter = String.fromCharCode(i);
        button.innerText = letter;
        keyboardDiv.appendChild(button);
        button.addEventListener("click", () => initGame(button, letter));
    }

    // Add event listener for the "Play Again" button in the modal
    playAgainBtn.addEventListener("click", getRandomWord);

    // Start the first game
    getRandomWord();

    // Set the initialized flag to true
    hangmanGameInitialized = true; // <-- NEW LINE
}


// ==========================================================================
// QUIZ GAME
// ==========================================================================
let quizGameInitialized = false; // <-- NEW LINE

function initializeQuizGame() {
    if (quizGameInitialized) return; // <-- NEW LINE

    // Selecting all required elements
    const startBtn = document.querySelector(".quiz-start_btn button");
    const infoBox = document.querySelector(".quiz-info_box");
    const exitBtn = infoBox.querySelector(".quiz-buttons .quiz-quit");
    const continueBtn = infoBox.querySelector(".quiz-buttons .quiz-restart");
    const quizBox = document.querySelector(".quiz-quiz_box");
    const resultBox = document.querySelector(".quiz-result_box");
    const optionList = document.querySelector(".quiz-option_list");
    const timeLine = document.querySelector("header .quiz-time_line");
    const timeText = document.querySelector(".quiz-timer .quiz-time_left_txt");
    const timeCount = document.querySelector(".quiz-timer .quiz-timer_sec");

    let timeValue = 15;
    let queCount = 0;
    let queNumb = 1;
    let userScore = 0;
    let counter;
    let counterLine;
    let widthValue = 0;

    const restartQuizBtn = resultBox.querySelector(".quiz-buttons .quiz-restart");
    const quitQuizBtn = resultBox.querySelector(".quiz-buttons .quiz-quit");
    const nextBtn = document.querySelector(".quiz-footer .quiz-next_btn");
    const bottomQuesCounter = document.querySelector(".quiz-footer .quiz-total_que");

    // Show info box when start button is clicked
    startBtn.onclick = () => {
        infoBox.classList.add("quiz-activeInfo");
    }

    // Hide info box when exit button is clicked
    exitBtn.onclick = () => {
        infoBox.classList.remove("quiz-activeInfo");
    }

    // Start quiz when continue button is clicked
    continueBtn.onclick = () => {
        infoBox.classList.remove("quiz-activeInfo");
        quizBox.classList.add("quiz-activeQuiz");
        startTheQuiz(); // Changed from initializeQuiz to avoid confusion
    }

    // Restart quiz when restart button is clicked
    restartQuizBtn.onclick = () => {
        resultBox.classList.remove("quiz-activeResult");
        quizBox.classList.add("quiz-activeQuiz");
        resetQuiz();
        startTheQuiz(); // Changed from initializeQuiz
    }

    // Make the quit button hide the quiz and show the start button again
    quitQuizBtn.onclick = () => {
        resultBox.classList.remove("quiz-activeResult");
        resetQuiz();
    }

    // Show next question when next button is clicked
    nextBtn.onclick = () => {
        if (queCount < questions.length - 1) {
            queCount++;
            queNumb++;
            updateQuiz();
        } else {
            clearInterval(counter);
            clearInterval(counterLine);
            showResult();
        }
    }

    function startTheQuiz() {
        showQuestions(queCount);
        queCounter(queNumb);
        startTimer(timeValue);
        startTimerLine(widthValue);
    }

    function resetQuiz() {
        timeValue = 15;
        queCount = 0;
        queNumb = 1;
        userScore = 0;
        widthValue = 0;
        // Also ensure quiz boxes are hidden and timers are cleared
        quizBox.classList.remove("quiz-activeQuiz");
        infoBox.classList.remove("quiz-activeInfo");
        resultBox.classList.remove("quiz-activeResult");
        clearInterval(counter);
        clearInterval(counterLine);
    }

    function updateQuiz() {
        showQuestions(queCount);
        queCounter(queNumb);
        clearInterval(counter);
        clearInterval(counterLine);
        startTimer(timeValue);
        startTimerLine(widthValue);
        timeText.textContent = "Time Left";
        nextBtn.classList.remove("quiz-show");
    }

    function showQuestions(index) {
        const queText = document.querySelector(".quiz-que_text");
        let queTag = `<span>${questions[index].numb}. ${questions[index].question}</span>`;
        let optionTag = questions[index].options.map(option => `<div class="quiz-option"><span>${option}</span></div>`).join('');
        queText.innerHTML = queTag;
        optionList.innerHTML = optionTag;

        optionList.querySelectorAll(".quiz-option").forEach(option => {
            option.onclick = () => optionSelected(option);
        });
    }

    function optionSelected(answer) {
        clearInterval(counter);
        clearInterval(counterLine);
        let userAns = answer.textContent;
        let correctAns = questions[queCount].answer;
        
        if (userAns === correctAns) {
            userScore++;
            answer.classList.add("quiz-correct");
            answer.insertAdjacentHTML("beforeend", tickIconTag);
        } else {
            answer.classList.add("quiz-incorrect");
            answer.insertAdjacentHTML("beforeend", crossIconTag);
            highlightCorrectAnswer(correctAns);
        }
        disableOptions();
        nextBtn.classList.add("quiz-show");
    }

    function highlightCorrectAnswer(correctAns) {
        for (let i = 0; i < optionList.children.length; i++) {
            if (optionList.children[i].textContent === correctAns) {
                optionList.children[i].classList.add("quiz-correct");
                optionList.children[i].insertAdjacentHTML("beforeend", tickIconTag);
            }
        }
    }

    function disableOptions() {
        for (let i = 0; i < optionList.children.length; i++) {
            optionList.children[i].classList.add("quiz-disabled");
        }
    }

    function showResult() {
        infoBox.classList.remove("quiz-activeInfo");
        quizBox.classList.remove("quiz-activeQuiz");
        resultBox.classList.add("quiz-activeResult");
        const scoreText = resultBox.querySelector(".quiz-score_text");
        let scoreTag = '';

        if (userScore > 3) {
            scoreTag = `<span>and congrats! 🎉, You got <span>${userScore}</span> out of <span>${questions.length}</span></span>`;
        } else if (userScore > 1) {
            scoreTag = `<span>and nice 😎, You got <span>${userScore}</span> out of <span>${questions.length}</span></span>`;
        } else {
            scoreTag = `<span>and sorry 😐, You got only <span>${userScore}</span> out of <span>${questions.length}</span></span>`;
        }
        scoreText.innerHTML = scoreTag;
    }

    function startTimer(time) {
        counter = setInterval(() => {
            timeCount.textContent = time > 9 ? time : `0${time}`;
            time--;
            if (time < 0) {
                clearInterval(counter);
                timeText.textContent = "Time Off";
                highlightCorrectAnswer(questions[queCount].answer);
                disableOptions();
                nextBtn.classList.add("quiz-show");
            }
        }, 1000);
    }

    function startTimerLine(time) {
        const totalTime = 550;
        counterLine = setInterval(() => {
            time += 1;
            let progressPercentage = (time / totalTime) * 100;
            timeLine.style.width = `${progressPercentage}%`;
            if (time >= totalTime) {
                clearInterval(counterLine);
            }
        }, 29);
    }

    function queCounter(index) {
        let totalQueCounTag = `<span> <span> ${index} </span> of <span> ${questions.length} </span> Questions </span>`;
        bottomQuesCounter.innerHTML = totalQueCounTag;
    }

    const tickIconTag = '<div class="quiz-icon quiz-tick"><i class="fas fa-check"></i></div>';
    const crossIconTag = '<div class="quiz-icon quiz-cross"><i class="fas fa-times"></i></div>';

    quizGameInitialized = true;
}

//==========================================================================
// TIC-TAC-TOE
//==========================================================================
let ticTacToeGameInitialized = false;

function initializeTicTacToeGame() {
    if (ticTacToeGameInitialized) return;

    // --- DOM Element Selection ---
    const ticSelectBox = document.querySelector(".tic-select-box"),
        ticSelectBtnX = ticSelectBox.querySelector(".tic-options .tic-playerX"),
        ticSelectBtnO = ticSelectBox.querySelector(".tic-options .tic-playerO"),
        ticPlayBoard = document.querySelector(".tic-play-board"),
        ticPlayers = document.querySelector(".tic-players"),
        ticAllBox = document.querySelectorAll(".tic-play-area section span"),
        ticResultBox = document.querySelector(".tic-result-box"),
        ticWonText = ticResultBox.querySelector(".tic-won-text"),
        ticReplayBtn = ticResultBox.querySelector(".tic-btn button");

    // --- Game State Variables ---
    let ticPlayerXIcon = "fas fa-times";
    let ticPlayerOIcon = "far fa-circle";
    let ticPlayerSign = "X";
    let ticRunBot = true;

    // --- Game Reset Function ---
    function ticResetGame() {
        ticRunBot = true;
        ticPlayerSign = "X";
        
        // Reset the board UI
        ticAllBox.forEach(box => {
            box.innerHTML = ""; // Clear the X or O icon
            box.removeAttribute("id"); // Remove the player ID
            box.style.pointerEvents = "auto"; // Re-enable clicks
        });

        // Reset the player turn indicator
        ticPlayers.classList.remove("active", "player");

        // --- FIX IS HERE ---
        // Explicitly manage the visibility of all three containers to reset the game view.
        ticResultBox.classList.remove("show"); // Hide the result box
        ticPlayBoard.classList.remove("show"); // Hide the play board
        ticSelectBox.classList.remove("hide"); // **Show the select box again**
    }

    // --- Event Listeners ---
    ticAllBox.forEach(box => {
        box.addEventListener("click", () => ticClickedBox(box));
    });

    ticSelectBtnX.onclick = () => {
        ticSelectBox.classList.add("hide");
        ticPlayBoard.classList.add("show");
    };

    ticSelectBtnO.onclick = () => {
        ticSelectBox.classList.add("hide");
        ticPlayBoard.classList.add("show");
        ticPlayers.classList.add("active", "player");
    };

    // Use the new reset function instead of reloading the page
    ticReplayBtn.onclick = ticResetGame;

    // --- Game Logic Functions ---
    function ticClickedBox(element) {
        if (ticPlayers.classList.contains("player")) {
            ticPlayerSign = "O";
            element.innerHTML = `<i class="${ticPlayerOIcon}"></i>`;
            ticPlayers.classList.remove("active");
        } else {
            ticPlayerSign = "X";
            element.innerHTML = `<i class="${ticPlayerXIcon}"></i>`;
            ticPlayers.classList.add("active");
        }
        element.setAttribute("id", ticPlayerSign);
        element.style.pointerEvents = "none";
        ticPlayBoard.style.pointerEvents = "none";
        ticSelectWinner();

        const ticRandomTimeDelay = Math.floor(Math.random() * 1000) + 200;
        setTimeout(() => {
            ticBot();
        }, ticRandomTimeDelay);
    }

    function ticBot() {
        if (ticRunBot) {
            const ticAvailableBoxes = [...ticAllBox].filter(box => !box.childElementCount);
            const ticRandomBox = ticAvailableBoxes[Math.floor(Math.random() * ticAvailableBoxes.length)];

            if (ticRandomBox) {
                if (ticPlayers.classList.contains("player")) {
                    ticPlayerSign = "X";
                    ticRandomBox.innerHTML = `<i class="${ticPlayerXIcon}"></i>`;
                    ticPlayers.classList.add("active");
                } else {
                    ticPlayerSign = "O";
                    ticRandomBox.innerHTML = `<i class="${ticPlayerOIcon}"></i>`;
                    ticPlayers.classList.remove("active");
                }
                ticRandomBox.setAttribute("id", ticPlayerSign);
                ticRandomBox.style.pointerEvents = "none";
                ticSelectWinner();
                ticPlayBoard.style.pointerEvents = "auto";
            }
        }
    }

    function ticGetIdVal(boxNumber) {
        const element = document.querySelector(".tic-box" + boxNumber);
        return element ? element.id : "";
    }

    function ticCheckIdSign(val1, val2, val3, sign) {
        return ticGetIdVal(val1) === sign && ticGetIdVal(val2) === sign && ticGetIdVal(val3) === sign;
    }

    function ticSelectWinner() {
        const ticWinningCombinations = [
            [1, 2, 3], [4, 5, 6], [7, 8, 9],
            [1, 4, 7], [2, 5, 8], [3, 6, 9],
            [1, 5, 9], [3, 5, 7]
        ];

        const ticIsWinner = ticWinningCombinations.some(combination => ticCheckIdSign(...combination, ticPlayerSign));

        if (ticIsWinner) {
            ticRunBot = false;
            setTimeout(() => {
                ticResultBox.classList.add("show");
                ticPlayBoard.classList.remove("show");
                ticWonText.innerHTML = `Player <p>${ticPlayerSign}</p> won the game!`;
            }, 700);
        } else if ([...ticAllBox].every(box => box.id)) {
            ticRunBot = false;
            setTimeout(() => {
                ticResultBox.classList.add("show");
                ticPlayBoard.classList.remove("show");
                ticWonText.textContent = "Match has been drawn!";
            }, 700);
        }
    }

    ticTacToeGameInitialized = true; // <-- NEW LINE
}

//==========================================================================
// ROCK PAPER SCISSORS
//==========================================================================
let RPSGameInitialized = false;

function RPS_initializeGame() {
  if (RPSGameInitialized) return;

  // Get DOM elements
  const RPS_gameContainer = document.querySelector(".RPS-container");
  const RPS_userResult = document.querySelector(".RPS-user_result img");
  const RPS_botResult = document.querySelector(".RPS-bot_result img");
  const RPS_result = document.querySelector(".RPS-result");
  const RPS_optionImages = document.querySelectorAll(".RPS-option_image");

  // Define possible images and outcomes
  const RPS_botImages = ["images/rock.png", "images/paper.png", "images/scissors.png"];
  const RPS_outcomes = {
    RR: "Draw",
    RP: "BOT",
    RS: "YOU",
    PP: "Draw",
    PR: "YOU",
    PS: "BOT",
    SS: "Draw",
    SR: "BOT",
    SP: "YOU",
  };

  // Event handler for image click
  function RPS_handleOptionClick(event) {
    const clickedImage = event.currentTarget;
    const clickedIndex = Array.from(RPS_optionImages).indexOf(clickedImage);

    // Reset results and display "Wait..."
    RPS_userResult.src = RPS_botResult.src = "images/rock.png";
    RPS_result.textContent = "Wait...";

    // Activate clicked image and deactivate others
    RPS_optionImages.forEach((image, index) => {
      image.classList.toggle("RPS-active", index === clickedIndex);
    });

    RPS_gameContainer.classList.add("RPS-start");

    setTimeout(() => {
      RPS_gameContainer.classList.remove("RPS-start");

      // Set user and bot images
      const userImageSrc = clickedImage.querySelector("img").src;
      RPS_userResult.src = userImageSrc;

      const randomNumber = Math.floor(Math.random() * RPS_botImages.length);
      const botImageSrc = RPS_botImages[randomNumber];
      RPS_botResult.src = botImageSrc;

      // Determine the result
      const userValue = ["R", "P", "S"][clickedIndex];
      const botValue = ["R", "P", "S"][randomNumber];
      const outcomeKey = userValue + botValue;
      const outcome = RPS_outcomes[outcomeKey] || "Unknown";

      // Display the result
      RPS_result.textContent = userValue === botValue ? "Match Draw" : `${outcome} WON!`;
    }, 2500);
  }

  // Attach event listeners to option images
  RPS_optionImages.forEach((image) => {
    image.addEventListener("click", RPS_handleOptionClick);
  });

  RPSGameInitialized = true; // <-- NEW LINE
}

//==========================================================================
// DICE ROLLER
//==========================================================================
let diceRollerInitialized = false; // <-- NEW LINE

    function initialiseDicerRoller() {
        if (diceRollerInitialized) return; // <-- NEW LINE

        // --- Configuration ---
        const diceTypes = [4, 6, 8, 10, 12, 20];
        const animationDuration = 1500; // Must match CSS animation duration in ms
        // Regex for parsing a freeform dice term, e.g., "2d8*2[fire]"
        const termRegex = /^(\d*d\d+)(?:\s*([*/])\s*(\d+))?(?:\s*\[([^\]]+)\])?$/i;

        // --- Element References ---
        const controlsContainer = document.getElementById('dice-controls');
        const rollButton = document.getElementById('dice-roll-button');
        const diceMat = document.getElementById('dice-dice-mat');
        const totalResultEl = document.getElementById('dice-total-result');
        const breakdownEl = document.getElementById('dice-breakdown');
        const freeformInputEl = document.getElementById('dice-freeform-input');
        const freeformRollButtonEl = document.getElementById('dice-freeform-roll-button');

        // --- Event Handler for Quantity Buttons ---
        const handleQuantityChange = (e) => {
            if (!e.target.classList.contains('dice-qty-btn')) return;

            const sides = e.target.dataset.sides;
            const action = e.target.dataset.action;
            const input = document.getElementById(`dice-d${sides}-qty`);
            let currentValue = parseInt(input.value);

            if (action === 'increment') {
                input.value = currentValue + 1;
            } else if (action === 'decrement' && currentValue > 0) {
                input.value = currentValue - 1;
            }
        };
        
        /**
         * Performs all dice rolls, calculates totals, and manages animations.
         * @param {Array} jobs - A list of roll operations to perform.
         * @param {boolean} isFreeform - Flag to determine output formatting.
         */
        // --- SHARED Roll and Animate Function ---
        const rollAndAnimate = (jobs, isFreeform) => {
            diceMat.innerHTML = '';
            totalResultEl.textContent = '...';
            breakdownEl.textContent = '';
            rollButton.disabled = true;
            freeformRollButtonEl.disabled = true;

            if (jobs.length === 0) {
                totalResultEl.textContent = '0';
                rollButton.disabled = false;
                freeformRollButtonEl.disabled = false;
                return;
            }
            
            let overallTotal = 0;
            const freeformBreakdown = []; // For " (1,2)=6[tag] " style
            const standardBreakdown = []; // For " 1, 2, ... " style
            const allDiceForAnimation = []; // Flat array of all dice to animate
            
            // --- Phase 1: Perform all calculations ---
            jobs.forEach((job) => {
                if (job.modifier) {
                    // This is a simple number modifier (e.g., "+5")
                    overallTotal += job.modifier;
                    if (isFreeform) {
                        freeformBreakdown.push(job.modifier.toString());
                    }
                } else if (job.dice) {
                    // This is a dice roll job
                    const individualRolls = [];
                    let termTotal = 0;
                    
                    job.dice.forEach(die => {
                        const result = Math.floor(Math.random() * die.sides) + 1;
                        individualRolls.push(result);
                        termTotal += result;
                        standardBreakdown.push(result); // Add to standard breakdown regardless
                        allDiceForAnimation.push({ sides: die.sides, result: result });
                    });
                    
                    let finalTermTotal = termTotal;
                    let breakdownString = `(${individualRolls.join(', ')})`;
                    
                    if (isFreeform) {
                        if (job.operator) {
                            if (job.operator === '*') {
                                finalTermTotal *= job.modValue;
                            } else if (job.operator === '/') {
                                finalTermTotal = Math.floor(finalTermTotal / job.modValue);
                            }
                        }
                        
                        // --- FIX IS HERE ---
                        // Always add the final total *before* the tag.
                        breakdownString += `=${finalTermTotal}`;
                        
                        if (job.tag) {
                            breakdownString += `[${job.tag}]`;
                        }
                        
                        overallTotal += finalTermTotal;
                        freeformBreakdown.push(breakdownString);
                    } else {
                        overallTotal += termTotal; // Standard roll just sums the dice
                    }
                }
            });
            
            // --- Phase 2: Animate ---
            if (allDiceForAnimation.length === 0) {
                // Handle case with only modifiers (e.g., "5+2")
                totalResultEl.textContent = overallTotal;
                if (isFreeform) {
                    breakdownEl.textContent = freeformBreakdown.join(', ');
                }
                rollButton.disabled = false;
                freeformRollButtonEl.disabled = false;
                return;
            }

            let completedRolls = 0;
            allDiceForAnimation.forEach((die, index) => {
                const dieEl = document.createElement('div');
                
                // --- MODIFICATION: Use d10 icon for d100 ---
                const iconClass = (die.sides === 100) ? 'dice-d10' : `dice-d${die.sides}`;
                dieEl.classList.add('dice-die', iconClass);
                // --- END MODIFICATION ---
                
                setTimeout(() => {
                    dieEl.classList.add('dice-rolling');
                    diceMat.appendChild(dieEl);
                    
                    const interval = setInterval(() => {
                        dieEl.innerHTML = `<span>${Math.floor(Math.random() * die.sides) + 1}</span>`;
                    }, 100);

                    setTimeout(() => {
                        clearInterval(interval);
                        dieEl.classList.remove('dice-rolling');
                        dieEl.innerHTML = `<span>${die.result}</span>`; // Show final pre-calculated result
                        completedRolls++;

                        if (completedRolls === allDiceForAnimation.length) {
                            // All animations are done, show final results
                            totalResultEl.textContent = overallTotal;
                            if (isFreeform) {
                                breakdownEl.textContent = freeformBreakdown.join(', ');
                            } else {
                                breakdownEl.textContent = `Rolls: ${standardBreakdown.sort((a, b) => a - b).join(', ')}`;
                            }
                            rollButton.disabled = false;
                            freeformRollButtonEl.disabled = false;
                        }
                    }, animationDuration);
                }, index * 60); // Stagger start time
            });
        };

        // --- Main Roll Function (for bottom controls) ---
        const handleRoll = () => {
            const allDice = [];
            document.querySelectorAll('.dice-qty-input').forEach(input => {
                const sides = parseInt(input.dataset.sides);
                const quantity = parseInt(input.value);
                for (let i = 0; i < quantity; i++) {
                    allDice.push({ sides });
                }
            });
            
            if (allDice.length === 0) return;
            // Create a single job with all dice and no modifiers
            const jobs = [{ dice: allDice, operator: null, modValue: null, tag: null }];
            rollAndAnimate(jobs, false); // Call with isFreeform = false
        };
        
        // --- Free-Form Roll Function ---
        const handleFreeformRoll = () => {
            const inputString = freeformInputEl.value;
            if (!inputString) return;
            
            const jobs = [];
            const terms = inputString.split('+'); // Split by "+"
            
            for (const term of terms) {
                const trimmedTerm = term.trim().replace(/^\(|\)$/g, ''); // Trim and remove outer ()
                
                const match = trimmedTerm.match(termRegex);
                
                if (match) {
                    // It's a dice expression, e.g., "2d8*2[fire]"
                    const diceNotation = match[1];
                    const operator = match[2] || null;
                    const modValue = match[3] ? parseInt(match[3]) : null;
                    const tag = match[4] || null;
                    
                    const [qtyStr, sidesStr] = diceNotation.toLowerCase().split('d');
                    const quantity = parseInt(qtyStr) || 1;
                    const sides = parseInt(sidesStr);

                    // --- MODIFICATION: Allow d100 in freeform parser ---
                    if (isNaN(sides) || (!diceTypes.includes(sides) && sides !== 100)) {
                        alert(`Invalid dice type in '${trimmedTerm}'. Only d${diceTypes.join(', ')}, d100 are supported.`);
                        return;
                    }
                    // --- END MODIFICATION ---
                    
                    const diceList = [];
                    for (let i = 0; i < quantity; i++) {
                        diceList.push({ sides });
                    }
                    jobs.push({ dice: diceList, operator, modValue, tag });
                    
                } else if (trimmedTerm) {
                    // It's a plain modifier, e.g., "5"
                    const mod = parseInt(trimmedTerm);
                    if (isNaN(mod)) {
                        alert(`Invalid term: '${trimmedTerm}'.`);
                        return;
                    }
                    jobs.push({ modifier: mod });
                }
            }
            
            rollAndAnimate(jobs, true); // Call with isFreeform = true
        };

        // --- Initialization ---
        // generateControls(); // <-- This line is removed
        controlsContainer.addEventListener('click', handleQuantityChange);
        rollButton.addEventListener('click', handleRoll);
        freeformRollButtonEl.addEventListener('click', handleFreeformRoll);
        
        freeformInputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleFreeformRoll();
            }
        });
        
        diceRollerInitialized = true; // <-- NEW LINE
    } // End of initialiseDicerRoller function

// ==========================================================================
//  SETTLEMENT GENERATOR
// ==========================================================================
	/**
 * Initializes the settlement generator, attaching all event listeners
 * and setting up the necessary functions.
 * Call this function when you want to "activate" the generator
 * (e.g., when its tab is clicked).
 */
function initializeSettlementGenerator() {

    // --- GLOBAL STATE ---
    let currentSettlement = {
        name: null,
        type: null,
        location: null,
        population: null,
        government: null,
        economy: null,
        vibe: null,
        landmark: null,
        problem: null
    };

    // --- HELPER FUNCTION ---
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const setOutput = (id, text, isPlaceholder = false) => {
        const el = document.getElementById(id);
        if (el) { // Add safety check
            el.textContent = text;
            if (isPlaceholder) {
                el.classList.add('placeholder-text');
            } else {
                el.classList.remove('placeholder-text');
            }
        }
    };

    // --- GENERATOR FUNCTIONS ---
    function generateName() {
        const name = `${getRandom(namePrefixes)}${getRandom(nameSuffixes)}`;
        currentSettlement.name = name;
        setOutput('output-name', name);
        return name;
    }

    function generateType() {
        const type = getRandom(settlementTypes);
        currentSettlement.type = type;
        setOutput('output-type', type.name);
        return type;
    }

    function generateLocation() {
        const location = getRandom(locations);
        currentSettlement.location = location;
        setOutput('output-location', location.name);
        return location;
    }

    function generatePopulation() {
        const population = getRandom(populations);
        currentSettlement.population = population;
        setOutput('output-population', population.name);
        return population;
    }

    function generateGovernment() {
        const government = getRandom(governments);
        currentSettlement.government = government;
        setOutput('output-government', government.name);
        return government;
    }

    function generateEconomy() {
        const economy = getRandom(economies);
        currentSettlement.economy = economy;
        setOutput('output-economy', economy.name);
        return economy;
    }

    function generateVibe() {
        const vibe = getRandom(vibes);
        currentSettlement.vibe = vibe;
        setOutput('output-vibe', vibe.name);
        return vibe;
    }

    function generateLandmark() {
        const landmark = getRandom(landmarks);
        currentSettlement.landmark = landmark;
        setOutput('output-landmark', landmark.name);
        return landmark;
    }

    function generateProblem() {
        const problem = getRandom(problems);
        currentSettlement.problem = problem;
        setOutput('output-problem', problem.name);
        return problem;
    }

    // --- NARRATIVE ASSEMBLY ---
    function assembleDescription() {
        const { name, type, location, population, government, economy, vibe, landmark, problem } = currentSettlement;
        const outputDiv = document.getElementById('final-output');

        if (!outputDiv) return; // Safety check

        if (!name || !type || !location || !population || !government || !economy || !vibe || !landmark || !problem) {
            outputDiv.innerHTML = `<p>Click 'Generate All' or generate each module above to create your settlement description.</p>`;
            outputDiv.classList.add('placeholder-text');
            return;
        }

        outputDiv.classList.remove('placeholder-text');

        let html = `
            <p><strong>${name}</strong>, a ${type.desc} of roughly ${type.pop} souls, is ${location.desc}.</p>
            <p>It is home to ${population.desc}. The settlement ${government.desc}, and its people ${economy.desc}.</p>
            <p>Visitors to ${name} immediately notice ${vibe.desc}. The entire skyline is ${landmark.desc}.</p>
            <p class="text-yellow-300/80"><strong>Adventure Hook:</strong> Lately, the townsfolk have been worried, as ${problem.desc}.</p>
        `;

        outputDiv.innerHTML = html;
    }

    // --- EVENT LISTENERS ---

    // Individual Generator Buttons
    document.getElementById('gen-name').addEventListener('click', () => {
        generateName();
        assembleDescription();
    });
    document.getElementById('gen-type').addEventListener('click', () => {
        generateType();
        assembleDescription();
    });
    document.getElementById('gen-location').addEventListener('click', () => {
        generateLocation();
        assembleDescription();
    });
    document.getElementById('gen-population').addEventListener('click', () => {
        generatePopulation();
        assembleDescription();
    });
    document.getElementById('gen-government').addEventListener('click', () => {
        generateGovernment();
        assembleDescription();
    });
    document.getElementById('gen-economy').addEventListener('click', () => {
        generateEconomy();
        assembleDescription();
    });
    document.getElementById('gen-vibe').addEventListener('click', () => {
        generateVibe();
        assembleDescription();
    });
    document.getElementById('gen-landmark').addEventListener('click', () => {
        generateLandmark();
        assembleDescription();
    });
    document.getElementById('gen-problem').addEventListener('click', () => {
        generateProblem();
        assembleDescription();
    });

    // Master "Generate All"
    document.getElementById('generate-all').addEventListener('click', () => {
        generateName();
        generateType();
        generateLocation();
        generatePopulation();
        generateGovernment();
        generateEconomy();
        generateVibe();
        generateLandmark();
        generateProblem();
        assembleDescription();
    });

    // Master "Reset"
    document.getElementById('reset-all').addEventListener('click', () => {
        currentSettlement = {
            name: null, type: null, location: null, population: null,
            government: null, economy: null, vibe: null, landmark: null, problem: null
        };
        
        const outputs = ['name', 'type', 'location', 'population', 'government', 'economy', 'vibe', 'landmark', 'problem'];
        outputs.forEach(id => {
            setOutput(`output-${id}`, 'Click to generate...', true);
        });
        
        const outputDiv = document.getElementById('final-output');
        if (outputDiv) {
            outputDiv.innerHTML = `<p>Click 'Generate All' or generate each module above to create your settlement description.</p>`;
            outputDiv.classList.add('placeholder-text');
        }
    });

    // NOTE: The initial placeholder text is already set in the HTML file,
    // so there's no need to run the reset logic immediately on initialization.
    // The page will load with the correct placeholders.
    // This function's only job is to attach the listeners.
}