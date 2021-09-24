import React, { useContext } from 'react';
import * as style from './gameboard.module.scss';
import { GameContext } from '../../context/game';
import Block from '../block/Block.jsx';

export default function Gameboard() {
	const game = useContext(GameContext);
	let blocks = [];
	for (let i = 0; i <= 8; i++) {
		let blockCells = [];
		game.cells.map((cell) => {
			if (cell.block === i) {
				blockCells.push(cell);
			}
			return null;
		});
		blocks.push(blockCells);
	}
	return (
		<div className={style.BoardContainer}>
			{blocks.map((block, i) => (
				<Block key={`block=${i}`} cells={block}></Block>
			))}
		</div>
	);
}
