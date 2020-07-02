import { ipcMain } from 'electron';
import Lights from '../../models/lights';
import {
	LIGHT_SETUP,
	LIGHT_SETUP_REPLY,
	LIGHT_GET_ALL,
	LIGHT_GET_ALL_REPLY,
	LIGHT_SET,
} from './eventNames';

class LightsAPI {

	constructor() {
		this.api = false;
		ipcMain.on(LIGHT_SETUP, this.setup.bind(this));
		ipcMain.on(LIGHT_GET_ALL, this.getAll.bind(this));
		ipcMain.on(LIGHT_SET, this.setLight.bind(this));
	}

	async setup(event, arg) {

		if (this.host !== arg.host || this.username !== arg.username) {
			// reset the connection
			this.api = new Lights(arg.host, arg.username);
			await this.api.connect();
		}
		this.host = arg.host;
		this.username = arg.username;
		event.reply(LIGHT_SETUP_REPLY);
	}

	async getAll(event, arg) {
		const lights = new Lights(arg.host, arg.username);
		try {
			await lights.connect();
			const list = await lights.getAll();
			event.reply(LIGHT_GET_ALL_REPLY, list);
		} catch (e) {
			event.reply(LIGHT_GET_ALL_REPLY, {
				'error': e.message
			});
		}
	}

	async setLight(event, arg) {
		try {
			await this.api.applyState(arg.id, arg.state);
		} catch (e) {
			console.log(e);
		}
	}
}

export default new LightsAPI();

