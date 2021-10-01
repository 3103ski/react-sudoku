import React, { useState, useEffect } from 'react';
import * as style from './dropMenu.module.scss';

export default function DropMenu({
	options = [],
	selected = 'select option',
	callback,
	staticText = null,
}) {
	const [activeText, setActiveText] = useState(selected);
	const [isOpen, setIsOpen] = useState(false);

	function handleOptionOnClick({ value, name }) {
		setActiveText(name ? name : value);
		if (callback) {
			callback(value);
		}
	}

	function Option({ value, name }) {
		return (
			<li onClick={() => handleOptionOnClick({ value, name })} className={style.Option}>
				{name ? name : value}
			</li>
		);
	}

	function toggleMenu() {
		let outerEl = document.getElementById('options-outer');
		if (isOpen) {
			outerEl.style.maxHeight = '0px';
			outerEl.style.border = 'none';
		} else {
			outerEl.style.maxHeight = '100px';
			outerEl.style.border = 'solid 1px grey';
		}

		return setIsOpen(!isOpen);
	}

	useEffect(() => {
		let mainContainer = document.getElementById('drop-container');
		let outerEl = document.getElementById('options-outer');

		outerEl.style.marginTop = `${mainContainer.clientHeight}px`;
	}, []);

	return (
		<div id='drop-container' className={style.Container} onClick={toggleMenu}>
			<p>{staticText ? staticText : activeText}</p>
			<div id='options-outer' className={style.Options}>
				<ul id='options-inner' className={style.OptionsInner}>
					{options.length > 0 ? (
						options.map((o, i) => <Option key={i} value={o.value} name={o.name} />)
					) : (
						<li>No Options</li>
					)}
				</ul>
			</div>
		</div>
	);
}
