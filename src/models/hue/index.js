import HueApi from "node-hue-api";

const APP_NAME = 'lumr';
const DEVICE_NAME = 'example';

class Hue {

	constructor() {
		this._user = false;
		this._authenticatedApi = false;
	}

	async discover() {
		// look for the bridge
		const results = await HueApi.v3.discovery.nupnpSearch();
		// couldn't find any
		if (results.length === 0) {
			throw new Error('Failed to find any Hue Bridges');
		}

		return results;
	}

	async createUser(hubIpAddress) {
		// create an unauthenticated instance of the Hue API so that we can create a new user
		const unauthenticatedApi = await HueApi.v3.api.createLocal(hubIpAddress).connect();
		// create the user/app on the hub
		try {
			this._user = await unauthenticatedApi.users.createUser(APP_NAME, DEVICE_NAME);
			this._authenticatedApi = await HueApi.v3.api.createLocal(hubIpAddress).connect(this._user.username);
			const bridgeConfig = await this._authenticatedApi.configuration.getConfiguration();
			return {
				ip: bridgeConfig.ipaddress,
				name: bridgeConfig.name,
				username: this._user.username,
				key: this._user.clientkey
			}
		} catch(e) {
			if (e.getHueErrorType() === 101) {
				// handle the button not being pressed
				throw new Error('The Link button on the bridge was not pressed. Please press the Link button and try again.');
   			} else {
      			throw e;
    		}
    	}
	}
}

export default new Hue();