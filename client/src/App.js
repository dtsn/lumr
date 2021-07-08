import React from 'react';
import Welcome from './components/welcome';
import Dashboard from './components/dashboard';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			config: false,
		};
	}

	componentDidMount() {
		fetch('/api/discover/config')
			.then((res) => res.json())
			.then((config) => {
				this.setState({
					loading: false,
					config: config,
				});
			});
	}

	render() {
		if (this.state.loading === true) {
			return 'Loading';
		}

		if (!this.state.config || !this.state.config.lights) {
			// start discovery
			return <Welcome config={this.state.config} />;
		}

        if (this.state.config.lights) {
            return <Dashboard config={this.state.config} />;
        }
	}
}

export default App;
