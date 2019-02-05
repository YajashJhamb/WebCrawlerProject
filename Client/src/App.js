import React, { Component } from "react";
import UrlDisplay from "./components/UrlDisplay";
import { Provider } from "react-redux";
import store from "./store";
import Scroll from "./components/Scroll";
import Particles from "react-particles-js";
// import Test from "./components/Test";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

class App extends Component {
  render() {
    const particleOptions = {
      particles: {
        number: { value: 100, density: { enable: true, value_area: 800 } },
        color: { value: "#fff" },
        shape: { type: "circle", stroke: { width: 0, color: "#000000" } }
      }
    };
    return (
      <Provider store={store}>
        <div className="App">
          <Particles className="particles" params={particleOptions} />
          <div className="container" style={{ textAlign: "center" }}>
            <h1 className="header">WEB CRAWLER</h1>
            <Scroll>
              <UrlDisplay />
              {/* <Test /> */}
            </Scroll>
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;
