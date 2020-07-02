import {
	CONNECT_TO_HUB,
	CONNECT_TO_HUB_SUCCESS,
	CONNECT_TO_HUB_FAILURE,
	GET_LIGHTS,
	GET_LIGHTS_ERROR,
	GET_LIGHTS_SUCCESS
} from '../actions/credentials';

const initialState = {
	loading: false,
	user: {
		username: '',
		clientKey: '',
	},
	hub: {
		ip: '',
		lights: []
	},
};

export default (state = initialState, action) => {
	switch(action.type) {
		case CONNECT_TO_HUB:
			return {
				...state,
				loading: true,
			}
		case CONNECT_TO_HUB_SUCCESS: 
			return {
				...state,
				loading: false,
				user: {
					username: action.username,
					clientKey: action.key,
				},
				hub: {
					ip: action.ip,
					name: action.name,
					lights: action.lights
				}
			};
		case CONNECT_TO_HUB_FAILURE:
			return {
				...state,
				loading: false,
				message: action.message
			};
		case GET_LIGHTS:
			return {
				...state,
			};
		case GET_LIGHTS_ERROR:
			return {
				...state,
				message: action.message
			};
		case GET_LIGHTS_SUCCESS:
			return {
				...state,
				hub: {
					ip: state.hub.ip,
					name: state.hub.name,
					lights: action.lights
				}
			};
		default:
			return state;
	}
} 