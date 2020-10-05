import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

// core
import Switch from 'components/core/Switch';

import './ItemNeedSwitch.scss';

export default function ItemNeedSwitch({
    className,
    itemId,
    label,
    need,
    updateItemLoading,
    updateItemMutation,
}) {
    const [rootClassName] = getClassName({
        className,
        rootClass: 'item-need-switch',
    });
    const [loading, setLoading] = useState(false);
    const isDisabled = useCallback(() => {
        let disabled = loading;

        if (loading && !updateItemLoading) {
            setLoading(false);
            disabled = false;
        }

        return disabled;
    }, [loading, updateItemLoading]);

    function handleNeedClick(event) {
        setLoading(true);
        updateItemMutation({
            variables: {
                itemId: event.currentTarget.value,
                need: !!event.currentTarget.checked,
                purchased: false,
            },
        });
    }

    return (
        <Switch
            className={rootClassName}
            checked={need}
            disabled={isDisabled()}
            label={label}
            loading={loading}
            name={`need_${itemId}`}
            onClick={handleNeedClick}
            value={itemId}
        />
    );
}

ItemNeedSwitch.propTypes = {
    className: PropTypes.string,
    itemId: PropTypes.string,
    label: PropTypes.string,
    need: PropTypes.bool,
    updateItemLoading: PropTypes.bool,
    updateItemMutation: PropTypes.func,
};
