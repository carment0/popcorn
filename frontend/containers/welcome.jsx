/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

// Thirdparty imports
import React from 'react';
import { connect } from 'react-redux';

// Component imports
import RatingRecord from '../components/rating_record';
import MovieIndex from '../components/welcome/movie_index';

// Style
import './welcome.scss';


class Welcome extends React.Component {
  componentWillReceiveProps() {
  }

  render() {
    return (
      <section className="welcome">
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
