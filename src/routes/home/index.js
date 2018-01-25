import { h, Component } from 'preact';
import {
	getAllGroups,
	createGroup,
	trainGroup,
	removeGroup
} from '../../lib/api';
import Form from '../../components/form';
import withAlert from '../../components/withAlert';

class Home extends Component {
	state = {
		groups: []
	};

	addGroup = e => {
		e.preventDefault();
		const inputName = document.getElementById('name');
		const inputId = document.getElementById('id');
		createGroup(inputId.value, inputName.value)
			.then(e => {
				inputName.value = '';
				inputId.value = '';
				this.loadGroups();
			})
			.catch(e => {
				this.props.showAlert(e.toString());
			});
	};

	loadGroups = () => {
		getAllGroups()
			.then(result => {
				this.setState({
					groups: result
				});
			})
			.catch(e => {
				this.props.showAlert(e.toString());
			});
	};

	removeGroup = personGroupId => {
		const ask = confirm('Are you sure ?');
		if (ask) {
			removeGroup(personGroupId)
				.then(this.loadGroups)
				.catch(e => {
					this.props.showAlert(e.toString());
				});
		}
	};

	verifyNeededBrowserFeatures = () => {
		if (!window.FaceDetector) {
			this.props.showAlert(
				<div>
					<strong>window.FaceDetector</strong> is not currently available.<br />
					Please enable the experimental features in your browser in: <br /><br />
					chrome://flags/#enable-experimental-web-platform-features
				</div>
			);
		}
	}

	componentWillMount() {
		this.verifyNeededBrowserFeatures();
		this.loadGroups();
	}

	render(_, { groups }) {
		return (
			<div>
				<Form
					title="Add group"
					onSubmit={this.addGroup.bind(this)}
					submitLabel="Add"
					fields={[{ id: 'id', label: 'ID' }, { id: 'name', label: 'Name' }]}
				/>

				<h3>My groups</h3>
				<table class="table">
					<tr>
						<th>Name</th>
						<th>ID</th>
						<th width="260">Actions</th>
					</tr>
					{groups.map(({ name, personGroupId }) => {
						const onRemove = () => this.removeGroup(personGroupId);
						const onTrain = () => trainGroup(personGroupId);

						return (
							<tr>
								<td>
									<a href={'/persongroup/' + personGroupId}>{name}</a>
								</td>
								<td>{personGroupId}</td>
								<td>
									<div class="btn-group">
										<a href={'/face/' + personGroupId} class="btn btn-info">
											Try it
										</a>
										<button class="btn btn-success" onClick={onTrain}>
											Train it
										</button>
										<button class="btn btn-danger" onClick={onRemove}>
											Remove
										</button>
									</div>
								</td>
							</tr>
						);
					})}
				</table>
			</div>
		);
	}
}

export default withAlert(Home);
