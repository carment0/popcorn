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

// Style imports
import './recommendation_index.scss';


class RecommendationIndex extends React.Component {
  state = {
    activeTrailer: []
  };

  static propTypes = {
    movies: PropTypes.object.isRequired,
    movieTrailers: PropTypes.object.isRequired
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
        <YearRangeSelector disabled={this.props.movies.recommended.size === 0} />
        <PopularitySelector disbaled={this.props.movies.recommended.size === 0} />
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
  movies: state.movies
});

const mapDispatchToProps = () => ({

});

export default connect(mapReduxStateToProps, mapDispatchToProps)(RecommendationIndex);
