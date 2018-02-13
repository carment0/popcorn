/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

// Thirdparty imports
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Component imports
import RatingRecord from '../components/rating_record';
import RecommendationIndex from '../components/recommender/recommendation_index';

// Store imports
import { allMoviesFetch } from '../store/movies/movie.action';

// Style imports
import './recommender.scss';


class Recommender extends React.Component {
  static propTypes = {
    movies: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    dispatchAllMovieFetch: PropTypes.func.isRequired
  };

  componentWillReceive(nextProps) {
    if (this.props.movies.rated.size !== nextProps.movies.rated.size) {
      console.log('Rated movie set has changed!');
    }
  }

  componentDidMount() {
    if (Object.keys(this.props.movies.all).length === 0) {
      this.props.dispatchAllMovieFetch();
    }
  }

  get greeting() {
    if (this.props.session.currentUser) {
      return `Hi, ${this.props.session.currentUser.username}`;
    }

    return 'Hello there';
  }

  render() {
    if (this.props.movies.recommended.size !== 0) {
      return (
        <section className="recommender">
          <h3>Recommendations are not ready</h3>
        </section>
      );
    }

    return (
      <section className="recommender">
        <RecommendationIndex />
        <RatingRecord />
      </section>
    );
  }
}

const mapReduxStateToProps = (state) => ({
  session: state.session,
  movies: state.movies
});

const mapDispatchToProps = (dispatch) => ({
  dispatchAllMovieFetch: () => dispatch(allMoviesFetch())
});

export default connect(mapReduxStateToProps, mapDispatchToProps)(Recommender);
