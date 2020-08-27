import React, {useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useForm} from 'react-hook-form';

import getClassName from 'tools/getClassName';
import {useItemsData} from 'components/providers/ItemsDataProvider';
import {useListsData} from 'components/providers/ListsDataProvider';
// import {NewItemFragment} from 'graphql/localQueries';

// core
import IconButton from 'components/core/IconButton';
import TextField from 'components/core/TextField';

import './AddItemForm.scss';

export default function AddItemForm({className}) {
    const [rootClassName, getClass] = getClassName({
        className,
        rootClass: 'add-item-form',
    });
    const {isDisabled, selectedListId: listId} = useListsData();
    const {addItemCalled, addItemLoading, addItemMutation} = useItemsData();

    const nameInputRef = useRef(null);

    const {register: fieldRegister, handleSubmit, errors: fieldErrors, reset} = useForm();

    useEffect(() => {
        if (addItemCalled && nameInputRef.current.value) {
            reset();
            nameInputRef.current.focus();
        }
    }, [addItemCalled, nameInputRef, reset]);

    function handleOnSubmit(formData) {
        addItemMutation({variables: {...formData, listId}});
    }

    function handleInputRef(node) {
        nameInputRef.current = node;
        fieldRegister(node, {required: 'This field is required'});
    }

    const formDisabled = isDisabled() || addItemLoading || !listId;

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
};
