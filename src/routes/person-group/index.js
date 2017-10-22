import { h, Component } from 'preact';
import {
	getPeolpeFromPersonGroup,
	createPerson,
	deletePerson
} from '../../lib/api';
import Form from '../../components/form';

export default class PersonGroup extends Component {
	state = {
		people: []
	};

	loadPeople = () => {
		getPeolpeFromPersonGroup(this.props.personGroupId).then(result => {
			this.setState({
				people: result
			});
		});
	};

	addPerson = e => {
		e.preventDefault();
		const input = document.getElementById('name');
		createPerson(this.props.personGroupId, input.value).then(res => {
			input.value = '';
			this.loadPeople();
		});
	};

	removePerson(personId) {
		const ask = confirm('Are you sure ?');
		if (ask) {
			deletePerson(this.props.personGroupId, personId).catch(() =>
				this.loadPeople()
			);
		}
	}

	componentWillMount() {
		this.loadPeople();
	}

	render({ personGroupId }, { people }) {
		return (
			<div class="main">
				<Form
					title="Add person"
					onSubmit={this.addPerson.bind(this)}
					submitLabel="Add person"
					fields={[{ id: 'name', label: 'Name' }]}
				/>

				<h3>List of people:</h3>
				<table class="table">
					<tr>
						<th>Name</th>
						<th>ID</th>
						<th>Pictures</th>
						<th>Actions</th>
					</tr>
					{people.map(({ name, personId, persistedFaceIds }) => {
						const removePersonBtn = () => this.removePerson(personId);
						return (
							<tr>
								<td>
									<a href={'/person/' + personGroupId + '/' + personId}>
										{name}
									</a>
								</td>
								<td>{personId}</td>
								<td>{persistedFaceIds.length}</td>
								<td>
									<button class="btn btn-danger" onClick={removePersonBtn}>
										Remove
									</button>
								</td>
							</tr>
						);
					})}
				</table>
			</div>
		);
	}
}
