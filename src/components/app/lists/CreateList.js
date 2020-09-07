import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

import AddListForm from './AddListForm';
import ListSelect from './ListSelect';

import './CreateList.scss';

export default function CreateList({className}) {
    const [rootClassName, getChildClass] = getClassName({
        className,
        rootClass: 'create-list',
    });

    return (
        <div className={rootClassName}>
            <div className={getChildClass('content')}>Add a new list...</div>
            <AddListForm />
            <div className={getChildClass('content')}>Or select one to work on...</div>
            <ListSelect />
        </div>
    );
}

CreateList.propTypes = {
    className: PropTypes.string,
};
