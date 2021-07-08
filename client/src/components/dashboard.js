import React from 'react';

class Dashboard extends React.Component {

	componentDidMount() {
        // connect to the hub
        fetch('/api/lights/connect');
	}

    play(name) {
        fetch(`/api/fx/${name}/play`);
    }

	render() {
        return (
            <button onClick={this.play.bind(this, 'dark-and-stormy')}>Dark and Stormy</button>
        )
	}
}

export default Dashboard;
