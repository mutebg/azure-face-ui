import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header';
import Home from '../routes/home';
import PersonGroup from '../routes/person-group';
import Person from '../routes/person';
import Face from '../routes/face';
// import Home from 'async!./home';
// import Profile from 'async!./profile';

export default class App extends Component {
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app">
				<Header />
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<PersonGroup path="/persongroup/:personGroupId" />
					<Person path="/person/:personGroupId/:personId" />
					<Face path="/face/:personGroupId" />
				</Router>
			</div>
		);
	}
}
