import { connect } from 'react-redux';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.status === 401) {
      console.log(error);
    }
    return error;
  }
);
class User extends React.Component {
  // on mount make api call to secret
  // if token is valid, push home to history
  // if token invalid, push to login or signup
  onMount(data, history) {
    if (data.user) {
      return history.push('/home');
    }
    history.push('/login');
  }
  componentDidMount() {
    const { history } = this.props;

    axios
      .get('/api/users/secret')
      .then(res => {
        console.log('users onmount', res);
        this.onMount(res, history);
      })
      .catch(e => console.log(e));
  }
  render() {
    return <h1>LOGIN OR REGISTER</h1>;
  }
}

const mapStateToProps = state => ({
  email: state.user.email
});

const mapDispatchToProps = dispatch => ({
  onMount: (data, history) => {
    dispatch({ type: 'USER_EMAIL', data });
    return history.push('/home');
  }
});

export default withRouter(User);
