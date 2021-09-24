import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { GameProvider } from './context/game.js';

ReactDOM.render(
	<React.StrictMode>
		<GameProvider>
			<App />
		</GameProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
