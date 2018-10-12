import axios from 'axios';

export default token => {
  console.log('setAuthToken() called');
  if (token) {
    console.log('axios token header set', token);

    axios.defaults.headers.common['Authorization'] = `${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};
