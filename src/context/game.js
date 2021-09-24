import React, { createContext, useReducer } from 'react';
import { updateObj } from '../util/util.js';
import { generateSudoku, returnBlock, returnRow, returnCol } from '../util/sudokuFunctions.js';

const initialState = {
	puzzleAnswers: generateSudoku(),
	cells: null,
	clues: buildClueArray(6),
	focusCell: null,
	flaggedRows: [],
	flaggedCols: [],
	flaggedBoxes: [],
	showAnswers: false,
	difficulty: 'medium',
};

initialState.cells = initialState.puzzleAnswers.map((cell, i) => ({
	correctAnswer: cell,
	row: returnRow(i),
	col: returnCol(i),
	block: returnBlock(i),
	answer: '',
	cellIndex: i,
	isClue: false,
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
const gameReducer = (state, { type, difficulty, cells, focusCell }) => {
	switch (type) {
		case 'UPDATE_CELL_VALUES':
			return updateObj(state, { cells });
		case 'SET_FOCUS_CELL':
			return updateObj(state, { focusCell });
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

	const updateCellValue = (newCell) => {
		const updatedCells = state.cells.map((cell) =>
			cell.cellIndex === newCell.cellIndex ? newCell : cell
		);
		return dispatch({ type: 'UPDATE_CELLS', cells: updatedCells });
	};

	return (
		<GameContext.Provider
			value={{
				puzzleAnswers: state.puzzleAnswers,
				cells: state.cells,
				clues: state.clues,
				flaggedBoxes: state.flaggedBoxes,
				flaggedCols: state.flaggedCols,
				flaggedRows: state.flaggedRows,
				showAnswers: state.showAnswers,
				focusCell: state.focusCell,
				setDifficult,
				setFocusCell,
				updateCellValue,
			}}
			{...props}
		/>
	);
};

export { GameContext, GameProvider };
