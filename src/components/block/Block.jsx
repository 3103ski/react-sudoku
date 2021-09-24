import React from 'react';
import * as style from './block.module.scss';
import Cell from '../cell/Cell.jsx';

export default function Block({ cells }) {
	return (
		<div className={style.BlockContainer}>
			{cells.map((cell, i) => (
				<Cell key={`cell${i}`} cell={cell}></Cell>
			))}
		</div>
	);
}
