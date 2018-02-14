/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng, Carmen To
 */

import { SET_MOVIE_POPULARITY_PERCENTILE } from './percentile.action';

export default function moviePopularityPercentileReducer(state = 0, action) {
  switch (action.type) {
    case SET_MOVIE_POPULARITY_PERCENTILE:
      return action.percentile;
    default:
      return state;
  }
}
