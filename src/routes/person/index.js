import { h, Component } from 'preact';
import { route } from 'preact-router';

import { addPersonFace, deletePersonFace, getPerson } from '../../lib/api';

export default class PersonGroup extends Component {
	state = {
		persistedFaceIds: [],
		name: ''
	};

	loadPerson = () => {
		getPerson(this.props.personGroupId, this.props.personId).then(result => {
			this.setState(result);
		});
	};

	addFace = e => {
		e.preventDefault();
		const input = document.getElementById('face');

		let fileToLoad = input.files[0];
		let fileReader = new FileReader();

		fileReader.onload = async fileLoadedEvent => {
			const blob = await fetch(fileLoadedEvent.target.result).then(res =>
				res.blob()
			);
			addPersonFace(
				this.props.personGroupId,
				this.props.personId,
				blob
			).then(res => {
				input.value = '';
				this.loadPerson();
			});
		};

		fileReader.readAsDataURL(fileToLoad);
	};

	deletePerson = () => {};

	deleteFace = id => {
		const ask = confirm('Are you sure ?');
		if (ask) {
			deletePersonFace(
				this.props.personGroupId,
				this.props.personId,
				id
			).catch(() => this.loadPerson());
		}
	};

	componentWillMount() {
		this.loadPerson();
	}

	render({ personGroupId, personId }, { persistedFaceIds, name }) {
		return (
			<div class="main">
				<form
					onSubmit={this.addFace.bind(this)}
					enctype="multipart/form-data"
					class="card"
				>
					<h3>Add photo</h3>
					<div class="form-group">
						<label class="col-sm-2 col-form-label">Image:</label>
						<div class="col-sm-10">
							<input
								name="face"
								id="face"
								type="file"
								accept="image/*"
								class="form-control-file"
							/>
						</div>
					</div>
					<button class="btn btn-primary">Add</button>
				</form>

				<h3>Person: {name}</h3>

				<table class="table">
					<tr>
						<th>ID</th>
						<th>Actions</th>
					</tr>
					{persistedFaceIds.map(imgID => (
						<tr>
							<td>{imgID}</td>
							<td>
								<button
									class="btn btn-danger btn-sm"
									onClick={() => this.deleteFace(imgID)}
								>
									Remove
								</button>
							</td>
						</tr>
					))}
				</table>
			</div>
		);
	}
}
