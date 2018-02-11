/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

// Thirdparty imports
import React from 'react';
import PropTypes from 'prop-types';


class MovieItem extends React.Component {
  static propTypes = {
    movieId: PropTypes.number.isRequired
  };

  componentWillReceiveProps() {
  }

  render() {
    return <article>{this.props.movieId}</article>;
  }
}

export default MovieItem;
