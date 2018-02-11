/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng, Carmen To
 */

// Thirdparty imports
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { HashRouter, Route } from 'react-router-dom';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// Component imports
import Recommender from './containers/recommender';
import Welcome from './containers/welcome';
import Navigation from './containers/navigation';
import Footer from './components/footer';
import ReduxStore from './store';

// Style
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
          <Navigation history={this.props.history} />
          <Route path="/welcome" component={Welcome} />
          <Route path="/recommend" component={Recommender} />
          <Footer />
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
