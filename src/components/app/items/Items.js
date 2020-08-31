import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

// app
import ItemDetail from 'components/app/items/ItemDetail';

export default function Items({
    className,
    itemsData,
    renderFirstColumn,
    renderThirdColumn,
}) {
    const [rootClassName] = getClassName({className, rootClass: 'items'});

    return (
        <div className={rootClassName}>
            <ul>
                {itemsData.map(({itemId, ...itemData}) => (
                    <ItemDetail
                        key={itemId}
                        itemData={itemData}
                        renderFirstColumn={renderFirstColumn}
                        renderThirdColumn={renderThirdColumn}
                    />
                ))}
            </ul>
        </div>
    );
}

Items.propTypes = {
    className: PropTypes.string,
    itemsData: PropTypes.array.isRequired,
    renderFirstColumn: PropTypes.func,
    renderThirdColumn: PropTypes.func,
};

Items.defaultProps = {
    renderFirstColumn: () => null,
    renderThirdColumn: () => null,
};
