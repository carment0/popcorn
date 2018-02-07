/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

// External imports
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { HashRouter, Route } from 'react-router-dom';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// Internal imports
import RecommenderPage from './containers/recommender_page';
import LandingPage from './containers/landing_page';
import NavigationBar from './containers/navigation_bar';
import ReduxStore from './store';
import './index.scss';


class Application extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.history.location.pathname === '/') {
      this.props.history.push('/welcome');
    }
  }

  componentDidMount() {
    if (this.props.history.location.pathname === '/') {
      this.props.history.push('/welcome');
    }
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <article className="popcorn">
          <NavigationBar history={this.props.history} />
          <Route path="/welcome" component={LandingPage} />
          <Route path="/recommendations" component={RecommenderPage} />
        </article>
      </MuiThemeProvider>
    );
  }
}

const Router = (props) => (
  <Provider store={props.store}>
    <HashRouter>
      <Route path="/" component={Application} />
    </HashRouter>
  </Provider>
);

Router.propTypes = {
  store: PropTypes.object.isRequired
};

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<Router store={ReduxStore} />, document.getElementById('react-application'));
});
