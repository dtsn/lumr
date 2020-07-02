import React, { Fragment } from 'react';
import { connect } from 'react-redux';

const CreateEffect = ({ actions, effects }) => {
	return (
		<section name="create-effect">
			<h2>Create Effect</h2>
			
			Load file <br/>
			Waveform <br/>
			



		</section>
	);
};

const mapStateToProps = (state) => {
	return {
		effects: state.effects,
	}
}

export default connect(mapStateToProps)(CreateEffect);