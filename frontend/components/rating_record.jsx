/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

// Thirdparty imports
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Component imports
import MovieItem from './movie_item';

// Store imports
import { movieDetailFetch, movieTrailerFetch } from '../store/movies/detail.action';
import { movieSkip } from '../store/movies/movie.action';
import { movieRatingPost } from '../store/movies/rating.action';

// Style imports
import './rating_record.scss';


class RatingRecord extends React.Component {
  static propTypes = {
    movieRatings: PropTypes.object.isRequired,
    movieDetails: PropTypes.object.isRequired,
    mostViewedMovies: PropTypes.object.isRequired,
    recommendedMovies: PropTypes.object.isRequired,
    dispatchMovieSkip: PropTypes.func.isRequired,
    dispatchMovieDetailFetch: PropTypes.func.isRequired,
    dispatchMovieRatingPost: PropTypes.func.isRequired,
    dispatchMovieTrailerFetch: PropTypes.func.isRequired
  };

  // TODO: I notice that we should have a Redux field for recording all the rated movies. Although it takes up a bit
  // more memory but the logic is definitely clearer.
  get ratedMovies() {
    const ratedMovieIds = Object.keys(this.props.movieRatings);
    return ratedMovieIds.map((movieId) => {
      const movie = this.props.mostViewedMovies[movieId] || this.props.recommendedMovies.items[movieId];
      return (
        <MovieItem
          isRecommendation={false}
          key={movie.id}
          movieId={movie.id}
          imdbId={movie.imdbId}
          rating={this.props.movieRatings[movieId]}
          movieDetail={this.props.movieDetails[movie.imdbId]}
          dispatchMovieSkip={this.props.dispatchMovieSkip}
          dispatchMovieDetailFetch={this.props.dispatchMovieDetailFetch}
          dispatchMovieRatingPost={this.props.dispatchMovieRatingPost}
          dispatchMovieTrailerFetch={this.props.dispatchMovieTrailerFetch} />
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
    dispatchMovieSkip: (movieId) => dispatch(movieSkip(movieId)),
    dispatchMovieDetailFetch: (imdbId) => dispatch(movieDetailFetch(imdbId)),
    dispatchMovieTrailerFetch: (imdbId) => dispatch(movieTrailerFetch(imdbId)),
    dispatchMovieRatingPost: (movieId, rating) => dispatch(movieRatingPost(movieId, rating))
  };
};

export default connect(mapReduxStateToProps, mapDispatchToProps)(RatingRecord);
