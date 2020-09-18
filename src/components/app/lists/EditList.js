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

// app
import AddItemForm from 'components/app/items/AddItemForm';

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
    useGlobalLoading('updateItemLoading', updateItemLoading);
    useGlobalLoading('updateListLoading', updateListLoading);

    const {collaborated} = listData || {};

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
            <ul className={getClass('ul')}>
                {itemsData.map(({id: itemId, name, need}) => (
                    <li key={itemId} className={getClass('li')}>
                        <div className={getClass('li-edge')}>
                            <Switch
                                name={`need_${itemId}`}
                                checked={need}
                                disabled={isDisabled()}
                                onClick={handleNeedClick}
                                value={itemId}
                            />
                        </div>
                        <div className={getClass('li-center')}>{name}</div>
                        <div className={getClass('li-edge')}>
                            {/* <IconButton icon="edit" disabled={isDisabled()} /> */}
                            <IconButton
                                icon="delete"
                                disabled={isDisabled({ownerOnly: true})}
                                onClick={handleDeleteItemClick(itemId)}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

EditList.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};
