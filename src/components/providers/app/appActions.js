function appAuthenticated(payload) {
    return {type: 'SET_AUTHENTICATED', payload};
}

function appAuthenticating(payload) {
    return {type: 'SET_AUTHENTICATING'};
}

function appError(payload) {
    return {type: 'SET_ERROR', payload};
}

function appResetState() {
    return {type: 'RESET_STATE'};
}

function appLoggedOut() {
    return {type: 'SET_LOGGED_OUT'};
}

const appActionsCreator = (dispatch) => {
    return {
        appAuthenticated: (payload) => dispatch(appAuthenticated(payload)),
        appAuthenticating: (payload) => dispatch(appAuthenticating(payload)),
        appError: (error) => dispatch(appError(error)),
        appResetState: () => dispatch(appResetState()),
        appLoggedOut: () => dispatch(appLoggedOut()),
    };
};

export default appActionsCreator;
