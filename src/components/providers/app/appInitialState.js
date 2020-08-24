export const APP_INITIAL_STATE = {
    accessToken: null,
    authenticated: false,
    authenticating: false,
    authInitialized: false,
    error: null,
    loggedOut: false,
    name: null,
    ssr: typeof window === 'undefined',
    userId: null,
};
