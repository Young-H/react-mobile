import React from 'react';

// import { Button } from 'antd-mobile'
import {BrowserRouter as Router , Route , Switch, Redirect } from 'react-router-dom'

import Home from './views/layout'
import City from './views/city'
import Map from './views/map'

function Login () {
  return <div>登录</div>
}


function NotMatch () {
  return <div>页面丢失</div>
}

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Redirect exact from='/' to='/login' />
          <Route path='/home' component={Home} />
          <Route path='/login' component={Login} />
          <Route path='/map' component={ Map } />
          <Route path='/citylist' component={City} />
          <Route component={NotMatch} />
        </Switch>
      </Router>      
    </div>
  );
}

export default App;
