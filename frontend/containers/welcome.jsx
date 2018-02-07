/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

import React from 'react';
import { connect } from 'react-redux';

class Welcome extends React.Component {
  componentWillReceiveProps() {

  }

  render() {
    return <h1>Welcome to Popcorn</h1>;
  }
}

const mapReduxStateToProps = (state) => ({
  userPreference: state.userPreference
});

const mapDispatchToProps = () => ({

});

export default connect(mapReduxStateToProps, mapDispatchToProps)(Welcome);
