import { h, Component } from 'preact';

const WithAlert = BaseComp =>
	class HOC extends Component {
		state = { alerts: [] };

		showAlert = message => {
			this.setState({
				alerts: [...this.state.alerts, message]
			});
		};

		render(_, { alerts }) {
			return (
				<div class="main">
					{alerts.map(msg => <div class="alert alert-danger">{msg}</div>)}
					<BaseComp {...this.props} showAlert={this.showAlert} />
				</div>
			);
		}
	};

export default WithAlert;
