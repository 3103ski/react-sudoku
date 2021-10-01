import React from 'react';

import * as style from './button.module.scss';

export default function Button({ text, callback, color }) {
	let COLOR = (function () {
		switch (color) {
			case 'orange':
				return style.Orange;
			case 'green':
				return style.Green;
			case 'red':
				return style.Red;
			default:
				return style.Blue;
		}
	})();

	return (
		<button className={`${style.Button} ${COLOR} `} onClick={callback}>
			{text}
		</button>
	);
}
