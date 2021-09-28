import React, { useContext } from 'react';
import { GameContext } from './context/game.js';
import * as style from './app.module.scss';
import { Gameboard, GameButtons } from './components';

export default function App() {
	const game = useContext(GameContext);

	// const renderGameStatus = () => {
	// 	let incorrectCount = game.cells
	// 		.filter((c) => !game.clues.includes(c.cellIndex))
	// 		.filter((cell) => cell.answer !== cell.correctAnswer).length;
	// 	if (incorrectCount > 0) {
	// 		setTimeout(() => game.toggleCheckAnswers(), 2000);
	// 		return <h3>You have {incorrectCount} wrong answers</h3>;
	// 	} else {
	// 		return <h3>You SOLVED IT!</h3>;
	// 	}
	// };

	function ClearFocusCell() {
		return (
			<div
				onClick={() => game.setFocusCell(null)}
				id='bg-clear'
				className={style.ClearBG}></div>
		);
	}
	return (
		<>
			{game.wrongAnswerCount && game.wrongAnswerCount > 0 ? (
				<h3>You have {game.wrongAnswerCount} wrong answers</h3>
			) : null}
			<div className={style.AppContainer}>
				<Gameboard />
				<GameButtons />
			</div>
			<ClearFocusCell />
		</>
	);
}
