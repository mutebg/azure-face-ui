import { h, Component } from 'preact';
import { getPerson } from '../../lib/api';
import {
	startVideo,
	capture,
	compareImages,
	findPerson,
	drawImageToCanvas
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

		try {
			startVideo(videoEl);
			const faceDetector = new FaceDetector({
				fastMode: true,
				maxDetectedFaces: 1
			});

			setInterval(async () => {
				drawImageToCanvas(videoEl, overlay);

				const faces = await faceDetector.detect(overlay);

				if (faces.length) {
					const image = capture(overlay);
					this.lastImages.unshift(image);

					//keep last 2 images
					this.lastImages = this.lastImages.slice(0, 2);

					// compare last 2 images
					const diffPercentage = await compareImages(...this.lastImages);
					if (diffPercentage > THRESHOLD) {
						// find faces
						const faceResult = await findPerson(
							image,
							this.props.personGroupId
						);

						// identify people on images
						if (faceResult && faceResult.length > 0) {
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
						else {
							this.hideAll();
						}
					}
				}
				else {
					this.hideAll();
				}
			}, 1000);
		}
		catch (e) {}
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
