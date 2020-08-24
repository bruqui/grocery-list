import React, {createContext, useContext} from 'react';
import PropTypes from 'prop-types';

import {APP_INITIAL_STATE} from './app/appInitialState';

const DEFAULT_CONTEXT = {
    ...APP_INITIAL_STATE,
};

const AppStateContext = createContext(DEFAULT_CONTEXT);

// Keeping this export despite not using it at this time. It will be for other apps
// that will potentially use it.
/* eslint-disable import/no-unused-modules */
export function useAppStateProvider() {
    return useContext(AppStateContext);
}
/* eslint-enable */

export default function AppStateProvider({appState, children}) {
    return (
        <AppStateContext.Provider value={appState}>{children}</AppStateContext.Provider>
    );
}

AppStateProvider.propTypes = {
    appState: PropTypes.object,
    children: PropTypes.node,
};
