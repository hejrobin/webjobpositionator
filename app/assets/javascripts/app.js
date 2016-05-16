// Libraries
import React from 'react';
import DOM from 'react-dom';

// Components
import Positionator from './components/positionator';

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
	let targetNode = document.querySelector('#app');
	if(targetNode) {
		DOM.render(<Positionator />, targetNode);
	}
});
