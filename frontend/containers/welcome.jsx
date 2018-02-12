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
import MovieIndex from '../components/welcome/movie_index';

// Store imports
import { allMoviesFetch } from '../store/movies/movie.action';

// Style
import './welcome.scss';


class Welcome extends React.Component {
  state = {
    isLoadingMovies: true
  };

  static propTypes = {
    movies: PropTypes.object.isRequired,
    dispatchAllMovieFetch: PropTypes.func.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.movies.all).length > 0) {
      this.setState({ isLoadingMovies: false });
    }
  }

  componentDidMount() {
    if (Object.keys(this.props.movies.all).length === 0) {
      this.props.dispatchAllMovieFetch();
    }
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
  movies: state.movies
});

const mapDispatchToProps = (dispatch) => ({
  dispatchAllMovieFetch: () => dispatch(allMoviesFetch())
});

export default connect(mapReduxStateToProps, mapDispatchToProps)(Welcome);
