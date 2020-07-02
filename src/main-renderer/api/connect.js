import { ipcMain } from 'electron';
import hue from '../../models/hue';

class Connect {

	constructor() {
		// trigger to search for hubs
		ipcMain.on('connect', this.connect.bind(this));
		console.log('blah');
	}

	async connect(event) {
		let credentials = false;
		console.log('starting discovery of hubs');
		// otherwise look for hubs
		let hubs = await hue.discover();
		console.log('Found hubs', hubs);
		// start hub discovery
		console.log('pinging hubs');
		try {
			credentials = await this.pingHubs(hubs);
			// return a success
			event.reply('connect-reply', credentials);
		} catch (e) {
			event.reply('connect-reply', {
				'error': 'Connection timed out, did you press the button?'
			});
		}

		/** Todo also fetch list of lights */
	}

	/**
	 * Ping each hub every 5 seconds, up to a max of 30 seconds until we have
	 * created a user on the hub.
	 * @param  {[type]} hubs [description]
	 * @return {[type]}      [description]
	 */
	pingHubs(hubs) {
		console.log('first ping');
		// promise in a repeating timer ....
		return new Promise((resolve, reject) => {
			let credentials = false;
			let counter = 0;
			let attempts = 10;
			let timeout = 5000;

			const search = () => {
				console.log('ping', counter);
				hubs.forEach(async (hub) => {
					try {
						console.log('attempting to create user on ' + hub.name);
						credentials = await hue.createUser(hub.ipaddress);
					} catch (e) {
						console.log(e);
					}
				});

				console.log('credentials', credentials);

				if (!credentials && counter <= attempts) {
					counter++;
					console.log('repeat');
					setTimeout(search, timeout);
				} else if (credentials) {
					console.log('success', credentials);
					resolve(credentials);
				} else {
					console.log('timed out');
					reject('Timed out');
				}
			}

			search();
		});		
	}
}

export default new Connect();

