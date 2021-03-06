/**
 * Copyright 2016-present, Dennis Norton.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule appRoutes
 */

'use strict';

import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { App, HomePage, RedditPage, TodoPage, ProfilePage } from './pages';

const appRoutes = (store) => {
    const requireAuth = (nextState, replace) => {
        const { auth } = store.getState();
        
        if (!auth.isAuthenticated) {
            replace({
                pathname: '/',
                state: { nextPathname: nextState.location.pathname }
            });
        }
    };
    
    // Returns the routes for react-router
    return (
        <Route path='/' component={App} >
            <IndexRoute component={HomePage} />
            <Route path='reddit' component={RedditPage} />
            <Route path='todo' component={TodoPage} />
            <Route path='profile' onEnter={requireAuth} component={ProfilePage} />
        </Route>
    );
};

export default appRoutes;