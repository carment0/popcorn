/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

// Thirdparty imports
import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';

// Style imports
import './movie_trailer_player.scss';


class MovieTrailerPlayer extends React.Component {
  state = {
    idx: 0
  };

  static propTypes = {
    videoSourceList: PropTypes.array.isRequired
  };

  handleVideoEnded = () => {
    let idx = this.state.idx;
    if (this.state.idx < this.props.videoSourceList.length) {
      idx += 1;
    }

    if (idx === this.props.videoSourceList.length) {
      idx = 0;
    }

    this.setState({ idx });
  };

  render() {
    if (this.props.videoSourceList.length > 0) {
      return (
        <ReactPlayer
          width="100%"
          height="450"
          onEnded={this.handleVideoEnded}
          url={this.props.videoSourceList[this.state.idx]}
          loop={true}
          playing={true} />
      );
    }
  }
}

export default MovieTrailerPlayer;
