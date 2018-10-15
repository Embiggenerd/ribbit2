import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { setAuthToken } from './utils';
import { Provider } from 'react-redux';
import store from './store';
import { App } from './components';
import axios from 'axios';
import '../resources/scss/style.scss';

setAuthToken(localStorage.jwtToken);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
