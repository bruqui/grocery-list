import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

export default function Share({className, listId, sharedUsers}) {
    const [rootClassName] = getClassName({className, rootClass: 'share'});

    return <div className={rootClassName}>Share With Users</div>;
}

Share.propTypes = {
    className: PropTypes.string,
    listId: PropTypes.string,
    sharedUsers: PropTypes.array,
};
