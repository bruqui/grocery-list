import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

// app
import Items from 'components/app/items/Items';

export default function Shop({className, itemData}) {
    const [rootClassName] = getClassName({className, rootClass: 'shop'});

    return (
        <div className={rootClassName}>
            <Items itemData={itemData} />
        </div>
    );
}

Shop.propTypes = {
    className: PropTypes.string,
    itemData: PropTypes.array,
};
