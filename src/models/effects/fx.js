import lights from '../lights/index.js';

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
	constructor(bpm, time) {
		this.bpm = bpm;
		this.time = time;
		// we create a queue of all the buckets
		this.queue = new Array(Math.round(bpm*(time/60)));
		// paused flag
		this.paused = false;
		// running flag
		this.running = false;
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
					// console.log(com.light, JSON.stringify(com.state));
					
					/**
					 * @todo come up with a way to combine light effects
					 */
					if (com.light.length) {
						com.light.forEach((light) => {
							lights.applyState(light, com.state);
						})
					} else {
						lights.applyState(com.light, com.state);
					}
				});
			}
			setTimeout(this.process.bind(this), (60 / this.bpm) * 1000 );
		} else {
			this.running = false;
		}
	}

	play(repeat = false) {
		this.paused = false;
		this.process();
	}

	pause() {
		this.paused = true;
		this.running = false;
		this.reset();
	}

	reset() {
		// empty the queue
		this.queue = [];
	}

	isRunning() {
		return this.running;
	}
}

export default fx;