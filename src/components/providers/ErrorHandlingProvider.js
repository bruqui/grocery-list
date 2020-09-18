import React, {createContext, useCallback, useContext, useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';

import * as errorResponses from 'graphql/lib/error-response-constants';
import {useNotifications} from 'components/providers/NotificationProvider';

const DEFAULT_CONTEXT = {
    setGraphQLError: () => null,
};

const ErrorHandlingContext = createContext(DEFAULT_CONTEXT);

export const useErrorHandling = () => {
    return useContext(ErrorHandlingContext);
};

export default function ErrorHandlingProvider({appActions, appState, children}) {
    const {setNotification} = useNotifications();
    const appStateError = useMemo(() => appState.error, [appState]);
    const setGraphQLError = useCallback(
        ({graphqlErrors}, {messagePrefix, ttl = -1} = {}) => {
            if (graphqlErrors && graphqlErrors.length) {
                graphqlErrors.map(({message, ...rest}, index) => {
                    // eslint-disable-next-line import/namespace
                    const graphQLErrorMessage = errorResponses[message] || message;
                    const notificationMessage = messagePrefix
                        ? `${messagePrefix} ${graphQLErrorMessage}`
                        : graphQLErrorMessage;

                    setNotification({
                        messageKey: `${message}__${index}`,
                        type: 'error',
                        message: notificationMessage,
                        devMessage: JSON.stringify({message, ...rest}, undefined, 4),
                        ttl,
                    });

                    if (message === 'TOKEN_NO_SESSION') {
                        appActions.appResetState();
                    }
                });
            }
        },
        [setNotification]
    );

    useEffect(() => {
        if (appStateError) {
            setGraphQLError(appStateError);
            appActions.appError({});
        }
    }, [appActions, appStateError, setGraphQLError]);

    const context = {setGraphQLError};

    return (
        <ErrorHandlingContext.Provider value={context}>
            {children}
        </ErrorHandlingContext.Provider>
    );
}

ErrorHandlingProvider.propTypes = {
    appActions: PropTypes.object,
    appState: PropTypes.object,
    children: PropTypes.node,
};
