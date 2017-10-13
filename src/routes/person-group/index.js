import { h, Component } from 'preact';
import {
	getPeolpeFromPersonGroup,
	createPerson,
	deletePerson
} from '../../lib/api';

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
				<form onSubmit={this.addPerson.bind(this)} class="card">
					<h3>Add person</h3>
					<div class="form-group row">
						<label class="col-sm-2 col-form-label">Name:</label>
						<div class="col-sm-10">
							<input name="name" id="name" class="form-control" />
						</div>
					</div>

					<button class="btn btn-primary">Add</button>
				</form>

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
