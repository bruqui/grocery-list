import React from 'react';
import PropTypes from 'prop-types';
import {Select as MdcSelect} from '@rmwc/select';

import getClassName from 'tools/getClassName';

import './Select.scss';

export default function Select({className, fullWidth, ...props}) {
    const [rootClassName] = getClassName({
        className,
        modifiers: {'full-width': fullWidth},
        rootClass: 'select',
    });

    return <MdcSelect {...props} className={rootClassName} />;
}

Select.propTypes = {
    className: PropTypes.string,
    fullWidth: PropTypes.bool,
};
