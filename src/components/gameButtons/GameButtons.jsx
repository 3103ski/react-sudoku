import React, { useContext } from 'react';
import * as style from './gameButtons.module.scss';

import { GameContext } from '../../context/game.js';

export default function GameButtons(props) {
	const game = useContext(GameContext);

	return (
		<div className={style.GameButtonsContainer}>
			<button onClick={game.checkPuzzle}>Check Puzzle</button>
		</div>
	);
}
