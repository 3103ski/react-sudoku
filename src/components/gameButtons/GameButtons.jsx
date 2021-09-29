import React, { useContext } from 'react';
import * as style from './gameButtons.module.scss';

import { GameContext } from '../../context/game.js';

export default function GameButtons(props) {
	const game = useContext(GameContext);

	return (
		<div className={style.GameButtonsContainer}>
			<button onClick={game.checkPuzzle} className={style.CheckPuzzle}>
				Check Puzzle
			</button>
			<button onClick={game.newPuzzle} className={style.NewPuzzle}>
				Generate New Puzzle
			</button>
		</div>
	);
}
