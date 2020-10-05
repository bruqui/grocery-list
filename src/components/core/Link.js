import React from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';

import getClassName from 'tools/getClassName';

import './Link.scss';

export default function Link({
    areaLink,
    children,
    className,
    noUnderline,
    onPrimary,
    onSecondary,
    ...props
}) {
    const [rootClassName] = getClassName({
        className,
        modifiers: {
            'area-link': areaLink,
            'no-underline': noUnderline,
            'on-primary': onPrimary,
            'on-secondary': onSecondary,
        },
        rootClass: 'link',
    });

    return (
        <NextLink {...props}>
            <a className={rootClassName}>{children}</a>
        </NextLink>
    );
}

Link.propTypes = {
    /** Adds a modifier class to the link when the page is active */
    activeClassName: PropTypes.string,
    /** Adds aditional styles when the page is active */
    activeStyleName: PropTypes.object,
    /**
        Makes link cover entire area of div it's within.
        The parent needs to have position: relative.
    */
    areaLink: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    /** Sets a url and uses the <a /> tag instead of a Gatsby Link comoponent */
    href: PropTypes.string,
    /** Removes underline from hover. */
    noUnderline: PropTypes.bool,
    /** Sets text color to work on primary color. */
    onPrimary: PropTypes.bool,
    /** Sets text color to work on secondary color. */
    onSecondary: PropTypes.bool,
    /** adds target attribute to anchor tag */
    target: PropTypes.string,
};
