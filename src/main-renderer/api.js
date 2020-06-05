import { ipcMain } from 'electron';
import hue from '../models/hue';

class Api {
	constructor() {
		ipcMain.on('discover', async (event, arg) => {
			let hubs = await hue.discover();
			event.reply('discover-reply', hubs);
		});

		ipcMain.on('create-user', async (event, arg) => {
			let response = false;
			try {
				response = await hue.createUser(arg);
			} catch (e) {
				response = e;
			}
			event.reply('create-user-reply', response);
		});
	}
}

export default new Api();

