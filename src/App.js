import React, { useContext } from 'react';

import * as style from './app.module.scss';

import { GameContext } from './context/game.js';
import { Gameboard, GameButtons } from './components';

export default function App() {
	const game = useContext(GameContext);

	// Cancles focus on a cell if the user clicks outside of the board
	function TransparentCancelFocusBackdrop() {
		return <div onClick={() => game.setFocusCell(null)} className={style.ClearBG} />;
	}

	// Render game status when checked
	function RenderGameStatus() {
		return game.wrongAnswerCount && game.wrongAnswerCount > 0 ? (
			<h3>You have {game.wrongAnswerCount} wrong answers</h3>
		) : game.wrongAnswerCount === 0 ? (
			<h3>All Solved!</h3>
		) : null;
	}

	return (
		<>
			<RenderGameStatus />
			<div className={style.AppContainer}>
				<GameButtons />
				<Gameboard />
			</div>
			<TransparentCancelFocusBackdrop />
		</>
	);
}
