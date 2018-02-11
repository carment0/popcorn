/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

import React from 'react';
import { connect } from 'react-redux';

import RatingRecord from '../components/rating_record';
import MovieIndex from '../components/welcome/movie_index';


class Welcome extends React.Component {
  componentWillReceiveProps() {

  }

  render() {
    return (
      <section className="landing-page">
        <MovieIndex />
        <RatingRecord />
      </section>
    );
  }
}

const mapReduxStateToProps = (state) => ({
  userPreference: state.userPreference
});

const mapDispatchToProps = () => ({

});

export default connect(mapReduxStateToProps, mapDispatchToProps)(Welcome);
