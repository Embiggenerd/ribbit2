import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';

import { home, user } from './reducers';

const reducers = combineReducers({
  home,
  user
});

const store = createStore(reducers, applyMiddleware(logger));

export default store;
