import HueApi from "node-hue-api";
const LightState = HueApi.v3.lightStates.LightState;

class Lights {
	constructor(host, username) {
		this.host = host;
		this.username = username;
	}

	async getAll() {
		let lights = await this.api.lights.getAll();
		return lights;
	}

	connect() {
		return new Promise((resolve, reject) => {
			HueApi.v3.api.createLocal(this.host).connect(this.username).then((api) => {
				this.api = api;
				resolve(this.api);
			}).catch((err) => {
				console.log(err);
				reject(err);
			});
		});
	}

	applyState(id, state, counter = 0) {
		this.api.lights.setLightState(id, state).then((result) => {
			console.log(result, state, counter);
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

export default Lights;