import fx from '../fx.js';
import HueApi from 'node-hue-api';
import config from '../../../config.json';

const LightState = HueApi.v3.lightStates.LightState;

class DarkAndStormy extends fx {
	constructor() {
		super(120, 56, 'storm.wav');

        this.id = 'dark-and-stormy';

        const lights = config.lights;

		this.addState(0, lights, new LightState().off());

		this.addState(8, lights, new LightState().on().transitionInstant().white(154, 100));
		this.addState(8, lights, new LightState().off().transitionInstant());

		this.addState(30, lights, new LightState().on().transitionInstant().white(154, 50));
		this.addState(30, lights, new LightState().off().transitionInstant());
		this.addState(32, lights, new LightState().on().transitionInstant().white(154, 75));
		this.addState(32, lights, new LightState().off().transitionInstant());
		this.addState(33, lights, new LightState().on().transitionInstant().white(154, 100));
		this.addState(33, lights, new LightState().off().transitionInstant());

		this.addState(66, lights, new LightState().on().transitionInstant().white(154, 100));
		this.addState(66, lights, new LightState().off().transitionInstant());
		this.addState(67, lights, new LightState().on().transitionInstant().white(154, 100));
		this.addState(67, lights, new LightState().off().transitionInstant());

		this.addState(84, lights, new LightState().on().transitionInstant().white(154, 100));
		this.addState(84, lights, new LightState().off().transitionInstant());
	}
}

export default DarkAndStormy;
