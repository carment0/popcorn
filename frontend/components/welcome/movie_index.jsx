/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

// Thirdparty imports
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import LinearProgress from 'material-ui/LinearProgress';

// Component imports
import MovieItem from '../movie_item';
import PosterSlider from './poster_slider';

// Store imports
import { mostViewedMoviesFetch, movieSkip } from '../../store/movies/movie.action';
import { movieDetailFetch, movieTrailerFetch } from '../../store/movies/detail.action';
import { movieRatingPost } from '../../store/movies/rating.action';

// Style imports
import './movie_index.scss';


class MovieIndex extends React.Component {
  state = {
    displayMovies: {}
  };

  static propTypes = {
    movieDetails: PropTypes.object.isRequired,
    movieRatings: PropTypes.object.isRequired,
    movies: PropTypes.object.isRequired,
    dispatchMovieSkip: PropTypes.func.isRequired,
    dispatchMovieDetailFetch: PropTypes.func.isRequired,
    dispatchMovieTrailerFetch: PropTypes.func.isRequired,
    dispatchMovieRatingPost: PropTypes.func.isRequired,
    dispatchMostViewedMoviesFetch: PropTypes.func.isRequired
  };

  handleButtonClickMoreMovies = () => {
    if (Object.keys(this.props.movies.mostViewed).length > 0) {
      this.randomlySetMoviesOnDisplay(this.props.movies.mostViewed);
    } else {
      this.props.dispatchMostViewedMoviesFetch();
    }
  }

  randomlySetMoviesOnDisplay(mostViewedMovies) {
    if (Object.keys(mostViewedMovies).length > 0) {
      const displayMovies = {};
      _.shuffle(Object.keys(mostViewedMovies)).slice(0, 12).forEach((movieId) => {
        const movie = mostViewedMovies[movieId];
        displayMovies[movieId] = movie;
      });
      this.setState({ displayMovies });
    }
  }

  componentDidMount() {
    if (Object.keys(this.props.movies.mostViewed).length === 0) {
      this.props.dispatchMostViewedMoviesFetch();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(this.state.displayMovies).length === 0) {
      this.randomlySetMoviesOnDisplay(nextProps.movies.mostViewed);
    }
  }

  get instruction() {
    const instruction = `These are some of the most viewed American films. We think it is very likely that you have
    seen at least some of them.  If you have seen them, whether you like or dislike them, let us know and give them
    ratings! It will help our backend machine learning algorithm to learn your taste and preference`;
    const ratingCount = Object.keys(this.props.movieRatings).length;
    if (ratingCount === 0) {
      return (
        <div className="instruction">
          <p>{instruction}</p>
          <h4>As soon as 10 movies are rated, the recommender system will get to work!</h4>
        </div>
      );
    } else if (ratingCount >= 10) {
      return (
        <div className="instruction">
          <p>{instruction}</p>
          <h4>Recommendations are ready!</h4>
        </div>
      );
    }

    return (
      <div className="instruction">
        <p>{instruction}</p>
        <h4>Rate <strong>{10 - ratingCount}</strong> more movies</h4>
      </div>
    );
  }

  get mostViewedMovieItems() {
    const movieRatings = this.props.movieRatings;

    // Only serve movies that haven't been rated
    const unratedMovieIds = Object.keys(this.state.displayMovies).filter((movieId) => {
      return movieRatings[movieId] === undefined;
    });

    return unratedMovieIds.sort().map((movieId) => {
      const movie = this.state.displayMovies[movieId];
      return (
        <MovieItem
          isRecommendation={false}
          key={movie.id}
          movieId={movie.id}
          imdbId={movie.imdb_id}
          movieDetail={this.props.movieDetails[movie.imdb_id]}
          dispatchMovieSkip={this.props.dispatchMovieSkip}
          dispatchMovieRatingPost={this.props.dispatchMovieRatingPost}
          dispatchMovieDetailFetch={this.props.dispatchMovieDetailFetch}
          dispatchMovieTrailerFetch={this.props.dispatchMovieTrailerFetch}  />
      );
    });
  }

  render() {
    const progressPercentage = (100 * Object.keys(this.props.movieRatings).length) / 10;
    if (Object.keys(this.props.movies.mostViewed).length === 0) {
      return (
        <article className="movie-index">
          <section className="header">
            <h1>Popular Movies</h1>
          </section>
          <section className="fetching-progress">
            <h5>Please wait while movies are fetching</h5>
            <LinearProgress mode="indeterminate" />
          </section>
        </article>
      );
    }

    return (
      <article className="movie-index">
        <section className="header">
          <h1>Popular Movies</h1>
        </section>
        <PosterSlider
          movies={this.state.moviesOnDisplay}
          movieDetails={this.props.movieDetails} />
        {this.instruction}
        <LinearProgress mode="determinate" value={progressPercentage} />
        <div className="movies">
          { this.mostViewedMovieItems }
        </div>
        <section className="footer">
          <Button
            disabled={this.state.isMovieSetLoading}
            bsSize="xsmall"
            className="react-buttons"
            onClick={this.handleClickMoreMovies}
            bsStyle="primary">
            Load more movies
          </Button>
        </section>
      </article>
    );
  }
}

const mapReduxStateToProps = (state) => {
  return {
    movies: state.movies,
    movieDetails: state.movieDetails,
    movieRatings: state.movieRatings
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchMostViewedMoviesFetch: () => dispatch(mostViewedMoviesFetch()),
    dispatchMovieSkip: (movieId) => dispatch(movieSkip(movieId)),
    dispatchMovieDetailFetch: (imdbId) => dispatch(movieDetailFetch(imdbId)),
    dispatchMovieTrailerFetch: (imdbId) => dispatch(movieTrailerFetch(imdbId)),
    dispatchMovieRatingPost: (movieId, rating) => dispatch(movieRatingPost(movieId, rating))
  };
};

export default connect(mapReduxStateToProps, mapDispatchToProps)(MovieIndex);
