import {APP_INITIAL_STATE} from './appInitialState';

export default function reducer(state, {type, payload = {}}) {
    const actions = {
        RESET_STATE: APP_INITIAL_STATE,
        SET_AUTHENTICATED: {
            accessToken: payload.accessToken,
            authenticated: !!payload.accessToken,
            authenticating: false,
            authInitialized: payload.authInitialized || state.authInitialized,
            error: null,
            loggedOut: false,
            name: payload.name,
            userId: payload.userId,
        },
        SET_AUTHENTICATING: {
            ...APP_INITIAL_STATE,
            authenticating:
                payload.authenticating !== undefined ? payload.authenticating : true,
            authenticated: state.authenticated,
        },
        SET_ERROR: {
            authenticating: false,
            error: payload.error,
            loggedOut: payload.loggedOut || state.loggedOut,
        },
        SET_LOGGED_OUT: {
            ...APP_INITIAL_STATE,
            loggedOut: true,
        },
    };

    return {...state, ...actions[type]} || state;
}
