import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav className="col-sm-3 col-md-2 hidden-xs-down bg-faded sidebar">
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
        <li clasNames="nav-item">
          <Link className="nav-link" to="/logout">
            Logout
          </Link>
        </li>
      </ul>
    </nav>
    // <ul className="nav flex-column">
    //   <li className="nav-item">
    //     <Link className="nav-link active" to="/home" />
    //   </li>
    //   <li className="nav-item">
    //     <Link className="nav-link active" to="/login" />
    //   </li>
    //   <li className="nav-item">
    //     <Link className="nav-link active" to="/register" />
    //   </li>
    //   <li className="nav-item">
    //     <Link className="nav-link active" to="/logout" />
    //   </li>
    // </ul>
  );
};

export default Sidebar;

// <div className="container-fluid">
//   <div className="row">
// <nav className="col-sm-3 col-md-2 hidden-xs-down bg-faded sidebar">
//   <ul className="nav nav-pills flex-column">
//     <li className="nav-item">
//       <Link className="nav-link active" to="/home" />
//     </li>
//     <li className="nav-item">
//       <Link className="nav-link active" to="/login" />
//     </li>
//     <li className="nav-item">
//       <Link className="nav-link active" to="/register" />
//     </li>
//     <li className="nav-item">
//       <Link className="nav-link active" to="/logout" />
//     </li>
//   </ul>
// </nav>
//   </div>
// </div>
