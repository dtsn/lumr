import { 
	LIGHT_GET_ALL,
	LIGHT_GET_ALL_REPLY
} from '../main-renderer/api/eventNames';

const electron = window.require("electron");
export const CONNECT_TO_HUB = 'CONNECT_TO_HUB';
export const CONNECT_TO_HUB_FAILURE = 'CONNECT_TO_HUB_FAILURE';
export const CONNECT_TO_HUB_SUCCESS = 'CONNECT_TO_HUB_SUCCESS';
export const GET_LIGHTS = 'GET_LIGHTS';
export const GET_LIGHTS_ERROR = 'GET_LIGHTS_ERROR';
export const GET_LIGHTS_SUCCESS = 'GET_LIGHTS_SUCCESS';
export const SET_LIGHT = 'GET_LIGHTS';
export const SET_LIGHT_ERROR = 'SET_LIGHT_ERROR';
export const SET_LIGHT_SUCCESS = 'SET_LIGHT_SUCCESS';

const connectToHub = () => {
	return { type: CONNECT_TO_HUB }
}

const connectToHubSuccess = (hub) => {
	return {
		type: CONNECT_TO_HUB_SUCCESS,
		...hub,
	}
}

const connectToHubFailure = (message) => {
	return {
		type: CONNECT_TO_HUB_FAILURE,
		message
	}
}

const getLights = () => {
	return { type: GET_LIGHTS }
}

const getLightsError = (message) => {
	return {
		type: GET_LIGHTS_ERROR,
		message
	}
}

const getLightsSuccess = (lights) => {
	return {
		type: GET_LIGHTS_SUCCESS,
		lights
	}
}

const setLight = () => {
	return { type: SET_LIGHT }
}

export const connect = () => {
	return (dispatch) => {
		// we are starting our call
		dispatch(connectToHub());
		// return a promise, it's easier for us to use
		return new Promise((resolve, reject) => {
			electron.ipcRenderer.on('connect-reply', (event, arg) => {
				if (arg.error) {
					reject(arg);
				}
				resolve(arg);
			});
			electron.ipcRenderer.send('connect');
		}).then((hub) => {
			dispatch(connectToHubSuccess(hub));
		}).catch((error) => {
			dispatch(connectToHubFailure(error.error || error))
		});
	}
}

export const getAllLights = (host, username) => {
	return (dispatch) => {
		dispatch(getLights());
		return new Promise((resolve, reject) => {
			electron.ipcRenderer.on(LIGHT_GET_ALL_REPLY, (event, arg) => {
				if (arg.error) {
					reject(arg);
				}
				resolve(arg);
			});
			electron.ipcRenderer.send(LIGHT_GET_ALL, {
				host,
				username
			});
		}).then((lights) => {
			dispatch(getLightsSuccess(lights));
		}).catch((error) => {
			dispatch(getLightsError(error.error || error))
		});
	}
}