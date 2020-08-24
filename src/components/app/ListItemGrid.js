import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

// core
import {ListItem} from 'components/core/list';

import './ListItemGrid.scss';

export default function ListItemGrid({className, children}) {
    const [rootClassName] = getClassName({className, rootClass: 'list-item-grid'});

    return <ListItem className={rootClassName}>{children}</ListItem>;
}

ListItemGrid.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};
