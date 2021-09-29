import React, { useContext } from 'react';
import * as style from './gameOptions.module.scss';

import { GameContext } from '../../context/game.js';

export default function GameOptions() {
	const game = useContext(GameContext);

	return (
		<div className={style.GameOptionsContainer}>
			<GameOptions.Button text='Check Answers' cb={game.checkPuzzle} cn={style.CheckPuzzle} />
			<GameOptions.Button text='New Puzzle' cb={game.newPuzzle} cn={style.NewPuzzle} />
			<GameOptions.Button text='Show Solution' cb={game.endGame} cn={style.EndGame} />
		</div>
	);
}

GameOptions.Button = ({ text, cn, cb }) => {
	return (
		<button className={`${style.GameButton} ${cn}`} onClick={cb}>
			{text}
		</button>
	);
};
