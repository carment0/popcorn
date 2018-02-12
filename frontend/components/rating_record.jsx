/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

// Thirdparty imports
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Component imports
import RatedMovieItem from './rated_movie_item';

// Store imports
import { movieDetailFetch } from '../store/movies/detail.action';

// Style imports
import './rating_record.scss';


class RatingRecord extends React.Component {
  static propTypes = {
    movieRatings: PropTypes.object.isRequired,
    movieDetails: PropTypes.object.isRequired,
    mostViewedMovies: PropTypes.object.isRequired,
    recommendedMovies: PropTypes.object.isRequired,
    dispatchMovieDetailFetch: PropTypes.func.isRequired,
  };

  get ratedMovies() {
    const ratedMovieIds = Object.keys(this.props.movieRatings);
    return ratedMovieIds.map((movieId) => {
      const movie = this.props.mostViewedMovies[movieId] || this.props.recommendedMovies.items[movieId];
      return (
        <RatedMovieItem
          key={movie.id}
          movieId={movie.id}
          imdbId={movie.imdb_id}
          movieRating={this.props.movieRatings[movieId]}
          movieDetail={this.props.movieDetails[movie.imdb_id]}
          dispatchMovieDetailFetch={this.props.dispatchMovieDetailFetch} />
      );
    });
  }

  render() {
    return (
      <div className="rating-record-container">
        <div className="movies">
          {this.ratedMovies}
        </div>
      </div>
    );
  }
}

const mapReduxStateToProps = (state) => {
  return {
    movieRatings: state.movieRatings,
    movieDetails: state.movieDetails,
    mostViewedMovies: state.movies.mostViewed,
    recommendedMovies: state.movies.recommended
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchMovieDetailFetch: (imdbId) => dispatch(movieDetailFetch(imdbId))
  };
};

export default connect(mapReduxStateToProps, mapDispatchToProps)(RatingRecord);
