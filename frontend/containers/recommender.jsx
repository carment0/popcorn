/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

import React from 'react';
import { connect } from 'react-redux';
import './recommender.scss';


class Recommender extends React.Component {
  componentWillReceiveProps() {

  }

  render() {
    return <h1>This is Recommender</h1>;
  }
}

const mapReduxStateToProps = (state) => ({
  userPreference: state.userPreference
});

const mapDispatchToProps = () => ({

});

export default connect(mapReduxStateToProps, mapDispatchToProps)(Recommender);
