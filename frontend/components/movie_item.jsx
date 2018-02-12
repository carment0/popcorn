/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

// Thirdparty imports
import React from 'react';
import PropTypes from 'prop-types';
import Spinner from 'spin';
import Rating from 'react-rating';
import { OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import FlatButton from 'material-ui/FlatButton';

// Style
import './movie_item.scss';


class MovieItem extends React.Component {
  static propTypes = {
    movieDetail: PropTypes.object,
    playTrailer: PropTypes.func,
    movieRating: PropTypes.number,
    movieTrailers: PropTypes.array,
    movieId: PropTypes.number.isRequired,
    imdbId: PropTypes.string.isRequired,
    isRecommendation: PropTypes.bool.isRequired,
    dispatchMovieSkip: PropTypes.func.isRequired,
    dispatchMovieRatingPost: PropTypes.func.isRequired,
    dispatchMovieTrailerFetch: PropTypes.func.isRequired,
    dispatchMovieDetailFetch: PropTypes.func.isRequired
  };

  static defaultProps = {
    movieRating: undefined,
    movieTrailers: undefined,
    movieDetail: {
      isDefaultProp: true,
      title: 'Loading...',
      year: '....',
      plot: 'Loading...'
    },
    playTrailer: () => {}
  };

  /**
   * Initiate fetching metadata of the current movie and spinning the loading bar so user knows that it is fetching
   * something.
   */
  fetchMovieDetail = () => {
    if (this.props.movieDetail.isDefaultProp) {
      this.spinner = new Spinner().spin();
      document.getElementById(this.props.movieId).appendChild(this.spinner.el);
      this.props.dispatchMovieDetailFetch(this.props.imdbId);
    }
  };

  /**
   * Save movie rating to server.
   */
  handleRatingSelect = (ratingValue) => {
    this.props.dispatchMovieRatingPost(this.props.movieId, ratingValue);
  };

  /**
   * Label a movie as skipped in Redux store.
   */
  handleMovieSkip = () => {
    this.props.dispatchMovieSkip(this.props.movieId);
  };

  /**
   * Play a movie trailer
   */
  handleTrailerPlay = () => {
    this.props.playTrailer(this.props.imdbId);
  };

  get poster() {
    if (this.props.movieDetail.poster) {
      return (
        <section className="poster">
          <img id={this.props.movieId} src={this.props.movieDetail.poster} alt="poster" />
        </section>
      );
    }

    return <section className="poster" />;
  }

  get ratedItemContent() {
    const tooltip = (
      <Tooltip id="tooltip">
        Your rating: <strong>{this.props.movieRating}</strong>
      </Tooltip>
    );

    return (
      <section className="rated movie-item" id={this.props.movieId}>
        <OverlayTrigger trigger="click" rootClose placement="bottom" overlap={tooltip}>
          {this.poster}
        </OverlayTrigger>
      </section>
    );
  }

  get recommendedItemContent() {
    const buttons = [];

    // When there is no movie trailers, we shouldn't even show a button to prompt user to play trailer.
    if (this.props.movieTrailers && this.props.movieTrailers.length > 0) {
      buttons.push(
        <FlatButton key="play"
          label="Play Trailer"
          primary={true}
          onTouchTap={this.handleTrailerPlay}
          onClick={this.handleTrailerPlay} />
      );
    }

    buttons.push(
      <FlatButton key="skip"
        label="Not Interested"
        secondary={true}
        onTouchTap={this.handleMovieSkip}
        onClick={this.handleMovieSkip} />
    );

    return (
      <article className="recommended movie-item" id={this.props.movieId}>
        <section className="content-box">
          <aside className="left">
            {this.poster}
          </aside>
          <aside className="right">
            <h3 className="title"><strong>{this.props.movieDetail.title}</strong>{this.props.movieDetail.year}</h3>
            <div className="plot">{this.props.movieDetail.plot}</div>
            <div className="rating-toolbar" >
              <div className="star-toolbar-container">
                <Rating fractions={2} onClick={this.handleRatingSelect} />
              </div>
              <div className="button-container">{buttons}</div>
            </div>
          </aside>
        </section>
      </article>
    );
  }

  get itemContent() {
    const titleString = this.props.movieDetail.title + ' - ' + this.props.movieDetail.year;
    const popover = (
      <Popover id="popover-trigger-click-root-close" title={titleString}>
        {this.props.movieDetail.plot}
      </Popover>
    );

    return (
      <article className="default movie-item" id={this.props.movieId}>
        <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={popover}>
          {this.poster}
        </OverlayTrigger>
        <div className="rating-toolbar">
          <div className="star-toolbar-container">
            <Rating fractions={2} onClick={this.handleRatingSelect} />
          </div>
        </div>
      </article>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.movieDetail.isDefaultProp && this.spinner) {
      this.spinner.stop();
    }
  }

  componentDidMount() {
    this.fetchMovieDetail();
    if (this.props.isRecommendation && this.props.movieTrailers === undefined) {
      this.props.dispatchMovieTrailerFetch(this.props.imdbId);
    }
  }

  render() {
    if (this.props.movieRating) {
      return this.ratedItemContent;
    }

    if (this.props.isRecommendation) {
      return this.recommendedItemContent;
    }

    return this.itemContent;
  }
}

export default MovieItem;
