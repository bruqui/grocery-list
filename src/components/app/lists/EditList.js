import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';

import getClassName from 'tools/getClassName';
import {useListData} from 'components/providers/ListDataProvider';
import {useGlobalLoading} from 'components/providers/LoadingProvider';

// core
import Button from 'components/core/Button';
import IconButton from 'components/core/IconButton';
import Switch from 'components/core/Switch';

// layout
import SimpleRecordGrid from 'components/layout/SimpleRecordGrid';

// app
import AddItemForm from 'components/app/items/AddItemForm';
import ItemNeedSwitch from 'components/app/items/ItemNeedSwitch';

import './EditList.scss';

const UPDATE_LIST = gql`
    mutation UPDATE_LIST($listId: String!, $collaborated: Boolean, $name: String) {
        updateList(listId: $listId, collaborated: $collaborated, name: $name) {
            id
            name
            collaborated
            owner {
                id
            }
        }
    }
`;
const UPDATE_ITEM = gql`
    mutation UPDATE_ITEM($itemId: String!, $need: Boolean, $purchased: Boolean) {
        updateItem(itemId: $itemId, need: $need, purchased: $purchased) {
            id
            name
            need
            purchased
        }
    }
`;
const DELETE_LIST = gql`
    mutation DELETE_LIST($listId: String!) {
        deleteList(id: $listId) {
            id
        }
    }
`;
const DELETE_ITEM = gql`
    mutation DELETE_ITEM($itemId: String!) {
        deleteItem(itemId: $itemId) {
            id
        }
    }
`;

export default function EditList({children, className}) {
    const [rootClassName, getClass] = getClassName({className, rootClass: 'edit-list'});
    const {isDisabled, itemsData, listData, listId, listRefetch} = useListData();
    const [deleteListMutation, {loading: deleteListLoading}] = useMutation(DELETE_LIST, {
        errorPolicy: 'all',
        variables: {listId},
        refetchQueries: listRefetch ? [listRefetch] : undefined,
    });
    const [updateListMutation, {loading: updateListLoading}] = useMutation(UPDATE_LIST, {
        errorPolicy: 'all',
        variables: {listId},
        refetchQueries: listRefetch ? [listRefetch] : undefined,
    });
    const [updateItemMutation, {loading: updateItemLoading}] = useMutation(UPDATE_ITEM, {
        errorPolicy: 'all',
        refetchQueries: listRefetch ? [listRefetch] : undefined,
    });
    const [deleteItemMutation, {loading: deleteItemLoading}] = useMutation(DELETE_ITEM, {
        errorPolicy: 'all',
        refetchQueries: listRefetch ? [listRefetch] : undefined,
    });

    useGlobalLoading('deleteItemLoading', deleteItemLoading);
    useGlobalLoading('deleteListLoading', deleteListLoading);
    useGlobalLoading('updateListLoading', updateListLoading);

    const {collaborated} = listData || {};

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

    function renderRow({id: itemId, need, name}) {
        return (
            <React.Fragment key={itemId}>
                <div>
                    <ItemNeedSwitch
                        itemId={itemId}
                        label={name}
                        need={need}
                        updateItemLoading={updateItemLoading}
                        updateItemMutation={updateItemMutation}
                    />
                </div>
                <div className={getClass('li-edge')}>
                    {/* <IconButton icon="edit" disabled={isDisabled()} /> */}
                    <IconButton
                        icon="delete"
                        disabled={isDisabled({ownerOnly: true})}
                        onClick={handleDeleteItemClick(itemId)}
                    />
                </div>
            </React.Fragment>
        );
    }

    return (
        <div className={rootClassName}>
            <div className={getClass('list-actions')}>
                <Switch
                    className={getClass('collaborated')}
                    checked={collaborated || false}
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
            <SimpleRecordGrid records={itemsData} renderRow={renderRow} />
        </div>
    );
}

EditList.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};
