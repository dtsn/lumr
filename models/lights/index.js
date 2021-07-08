import HueApi from "node-hue-api";
import config from '../../config.json';
const LightState = HueApi.v3.lightStates.LightState;

class Lights {

	lights() {
		if (config && config.lights) {
			this._lights = config.lights;
			// create all the light objects
			this._lights.forEach((light) => {
				this[light.name] = light.id;
			});
		}
	}

	connect() {
		return HueApi.v3.api.createLocal(config.ip).connect(config.username).then((api) => {
			this.api = api;
			console.log('Connected to the Hub');
		}).catch((e) => {
			console.log('Failed to connect to hub');
			console.log(e);
		});
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
			this._lights.forEach((l) => this.api.lights.setLightState(l.id, new LightState().off()));
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
			this._lights.forEach((l) => this.api.lights.setLightState(l.id, new LightState().on()));
		} else {
			this.api.lights.setLightState(light, new LightState().on())
		}
	}

	async getAll() {
		if (!this.api) {
			await this.connect();
		}
		console.log(this.api);
		return this.api.lights.getAll();
	}
}

export default new Lights();
