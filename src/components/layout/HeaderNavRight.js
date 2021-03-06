import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';
import {useAuth, useLogout} from 'components/providers/AuthProvider';

import IconButton from 'components/core/IconButton';
import {SimpleMenu} from 'components/core/menu/';
import {ListItem, ListLink} from 'components/core/list/';
import Link from 'components/core/Link';

import './HeaderNavRight.scss';

export default function HeaderNavRight({className}) {
    const {authenticated, name} = useAuth();
    const {logout} = useLogout();
    const [rootClassName, getChildClass] = getClassName({
        className,
        rootClass: 'header-nav-right',
    });
    const linkClassName = getChildClass('link');

    function handleLogout() {
        logout();
    }

    function renderLogin() {
        return (
            <div className={getChildClass('links')}>
                <Link href="/login" className={linkClassName} onPrimary>
                    log in
                </Link>
                <Link href="/register" className={linkClassName} onPrimary>
                    sign up
                </Link>
            </div>
        );
    }

    function renderIcon() {
        return (
            <IconButton
                className={getChildClass('user')}
                icon="account_circle"
                onPrimary
            />
        );
    }

    function renderLoggedIn() {
        return (
            <SimpleMenu
                className={getChildClass('menu')}
                handle={renderIcon()}
                style={{minWidth: '200px'}}
            >
                <ListItem disabled>logged in as {name || ''}</ListItem>
                <ListItem>
                    <ListLink className={linkClassName} onClick={handleLogout} href="/">
                        Logout
                    </ListLink>
                </ListItem>
                <ListItem>
                    <ListLink className={linkClassName} href="/account-profile">
                        Profile
                    </ListLink>
                </ListItem>
            </SimpleMenu>
        );
    }

    return (
        <div className={rootClassName}>
            {authenticated ? renderLoggedIn() : renderLogin()}
        </div>
    );
}

HeaderNavRight.propTypes = {
    className: PropTypes.string,
};
