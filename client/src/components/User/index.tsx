import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { History } from 'history';

interface Props extends RouteComponentProps {}

class User extends React.Component<Props, {}> {
  // on mount make api call to secret
  // if token is valid, push home to history
  // if token invalid, push to login or signup
  onMount(data: AxiosResponse, history: History) {
    if (data) {
      return history.push('/home');
    }
    history.push('/login');
  }
  componentDidMount() {
    const { history } = this.props;
    axios
      .get('/api/users/secret')
      .then(res => {
        this.onMount(res, history);
      })
      .catch(e => {
        this.onMount(e, history);
      });
  }
  render() {
    return <div />;
  }
}

export default withRouter(User);
