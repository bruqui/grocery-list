import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

import AddListForm from './AddListForm';
import ListSelect from './ListSelect';

export default function CreateList({className}) {
    const [rootClassName] = getClassName({className, rootClass: 'create-list'});

    return (
        <div className={rootClassName}>
            Add a new list...
            <AddListForm />
            Or select one to work on...
            <ListSelect />
        </div>
    );
}

CreateList.propTypes = {
    className: PropTypes.string,
};
