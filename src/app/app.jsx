import React from 'react'
import hue from '../models/hue';
const electron = window.require("electron");

class App extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			hubs: [],
		}
	}

	discoverHubs() {
		electron.ipcRenderer.on('discover-reply', (event, arg) => {
			console.log(event, arg);
			this.setState({hubs: arg});
		});
		electron.ipcRenderer.send('discover');
	}

	createUser(ip) {
		console.log(ip);
		electron.ipcRenderer.on('create-user-reply', (event, arg) => {
			console.log(event, arg);
		});
		electron.ipcRenderer.send('create-user', ip);
	}


	render() {

		let hubs = this.state.hubs.map((hub, i) => {
			return (
				<button className="hub" key={i} onClick={this.createUser.bind(this, hub.ipaddress)}>
					{hub.name}
				</button>
			)
		});


		return (
			<>
				<h1>Lumr</h1>
				<button onClick={this.discoverHubs.bind(this)}>Discover Hubs</button>

				{hubs.length > 0 && (
					<>
						<p>Please press the link button on the hub, then press button of the matching hub below to connect</p>
						{hubs}
					</>
				)}
			</>
		);
	}
}

export default App