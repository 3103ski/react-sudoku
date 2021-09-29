import React, { useContext, useState, useEffect, useCallback } from 'react';
import * as style from './cell.module.scss';
import { GameContext } from '../../context/game.js';

export default function Cell({ cell }) {
	const game = useContext(GameContext);
	const isClue = game.clues.includes(cell.cellIndex);

	const [isEditing, setIsEditing] = useState(false);
	const [cellValue, setCellValue] = useState(cell.answer);
	const [userInput, setUserInput] = useState('');

	// Validate and handle user input before setting value of cell
	const handleInputOnChange = (e) => {
		if ((!isNaN(e.target.value) && userInput.length < 1) || e.target.value === '') {
			setUserInput(e.target.value);
		}
	};

	// If user input doesn't match stored value set the new value
	const handleAddUserInput = useCallback(() => {
		if (cellValue !== userInput) {
			let updatedCell = {
				...cell,
				answer: parseInt(userInput),
			};
			setCellValue(userInput);
			game.updateCellValue(updatedCell);
		}
	}, [cell, cellValue, game, userInput]);

	// Handle enter key when cell is active input
	const handleOnEnterKey = (e) => (e.key === 'Enter' ? game.setFocusCell(null) : null);

	// Let game context know if a cell should be focused when clicked
	const handleCellClick = () =>
		!isClue ? game.setFocusCell(cell.cellIndex) : game.setFocusCell(null);

	//••••••••
	// SideEffects
	//••••••••

	// •• Check if cell should show the answer without user input
	useEffect(() => {
		if (isClue || game.showAnswers) {
			setCellValue(cell.correctAnswer);
		}
	}, [game.clues, cell.correctAnswer, cell.cellIndex, game.showAnswers, isClue]);

	// •• Toggle input editing
	useEffect(() => {
		if (game.focusCell === cell.cellIndex) {
			setIsEditing(true);
		} else if (game.focusCell !== cell.cellIndex) {
			setIsEditing(false);
			if (cellValue !== userInput && !isClue) {
				handleAddUserInput();
			}
		}
	}, [cell.cellIndex, cellValue, game.focusCell, handleAddUserInput, isClue, userInput]);

	// •• Focus On Input When Visible
	useEffect(() => {
		let input = document.querySelector('input');
		if (isEditing && input) {
			input.focus();
		}
	}, [isEditing]);

	return (
		<div
			onClick={handleCellClick}
			className={style.CellContainer}
			data-show-correct={game.wrongAnswerCount ? 1 : 0}
			data-is-correct={cell.answer === cell.correctAnswer ? 1 : 0}
			data-is-clue={isClue ? 1 : 0}>
			{isEditing && !game.gameComplete ? (
				<input
					type='text'
					value={userInput}
					onKeyDown={handleOnEnterKey}
					onChange={handleInputOnChange}
				/>
			) : (
				<p>{cellValue}</p>
			)}
		</div>
	);
}
