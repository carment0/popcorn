/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

import React from 'react';
import PropTypes from 'prop-types';
import './popularity_selector.scss';


class PopularitySelector extends React.Component {
  state = {
    percentile: this.props.movieRatingCountPercentile
  };

  static propTypes = {
    movieRatingCountPercentile: PropTypes.number.isRequired,
    disabled: PropTypes.bool.isRequired,
    dispatchSetMovieRatingCountPercentile: PropTypes.func.isRequired
  };

  render() {
    return <div />;
  }
}

export default PopularitySelector;
