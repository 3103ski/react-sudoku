import React, { useContext, useState, useEffect, useCallback } from 'react';
import * as style from './cell.module.scss';
import { GameContext } from '../../context/game.js';

export default function Cell({ cell }) {
	const game = useContext(GameContext);
	const isClue = game.clues.includes(cell.cellIndex);

	const [isEditing, setIsEditing] = useState(false);
	const [cellValue, setCellValue] = useState(cell.answer);
	const [userInput, setUserInput] = useState('');

	const handleAddUserInput = useCallback(() => {
		if (cellValue !== userInput) {
			let updatedCell = {
				...cell,
				answer: userInput,
			};
			setCellValue(userInput);
			game.updateCellValue(updatedCell);
		}
	}, [cell, cellValue, game, userInput]);

	const handleInputOnChange = (e) => {
		if ((!isNaN(e.target.value) && userInput.length < 1) || e.target.value === '') {
			setUserInput(e.target.value);
		}
	};

	const handleCellClick = () => {
		if (!isClue) {
			game.setFocusCell(cell.cellIndex);
		} else {
			game.setFocusCell(null);
		}
	};

	useEffect(() => {
		if (isClue || game.showAnswers) {
			setCellValue(cell.correctAnswer);
		}
	}, [game.clues, cell.correctAnswer, cell.cellIndex, game.showAnswers, isClue]);

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
		<div className={style.CellContainer} onClick={handleCellClick}>
			{isEditing ? (
				<input
					type='text'
					value={userInput}
					onKeyDown={(e) => (e.key === 'Enter' ? game.setFocusCell(null) : null)}
					onChange={handleInputOnChange}
				/>
			) : (
				<p>{cellValue}</p>
			)}
		</div>
	);
}
