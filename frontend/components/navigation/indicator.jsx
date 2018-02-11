/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

import React from 'react';
import PropTypes from 'prop-types';
import RefreshIndicator from 'material-ui/RefreshIndicator';


const Indicator = (props) => {
  const style = {
    display: 'flex',
    position: 'relative'
  };

  if (props.isFetching) {
    return (
      <div className="indicator">
        <RefreshIndicator size={50} left={0} top={0} loadingColor="#FF9800" status="loading" style={style} />
      </div>
    );
  }

  return (
    <div className="indicator">
      <RefreshIndicator size={50} left={0} top={0} loadingColor="#FF9800" status="hide" style={style} />
    </div>
  );
};

Indicator.propTypes = {
  isFetching: PropTypes.bool.isRequired
};

export default Indicator;
