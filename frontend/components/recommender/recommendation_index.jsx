/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

// Thirdparty imports
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';

// Component imports
import MovieTrailerPlayer from './movie_trailer_player';
import YearRangeSelector from './year_range_selector';
import PopularitySelector from './popularity_selector';

// Store imports
import { setMovieYearRange } from '../../store/movies/year_range.action';
import { setMoviePopularityPercentile } from '../../store/movies/percentile.action';


// Style imports
import './recommendation_index.scss';


class RecommendationIndex extends React.Component {
  state = {
    activeTrailer: []
  };

  static propTypes = {
    movies: PropTypes.object.isRequired,
    movieTrailers: PropTypes.object.isRequired,
    movieYearRange: PropTypes.object.isRequired,
    moviePopularityPercentile: PropTypes.number.isRequired,
    dispatchSetMovieYearRange: PropTypes.func.isRequired,
    dispatchSetMoviePopularityPercentile: PropTypes.func.isRequired
  }

  playTrailer = (imdbId) => {
    if (this.props.movieTrailers[imdbId] && this.props.movieTrailers[imdbId].length > 0) {
      this.setState({
        activeTrailer: this.props.movieTrailers[imdbId]
      });
    }
  };

  get filters() {
    return (
      <section className="filters">
        <YearRangeSelector
          disabled={false}
          movieYearRange={this.props.movieYearRange}
          dispatchSetMovieYearRange={this.props.dispatchSetMovieYearRange} />

        <PopularitySelector
          dispatchSetMoviePopularityPercentile={this.props.dispatchSetMoviePopularityPercentile}
          moviePopularityPercentile={this.props.moviePopularityPercentile}
          disabled={false} />
      </section>
    );
  }

  get trailerPlayer() {
    if (this.state.activeTrailer.length > 0) {
      return (
        <section className="trailer-player">
          <MovieTrailerPlayer videoSourceList={this.state.activeTrailer} />
        </section>
      );
    }

    const movieIMDBIds = Object.keys(this.props.movieTrailers);
    if (movieIMDBIds.length > 0) {
      const randomIndex = Math.floor(Math.random() * movieIMDBIds.length);
      const randomImdbId = movieIMDBIds[randomIndex];
      return (
        <section className="trailer-player">
          <MovieTrailerPlayer videoSourceList={this.props.movieTrailers[randomImdbId]} />
        </section>
      );
    }

    return <section className="trailer-player" />;
  }

  get recommendedMovies() {
    return this.props.movies.recommended;
  }

  get movies() {
    if (this.props.movies.recommended.size === 0) {
      return (
        <section className="movies">
          <div className="circular-progress">
            <h4>Please wait while recommendations are fetching...</h4>
            <CircularProgress size={100} thickness={7} />
          </div>
        </section>
      );
    }

    return (
      <section className="movies">
        {this.recommendedMovies}
      </section>
    );
  }

  render() {
    return (
      <section className="recommendation-index">
        <header>
          <h1>Recommendations</h1>
        </header>
        {this.filters}
        {this.trailerPlayer}
        {this.movies}
      </section>
    );
  }
}

const mapReduxStateToProps = (state) => ({
  movieTrailers: state.movieTrailers,
  movieYearRange: state.movieYearRange,
  moviePopularityPercentile: state.moviePopularityPercentile,
  movies: state.movies
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSetMovieYearRange: (minYear, maxYear) => dispatch(setMovieYearRange(minYear, maxYear)),
  dispatchSetMoviePopularityPercentile: (percentile) => dispatch(setMoviePopularityPercentile(percentile))
});

export default connect(mapReduxStateToProps, mapDispatchToProps)(RecommendationIndex);
