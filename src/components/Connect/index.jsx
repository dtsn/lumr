import React, { Fragment } from 'react';
import HueApi from "node-hue-api";
import { connect } from 'react-redux';
import {
	LIGHT_SETUP,
	LIGHT_SETUP_REPLY,
	LIGHT_SET,
	LIGHT_SET_REPLY
} from '../../main-renderer/api/eventNames';

const electron = window.require("electron");
const LightState = HueApi.v3.lightStates.LightState;

const Connect = ({ actions, loading, user, hub }) => {

	const setRed = (id) => {
  		electron.ipcRenderer.send(LIGHT_SETUP, {
  			host: hub.ip,
  			username: user.username
  		});
  		electron.ipcRenderer.on(LIGHT_SETUP_REPLY, () => {
  			electron.ipcRenderer.send(LIGHT_SET, {
				id, 
				state: {
					on: true,
					alert: 'lselect'
				}
			});
  		});
	}

	const lights = hub && hub.lights ? hub.lights : [];
	const listOfLights = lights.map((light, i) => {
		console.log(light);
		return (
			<div key={i}>
				<h4>{light._data.name}</h4>
				<p>{light._data.productname}</p>
				<p>
					<button onClick={setRed.bind(this, light._data.id)}>
						Flash the light
					</button>
				</p>
			</div>
		)
	});

	return (
		<section name="connect" className={loading ? 'loading' : ''}>
			{/* start button to begin connection */}
			{!hub && !loading && (
				<Fragment>
					<h2>Connect</h2>
					<p>
						First we need to connect to your Hue Hub to proceed. You will need 
						to press the link button on the hub you would like to use after 
						clicking start.
					</p>
					<button onClick={actions.connect}>
						Start
					</button>
				</Fragment>
			)}
			{/* connecting to hub */}
			{loading && (
				<Fragment>
					<h2>Connecting</h2>
					<p>Press link button</p>
					<p>Some kind of animation which shows the button being pressed</p>
					<p>A countdown bar</p>
				</Fragment>
			)}
			{/* connected to hub */}
			{hub && (
				<Fragment>
					<h2>Connected to {hub.name} as {user.username}</h2>
					<button onClick={actions.connect}>Connect again</button>
					<h2>Lights</h2>
					{listOfLights}
					<button onClick={() => {
						actions.getAllLights(hub.ip, user.username);
					}}>Refresh light list</button>
				</Fragment>
			)}
		</section>
	);
};

const mapStateToProps = (state) => {
	return {
		loading: state.credentials.loading,
		user: state.credentials.user,
		hub: state.credentials.hub
	}
}

export default connect(mapStateToProps)(Connect);