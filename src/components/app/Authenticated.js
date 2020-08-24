import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';
import {useAuth} from 'components/providers/AuthProvider';

// core
import LoginForm from './LoginForm';

export default function Authenticated({className, children}) {
    const [rootClassName] = getClassName({className, rootClass: 'authenticated'});
    const {authenticated, userId} = useAuth();

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
