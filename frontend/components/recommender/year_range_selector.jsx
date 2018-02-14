/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

// Thirdparty imports
import React from 'react';
import PropTypes from 'prop-types';
import { Range } from 'rc-slider';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';

// Style imports
import './year_range_selector.scss';


class YearRangeSelector extends React.Component {
  state = {
    minYear: this.props.movieYearRange.minYear,
    maxYear: this.props.movieYearRange.maxYear
  };

  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    movieYearRange: PropTypes.object.isRequired,
    dispatchSetMovieYearRange: PropTypes.func.isRequired
  };

  handleChange = (value) => {
    this.setState({
      minYear: value[0],
      maxYear: value[1]
    });

    if (this.dispatchTimer) {
      clearTimeout(this.dispatchTimer);
    }

    this.dispatchTimer = setTimeout(() => {
      this.props.dispatchSetMovieYearRange(this.state.minYear, this.state.maxYear);
    }, 1000);
  }

  render() {
    const title = `Year: ${this.state.minYear} - ${this.state.maxYear}`;

    const popover = (
      <Popover id="popover-positioned-bottom" title={title} className="year-range-selector">
        <div className="instruction">
          <p>Slide to filter by year</p>
        </div>
        <div className="slider">
          <Range
            disabled={this.props.disabled}
            defaultValue={[this.state.minYear, this.state.maxYear]}
            min={1930}
            max={2018}
            allowCross={false}
            onChange={this.handleChange} />
        </div>
      </Popover>
    );

    return (
      <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
        <Button className="year-range-selector-trigger">Filter by year</Button>
      </OverlayTrigger>
    );
  }
}

export default YearRangeSelector;
