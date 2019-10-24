import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root';
import { connect } from 'react-redux';
import getLogAction from '../actions/Log';
import { Event, Tabs } from '../components';
import getBranchName from '../utils/getBranchName';

class App extends Component {
  static addRepos(events) {
    const store = {};

    events.forEach((e) => {
      const { name } = e.payload.repository;
      const branch = getBranchName(e);

      if (name in store) {
        store[name][branch] = {};
      } else {
        store[name] = {
          [branch]: {},
        };
      }
    });

    return Object.keys(store).map(k => ({ name: k, id: k, branches: store[k] }));
  }

  state = {
    currentTab: null,
  };

  componentDidMount() {
    const { getLog } = this.props;

    getLog();
  }

  onTabChange = (currentTab) => {
    this.setState({
      currentTab,
    });
  };

  render() {
    const { log } = this.props;
    const { currentTab } = this.state;

    if (!log.loaded && !log.error) {
      return (
        <div>Loading...</div>
      );
    }

    if (log.error) {
      return (
        <div>Loading error</div>
      );
    }

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

    const repos = App.addRepos(parsedLog);
    const filteredLog = currentTab
      ? parsedLog.filter(l => l.payload.repository.name === currentTab.id)
      : parsedLog;

    return (
      <div>
        <Tabs
          tabs={repos}
          defaultTab={repos[0]}
          onChange={this.onTabChange}
          currentTab={currentTab}
        />
        {
          filteredLog.map(l => (
            <Event data={l} />
          ))
        }
        {
          !filteredLog.length && (
            <div>Nothing to show</div>
          )
        }
      </div>
    );
  }
}

App.propTypes = {
  getLog: PropTypes.func.isRequired,
  log: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  log: state.Log,
});

export default hot(connect(mapStateToProps, { getLog: getLogAction })(App));
