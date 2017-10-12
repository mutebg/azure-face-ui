import { h, Component } from 'preact';
import { getPerson } from '../../lib/api';
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

	async componentDidMount() {
		const THRESHOLD = 8;
		const videoEl = document.querySelector('#video');
		const canvasEl = document.querySelector('#canvas');
		canvasEl.width = document.body.clientWidth;
		canvasEl.height = document.body.clientHeight;

		canvasEl.width = 800;
		canvasEl.height = 600;

		try {
			await startVideo(videoEl);
			setInterval(async () => {
				const image = capture(videoEl, canvasEl);
				this.lastImages.unshift(image);

				//keep last n images
				this.lastImages = this.lastImages.slice(0, 2);

				const diffPercentage = await compareImages(...this.lastImages);
				if (diffPercentage > THRESHOLD) {
					const faceResult = await findPerson(image, this.props.personGroupId);
					if (faceResult.length > 0) {
						const people = await Promise.all(
							faceResult.map(
								async person =>
									await getPerson(
										this.props.personGroupId,
										person.candidates[0].personId
									)
							)
						);

						this.setState({
							people
						});
					}
				}
			}, 1000);
		}
		catch (e) {
			console.log(e);
		}
	}

	render(_, { people }) {
		return (
			<div>
				<video id="video" class="camera-video" autoplay />
				<canvas id="canvas" class="canvas" />
				<div class="people">
					{people.map(({ name, personId }) => <p key={personId}>{name}</p>)}
				</div>
			</div>
		);
	}
}
