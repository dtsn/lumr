import HueApi from "node-hue-api";
import config from '../../config.json';
const LightState = HueApi.v3.lightStates.LightState;

class Lights {
	constructor() {
		this._lights = config.lights;
		// create all the light objects
		this._lights.forEach((light) => {
			this[light.name] = light.code;
		});
		console.log('trying to connect');
		this.connect().then((api) => {
			this.api = api;
			console.log('Connected to the Hub');
		}).catch((e) => {
			console.log('Failed to connect to hub');
			console.log(e);
		});
	}

	connect() {
		return HueApi.v3.api.create(config.host, config.username);
	}

	applyState(light, state, counter = 0) {
		this.api.lights.setLightState(light, state).then((result) => {
			console.log(light, `Light state change: true`);
		}).catch((e) => {
			console.log(`Light state change: false`);
			console.log(e);

			if (counter >= 5) {
				console.log('tried 5 times, give up');
				return;
			}
			console.log('retrying ....');
			this.applyState(light, state, counter++);
		});
	}

	/**
	 * Off
	 * Switch a single or all the lights off, all lights are those which are defined in the config
	 * @param  {Array|Light} light [description]
	 */
	off(light = false) {
		if (light === false || (light && light.length && light.length > 1)) {
			this._lights.forEach((l) => this.api.lights.setLightState(l.code, new LightState().off()));
		} else {
			this.api.lights.setLightState(light, new LightState().off())
		}
	}

	/**
	 * On
	 * Switch a single or all the lights on, they will return to there last light state
	 * @param  {Array|Light} light [description]
	 */
	on(light = false) {
		if (!light || light.length > 1) {
			this._lights.forEach((l) => this.api.lights.setLightState(l.code, new LightState().on()));
		} else {
			this.api.lights.setLightState(light, new LightState().on())
		}
	}
}

export default new Lights();