import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { connect } from "react-redux";
import { addURL } from "../actions/urlAction";
import PropTypes from "prop-types";

class UrlDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: [],
      endpoint: "http://localhost:5000"
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("FromServer", res => this.props.addURL(res));
    socket.emit("startEvent");
  }

  componentWillReceiveProps(nextProp) {
    const { url } = this.props;
    this.setState({ response: url });
  }

  render() {
    const { response } = this.state;
    return (
      <div>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">
                URLs CRAWLED{" "}
                <span style={{ textAlign: "right" }}>
                  Count: {response.length}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {response.map(response => (
              <tr>
                <td>{response}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  url: state.URL.URL
});

UrlDisplay.propTypes = {
  addURL: PropTypes.func.isRequired,
  url: PropTypes.array.isRequired
};
export default connect(
  mapStateToProps,
  { addURL }
)(UrlDisplay);
