import Omx from './omxplayer.js';
import path from 'path';
import Afplayer from './afplayer.js';
import minimist from 'minimist';
import config from '../config.json';

let location = path.resolve('sounds/' + src);
if (config && config.soundFolder) {
	location = config.soundFolder;
}

export default (src, loop = false, volume = false) => {
	let args = minimist(process.argv.slice(2));
	switch (args.environment) {
		case 'mac': {
			// just play a sound to know that it will work
			return Afplayer.play(path.resolve(location + src));
			break;
		}
		default: {
			return  Omx(path.resolve(location + src), 'alsa', loop, '5.1', volume, true);
			break;
		}
	}
}
