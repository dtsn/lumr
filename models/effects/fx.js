import lights from '../lights/index.js';
import play from '../../utilities/sound.js';


class fx {
	/**
	 * # FX
	 * This is the base class for all the sound effects. It works by creating
	 * buckets based upon the bpm and time sent and will play all the commands
	 * in that bucket at that time.
	 *
	 * Be careful not to have your buckets too short or too full. The Hue bridge
	 * can only handle a limited number of commands per second. Thats based on
	 * how many bulbs you have, how many commands you are sending and distance
	 * from the bridge. Signs of this problem would be the lights getting 'stuck'
	 * in a state.
	 *
	 * @param  {Int} bpm  Beats per minute, I would default to 2 buckets every second
	 * @param  {Int} time Time of the track
	 */
	constructor(bpm, time, soundFile) {
		this.bpm = bpm;
		this.time = time;
		// we create a queue of all the buckets
		this.queue = new Array(Math.round(bpm*(time/60)));
		// paused flag
		this.paused = false;
		// running flag
		this.running = false;
		// sound
		this.soundFile = soundFile;
		// looping flag
		this.loop = false;
	}

	/**
	 * Add a state (effect) to the queue
	 *
	 * @param {Int} beat  The beat/bucket you want to add to
	 * @param {Light} light A light from Lights
	 * @param {Hue.lightState} state The lightstate as defined by Hue.lightstate
	 */
	addState(beat, light, state) {
		// if the current beat is empty make sure it's an array first
		if (!this.queue[beat]) {
			this.queue[beat] = [];
		}
		// add the effect to the array
		this.queue[beat].push({
			light,
			state,
		});
	}

	process() {
		// if we are paused, stop
		if (this.paused) {
			return;
		}
		// as long as we have buckets to process
		if (this.queue.length > 0) {
			this.running = true;
			// take the next command
			const commands = this.queue.shift();
			// if the command has states
			if (commands && commands.length) {
				commands.forEach((com) => {
					/**
					 * @todo come up with a way to combine light effects
					 */
					if (com.light.length) {
						com.light.forEach((light) => {
							lights.applyState(light.id, com.state);
						})
					} else {
						lights.applyState(com.light.id, com.state);
					}
				});
			}
			setTimeout(this.process.bind(this), (60 / this.bpm) * 1000 );
		} else {
			this.running = false;
			if (this.loop) {
				// regenerate the queue
				this.queue = new Array(Math.round(this.bpm*(this.time/60)));
				// repopulate the queue
				this.generate();
				// start again
				this.process();
			}
		}
	}

	play(loop = false, volume = false) {
		this.paused = false;
		this.loop = loop;
		this.process();
		this.audio = play(this.soundFile, loop, volume);
	}

	pause() {
		this.paused = true;
		this.running = false;
		this.reset();
		if (this.audio) {
			this.audio.quit();
		}
	}

	reset() {
		// empty the queue
		this.queue = [];
	}

	isRunning() {
		return this.running;
	}

	generate() {
		// empty function
	}
}

export default fx;
