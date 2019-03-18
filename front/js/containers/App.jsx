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
    const { log } = this.props;

    if (!log.loaded && !log.error) {
      return (<div>Loading...</div>);
    }

    if (log.error) {
      return (<div>Loading error</div>);
    }

    // return 'sss'

    const parsedLog = log.data
      .split('\n')
      .map((l) => {
        try {
          return JSON.parse(l);
        } catch (e) {
          return l;
        }
      })
      .filter(l => !!l);

    return (
      <div>
        {
          parsedLog.map(l => (
            <pre>{JSON.stringify(l, null, '\t')}</pre>
          ))
        }
        {
          !parsedLog.length &&
          <div>Nothing to show</div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  log: state.Log,
});

export default hot(connect(mapStateToProps, { getLog: getLogAction })(App));
