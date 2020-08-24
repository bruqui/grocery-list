import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

// core
import IconButton from 'components/core/IconButton';

import './ItemCheckbox.scss';

export default function ItemCheckbox({
    checked,
    className,
    clearFromNeed,
    itemId,
    onClick,
    value,
}) {
    const [rootClassName] = getClassName({
        className,
        modifiers: {purchased: checked},
        rootClass: 'item-checkbox',
    });

    function handleClick(event) {
        const purchased = !checked;
        const need = purchased ? !clearFromNeed : true;

        onClick({itemId: value, need, purchased});
    }

    return (
        <IconButton
            className={rootClassName}
            checked={checked}
            icon="check_circle_outline"
            onClick={handleClick}
            onIcon="check_circle"
        />
    );
}

ItemCheckbox.propTypes = {
    checked: PropTypes.bool,
    className: PropTypes.string,
    clearFromNeed: PropTypes.bool,
    itemId: PropTypes.string,
    onClick: PropTypes.func,
    value: PropTypes.string,
};
