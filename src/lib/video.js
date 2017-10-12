import { identify, detect } from './api';

export const capture = (video, canvas) => {
	const ctx = canvas.getContext('2d');
	ctx.drawImage(video, 0, 0);
	let dataURL = canvas.toDataURL('image/png');
	return dataURL;
};

export const startVideo = video =>
	new Promise((resolve, reject) => {
		if (navigator.getUserMedia) {
			navigator.getUserMedia(
				{ video: { facingMode: 'environment' } },
				stream => {
					video.srcObject = stream;
					video.onloadedmetadata = () => {
						video.play();
					};
					resolve(stream);
				},
				reject
			);
		}
		else {
			reject('getUserMedia not supported');
		}
	});

export const compareImages = (newImage, oldImage) =>
	new Promise((resolve, reject) => {
		resemble(newImage)
			.compareTo(oldImage)
			.onComplete(data => {
				resolve(data.misMatchPercentage);
			});
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
