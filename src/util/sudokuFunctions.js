/* eslint-disable no-array-constructor */

// given a sudoku cell, returns the row
export function returnRow(cell) {
	return Math.floor(cell / 9);
}

// given a sudoku cell, returns the column
export function returnCol(cell) {
	return cell % 9;
}

// given a sudoku cell, returns the 3x3 block
export function returnBlock(cell) {
	return Math.floor(returnRow(cell) / 3) * 3 + Math.floor(returnCol(cell) / 3);
}

// given a number, a row and a sudoku, returns true if the number can be placed in the row
export function isPossibleRow(number, row, sudoku) {
	for (var i = 0; i <= 8; i++) {
		if (sudoku[row * 9 + i] === number) {
			return false;
		}
	}
	return true;
}

// given a number, a column and a sudoku, returns true if the number can be placed in the column
export function isPossibleCol(number, col, sudoku) {
	for (var i = 0; i <= 8; i++) {
		if (sudoku[col + 9 * i] === number) {
			return false;
		}
	}
	return true;
}

// given a number, a 3x3 block and a sudoku, returns true if the number can be placed in the block
export function isPossibleBlock(number, block, sudoku) {
	for (var i = 0; i <= 8; i++) {
		if (
			sudoku[
				Math.floor(block / 3) * 27 + (i % 3) + 9 * Math.floor(i / 3) + 3 * (block % 3)
			] === number
		) {
			return false;
		}
	}
	return true;
}

// given a cell, a number and a sudoku, returns true if the number can be placed in the cell
export function isPossibleNumber(cell, number, sudoku) {
	var row = returnRow(cell);
	var col = returnCol(cell);
	var block = returnBlock(cell);
	return (
		isPossibleRow(number, row, sudoku) &&
		isPossibleCol(number, col, sudoku) &&
		isPossibleBlock(number, block, sudoku)
	);
}

// given a row and a sudoku, returns true if it's a legal row
export function isCorrectRow(row, sudoku) {
	var rightSequence = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
	var rowTemp = new Array();
	for (var i = 0; i <= 8; i++) {
		rowTemp[i] = sudoku[row * 9 + i];
	}
	rowTemp.sort();
	return rowTemp.join() === rightSequence.join();
}

// given a column and a sudoku, returns true if it's a legal column
export function isCorrectCol(col, sudoku) {
	var rightSequence = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
	var colTemp = new Array();
	for (var i = 0; i <= 8; i++) {
		colTemp[i] = sudoku[col + i * 9];
	}
	colTemp.sort();
	return colTemp.join() === rightSequence.join();
}

// given a 3x3 block and a sudoku, returns true if it's a legal block
export function isCorrectBlock(block, sudoku) {
	var rightSequence = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9);
	var blockTemp = new Array();
	for (var i = 0; i <= 8; i++) {
		blockTemp[i] =
			sudoku[Math.floor(block / 3) * 27 + (i % 3) + 9 * Math.floor(i / 3) + 3 * (block % 3)];
	}
	blockTemp.sort();
	return blockTemp.join() === rightSequence.join();
}

// given a sudoku, returns true if the sudoku is solved
export function isSolvedSudoku(sudoku) {
	for (var i = 0; i <= 8; i++) {
		if (!isCorrectBlock(i, sudoku) || !isCorrectRow(i, sudoku) || !isCorrectCol(i, sudoku)) {
			return false;
		}
	}
	return true;
}

// given a cell and a sudoku, returns an array with all possible values we can write in the cell
export function determinePossibleValues(cell, sudoku) {
	var possible = new Array();
	for (var i = 1; i <= 9; i++) {
		if (isPossibleNumber(cell, i, sudoku)) {
			possible.unshift(i);
		}
	}
	return possible;
}

// given an array of possible values assignable to a cell, returns a random value picked from the array
export function determineRandomPossibleValue(possible, cell) {
	var randomPicked = Math.floor(Math.random() * possible[cell].length);
	return possible[cell][randomPicked];
}

// given a sudoku, returns a two dimension array with all possible values
export function scanSudokuForUnique(sudoku) {
	var possible = new Array();
	for (var i = 0; i <= 80; i++) {
		if (sudoku[i] === 0) {
			possible[i] = new Array();
			possible[i] = determinePossibleValues(i, sudoku);
			if (possible[i].length === 0) {
				return false;
			}
		}
	}
	return possible;
}

// given an array and a number, removes the number from the array
export function removeAttempt(attemptArray, number) {
	var newArray = new Array();
	for (var i = 0; i < attemptArray.length; i++) {
		if (attemptArray[i] !== number) {
			newArray.unshift(attemptArray[i]);
		}
	}
	return newArray;
}

// given a two dimension array of possible values, returns the index of a cell where there are the less possible numbers to choose from
export function nextRandom(possible) {
	var max = 9;
	var minChoices = 0;
	for (var i = 0; i <= 80; i++) {
		if (possible[i] !== undefined) {
			if (possible[i].length <= max && possible[i].length > 0) {
				max = possible[i].length;
				minChoices = i;
			}
		}
	}
	return minChoices;
}

// given a sudoku, solve it
export function generateSudoku() {
	var sudoku = new Array(81).fill(0);
	var saved = new Array();
	var savedSudoku = new Array();

	var nextMove;
	var whatToTry;
	var attempt;
	while (!isSolvedSudoku(sudoku) || sudoku.includes(0)) {
		nextMove = scanSudokuForUnique(sudoku);
		if (nextMove === false) {
			nextMove = saved.pop();
			sudoku = savedSudoku.pop();
		}
		whatToTry = nextRandom(nextMove);
		attempt = determineRandomPossibleValue(nextMove, whatToTry);
		if (nextMove[whatToTry].length > 1) {
			nextMove[whatToTry] = removeAttempt(nextMove[whatToTry], attempt);
			saved.push(nextMove.slice());
			savedSudoku.push(sudoku.slice());
		}
		sudoku[whatToTry] = attempt;
	}
	return sudoku;
}
