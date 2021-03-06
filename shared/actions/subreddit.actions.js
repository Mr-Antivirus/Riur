/**
 * Copyright 2016-present, Dennis Norton.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule subreddit.actions
 */

'use strict';

import fetch from 'isomorphic-fetch';
import { SELECT_SUBREDDIT, INVALIDATE_SUBREDDIT, RECEIVE_POSTS, REQUEST_POSTS } from '../constants';

/*
* Action Creators
*/

export const selectSubreddit = (subreddit) => {
    return {
        type: SELECT_SUBREDDIT,
        subreddit
    };
};

export const invalidateSubreddit = (subreddit) => {
    return {
        type: INVALIDATE_SUBREDDIT,
        subreddit
    }
};

const requestPosts = (subreddit) => {
    return {
        type: REQUEST_POSTS,
        subreddit
    }
};

const receivePosts = (subreddit, posts) => {
    return {
        type: RECEIVE_POSTS,
        subreddit,
        posts: posts,
        receivedAt: Date.now()
    }
};

export const fetchPosts = (subreddit) => {
    return (dispatch) => {
        // First dispatch: the app state is updated to inform
        //  the the API call is starting.
        dispatch(requestPosts(subreddit));
        
        return fetch(`https://www.reddit.com/r/${subreddit}.json`)
            .then(response => response.json())
            
            // We can dispatch as many times as we want
            // This time, to update the state with the results.
            .then(json => {
                const redditData = json.data.children.map(child => child.data);
                return dispatch(receivePosts(subreddit, redditData));
            });
    };
};

const shouldFetchPosts = (state, subreddit) => {
    const posts = state.postsBySubreddit.get(subreddit);
    
    if (!posts) {
        return true;
    } else if (posts.get('isFetching')) {
        return false;
    } else {
        return posts.get('didInvalidate');
    }
};

export const fetchPostsIfNeeded = (subreddit) => {
    return (dispatch, getState) => {
        if (shouldFetchPosts(getState(), subreddit)) {
            return dispatch(fetchPosts(subreddit));
        } else {
            return Promise.resolve();
        }
    };
};