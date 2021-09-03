import React from 'react';

const HUB_STATUS_LOADING = 'loading';
const HUB_STATUS_CONNECTED = 'connected';
const HUB_STATUS_ERROR = 'error';

const LIGHTS_STATUS_LOADING = 'loading';
const LIGHTS_STATUS_ERROR = 'error';

class Welcome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hub: false,
            hubs: false,
			lights: false,
			lightStatus: false,
			selectedLights: [],
		};
	}

	componentDidMount() {
		// if we have the config but not the lights restart light discovery
		if (this.props.config && this.props.config.id && !this.props.config.lights) {
			this.setState({
				hub: HUB_STATUS_CONNECTED,
			});
			this.discoverLights();
		}
	}

	discoverHub() {
		this.setState({
			hub: HUB_STATUS_LOADING,
		});
		fetch('/api/discover/hubs')
            .then((res) => res.json())
            .then(json => {
                if (!json.hubs) {
                    this.setState({
                        hub: HUB_STATUS_CONNECTED,
                    });
                    this.discoverLights();
                }

			if (res.status === 200) {




			} else {
				this.setState({
					hub: HUB_STATUS_ERROR,
				});
			}
		});
	}

	discoverLights() {
		this.setState({
			lightStatus: LIGHTS_STATUS_LOADING,
		});
		fetch('/api/lights/list')
			.then((res) => res.json())
			.then((json) => {
				if (json && json.length > 0) {
					this.setState({ lights: json });
				}
			})
			.catch((e) => {
				this.setState({ lightStatus: LIGHTS_STATUS_ERROR });
			});
	}

	saveLights() {
		fetch('/api/lights/add', {
            headers: {
                'Content-Type': 'application/json'
            },
			method: 'POST',
			body: JSON.stringify({
				lights: this.state.selectedLights,
			}),
		});
	}

	render() {
		let lights = [];

		console.log(this.state);
		if (this.state.lights.length > 0) {
			this.state.lights.forEach((light) => {
				lights.push(
					<div>
						<input
							type='checkbox'
							id={`light-${light._data.id}`}
							name={`light-${light._data.id}`}
							checked={this.state.selectedLights.filter((l) => l.id === light._data.id).length > 0}
							onChange={() => {
								let selectedLights = [...this.state.selectedLights];
                                let selected = selectedLights.filter((l) => l.id === light._data.id).length > 0;

								if (selected) {
									// remove it
									selectedLights = selectedLights.filter((l) => l.id !== light._data.id);
								} else {
									// add it
									selectedLights.push({
                                        id: light._data.id,
                                        name: light._data.name
                                    });
								}

								this.setState({
									selectedLights,
								});
							}}
						/>
						<label htmlFor={`light-${light._data.id}`}>{light._data.name}</label>
					</div>
				);
			});
		}

		return (
			<section className='welcome'>
				{!this.state.hub && (
					<>
						<p>Let's get started, we are going to need to find your Hue hub to authenticate with it.</p>
						<button onClick={this.discoverHub.bind(this)}>Let's Go</button>
					</>
				)}

				{this.state.hub === HUB_STATUS_LOADING && (
					<>
						<p>Searching...</p>
						<p>Please push the button on the hub you want to use.</p>
					</>
				)}

				{this.state.hub === HUB_STATUS_ERROR && (
					<>
						<p>Oops something went wrong, try again prehaps you weren't quick enough?</p>
						<button onClick={this.discoverHub.bind(this)}>Let's Go</button>
					</>
				)}

				{this.state.lightStatus === LIGHTS_STATUS_LOADING && (
					<p>Wahoo! We are connected, just fetching your lights</p>
				)}

				{this.state.lights.length > 0 && (
					<>
						<p>
							We've found {this.state.lights.length} lights, please select the ones you would like to use:
						</p>
						{lights}
						<button onClick={this.saveLights.bind(this)}>Save</button>
					</>
				)}
			</section>
		);
	}
}

export default Welcome;
