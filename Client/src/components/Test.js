import React, { Component } from "react";
import axios from "axios";

class Test extends Component {
  constructor() {
    super();
    this.state = {
      url: []
    };
  }
  componentDidMount() {
    const { url } = this.state;
    axios.get("/").then(res => {
      console.log(res);
      this.setState({ url: [res, ...this.state.url] });
    });
  }
  render() {
    const { url } = this.state;
    return (
      <div>
        <h3 style={{ textAlign: "center" }}>{url.map(url => ({ url }))}</h3>
      </div>
    );
  }
}

export default Test;
