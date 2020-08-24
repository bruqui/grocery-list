import {useMemo} from 'react';
import fetch from 'isomorphic-unfetch';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {get} from 'lodash';

let apolloClient, currentAccessToken;
const httpLinkUri = '/api/graphql';

/* eslint-disable no-console */
function createIsomorphLink(
    {appAuthenticated, appAuthenticating, appError, appLoggedOut},
    getAppState
) {
    let isomorphLink;

    // For some reason, this specific conditional has to do
    // typeof window === 'undefined' instead of a function or coming from appState
    if (typeof window === 'undefined') {
        const {SchemaLink} = require('apollo-link-schema');
        const {schema} = require('./schema');
        const {prisma} = require('../../generated/prisma-client');

        isomorphLink = new SchemaLink({schema, context: {prisma, ssrRequest: true}});
    } else {
        const jwtDecode = require('jwt-decode');
        const {ApolloLink} = require('apollo-link');
        const {createHttpLink} = require('apollo-link-http');
        const {onError} = require('apollo-link-error');
        const {setContext} = require('apollo-link-context');
        const {TokenRefreshLink} = require('apollo-link-token-refresh');

        const httpLink = createHttpLink({
            uri: httpLinkUri,
            credentials: 'same-origin',
            fetch,
        });

        const authLink = setContext((_request, {headers}) => {
            return {
                headers: {
                    ...headers,
                    authorization: currentAccessToken
                        ? `Bearer ${currentAccessToken}`
                        : '',
                },
            };
        });

        const errorLink = onError((error) => {
            console.error('APOLLO_ON_ERROR: ', error);
            const graphqlErrors = get(error, 'graphQLErrors');

            if (graphqlErrors) {
                appError({graphqlErrors});
            }
        });

        const refreshLink = new TokenRefreshLink({
            accessTokenField: 'accessToken',
            isTokenValidOrUndefined: () => {
                let isValidOrUndefined = false;
                if (currentAccessToken) {
                    try {
                        const {exp} = jwtDecode(currentAccessToken);

                        if (Date.now() >= exp * 1000) {
                            isValidOrUndefined = false;
                        } else {
                            isValidOrUndefined = true;
                        }
                    } catch {
                        isValidOrUndefined = false;
                    }
                }

                return isValidOrUndefined;
            },
            fetchAccessToken: () => {
                return fetch('/api/refresh-token', {
                    credentials: 'same-origin',
                }).catch((error) => console.error(error));
            },
            handleResponse: (operation, accessTokenField) => async (response) => {
                try {
                    const refreshResponse = await response.json();

                    console.info('REFRESHING', refreshResponse);

                    if (refreshResponse.accessToken) {
                        await appAuthenticated({
                            authInitialized: true,
                            ...refreshResponse,
                        });
                    } else {
                        appLoggedOut();
                    }

                    return {[accessTokenField]: refreshResponse.accessToken};
                } catch (error) {
                    return {[accessTokenField]: null};
                }
            },
            handleFetch: (accessToken) => {
                return accessToken;
            },
            handleError: (refreshError) => {
                appError({error: refreshError, authenticated: false});
            },
        });

        isomorphLink = ApolloLink.from([refreshLink, errorLink, authLink, httpLink]);
    }

    return isomorphLink;
}
/* eslint-enable */

function createApolloClient(appActions, getAppState, ssr) {
    const cache = new InMemoryCache();
    const {accessToken} = getAppState();
    currentAccessToken = accessToken;

    return new ApolloClient({
        ssrMode: ssr,
        link: createIsomorphLink(appActions, getAppState),
        cache,
    });
}

function initializeApollo(initialState = null, getAppState, appActions) {
    const {accessToken, ssr} = getAppState();
    let initApolloClient = apolloClient;

    // If apolloClient is undefined or if there's an update to the accessToken,
    // create a new apollo client
    if (!apolloClient || currentAccessToken !== accessToken) {
        currentAccessToken = accessToken;
        initApolloClient = createApolloClient(appActions, getAppState, ssr);
    }
    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // get hydrated here
    if (initialState) {
        initApolloClient.cache.restore(initialState);
    }

    // For SSG and SSR always create a new Apollo Client
    // If it's the client and the global apolloClient doesn't exist, set the global
    // to the new Apollo Client so it's the same client whenever this is called
    if (!ssr && !apolloClient) {
        apolloClient = initApolloClient;
    }

    return initApolloClient;
}

export function useApolloInit({appActions, getAppState, initialState}) {
    const apolloClient = useMemo(
        () => initializeApollo(initialState, getAppState, appActions),
        [initialState, getAppState, appActions]
    );

    return apolloClient;
}
