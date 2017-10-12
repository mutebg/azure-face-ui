import './style';
import App from './components/app';

export default App;

// http://huddle.github.io/Resemble.js/resemble.js

let head = document.getElementsByTagName('head')[0];
let script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'http://huddle.github.io/Resemble.js/resemble.js';
head.appendChild(script);

let link = document.createElement('link');
link.rel = 'stylesheet';
link.href =
	'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css';
head.appendChild(link);
