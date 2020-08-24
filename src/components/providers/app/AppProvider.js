import React, {useMemo, useReducer} from 'react';
import PropTypes from 'prop-types';
import {ApolloProvider} from '@apollo/react-hooks';

import appActionsCreator from './appActions';
import {APP_INITIAL_STATE} from './appInitialState';
import {useApolloInit} from 'graphql/client';

import appReducer from './appReducer';
import AppStateProvider from '../AppStateProvider';
import AuthProvider from '../AuthProvider';
import ErrorHandlingProvider from '../ErrorHandlingProvider';
import LoadingProvider from '../LoadingProvider';
import NotificationProvider from '../NotificationProvider';
import StorageProvider from '../StorageProvider';

export default function AppProvider({children, pageProps}) {
    const [appState, appDispatch] = useReducer(appReducer, APP_INITIAL_STATE);
    const appActions = useMemo(() => appActionsCreator(appDispatch), [appDispatch]);
    const apolloClient = useApolloInit({
        appActions,
        getAppState: () => appState,
        initialState: pageProps.initialApolloState,
    });

    return (
        <AppStateProvider appState={appState} appActions={appActions}>
            <StorageProvider>
                <NotificationProvider>
                    <ErrorHandlingProvider appState={appState} appActions={appActions}>
                        <LoadingProvider>
                            <AuthProvider
                                apolloClient={apolloClient}
                                appState={appState}
                                appActions={appActions}
                            >
                                <ApolloProvider client={apolloClient}>
                                    {children}
                                </ApolloProvider>
                            </AuthProvider>
                        </LoadingProvider>
                    </ErrorHandlingProvider>
                </NotificationProvider>
            </StorageProvider>
        </AppStateProvider>
    );
}

AppProvider.propTypes = {
    children: PropTypes.node,
    pageProps: PropTypes.object,
};
