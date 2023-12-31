document.addEventListener('DOMContentLoaded', function () {
  const puzzleContainer = document.getElementById('puzzle-container');
  const gridSizeButtons = document.querySelectorAll('.grid-size-button');

  let gridSize = parseInt(localStorage.getItem('gridSize')) || 3; // Retrieve gridSize from localStorage
  let emptyIndex = parseInt(localStorage.getItem('emptyIndex')) || gridSize * gridSize - 1;

  function createPuzzle() {
    puzzleContainer.innerHTML = '';

    const totalPieces = gridSize * gridSize;
    const pieceSize = 100 / gridSize;

    puzzleContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    puzzleContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    const numbers = Array.from({ length: totalPieces }, (_, i) => i + 1); // Adjusted to start from 1

    for (let i = 0; i < totalPieces; i++) {
      const piece = document.createElement('div');
      piece.className = 'puzzle-piece';
      piece.style.fontSize = `${6 / gridSize}vh`;

      const row = Math.floor(i / gridSize) + 1;
      const col = (i % gridSize) + 1;

      if (i === emptyIndex) {
        piece.classList.add('empty');
        piece.textContent = '';
      } else {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        piece.textContent = numbers[randomIndex];
        numbers.splice(randomIndex, 1);
      }

      piece.addEventListener('click', () => movePiece(i));

      puzzleContainer.appendChild(piece);
    }

    gridSizeButtons.forEach((button) => {
      button.classList.remove('active');
      if (parseInt(button.dataset.size) === gridSize) {
        button.classList.add('active');
      }
    });
  }

  function randomize(iterationCount) {
    for (let i = 0; i < iterationCount; i++) {
      const adjacentPieces = getAdjacentPieces(emptyIndex);
      const randomIndex = adjacentPieces[Math.floor(Math.random() * adjacentPieces.length)];
      swapElements(puzzleContainer.children[randomIndex], puzzleContainer.children[emptyIndex]);
      emptyIndex = randomIndex;
    }
  }

  function getAdjacentPieces(index) {
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const adjacentPieces = [];

    if (row > 0) adjacentPieces.push(index - gridSize); // Top
    if (row < gridSize - 1) adjacentPieces.push(index + gridSize); // Bottom
    if (col > 0) adjacentPieces.push(index - 1); // Left
    if (col < gridSize - 1) adjacentPieces.push(index + 1); // Right

    return adjacentPieces.filter((adjacentIndex) => {
      const piece = puzzleContainer.children[adjacentIndex];
      return piece.classList.contains('empty');
    });
  }

  function movePiece(index) {
    const piece = puzzleContainer.children[index];

    if (isAdjacent(index, emptyIndex)) {
      if (!piece.classList.contains('empty')) {
        piece.classList.add('clicked');
        setTimeout(() => {
          piece.classList.remove('clicked');
        }, 300);

        swapElements(piece, puzzleContainer.children[emptyIndex]);
        emptyIndex = index; // Update emptyIndex

        if (isPuzzleSolved()) {
          alert('Congratulations! Puzzle Solved!');
        }

        // Save the current state to localStorage
        localStorage.setItem('gridSize', gridSize);
        localStorage.setItem('emptyIndex', emptyIndex);
      }
    }
  }

  function isAdjacent(index1, index2) {
    const row1 = Math.floor(index1 / gridSize);
    const col1 = index1 % gridSize;
    const row2 = Math.floor(index2 / gridSize);
    const col2 = index2 % gridSize;

    return (
      (Math.abs(row1 - row2) === 1 && col1 === col2) ||
      (Math.abs(col1 - col2) === 1 && row1 === row2)
    );
  }

  function swapElements(element1, element2) {
    const temp = element1.textContent;
    element1.textContent = element2.textContent;
    element2.textContent = temp;

    element1.classList.toggle('empty');
    element2.classList.toggle('empty');
  }

  function isPuzzleSolved() {
    for (let i = 0; i < gridSize * gridSize - 1; i++) {
      const piece = puzzleContainer.children[i];
      if (piece.textContent !== '' && parseInt(piece.textContent) !== i + 1) {
        return false;
      }
    }
    return true;
  }

  function setGridSize(size) {
    gridSize = size;
    emptyIndex = gridSize * gridSize - 1;
    localStorage.setItem('gridSize', gridSize); // Save gridSize to localStorage
    localStorage.setItem('emptyIndex', emptyIndex); // Save emptyIndex to localStorage
    createPuzzle();
    randomize(100);
  }

  gridSizeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      gridSizeButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      setGridSize(parseInt(button.dataset.size));
    });
  });

  createPuzzle();
  randomize(100);
});
