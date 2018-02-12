/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

// Thirdparty
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Store
import allMoviesFetch from '../store/movies/movie.action';

// Style imports
import './recommender.scss';


class Recommender extends React.Component {
  static propTypes = {
    movies: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    dispatchAllMovieFetch: PropTypes.func.isRequired
  };

  componentDidMount() {
    if (Object.keys(this.props.movies.all).length === 0) {
      this.props.dispatchAllMovieFetch();
    }
  }

  get greeting() {
    return (
      <h2>
        {this.props.session.currentUser ? `Welcome back ${this.props.session.currentUser.username}` : 'Recommender'}
      </h2>
    );
  }

  render() {
    return (
      <section>
        {this.greeting}
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
