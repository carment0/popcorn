/**
 * @copyright Popcorn, 2018
 * @author Calvin Feng
 */

import merge from 'lodash/merge';
import { MOVIE_TRAILER_FETCH_SUCCESS, MOVIE_TRAILER_FETCH_FAIL } from './trailer.action';

const YouTube = 'YouTube';

export default function movieTrailerReducer(state = {}, action) {
  Object.freeze(state);

  switch (action.type) {
    case MOVIE_TRAILER_FETCH_SUCCESS:
      const results = action.payload.results;

      // Currently we only support movie trailers on YouTube, will consider supporting Vimeo in the future.
      const youtubeVidoeKeyList = [];
      results.forEach((trailerSearchResult) => {
        if (trailerSearchResult.site === YouTube) {
          youtubeVidoeKeyList.push(trailerSearchResult.key);
        }
      });

      const newState = {};

      if (youtubeVidoeKeyList.length > 0) {
        newState[action.imdbId] = youtubeVidoeKeyList;
      }

      return merge({}, state, newState);

    case MOVIE_TRAILER_FETCH_FAIL:
      console.log(`Failed to fetch movie trailer for movie ${action.imdbId}`, action.error);
      return state;

    default:
      return state;
  }
}
