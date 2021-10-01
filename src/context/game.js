import React, { createContext, useReducer } from 'react';

import { updateObj } from '../util/util.js';
import { generateSudoku, returnBlock, returnRow, returnCol } from '../util/sudokuFunctions.js';

const initialState = {
	puzzleAnswers: generateSudoku(),
	difficulty: 'medium',
	cells: null,
	clues: null,
	focusCell: null,
	wrongAnswerCount: null,
	gameComplete: false,
};

initialState.cells = generateCells(initialState.puzzleAnswers);
initialState.clues = buildClueArray(initialState.difficulty);

//•••••••••••••••••••
// •• Game Utilities
//•••••••••••••••••••
function generateCells(puzzleAnswers) {
	return puzzleAnswers.map((cell, i) => ({
		correctAnswer: cell,
		row: returnRow(i),
		col: returnCol(i),
		block: returnBlock(i),
		answer: null,
		cellIndex: i,
	}));
}

function buildClueArray(difficulty) {
	let [indexList, limit] = [[], null];

	switch (difficulty) {
		case 'easy':
			limit = 35;
			break;
		case 'hard':
			limit = 15;
			break;
		default:
			limit = 25;
			break;
	}

	while (indexList.length < limit) {
		let num = Math.floor(Math.random() * 80);
		if (!indexList.includes(num)) indexList.push(num);
	}

	return indexList;
}

//•••••••••••••••••••••••
// •• Build game reducer
//•••••••••••••••••••••••
const reducer = (
	state,
	{ type, clues, puzzleAnswers, wrongAnswerCount, difficulty, cells, focusCell }
) => {
	switch (type) {
		case 'UPDATE_CELL_VALUES':
			return updateObj(state, { cells });
		case 'SET_FOCUS_CELL':
			return updateObj(state, { focusCell });
		case 'CHECK_PUZZLE':
			return updateObj(state, { wrongAnswerCount });
		case 'SET_DIFFICULTY':
			return updateObj(state, { difficulty });
		case 'NEW_PUZZLE':
			return updateObj(state, { clues, puzzleAnswers, cells, gameComplete: false });
		case 'END_GAME':
			return updateObj(state, { gameComplete: true, cells, focusCell: null });
		default:
			return state;
	}
};

const GameContext = createContext(initialState);

const GameProvider = (props) => {
	// •• Game State
	const [state, dispatch] = useReducer(reducer, initialState);

	// •• Game Options
	const setDifficulty = async (difficulty) => {
		await dispatch({ type: 'SET_DIFFICULTY', difficulty });
	};

	//••••••••••••••••••
	// •• Puzzle & Game
	//••••••••••••••••••

	// Create new puzzle
	const newPuzzle = () => {
		const puzzleAnswers = generateSudoku();
		let [clues, cells] = [buildClueArray(state.difficulty), generateCells(puzzleAnswers)];

		return dispatch({ type: 'NEW_PUZZLE', clues, cells, puzzleAnswers });
	};

	// Check if the values entered by user are correct and provide wrong answer count
	const checkPuzzle = () => {
		let wrongAnswerCount = state.cells
			.filter((c) => !state.clues.includes(c.cellIndex))
			.filter((cell) => cell.answer !== cell.correctAnswer).length;

		dispatch({ type: 'CHECK_PUZZLE', wrongAnswerCount });

		if (wrongAnswerCount > 0)
			setTimeout(() => dispatch({ type: 'CHECK_PUZZLE', wrongAnswerCount: null }), 2000);
	};

	// End the game when the user clicks the end button
	const endGame = () =>
		dispatch({
			type: 'END_GAME',
			cells: state.cells.map((cell) => ({ ...cell, answer: cell.correctAnswer })),
		});

	//••••••••••
	// •• Cells
	//••••••••••

	// toggle or select focus cell's when clicking around the window or board
	const setFocusCell = (focusCell) => dispatch({ type: 'SET_FOCUS_CELL', focusCell });

	// Recieve an updated cell from cell component and update stored cells in state
	const updateCellAnswer = (newCell) =>
		dispatch({
			type: 'UPDATE_CELL_VALUES',
			cells: state.cells.map((cell) =>
				cell.cellIndex === newCell.cellIndex ? newCell : cell
			),
		});

	// TODO -

	return (
		<GameContext.Provider
			value={{
				puzzleAnswers: state.puzzleAnswers,
				cells: state.cells,
				clues: state.clues,
				difficulty: state.difficulty,
				flaggedBoxes: state.flaggedBoxes,
				focusCell: state.focusCell,
				wrongAnswerCount: state.wrongAnswerCount,
				gameComplete: state.gameComplete,
				setDifficulty,
				setFocusCell,
				updateCellAnswer,
				checkPuzzle,
				newPuzzle,
				endGame,
			}}
			{...props}
		/>
	);
};

export { GameContext, GameProvider };
