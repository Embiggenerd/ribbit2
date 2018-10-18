import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { setAuthToken } from '../../utils';
import { History } from 'history';

interface AxiosResponseWithToken extends AxiosResponse {
  token: string;
}

interface Props extends RouteComponentProps {}

interface State {
  email: string;
  password: string;
}

type StateKeys = keyof State;

class LoginForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };

    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onSubmit(data: AxiosResponseWithToken, history: History) {
    if (data.token) {
      try {
        const token = data.token;
        localStorage.setItem('jwtToken', token);
        setAuthToken(token);
        this.setState({ email: '', password: '' });
        history.push('/home');
      } catch (e) {
        console.log(e);
      }
    }
  }

  handleSubmit() {
    const { history } = this.props;
    const { email, password } = this.state;

    axios
      .post('/api/users/signin', {
        email,
        password
      })
      .then(res => {
        this.onSubmit(res.data, history);
      });
  }

  handleChangeField(key: StateKeys, event: { target: { value: string } }) {
    this.setState({
      [key]: event.target.value
    } as Pick<State, keyof State>);
  }

  render() {
    const { email, password } = this.state;

    return (
      <div className="col">
        <div className="container-fluid">
          <div className="content">
            <div className="row pt-5">
              <div className="col-12 col-lg-6 offset-lg-3">
                <h1 className="text-center">
                  Enter your email and password to login!
                </h1>
                <input
                  onChange={ev => this.handleChangeField('email', ev)}
                  className="form-control my-3"
                  placeholder="Email"
                  value={email}
                />
                <input
                  type="password"
                  onChange={ev => this.handleChangeField('password', ev)}
                  className="form-control my-3"
                  placeholder="Password"
                  value={password}
                />
                <button
                  onClick={this.handleSubmit}
                  className="btn btn-primary float-right"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(LoginForm);
