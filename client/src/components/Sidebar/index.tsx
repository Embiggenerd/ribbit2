import React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';

interface Props extends RouteComponentProps {}

interface State {
  error: string;
}

class Sidebar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      error: ''
    };
  }

  onError(error: string) {
    this.setState({
      error: error
    });
    setTimeout(() => {
      document.getElementById('error-div').style.opacity = '0';
    }, 2000);
    setTimeout(() => {
      document.getElementById('error-div').style.opacity = '1';
      this.setState({ error: '' });
    }, 3000);
  }

  render() {
    const { history } = this.props;
    axios.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (error.response.status === 401) {
          history.push('/');
          this.onError(error.response.data.errors.message);
        } else if (error.response.status === 422) {
          const errorMsg =
            Object.keys(error.response.data.errors) +
            ' ' +
            error.response.data.errors.title;
          this.onError(errorMsg);
        } else if (error.response.status === 403) {
          this.onError(error.response.data.error);
        } else {
          this.onError(error.response.data.details[0].message);
        }
        Promise.reject(error);
      }
    );
    return (
      <nav className="col-2">
        <div className="container-fluid nav-container">
          <div className="row pt-5">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link" to="/home">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/logout">
                  Logout
                </Link>
              </li>
            </ul>
            <div id="error-div">{this.state.error}</div>
          </div>
        </div>
      </nav>
    );
  }
}

export default withRouter(Sidebar);
