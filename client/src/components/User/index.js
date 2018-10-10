// export { default as LoginForm } from "./LoginForm";
// export { default as LoginForm } from './LoginForm';
// console.log('loginFormz', LoginForm)
// connect this component: this is the component that 
// does localstorage etc etc, asks if authorized, pushes 
// register or home onto history

import React from 'react';
import { Link } from 'react-router-dom';

const User = props => {
  return (
    <h1>
      <Link to="/home">Home</Link>
    </h1>
  );
};

export default User;
