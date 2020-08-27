import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

// core
import IconButton from 'components/core/IconButton';

import './ItemCheckbox.scss';

export default function ItemCheckbox({className, itemId, purchased, onChange}) {
    const [rootClassName] = getClassName({
        className,
        modifiers: {purchased},
        rootClass: 'item-checkbox',
    });

    function handleChange(event) {
        const checked = event.detail.isOn;

        onChange({
            checked,
            itemId,
            purchased,
        });
    }

    return (
        <IconButton
            className={rootClassName}
            checked={purchased}
            icon="check_circle_outline"
            onChange={handleChange}
            onIcon="check_circle"
        />
    );
}

ItemCheckbox.propTypes = {
    checked: PropTypes.bool,
    className: PropTypes.string,
    itemId: PropTypes.string.isRequired,
    purchased: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
};
