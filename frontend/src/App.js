import './App.css';
import React from "react";
// eslint-disable-next-line no-unused-vars
import { Route, Switch, useLocation } from "react-router-dom";
import { Home } from "./components/Home";
import { Player } from "./components/Player";


export const config = {
  endpoint: `http://3.110.122.228:8082/v1/videos`
  // endpoint: `https://xflix-node.herokuapp.com/v1/videos`
};


export function App() {
  return (
    <div className="App">
      <Switch>
      <Route path = "/:videoId" render={(props)=> <Player {...props} />} />
        <Route path = "/" component = {Home} />
      </Switch>
      
      
    </div>
  );
}

export default App;