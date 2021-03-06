/**
 * Copyright 2016-present, Dennis Norton.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule auth.actions
 */

'use strict';

import { push } from 'react-router-redux';
import fetch from '../utils/fetch';
import { fromJS } from 'immutable';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

const requestLogin = (creds) => {
    return {
        type: LOGIN_REQUEST,
        isFetching: true,
        isAuthenticated: false,
        creds
    };
};

const receiveLogin = (user) => {
    return {
        type: LOGIN_SUCCESS,
        isFetching: false,
        isAuthenticated: true,
        user
    };
};

const loginError = (message) => {
    return {
        type: LOGIN_FAILURE,
        isFetching: false,
        isAuthenticated: false,
        message
    };
};

export const loginUser = (creds) => {
    return ( dispatch ) => {
        dispatch(requestLogin(creds));
        
        return fetch.post('/auth/login', JSON.stringify(creds))
            .then(handleErrors)
            .then(response => response.json())
            .then(data => {
                const user = fromJS(data);
                
                dispatch(receiveLogin(user));
                
                // You probably want to dispatch a toast and delay redirect
                dispatch(push('/profile'));
            })
            .catch(err => {
                dispatch(loginError(err.message));
                return Promise.reject(err);
            });
    };
};

export const registerUser = (creds) => {
    return ( dispatch ) => {
        dispatch(requestLogin(creds));
        
        return fetch.post('/auth/signup', JSON.stringify(creds))
            .then(handleErrors)
            .then(response => response.json())
            .then(data => {
                const user = fromJS(data);
                
                dispatch(receiveLogin(user));
                
                // You probably want to dispatch a toast and delay redirect
                dispatch(push('/profile'));
            })
            .catch(err => {
                dispatch(loginError(err.message));
                return Promise.reject(err);
            });
    };
};

// TODO: Make this server only
export const serverLogin = (user) => {
    return (dispatch) => {
        return dispatch(receiveLogin(user));
    };
};



export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

const requestLogout = () => {
    return {
        type: LOGOUT_REQUEST,
        isFetching: true,
        isAuthenticated: true
    }
}

const receiveLogout = () => {
    return {
        type: LOGOUT_SUCCESS,
        isFetching: false,
        isAuthenticated: false
    }
}

const logoutError = (message) => {
    return {
        type: LOGOUT_FAILURE,
        isFetching: false,
        isAuthenticated: false,
        message
    };
};

export const logoutUser = () => {
    return ( dispatch ) => {
        dispatch(requestLogout());
        
        return fetch.get('/auth/logout')
            .then(handleErrors)
            .then((response) => {
                dispatch(receiveLogout());
                
                // You probably want to dispatch a toast and delay redirect                
                dispatch(push('/'));
            })
            .catch(err => {
                dispatch(logoutError(err.message));
                return Promise.reject(err);
            });
    };
};

export const CLEAR_ERROR_MESSAGE = 'CLEAR_ERROR_MESSAGE';

export const clearErrorMessage = () => {
    return {
        type: CLEAR_ERROR_MESSAGE
    }
};

const handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.headers.get("X-Error-Message"));
    }
    return response;
};