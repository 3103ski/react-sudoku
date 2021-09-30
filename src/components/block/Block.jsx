import React from 'react';

import Cell from '../cell/Cell.jsx';

import * as style from './block.module.scss';

export default function Block({ cells }) {
	const renderCells = () => cells.map((cell, i) => <Cell key={`cell${i}`} cell={cell} />);

	return <div className={style.BlockContainer}>{renderCells()}</div>;
}
