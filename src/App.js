import React, { useContext } from 'react';
import { GameContext } from './context/game.js';
import * as style from './app.module.scss';
import { Gameboard } from './components';

export default function App() {
	const game = useContext(GameContext);

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
			<div className={style.AppContainer}>
				<Gameboard />
			</div>
			<ClearFocusCell />
		</>
	);
}
