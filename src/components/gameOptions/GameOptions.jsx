import React, { useContext, useEffect, useState } from 'react';

import { GameContext } from '../../context/game.js';
import { Button as Btn, DropMenu as Drop } from '../../components';
import * as style from './gameOptions.module.scss';

export default function GameOptions() {
	const game = useContext(GameContext);
	const [currDifficulty, setCurrentDifficulty] = useState(game.difficulty);

	const gameOptions = [{ value: 'easy' }, { value: 'medium' }, { value: 'hard' }];

	useEffect(() => {
		if (currDifficulty !== game.difficulty) {
			setCurrentDifficulty(game.difficulty);
			game.newPuzzle();
		}
	}, [currDifficulty, game, game.difficulty]);

	return (
		<div className={style.GameOptionsContainer}>
			<Btn text='Check Answers' callback={game.checkPuzzle} color='green' />
			<Btn text='New Puzzle' callback={game.newPuzzle} />
			<Btn text='Show Solution' callback={game.endGame} color='orange' />
			<Drop selected={game.difficulty} callback={game.setDifficulty} options={gameOptions} />
		</div>
	);
}
