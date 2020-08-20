import React, {useState} from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

// core
import IconButton from 'components/core/IconButton';

import './ItemCheckbox.scss';

export default function ItemCheckbox({className, itemId, purchased}) {
    const [rootClassName] = getClassName({className, rootClass: 'item-checkbox'});
    const [itemChecked, setItemChecked] = useState(purchased);

    function handleClick() {
        setItemChecked(!itemChecked);
    }

    return (
        <IconButton
            className={rootClassName}
            check={itemChecked}
            icon="check_circle_outline"
            onClick={handleClick}
            onIcon="check_circle"
        />
    );
}

ItemCheckbox.propTypes = {
    className: PropTypes.string,
    itemId: PropTypes.string,
    purchased: PropTypes.bool,
};
