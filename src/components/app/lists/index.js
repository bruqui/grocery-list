import React from 'react';
import PropTypes from 'prop-types';

import ListDataProvider from 'components/providers/ListDataProvider';

// app
import ListLayout from './ListLayout';

export default function Lists({className}) {
    return (
        <ListDataProvider>
            <ListLayout className={className} />
        </ListDataProvider>
    );
}

Lists.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};
