import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Switch as MdcSwitch} from '@rmwc/switch';

import getClassName from 'tools/getClassName';

// core
import LoadingSpinner from 'components/core/LoadingSpinner';

import './Switch.scss';

export default function Switch({
    className,
    fullWidth,
    inputClassName,
    inputRef,
    label,
    loading,
    name,
    onChange,
    rootProps,
    value,
    ...props
}) {
    const [inputValue, setInputValue] = useState(value);
    const [rootClassName, getChildClass] = getClassName({
        className,
        modifiers: {
            'full-width': fullWidth,
        },
        rootClass: 'switch',
    });

    function handleChange(event) {
        setInputValue(event.target.value);
        onChange(event);
    }

    return (
        <div className={rootClassName}>
            {loading && <LoadingSpinner className={getChildClass('spinner')} />}
            <MdcSwitch
                {...props}
                inputRef={inputRef}
                label={label}
                name={name}
                onChange={handleChange}
                value={inputValue}
            />
        </div>
    );
}

Switch.propTypes = {
    className: PropTypes.string,
    /**
        Sets the textfield to use the fullWidth which is preferred in most cases so
        the layout controls the size of the fields.
    */
    fullWidth: PropTypes.bool,
    /** The className that will be on the input if needed. */
    inputClassName: PropTypes.string,
    /** This is a prop that will be passed to the ref prop of the <input /> element*/
    inputRef: PropTypes.func,
    /**
        Creates a label element for the input. It's recommended to use this prop to show
        the special label made for the Switch component.
    */
    label: PropTypes.string,
    /** Shows a loading spinner when true */
    loading: PropTypes.bool,
    onChange: PropTypes.func,
    name: PropTypes.string.isRequired,
    /** By default, props spread to the input. These props are for the component's root container. */
    rootProps: PropTypes.object,
    value: PropTypes.string,
};

Switch.defaultProps = {
    fullWidth: true,
    onChange: () => null,
    rootProps: {},
    value: '',
};
