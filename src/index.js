import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import throttle from 'lodash.throttle';
import App from './components/App';
import reducer from './reducers';


const loadState = () => {
	try {
		const serializedState = localStorage.getItem('state');
		if (serializedState === null) {
			return undefined;
		}
		return JSON.parse(serializedState);
	} catch (err) {
		return undefined;
	}
}; 

const saveState = (state) => {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem('state', serializedState);
	} catch {
		// ignore write errors
	}
};

const middleware = [thunkMiddleware]
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const enhancer = composeEnhancers(applyMiddleware(...middleware))
const store = createStore(reducer, loadState(), enhancer)

store.subscribe(throttle(() => {
	saveState(store.getState());
}, 1000));


render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
