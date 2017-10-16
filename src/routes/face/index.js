import { h, Component } from 'preact';
import { getPerson, getPeolpeFromPersonGroup } from '../../lib/api';
import {
	startVideo,
	capture,
	compareImages,
	findPerson
} from '../../lib/video';

export default class Face extends Component {
	lastImages = [];
	state = {
		people: []
	};

	hideAll = () => {
		this.setState({
			people: []
		});
	};

	async componentDidMount() {
		const THRESHOLD = 8;
		const videoEl = document.querySelector('#video');
		const overlay = document.getElementById('canvas');

		// Code for face tracking
		let ctrack = new clm.tracker();
		ctrack.init();

		try {
			// start video
			startVideo(videoEl, ctrack);

			// fetch all people from azure api
			const allPeopleData = await getPeolpeFromPersonGroup(
				this.props.personGroupId
			);
			// transform people array to object with {person_id => person name }
			const allPeople = allPeopleData.reduce((prev, current) => {
				prev[current.personId] = current.name;
				return prev;
			}, {});

			setInterval(async () => {
				// get position of face
				const position = ctrack.getCurrentPosition();

				if (!position) {
					// no faces on the image
					this.hideAll();
					return false;
				}

				const image = capture(videoEl, overlay);
				this.lastImages.unshift(image);

				//keep last 2 images
				this.lastImages = this.lastImages.slice(0, 2);

				// compare last 2 images
				const diffPercentage = await compareImages(...this.lastImages);
				if (diffPercentage < THRESHOLD) {
					// images are similar
					return false;
				}

				// find faces
				const faceIds = await findPerson(image, this.props.personGroupId);

				// identify people on images
				if (faceIds && faceIds.length > 0) {
					const people = faceIds.map(id => ({
						id,
						name: allPeople[id]
					}));

					this.setState({
						people
					});
				}
				else {
					this.hideAll();
				}
			}, 1000);
		}
		catch (e) {
			console.log(e);
		}
	}

	componentWillUnmount() {}

	render(_, { people }) {
		return (
			<div>
				<video
					id="video"
					class="camera-video"
					autoplay
					width="800"
					height="600"
				/>
				<canvas id="canvas" class="canvas" width="800" height="600" />
				<div class="people">
					{people.map(({ name, personId }) => <p key={personId}>{name}</p>)}
				</div>
			</div>
		);
	}
}
