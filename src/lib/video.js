import { identify, detect } from './api';

export const drawImageToCanvas = (video, canvas) => {
	const ctx = canvas.getContext('2d');
	ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
	return ctx;
};

export const capture = canvas => {
	let dataURL = canvas.toDataURL('image/png');
	return dataURL;
};

export const startVideo = video => {
	// set up video
	if (navigator.mediaDevices) {
		navigator.mediaDevices
			.getUserMedia({ video: true })
			.then(stream => gumSuccess(stream, video))
			.catch(e => console.log(e));
	}
	else if (navigator.getUserMedia) {
		navigator.getUserMedia(
			{ video: true },
			stream => gumSuccess(stream, video),
			e => console.log(e)
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
	try {
		const blob = await fetch(base64image).then(res => res.blob());
		const faceData = await detect(blob);
		const faceIds = faceData.map(({ faceId }) => faceId);
		if (faceIds.length === 0) {
			throw 'No find face';
		}
		return identify(faceIds, personGroupId);
	}
	catch (e) {
		console.log(e);
	}
};

export function gumSuccess(stream, video) {
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
