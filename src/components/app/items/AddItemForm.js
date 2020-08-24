import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import {useForm} from 'react-hook-form';

import getClassName from 'tools/getClassName';
import {useGlobalLoading} from 'components/providers/LoadingProvider';
// import {NewItemFragment} from 'graphql/localQueries';
import {ALL_ITEMS} from './Items';

// core
import IconButton from 'components/core/IconButton';
import TextField from 'components/core/TextField';

import './AddItemForm.scss';

const CREATE_ITEM = gql`
    mutation CREATE_ITEM($name: String!, $listId: String!) {
        createItem(name: $name, listId: $listId) {
            id
            name
            purchased
            need
            list {
                id
            }
        }
    }
`;

export default function AddItemForm({className, disabled, listId}) {
    const [rootClassName, getClass] = getClassName({
        className,
        rootClass: 'add-item-form',
    });
    const nameInputRef = useRef(null);

    const {register: fieldRegister, handleSubmit, errors: fieldErrors, reset} = useForm();
    const [addItemMutation, {loading: addItemLoading}] = useMutation(CREATE_ITEM, {
        onCompleted: () => {
            reset();
            nameInputRef.current.focus();
        },
        // TODO: It would be better to use the update; however, the Items component doesn't
        // update when the following update is issued. It definitely is working because
        // the new record is in the cache when this happens. The refetchQueries with ALL_ITEMS
        // seems to update the Items component, but this kicks off a request which seems like
        // a wasted network call. I think cache.modify is probably the better thing to use,
        // but that isn't part of cache for some reason and not sure why since it's in the documentation.
        // async update(cache, {data: {createItem}}) {
        //     await cache.writeFragment({
        //         id: listId,
        //         fragment: NewItemFragment,
        //         data: createItem,
        //     });

        //     cache.readQuery({query: ALL_ITEMS, variables: {listId}});
        // },
        refetchQueries: [{query: ALL_ITEMS, variables: {listId}}],
    });

    useGlobalLoading('addItemLoading', addItemLoading);

    function handleOnSubmit(formData) {
        addItemMutation({variables: {...formData, listId}});
    }

    function handleInputRef(node) {
        nameInputRef.current = node;
        fieldRegister(node, {required: 'This field is required'});
    }

    const formDisabled = disabled || addItemLoading || !listId;

    return (
        <form
            className={rootClassName}
            disabled={formDisabled}
            onSubmit={handleSubmit(handleOnSubmit)}
            name="AddList"
        >
            <TextField
                className={getClass('field')}
                disabled={formDisabled}
                fieldError={fieldErrors.name}
                fullWidth
                id="name"
                inputRef={handleInputRef}
                label="Add Item"
                name="name"
            />
            <IconButton
                className={getClass('button')}
                disabled={formDisabled}
                type="submit"
                icon="add"
            />
        </form>
    );
}

AddItemForm.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    listId: PropTypes.string.isRequired,
};
