import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';

import {ALL_LISTS} from './Lists';
import {useGlobalLoading} from 'components/providers/LoadingProvider';

import getClassName from 'tools/getClassName';

// core
import Button from 'components/core/Button';
import Switch from 'components/core/Switch';

// app
import AddItemForm from 'components/app/items/AddItemForm';

import './EditList.scss';

const DELETE_LIST = gql`
    mutation DELETE_LIST($listId: String!) {
        deleteList(id: $listId) {
            id
        }
    }
`;

export default function EditList({children, className, listId, editable}) {
    const [rootClassName, getClass] = getClassName({className, rootClass: 'edit-list'});
    const [deleteListMutation, {loading: deleteLoading}] = useMutation(DELETE_LIST, {
        variables: {listId},
        // TODO: add update function
    });

    useGlobalLoading('deleteLoading', deleteLoading);

    function handleDeleteClick() {
        deleteListMutation({variables: {listId}, refetchQueries: [{query: ALL_LISTS}]});
    }

    return (
        <div className={rootClassName}>
            <div className={getClass('list-actions')}>
                <Switch
                    className={getClass('collaborated')}
                    label="collaborated"
                    name="collaborated"
                />
                <Button
                    className={getClass('delete')}
                    disabled={!editable}
                    onClick={handleDeleteClick}
                    raised
                >
                    Delete List
                </Button>
            </div>
            <AddItemForm listId={listId} disabled={!editable} />
            {children}
        </div>
    );
}

EditList.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    editable: PropTypes.bool,
    listId: PropTypes.string.isRequired,
};
