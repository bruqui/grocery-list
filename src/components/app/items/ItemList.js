import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

import './ItemList.scss';

export default function ItemList({className, items, renderRow}) {
    const [rootClassName, getChildClass] = getClassName({
        className,
        rootClass: 'item-list',
    });

    return (
        <ul className={rootClassName}>
            {items.map((item) => (
                <li key={item.id} className={getChildClass('row')}>
                    {renderRow(item)}
                </li>
            ))}
        </ul>
    );
}

ItemList.propTypes = {
    className: PropTypes.string,
    items: PropTypes.array,
    renderRow: PropTypes.func,
};
