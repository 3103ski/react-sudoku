import React, { useContext } from 'react';

import { GameContext } from '../../context/game.js';

import { updateObj } from '../../util/util.js';
import * as style from './numberButtons.module.scss';

export default function NumberButtons({ isNotes = false }) {
	const game = useContext(GameContext);

	const handleButtonOnClick = (num) => {
		let cell = game.cells[game.focusCell];
		let updatedCell = game.cells[game.focusCell];

		if (isNotes) {
			let notes = cell.notes;

			if (!notes.includes(num)) {
				notes.push(num);
			} else {
				notes = notes.filter((n) => {
					return n !== num;
				});
			}

			updatedCell = updateObj(updatedCell, { notes });
			return game.updateCell(updatedCell);
		} else {
			updatedCell = updateObj(updatedCell, { answer: num });
			return game.updateCell(updatedCell);
		}
	};

	const Btn = ({ num }) => (
		<div onClick={() => handleButtonOnClick(num)} className={style.NumberButton}>
			<span>{num}</span>
		</div>
	);

	const renderBtns = () =>
		new Array(9)
			.fill(null)
			.map((_, i) => <Btn num={i + 1} key={`${isNotes ? 'note-btn' : 'ans-btn'}-${i}`} />);

	return <div className={style.Container}>{renderBtns()}</div>;
}
