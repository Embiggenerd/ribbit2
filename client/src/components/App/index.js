import React from 'react';
import {
  BrowserRouter as Router,
  withRouter,
  Switch,
  Route
} from 'react-router-dom';

import { Home, User, NoMatch, Sidebar } from '../../components';

const App = props => {
  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <Switch>
          <Route exact path="/" component={User} />
          <Route exact path="/home" component={Home} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    </div>
  );
};

export default App;
