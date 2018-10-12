import React from 'react';
import { withRouter } from 'react-router-dom';
import { setAuthToken } from '../../utils';

const Logout = ({ history }) => {
  setAuthToken(false);
  localStorage.removeItem('jwtToken');
  history.push('/');
  return null;
};

export default withRouter(Logout);
