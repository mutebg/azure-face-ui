import { identify, detect } from './api';

export const capture = (video, canvas) => {
	const ctx = canvas.getContext('2d');
	ctx.drawImage(video, 0, 0);
	let dataURL = canvas.toDataURL('image/png');
	return dataURL;
};

export const startVideo = (video, ctrack) => {
	// set up video
	if (navigator.mediaDevices) {
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then(stream => getMediaSuccess(stream, video))
			.catch(getMediaFail);
	}
	else if (navigator.getUserMedia) {
		navigator.getUserMedia(
			{ video: true },
			stream => getMediaSuccess(stream, video),
			getMediaFail
		);
	}

	//start video when user media is ready
	video.addEventListener(
		'canplay',
		() => {
			video.play();
			ctrack.start(video);
		},
		false
	);
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

export const findPerson = async (base64image, personGroupId) => {
	const blob = await fetch(base64image).then(res => res.blob());
	const faceData = await detect(blob);
	const faceIds = faceData.map(({ faceId }) => faceId);
	if (faceIds.length === 0) {
		throw 'No find face';
	}
	const result = await identify(faceIds, personGroupId);
	return result.map(
		person => person.candidates.length && person.candidates[0].personId
	);
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
}

function getMediaFail(e) {
	conosle.log(e);
	alert(
		'There was some problem trying to fetch video from your webcam, using a fallback video instead.'
	);
}
