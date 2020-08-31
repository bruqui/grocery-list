import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';
import {useListsData} from 'components/providers/ListsDataProvider';
import {useItemsData} from 'components/providers/ItemsDataProvider';

// core
import Button from 'components/core/Button';
import IconButton from 'components/core/IconButton';
import Switch from 'components/core/Switch';

// app
import AddItemForm from 'components/app/items/AddItemForm';
import Items from 'components/app/items/Items';

import './EditList.scss';

export default function EditList({children, className}) {
    const [rootClassName, getClass] = getClassName({className, rootClass: 'edit-list'});
    const {
        currentList,
        deleteListMutation,
        isDisabled,
        selectedListId: listId,
        updateListMutation,
    } = useListsData();
    const {
        itemsData,
        deleteItemMutation,
        deleteItemLoading,
        updateItemMutation,
    } = useItemsData();
    const {collaborated} = currentList;

    function handleNeedClick(event) {
        updateItemMutation({
            variables: {
                itemId: event.currentTarget.value,
                need: !!event.currentTarget.checked,
                purchased: false,
            },
        });
    }

    function handleCollaborateClick(event) {
        updateListMutation({
            variables: {listId, collaborated: event.currentTarget.checked},
        });
    }

    function handleDeleteClick() {
        deleteListMutation();
    }

    function handleDeleteItemClick(itemId) {
        return () => {
            deleteItemMutation({variables: {itemId}});
        };
    }

    function renderFirstColumn({id: itemId, name: itemName, need, purchase}) {
        return (
            <Switch
                name={`need_${itemId}`}
                checked={need}
                disabled={isDisabled()}
                onClick={handleNeedClick}
                value={itemId}
            />
        );
    }

    function renderThirdColumn({id: itemId, name, need, purchase, updateItem}) {
        return (
            <React.Fragment>
                <IconButton icon="edit" disabled={isDisabled()} />
                <IconButton
                    icon="delete"
                    disabled={isDisabled({ownerOnly: true})}
                    onClick={handleDeleteItemClick(itemId)}
                />
            </React.Fragment>
        );
    }

    return (
        <div className={rootClassName}>
            <div className={getClass('list-actions')}>
                <Switch
                    className={getClass('collaborated')}
                    checked={collaborated}
                    disabled={isDisabled({ownerOnly: true})}
                    label="collaborated"
                    name="collaborated"
                    onClick={handleCollaborateClick}
                />
                <Button
                    className={getClass('delete')}
                    disabled={isDisabled({ownerOnly: true})}
                    onClick={handleDeleteClick}
                    raised
                >
                    Delete List
                </Button>
            </div>
            <AddItemForm />
            <Items
                itemsData={itemsData}
                renderFirstColumn={renderFirstColumn}
                renderThirdColumn={renderThirdColumn}
            />
        </div>
    );
}

EditList.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};
