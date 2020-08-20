import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';
import {useLists} from 'components/providers/ListProvider';

// core
import Button from 'components/core/Button';

// app
import AddItemForm from 'components/app/items/AddItemForm';
import Items from 'components/app/items/Items';

import './Edit.scss';

export default function Edit({className, itemData, listId}) {
    const [rootClassName, getClass] = getClassName({className, rootClass: 'edit'});
    const {deleteList} = useLists();

    function handleDeleteClick() {
        deleteList(listId);
    }

    return (
        <div className={rootClassName}>
            <Button className={getClass('delete')} onClick={handleDeleteClick} raised>
                Delete List
            </Button>
            <AddItemForm listId={listId} />
            <Items editMode itemData={itemData} />
        </div>
    );
}

Edit.propTypes = {
    className: PropTypes.string,
    itemData: PropTypes.array,
    listId: PropTypes.string,
};
