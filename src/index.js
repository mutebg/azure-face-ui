import './style';
import App from './components/app';

export default App;

// http://huddle.github.io/Resemble.js/resemble.js

const addScript = src => {
	let head = document.getElementsByTagName('head')[0];
	let script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = src;
	head.appendChild(script);
};

const addCSS = src => {
	let head = document.getElementsByTagName('head')[0];
	let link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = src;
	head.appendChild(link);
};

addScript('http://huddle.github.io/Resemble.js/resemble.js');
//addScript('https://trackingjs.com/bower/tracking.js/build/tracking-min.js');
//addScript('https://trackingjs.com/bower/tracking.js/build/data/face-min.js');
addScript('https://www.auduno.com/clmtrackr/build/clmtrackr.js');

addCSS(
	'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css'
);
