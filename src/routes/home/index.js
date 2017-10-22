import { h, Component } from 'preact';
import {
	getAllGroups,
	createGroup,
	trainGroup,
	removeGroup
} from '../../lib/api';
import Form from '../../components/form';

export default class Home extends Component {
	state = {
		groups: []
	};

	addGroup = e => {
		e.preventDefault();
		const inputName = document.getElementById('name');
		const inputId = document.getElementById('id');
		createGroup(inputId.value, inputName.value).catch(e => {
			inputName.value = '';
			inputId.value = '';
			this.loadGroups();
		});
	};

	loadGroups = () => {
		getAllGroups().then(result => {
			this.setState({
				groups: result
			});
		});
	};

	removeGroup = personGroupId => {
		const ask = confirm('Are you sure ?');
		if (ask) {
			removeGroup(personGroupId).catch(e => this.loadGroups());
		}
	};

	componentWillMount() {
		this.loadGroups();
	}

	render(_, { groups }) {
		return (
			<div class="main">
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
