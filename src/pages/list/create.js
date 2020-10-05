import React from 'react';
import PropTypes from 'prop-types';

// app
import Lists from 'components/app/lists';

export default function CreatePage({className}) {
    return <Lists className="create-page" />;
}

CreatePage.propTypes = {
    className: PropTypes.string,
};
