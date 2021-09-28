import React, { createContext, useReducer } from 'react';
import { updateObj } from '../util/util.js';
import { generateSudoku, returnBlock, returnRow, returnCol } from '../util/sudokuFunctions.js';

const initialState = {
	puzzleAnswers: generateSudoku(),
	cells: null,
	difficulty: 'medium',
	clues: buildClueArray(6),
	focusCell: null,
	showAnswers: false,
	checkAnswers: false,
	wrongAnswerCount: null,
};

initialState.cells = initialState.puzzleAnswers.map((cell, i) => ({
	correctAnswer: cell,
	row: returnRow(i),
	col: returnCol(i),
	block: returnBlock(i),
	answer: null,
	cellIndex: i,
}));

function buildClueArray(lengthDemand) {
	let indexList = [];
	while (indexList.length < lengthDemand) {
		let num = Math.floor(Math.random() * 80);
		if (!indexList.includes(num)) {
			indexList.push(num);
		}
	}
	return indexList;
}

initialState.clues = buildClueArray(25);

const GameContext = createContext(initialState);
const gameReducer = (
	state,
	{ type, checkAnswers, wrongAnswerCount, difficulty, cells, focusCell }
) => {
	switch (type) {
		case 'UPDATE_CELL_VALUES':
			return updateObj(state, { cells });
		case 'SET_FOCUS_CELL':
			return updateObj(state, { focusCell });
		case 'CHECK_PUZZLE':
			console.log('checking');
			return updateObj(state, { checkAnswers, wrongAnswerCount });
		case 'TOGGLE_SHOW__ANSWERS':
			return updateObj(state, !state.showAnswers);
		case 'SET_DIFFICULTY':
			return updateObj(state, { difficulty });
		default:
			return state;
	}
};

const GameProvider = (props) => {
	const [state, dispatch] = useReducer(gameReducer, initialState);

	const setDifficult = (difficulty) => {
		return dispatch({ type: 'SET_DIFFICULTY', difficulty });
	};

	const setFocusCell = (focusCell) => {
		return dispatch({ type: 'SET_FOCUS_CELL', focusCell });
	};

	const checkPuzzle = () => {
		let wrongAnswerCount = state.cells
			.filter((c) => !state.clues.includes(c.cellIndex))
			.filter((cell) => cell.answer !== cell.correctAnswer).length;
		dispatch({ type: 'CHECK_PUZZLE', checkAnswers: true, wrongAnswerCount });
		if (wrongAnswerCount > 0) {
			setTimeout(
				() =>
					dispatch({ type: 'CHECK_PUZZLE', checkAnswers: false, wrongAnswerCount: null }),
				2000
			);
		}
	};

	const updateCellValue = (newCell) => {
		const updatedCells = state.cells.map((cell) =>
			cell.cellIndex === newCell.cellIndex ? newCell : cell
		);
		return dispatch({ type: 'UPDATE_CELL_VALUES', cells: updatedCells });
	};

	return (
		<GameContext.Provider
			value={{
				puzzleAnswers: state.puzzleAnswers,
				cells: state.cells,
				clues: state.clues,
				flaggedBoxes: state.flaggedBoxes,
				focusCell: state.focusCell,
				checkAnswers: state.checkAnswers,
				wrongAnswerCount: state.wrongAnswerCount,
				setDifficult,
				setFocusCell,
				updateCellValue,
				checkPuzzle,
			}}
			{...props}
		/>
	);
};

export { GameContext, GameProvider };
