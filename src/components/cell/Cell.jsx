import React, { useContext, useState, useEffect, useCallback } from 'react';

import { GameContext } from '../../context/game.js';
import { updateObj } from '../../util/util.js';

import * as style from './cell.module.scss';

export default function Cell({ cell }) {
	const game = useContext(GameContext);
	const isClue = game.clues.includes(cell.cellIndex);

	const [isEditing, setIsEditing] = useState(false);
	const [cellValue, setCellValue] = useState(null);
	const [userInput, setUserInput] = useState('');

	// •• Validate and handle user input before setting value of cell
	const handleInputOnChange = (e) => {
		if ((!isNaN(e.target.value) && userInput.length < 1) || e.target.value === '')
			setUserInput(e.target.value);
	};

	// •• If user input doesn't match stored value set the new value
	const handleInputSubmit = useCallback(() => {
		if (cellValue !== userInput) {
			setCellValue(userInput);
			game.updateCell(updateObj(cell, { answer: parseInt(userInput) }));
		}
	}, [cell, cellValue, game, userInput]);

	// •• Create function that fills cell answer
	const fillAnswer = useCallback(() => setCellValue(cell.correctAnswer), [cell.correctAnswer]);

	// •• Create a function that renders the notes assigned to the cell inside the block
	const renderNotes = (notes) => {
		const noteComponents = [];
		for (let i = 1; i <= 9; i++) {
			let note = (
				<Note
					key={`${cell.block}_${cell.row}_${cell.col}_cell-note_${i}`}
					num={i}
					cellIndex={cell.cellIndex}
				/>
			);
			noteComponents.push(note);
		}
		return noteComponents.map((n) => n);
	};

	// •• Handle enter key when cell is active input
	const handleOnEnterKey = (e) => (e.key === 'Enter' ? game.setFocusCell(null) : null);

	// •• Let game context know if a cell should be focused when clicked
	const handleCellClick = () =>
		!isClue && !game.gameComplete ? game.setFocusCell(cell.cellIndex) : game.setFocusCell(null);

	//••••••••
	// •• SideEffects
	//••••••••

	// •• Check if cell should show the answer as a clue
	useEffect(() => {
		if (isClue) fillAnswer();
	}, [fillAnswer, isClue]);

	// •• Fill answer if the game has been ended
	useEffect(() => {
		if (game.gameComplete === true && cell.answer !== cellValue) fillAnswer();
	}, [cell, cell.correctAnswer, cellValue, fillAnswer, game.gameComplete]);

	// •• Toggle input editing; set answer if new value is present
	useEffect(() => {
		if (!game.gameComplete) {
			if (game.focusCell === cell.cellIndex) {
				setIsEditing(true);
			} else if (game.focusCell !== cell.cellIndex) {
				setIsEditing(false);
				if (cell.answer !== userInput && !isClue) handleInputSubmit();
			}
		}
	}, [
		cellValue,
		isClue,
		userInput,
		handleInputSubmit,
		game.focusCell,
		game.gameComplete,
		cell.cellIndex,
		cell.answer,
	]);

	// •• Focus On Input When Visible
	useEffect(() => {
		let input = document.querySelector('input');
		if (isEditing && input) input.focus();
	}, [isEditing]);

	// •• Listen for updates to cell notes

	return (
		<div
			onClick={handleCellClick}
			className={style.CellContainer}
			data-show-correct={game.wrongAnswerCount ? 1 : 0}
			data-game-complete={game.gameComplete ? 1 : 0}
			data-is-correct={cell.answer === cell.correctAnswer ? 1 : 0}
			data-is-clue={isClue ? 1 : 0}>
			{isEditing && game.gameComplete === false ? (
				<input
					type='text'
					value={userInput}
					onKeyDown={handleOnEnterKey}
					onChange={handleInputOnChange}
				/>
			) : (
				<p>{isClue ? cell.correctAnswer : cell.answer ? cell.answer : null}</p>
			)}
			{!isClue && !isEditing && !cell.answer ? (
				<div className={style.CellNotes}>
					{renderNotes(game.cells[cell.cellIndex].notes)}
				</div>
			) : null}
		</div>
	);
}

function Note({ num, cellIndex }) {
	const [isVisible, setIsVisible] = useState(false);
	const game = useContext(GameContext);

	useEffect(() => {
		if (game.cells[cellIndex].notes.includes(num)) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	}, [cellIndex, game.cells, num]);
	return (
		<div className={style.NoteBox}>
			{num ? <p className={style.NoteNum}>{isVisible ? num : null}</p> : null}
		</div>
	);
}
