import React from 'react';
import * as style from './block.module.scss';
import Cell from '../cell/Cell.jsx';

export default function Block({ cells }) {
	const renderCells = () => cells.map((cell, i) => <Cell key={`cell${i}`} cell={cell}></Cell>);

	return <div className={style.BlockContainer}>{renderCells()}</div>;
}
