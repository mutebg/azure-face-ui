import { API_SUBSCRIPTION_KEY } from '../conf';
const config = {
	API_URL: 'https://westeurope.api.cognitive.microsoft.com/face/v1.0/'
};

const apiFetch = ({
	url,
	method = 'GET',
	data = null,
	headers = {},
	isJSON = true
}) => {
	const options = {
		method,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'Ocp-Apim-Subscription-Key': API_SUBSCRIPTION_KEY,
			...headers
		}
	};

	// add post data
	if (data) {
		options.body =
			Object.keys(headers).length > 0 ? data : JSON.stringify(data);
	}

	return fetch(url, options)
		.then(response => {
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return response;
		})
		.then(response => (isJSON ? response.json() : response));
};

// ajax get method
const get = ({ path, ...rest }) =>
	apiFetch({
		url: config.API_URL + path,
		method: 'GET',
		...rest
	});

// ajax post method
const post = ({ path, ...rest }) =>
	apiFetch({
		url: config.API_URL + path,
		method: 'POST',
		...rest
	});

const put = ({ path, ...rest }) =>
	apiFetch({ url: config.API_URL + path, method: 'PUT', ...rest });

// ajax delete method
const remove = ({ path, ...rest }) =>
	apiFetch({
		url: config.API_URL + path,
		method: 'DELETE',
		...rest
	});

// ajax patch method
const patch = ({ path, ...rest }) =>
	apiFetch({
		url: config.API_URL + path,
		method: 'PATCH',
		...rest
	});

export const getAllGroups = () =>
	get({ path: 'persongroups?start=0&top=1000' });

export const createGroup = (personGroupId, name) =>
	put({ path: `persongroups/${personGroupId}`, data: { name }, isJSON: false });

export const trainGroup = personGroupId =>
	post({ path: `persongroups/${personGroupId}/train`, isJSON: false });

export const removeGroup = personGroupId =>
	remove({ path: `persongroups/${personGroupId}`, isJSON: false });

export const getPeolpeFromPersonGroup = personGroupId =>
	get({ path: `persongroups/${personGroupId}/persons?start=0&top=1000` });

export const createPerson = (personGroupId, personName) =>
	post({
		path: `persongroups/${personGroupId}/persons`,
		data: { name: personName }
	});

export const deletePerson = (personGroupId, personId) =>
	remove({
		path: `persongroups/${personGroupId}/persons/${personId}`,
		isJSON: false
	});

export const updatePerson = (personGroupId, personId, name) =>
	patch({
		path: `persongroups/${personGroupId}/persons/${personId}`,
		method: { name }
	});

export const getPerson = (personGroupId, personId) =>
	get({ path: `persongroups/${personGroupId}/persons/${personId}` });

export const addPersonFace = (personGroupId, personId, img) =>
	post({
		path: `persongroups/${personGroupId}/persons/${personId}/persistedFaces`,
		data: img,
		headers: {
			'Content-Type': 'application/octet-stream'
		}
	});

export const deletePersonFace = (personGroupId, personId, persistedFaceId) =>
	remove({
		path: `persongroups/${personGroupId}/persons/${personId}/persistedFaces/${persistedFaceId}`,
		isJSON: false
	});

export const detect = blobImage =>
	post({
		path: 'detect',
		data: blobImage,
		headers: {
			'Content-Type': 'application/octet-stream'
		}
	});

export const identify = (faceIds, personGroupId) =>
	post({
		path: 'identify',
		data: {
			faceIds,
			personGroupId
		}
	});
