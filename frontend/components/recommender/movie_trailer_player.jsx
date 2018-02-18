/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

// Thirdparty imports
import React from 'react';
import PropTypes from 'prop-types';

// Style imports
import './movie_trailer_player.scss';


class MovieTrailerPlayer extends React.Component {
  state = {
    playerReady: false,
  };

  static propTypes = {
    youtubeKeyList: PropTypes.array.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.youtubeKeyList.length !== 0 && this.state.playerReady) {
      this.videoIndex = 0;
      this.youtubePlayer.loadVideoById(nextProps.youtubeKeyList[this.videoIndex], 0);
    }
  }

  handleVideoReady = () => {
    this.videoIndex = 0;
    this.setState({ playerReady: true });
  };

  handleVideoStateChange = (state) => {
    if (state.data === YT.PlayerState.ENDED) {
      if (this.videoIndex < this.props.youtubeKeyList.length) {
        this.videoIndex += 1;
      }

      if (this.videoIndex === this.props.youtubeKeyList.length) {
        this.videoIndex = 0;
      }

      this.youtubePlayer.loadVideoById(this.props.youtubeKeyList[this.videoIndex], 0);
    }
  };

  componentDidMount() {
    if (this.props.youtubeKeyList.length > 0) {
      const options = {
        width: '756',
        height: '425',
        videoId: this.props.youtubeKeyList[0],
        events: {
          onReady: this.handleVideoReady,
          onStateChange: this.handleVideoStateChange
        }
      };

      this.youtubePlayer = new YT.Player('movie-trailer-player', options);
    }
  }

  render() {
    return <section id="movie-trailer-player" />;
  }
}

export default MovieTrailerPlayer;
