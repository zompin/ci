import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose,
} from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import App from './App';
import Log from './Log';
import history from '../utils/history';

const reducers = combineReducers({
  App,
  Log,
  router: connectRouter(history),
});

export default createStore(
  reducers,
  {},
  compose(
    applyMiddleware(routerMiddleware(history)),
    applyMiddleware(thunk),
  ),
);
