import React, { useContext } from 'react';

import { GameContext } from '../../context/game.js';

import { updateObj } from '../../util/util.js';
import * as style from './numberButtons.module.scss';

export default function NumberButtons({ isNotes = false }) {
	const game = useContext(GameContext);
	let cell = game.cells[game.focusCell];

	const handleButtonOnClick = (num) => {
		if (isNotes) {
			if (!cell.notes.includes(num)) {
				cell.notes.push(num);
			} else {
				cell.notes = cell.notes.filter((n) => {
					return n !== num;
				});
			}
		} else {
			if (cell.answer && num === cell.answer) {
				cell = updateObj(cell, { answer: null });
			} else {
				cell = updateObj(cell, { answer: num });
			}
		}

		return game.updateCell(cell);
	};

	const Btn = ({ num }) => (
		<div
			onClick={() => handleButtonOnClick(num)}
			data-fill={
				(cell.notes.includes(num) && isNotes) || (cell.answer === num && !isNotes) ? 1 : 0
			}
			className={style.NumberButton}>
			<span>{num}</span>
		</div>
	);

	const renderBtns = () =>
		new Array(9)
			.fill(null)
			.map((_, i) => <Btn num={i + 1} key={`${isNotes ? 'note-btn' : 'ans-btn'}-${i}`} />);

	return <div className={style.Container}>{renderBtns()}</div>;
}
