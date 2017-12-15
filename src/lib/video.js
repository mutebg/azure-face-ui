import { identify, detect } from './api';

export const drawImageToCanvas = (video, canvas) => {
	const ctx = canvas.getContext('2d');
	ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
	return ctx;
};

export const capture = canvas =>
	new Promise((resolve, reject) => {
		canvas.toBlob(resolve, 'image/jpeg', 0.95);
	});

export const startVideo = video => {
	// set up video
	if (navigator.mediaDevices) {
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then(stream => getMediaSuccess(stream, video))
			.catch(getMediaError);
	}
	else if (navigator.getUserMedia) {
		navigator.getUserMedia(
			{ video: true },
			stream => getMediaSuccess(stream, video),
			getMediaError
		);
	}

	//start video when user media is ready
	video.addEventListener(
		'canplay',
		() => {
			video.play();
		},
		false
	);
};

export const stopVideo = video => {
	video.pause();
};

export const compareImages = (newImage, oldImage) =>
	new Promise((resolve, reject) => {
		if (newImage && oldImage) {
			resemble(newImage)
				.compareTo(oldImage)
				.onComplete(data => {
					resolve(data.misMatchPercentage);
				});
		}
		else {
			resolve(100);
		}
	});

export const findPerson = async (blob, personGroupId) => {
	try {
		const faceData = await detect(blob);
		const faceIds = faceData.map(({ faceId }) => faceId);
		if (faceIds.length === 0) {
			throw 'No find face';
		}
		const result = await identify(faceIds, personGroupId);
		return result.map(
			person => person.candidates.length && person.candidates[0].personId
		);
	}
	catch (e) {
		console.log(e);
	}
};

export function getMediaSuccess(stream, video) {
	// add camera stream if getUserMedia succeeded
	if ('srcObject' in video) {
		video.srcObject = stream;
	}
	else {
		video.src = window.URL && window.URL.createObjectURL(stream);
	}
	video.onloadedmetadata = function() {
		video.play();
	};

	video.onpause = () => {
		let tracks = stream.getTracks();
		tracks.forEach(track => {
			track.stop();
		});
	};
}

function getMediaError(e) {
	alert(
		'There was some problem trying to fetch video from your webcam, using a fallback video instead.'
	);
}
