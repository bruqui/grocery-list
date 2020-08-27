import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

// core
import {List} from 'components/core/list';

// app
import ListItemGrid from 'components/app/ListItemGrid';

export default function Items({
    className,
    itemsData,
    renderFirstColumn,
    renderThirdColumn,
}) {
    const [rootClassName] = getClassName({className, rootClass: 'items'});

    return (
        <div className={rootClassName}>
            <List>
                {itemsData.map((item) => (
                    <ListItemGrid key={item.id}>
                        <div>{renderFirstColumn(item)}</div>
                        <div>{item.name}</div>
                        <div>{renderThirdColumn(item)}</div>
                    </ListItemGrid>
                ))}
            </List>
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
