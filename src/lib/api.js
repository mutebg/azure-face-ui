const config = {
	API_URL: 'https://westeurope.api.cognitive.microsoft.com/face/v1.0/'
};

const apiFetch = (url, method = 'get', data = {}, aHeaders) => {
	const options = {
		method,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'Ocp-Apim-Subscription-Key': '',
			...aHeaders
		}
	};

	// add post data
	if (data) {
		options.body = aHeaders ? data : JSON.stringify(data);
	}

	return fetch(url, options)
		.then(response => {
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return response;
		})
		.then(response => response.json());
};

// ajax get method
const get = path => apiFetch(config.API_URL + path, 'GET', null);

// ajax post method
const post = (path, data, headers) =>
	apiFetch(config.API_URL + path, 'POST', data, headers);

const put = (path, data, headers) =>
	apiFetch(config.API_URL + path, 'PUT', data, headers);

// ajax delete method
const remove = (path, data) => apiFetch(config.API_URL + path, 'DELETE', data);

// ajax patch method
const patch = (path, data) => apiFetch(config.API_URL + path, 'PATCH', data);

export const getAllGroups = () => get('persongroups?start=0&top=1000');

export const createGroup = (personGroupId, name) =>
	put(`persongroups/${personGroupId}`, { name });

export const trainGroup = personGroupId =>
	post(`persongroups/${personGroupId}/train`);

export const getPeolpeFromPersonGroup = personGroupId =>
	get(`persongroups/${personGroupId}/persons?start=0&top=1000`);

export const createPerson = (personGroupId, personName) =>
	post(`persongroups/${personGroupId}/persons`, { name: personName });

export const deletePerson = (personGroupId, personId) =>
	remove(`persongroups/${personGroupId}/persons/${personId}`);

export const updatePerson = (personGroupId, personId, name) =>
	patch(`persongroups/${personGroupId}/persons/${personId}`, { name });

export const getPerson = (personGroupId, personId) =>
	get(`persongroups/${personGroupId}/persons/${personId}`);

export const addPersonFace = (personGroupId, personId, img) =>
	post(
		`persongroups/${personGroupId}/persons/${personId}/persistedFaces`,
		img,
		{
			'Content-Type': 'application/octet-stream'
		}
	);

export const deletePersonFace = (personGroupId, personId, persistedFaceId) =>
	remove(
		`persongroups/${personGroupId}/persons/${personId}/persistedFaces/${persistedFaceId}`
	);

export const detect = blobImage =>
	post('detect', blobImage, {
		'Content-Type': 'application/octet-stream'
	});

export const identify = (faceIds, personGroupId) =>
	post('identify', {
		faceIds,
		personGroupId
	});
