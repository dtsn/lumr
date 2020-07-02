import { connect } from 'react-redux';
import * as Actions from '../actions/credentials';
import { bindActionCreators } from 'redux';
import Connect from '../components/Connect';

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(Actions, dispatch)
});

export default connect(
	null,
	mapDispatchToProps
)(Connect);