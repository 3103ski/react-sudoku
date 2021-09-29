import React, { useContext } from 'react';

import * as style from './gameboard.module.scss';

import { GameContext } from '../../context/game';
import Block from '../block/Block.jsx';

export default function Gameboard() {
	const game = useContext(GameContext);

	const renderBlocks = () => {
		let blocks = [];
		for (let i = 0; i <= 8; i++) {
			let blockCells = game.cells.filter((cell) => cell.block === i);
			blocks.push(blockCells);
		}
		return blocks.map((block, i) => <Block key={`block=${i}`} cells={block} />);
	};

	return <div className={style.BoardContainer}>{renderBlocks()}</div>;
}
