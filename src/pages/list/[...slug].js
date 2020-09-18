import React from 'react';
import PropTypes from 'prop-types';

// app
import Lists from 'components/app/lists';

export default function ListPage({className}) {
    return <Lists className="list-page" />;
}

ListPage.propTypes = {
    className: PropTypes.string,
};
