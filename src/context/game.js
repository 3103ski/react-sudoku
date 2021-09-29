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
	let indexList = [];
	let limit;
	switch (difficulty) {
		case 'easy':
			limit = 35;
			break;
		case 'hard':
			limit = 15;
			break;
		case 'medium':
			limit = 25;
			break;
		default:
			limit = 25;
			break;
	}
	while (indexList.length < limit) {
		let num = Math.floor(Math.random() * 80);
		if (!indexList.includes(num)) {
			indexList.push(num);
		}
	}
	return indexList;
}

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
		case 'END_GAME':
			return updateObj(state, { gameComplete: true, cells, focusCell: null });
		case 'NEW_PUZZLE':
			return updateObj(state, { clues, puzzleAnswers, cells, gameComplete: false });
		default:
			return state;
	}
};

const GameContext = createContext(initialState);

const GameProvider = (props) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const setDifficult = (difficulty) => dispatch({ type: 'SET_DIFFICULTY', difficulty });
	const setFocusCell = (focusCell) => dispatch({ type: 'SET_FOCUS_CELL', focusCell });
	const newPuzzle = () => {
		let puzzleAnswers = generateSudoku();
		let clues = buildClueArray(state.difficulty);
		let cells = generateCells(puzzleAnswers);

		return dispatch({ type: 'NEW_PUZZLE', clues, cells, puzzleAnswers });
	};

	const checkPuzzle = () => {
		let wrongAnswerCount = state.cells
			.filter((c) => !state.clues.includes(c.cellIndex))
			.filter((cell) => cell.answer !== cell.correctAnswer).length;

		dispatch({ type: 'CHECK_PUZZLE', wrongAnswerCount });

		if (wrongAnswerCount > 0) {
			setTimeout(() => dispatch({ type: 'CHECK_PUZZLE', wrongAnswerCount: null }), 2000);
		}
	};

	const endGame = () => {
		let cells = state.cells.map((cell) => ({ ...cell, answer: cell.correctAnswer }));
		return dispatch({ type: 'END_GAME', cells });
	};

	const updateCellAnswer = (newCell) => {
		let cells = state.cells.map((cell) =>
			cell.cellIndex === newCell.cellIndex ? newCell : cell
		);
		return dispatch({ type: 'UPDATE_CELL_VALUES', cells });
	};

	return (
		<GameContext.Provider
			value={{
				puzzleAnswers: state.puzzleAnswers,
				cells: state.cells,
				clues: state.clues,
				flaggedBoxes: state.flaggedBoxes,
				focusCell: state.focusCell,
				wrongAnswerCount: state.wrongAnswerCount,
				gameComplete: state.gameComplete,
				setDifficult,
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
