import React, { Fragment } from 'react';
import { connect } from 'react-redux';

const Dashboard = ({ actions, effects }) => {
	return (
		<section name="dashboard">
			<h2>Dashboard</h2>
			<p>You currently have {effects.length} saved effects.</p>
			<button onClick={actions.createEffect}>Create Effect</button>
		</section>
	);
};

const mapStateToProps = (state) => {
	return {
		effects: state.effects,
	}
}

export default connect(mapStateToProps)(Dashboard);