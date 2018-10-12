import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };

    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  onSubmit(data, history) {
    if (data.user) {
      const token = data.token;
      localStorage.setItem('jwtToken', token);
      setAuthToken(token);
      history.push('/home');
    }
  }

  handleSubmit() {
    const { history } = this.props;
    const { email, password } = this.state;

    axios
      .post('/api/users/signup', {
        email,
        password
      })
      .then(res => {
        console.log('login res.data', res.data);
        onSubmit(res.data, history);
      })
      .then(() => this.setState({ email: '', password: '' }));
  }

  handleChangeField(key, event) {
    this.setState({
      [key]: event.target.value
    });
  }

  render() {
    const { email, password } = this.state;

    return (
      <div className="col-12 col-lg-6 offset-lg-3">
        <h1 className="text-center">Enter your email and password to login!</h1>

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
    );
  }
}

// const mapDispatchToProps = dispatch => ({
//   onSubmit: (data, history) => {
//     if (data.user) {
//       history.push('/login');
//     }
//     return this.setState({ error: data.error });
//   }
// });

// export default connect(
//   null,
//   mapDispatchToProps
// )(withRouter(LoginForm));
export default withRouter(LoginForm);
