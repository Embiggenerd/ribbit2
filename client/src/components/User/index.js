import { connect } from 'react-redux';
import React from 'react';
import { Link } from 'react-router-dom';

class User extends React.Component {
  // on mount make api call to secret
  // if token is valid, push home to history
  // if token invalid, push to login or signup
  render() {
    const { auth } = this.props;
    return (
      <h1>
        <Link to="/home">Home</Link>
        USER COMPONENT
      </h1>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
