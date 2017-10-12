import { h, Component } from 'preact';
import { getAllGroups, createGroup } from '../../lib/api';

export default class Home extends Component {
	state = {
		groups: []
	};

	addGroup = e => {
		e.preventDefault();
		const inputName = document.getElementById('name');
		const inputId = document.getElementById('id');
		createGroup(inputId.value, inputName.value).then(res => {
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

	componentWillMount() {
		this.loadGroups();
	}

	render(_, { groups }) {
		return (
			<div class="main">
				<form onSubmit={this.addGroup.bind(this)} class="card">
					<h3>Add group</h3>
					<div class="form-group row">
						<label class="col-sm-2 col-form-label">ID:</label>
						<div class="col-sm-10">
							<input name="name" id="id" class="form-control" />
						</div>
					</div>
					<div class="form-group row">
						<label class="col-sm-2 col-form-label">Name:</label>
						<div class="col-sm-10">
							<input name="name" id="name" class="form-control" />
						</div>
					</div>
					<button class="btn btn-primary">Add</button>
				</form>
				<h3>My groups</h3>
				<table class="table">
					<tr>
						<th>Name</th>
						<th>ID</th>
						<th>Action</th>
					</tr>
					{groups.map(({ name, personGroupId }) => (
						<tr>
							<td>
								<a href={'/persongroup/' + personGroupId}>{name}</a>
							</td>
							<td>{personGroupId}</td>
							<td>
								<a href={'/face/' + personGroupId} class="btn btn-info">
									Try it
								</a>
							</td>
						</tr>
					))}
				</table>
			</div>
		);
	}
}
