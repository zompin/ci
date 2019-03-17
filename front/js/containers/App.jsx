import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import getLogAction from '../actions/Log';

class App extends Component {
  componentDidMount() {
    const { getLog } = this.props;

    getLog();
  }

  render() {
    return (
      <div>
          123123
      </div>
    );
  }
}

const mapStateToProps = state => ({
  log: state.Log,
});

export default hot(connect(mapStateToProps, { getLog: getLogAction })(App));
