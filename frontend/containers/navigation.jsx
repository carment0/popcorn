/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Nav } from 'react-bootstrap';
import { NavItem } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import Indicator from '../components/indicator';
import './navigation.scss';


class Navigation extends React.Component {
  state = { activeKey: 1 };

  static propTypes = {
    history: PropTypes.object.isRequired,
    userPreference: PropTypes.object.isRequired
  };

  handleTabSelect = (key) => {
    this.setState({ activeKey: key });

    switch (key) {
      case 1:
        if (this.props.history.location.pathname !== '/recommend') {
          this.props.history.push('recommend');
        }
        break;
      case 2:
        window.open('https://github.com/carment0/popcorn');
        break;
    }
  };

  render() {
    return (
      <section className="navigation">
        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/#">Popcorn</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight onSelect={this.handleTabSelect}>
              <NavItem eventKey={0} id="indicator">
                <Indicator isFetching={this.props.userPreference.isFetching} />
              </NavItem>
              <NavItem eventKey={1}>Recommendations</NavItem>
              <NavItem eventKey={2}>Github</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </section>
    );
  }
}

const mapReduxStateToProps = (state) => ({ userPreference: state.userPreference });
const mapDispatchToProps = () => ({});

export default connect(mapReduxStateToProps, mapDispatchToProps)(Navigation);
