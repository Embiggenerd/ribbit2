import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { History } from 'history';

interface Props extends RouteComponentProps {}

interface Data {
  user: any;
}

class User extends React.Component<Props, {}> {
  // on mount make api call to secret
  // if token is valid, push home to history
  // if token invalid, push to login or signup
  onMount(data: Data, history: History) {
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
        this.onMount(res.data, history);
      })
      .catch(e => console.log(e));
  }
  render() {
    return <div />;
  }
}

export default withRouter(User);
