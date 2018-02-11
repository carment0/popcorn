/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

// Thirdparty
import React from 'react';
import { connect } from 'react-redux';

// Style imports
import './recommender.scss';


class Recommender extends React.Component {
  componentWillReceiveProps() {

  }

  get greeting() {
    return <h2>{this.props.currentUser ? `Welcome back ${this.props.currentUser.username}` : 'Welcome bitch'}</h2>;
  }

  render() {
    return (
      <section>
        <h1>Welcome to Recommender</h1>
        {this.greeting}
      </section>
    );
  }
}

const mapReduxStateToProps = (state) => ({
  userPreference: state.userPreference,
  currentUser: state.session.currentUser
});

const mapDispatchToProps = () => ({

});

export default connect(mapReduxStateToProps, mapDispatchToProps)(Recommender);
