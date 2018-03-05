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
import {
  allMoviesFetch,
  personalizedRecommendedMoviesFetch,
  recommendedMoviesFetch
} from '../store/movies/movie.action';

// Style imports
import './recommender.scss';


class Recommender extends React.Component {
  state = {
    recommendedMovieChanged: 0,
  }
  static propTypes = {
    session: PropTypes.object.isRequired,
    movies: PropTypes.object.isRequired,
    movieRatings: PropTypes.object.isRequired,
    movieYearRange: PropTypes.object.isRequired,
    moviePopularityPercentile: PropTypes.number.isRequired,
    dispatchAllMovieFetch: PropTypes.func.isRequired,
    dispatchPersonalizedRecommendedMoviesFetch: PropTypes.func.isRequired,
    dispatchRecommendedMoviesFetch: PropTypes.func.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    const numberOfRecommendationRated = Object.keys(nextProps.movieRatings).length !== Object.keys(this.props.movieRatings).length;
    const numberOfRecommendationSkipped = Object.keys(nextProps.movies.skipped).length !== Object.keys(this.props.movies.skipped).length;

    if (numberOfRecommendationRated || numberOfRecommendationSkipped) {
      let num = this.state.recommendedMovieChanged;
      num += 1;
      this.setState({ recommendedMovieChanged: num });
    }
    console.log(this.state.recommendedMovieChanged);
    if (this.props.session.currentUser !== null) {
      // When user just signed in and fetched the stored ratings from database, fetch recommendations.
      if (Object.keys(this.props.movieRatings).length === 0 && Object.keys(nextProps.movieRatings).length >= 10) {
        this.props.dispatchPersonalizedRecommendedMoviesFetch(
          this.props.session,
          this.props.movieYearRange,
          this.props.moviePopularityPercentile,
          this.props.movies.skipped
        );
      }

      // When user modifies the query parameters, fetch recommendations.
      if (
        this.props.movieYearRange.minYear !== nextProps.movieYearRange.minYear
        || this.props.movieYearRange.maxYear !== nextProps.movieYearRange.maxYear
        || this.props.moviePopularityPercentile !== nextProps.moviePopularityPercentile
      ) {
        this.props.dispatchPersonalizedRecommendedMoviesFetch(
          this.props.session,
          nextProps.movieYearRange,
          nextProps.moviePopularityPercentile,
          nextProps.movies.skipped
        );
      }
    } else if (Object.keys(nextProps.movieRatings).length >= 10 && this.state.recommendedMovieChanged === 9) {
      this.props.dispatchRecommendedMoviesFetch(
        nextProps.movieYearRange,
        nextProps.moviePopularityPercentile,
        nextProps.movies.skipped,
        this.props.movieRatings
      );
    }
  }

  componentDidMount() {
    if (Object.keys(this.props.movies.all).length === 0) {
      this.props.dispatchAllMovieFetch();
    }

    if (Object.keys(this.props.movieRatings).length >= 10) {
      if (this.props.session.currentUser !== null) {
        this.props.dispatchPersonalizedRecommendedMoviesFetch(
          this.props.session,
          this.props.movieYearRange,
          this.props.moviePopularityPercentile,
          this.props.movies.skipped
        );
      } else {
        this.props.dispatchRecommendedMoviesFetch(
          this.props.movieYearRange,
          this.props.moviePopularityPercentile,
          this.props.movies.skipped,
          this.props.movieRatings
        );
      }
    }
  }

  render() {
    if (Object.keys(this.props.movieRatings).length < 10) {
      return (
        <section className="recommender">
          <header>
            <h3>Recommendations are not ready</h3>
            <p>{"You haven't rated enough movies for the system to recommend you anything."}</p>
          </header>
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
  movies: state.movies,
  movieRatings: state.movieRatings,
  movieYearRange: state.movieYearRange,
  moviePopularityPercentile: state.moviePopularityPercentile
});

const mapDispatchToProps = (dispatch) => ({
  dispatchAllMovieFetch: () => dispatch(allMoviesFetch()),
  dispatchPersonalizedRecommendedMoviesFetch: (session, yearRange, percentile, skipped) => {
    return dispatch(personalizedRecommendedMoviesFetch(session, yearRange, percentile, skipped));
  },
  dispatchRecommendedMoviesFetch: (yearRange, percentile, skipped, ratings) => {
    return dispatch(recommendedMoviesFetch(yearRange, percentile, skipped, ratings));
  }
});

export default connect(mapReduxStateToProps, mapDispatchToProps)(Recommender);
