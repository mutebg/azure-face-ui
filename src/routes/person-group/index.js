import { h, Component } from 'preact';
import {
	getPeolpeFromPersonGroup,
	createPerson,
	deletePerson
} from '../../lib/api';
import Form from '../../components/form';
import withAlert from '../../components/withAlert';

class PersonGroup extends Component {
	state = {
		people: []
	};

	loadPeople = () => {
		getPeolpeFromPersonGroup(this.props.personGroupId)
			.then(result => {
				this.setState({
					people: result
				});
			})
			.catch(e => this.props.showAlert(e.toString()));
	};

	addPerson = e => {
		e.preventDefault();
		const input = document.getElementById('name');
		createPerson(this.props.personGroupId, input.value)
			.then(res => {
				input.value = '';
				this.loadPeople();
			})
			.catch(e => this.props.showAlert(e.toString()));
	};

	removePerson(personId) {
		const ask = confirm('Are you sure ?');
		if (ask) {
			deletePerson(this.props.personGroupId, personId)
				.then(this.loadPeople)
				.catch(e => this.props.showAlert(e.toString()));
		}
	}

	componentWillMount() {
		this.loadPeople();
	}

	render({ personGroupId }, { people }) {
		return (
			<div>
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

export default withAlert(PersonGroup);
