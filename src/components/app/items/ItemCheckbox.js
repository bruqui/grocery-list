import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

// core
import IconButton from 'components/core/IconButton';
import LoadingSpinner from 'components/core/LoadingSpinner';

import './ItemCheckbox.scss';

export default function ItemCheckbox({
    className,
    itemId,
    label,
    onChange,
    purchased,
    updateItemLoading,
}) {
    const [rootClassName, getChildClass] = getClassName({
        className,
        modifiers: {purchased},
        rootClass: 'item-checkbox',
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

    function handleChange(event) {
        const checked = event.detail.isOn;

        setLoading(true);
        onChange({
            checked,
            itemId,
            purchased,
        });
    }

    return (
        <form className={rootClassName}>
            {loading && <LoadingSpinner className={getChildClass('spinner')} />}
            <IconButton
                className={getChildClass('button')}
                checked={purchased}
                disabled={isDisabled()}
                icon="check_circle_outline"
                name={name}
                onChange={handleChange}
                onIcon="check_circle"
            />
            <label htmlFor={name}>{label}</label>
        </form>
    );
}

ItemCheckbox.propTypes = {
    checked: PropTypes.bool,
    className: PropTypes.string,
    updateItemLoading: PropTypes.boolean,
    itemId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    purchased: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
};
