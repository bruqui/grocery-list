import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';

import getClassName from 'tools/getClassName';
import {useAuth} from 'components/providers/AuthProvider';

// core
import LoginForm from './LoginForm';

export default function Authenticated({className, children}) {
    const [rootClassName] = getClassName({className, rootClass: 'authenticated'});
    const {
        appAuthenticated,
        authInitialized,
        authenticated,
        authenticating,
        userId,
    } = useAuth();

    useSWR(!authInitialized && !authenticating ? '/api/refresh-token' : null, () =>
        fetch('/api/refresh-token', {
            credentials: 'same-origin',
        }).then(async (res) => {
            const responseData = await res.json();

            appAuthenticated({authInitialized: true, ...responseData});
        })
    );

    return (
        <div className={rootClassName}>
            {authenticated && userId ? children : <LoginForm />}
        </div>
    );
}

Authenticated.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
};
