import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

import './SimpleRecordGrid.scss';

export default function SimpleRecordGrid({className, records, renderRow, columns}) {
    const [rootClassName, getChildClass] = getClassName({
        className,
        modifiers: {
            'three-col': columns === 3,
        },
        rootClass: 'simple-record-grid',
    });

    return (
        <ul className={rootClassName}>
            {records.map((item) => (
                <li key={item.id} className={getChildClass('row')}>
                    {renderRow(item)}
                </li>
            ))}
        </ul>
    );
}

SimpleRecordGrid.propTypes = {
    className: PropTypes.string,
    /** Amount of columns per row */
    columns: PropTypes.oneOf([2, 3]),
    /** item records */
    records: PropTypes.array,
    /** function to render the content of the row */
    renderRow: PropTypes.func,
};

SimpleRecordGrid.defaultProps = {
    columns: 2,
};
