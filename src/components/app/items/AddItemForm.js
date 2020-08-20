import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useForm} from 'react-hook-form';

import getClassName from 'tools/getClassName';
import {useLists} from 'components/providers/ListProvider';

// core
import IconButton from 'components/core/IconButton';
import TextField from 'components/core/TextField';

import './AddItemForm.scss';

export default function AddItemForm({className, listId}) {
    const [rootClassName, getClass] = getClassName({
        className,
        rootClass: 'add-item-form',
    });
    const {
        register: fieldRegister,
        handleSubmit,
        errors: fieldErrors,
        getValues,
        reset,
    } = useForm();
    const {addItem, addItemCalled, addItemError} = useLists({itemFormReset: reset});

    useEffect(() => {
        if (addItemCalled && !addItemError && getValues('name')) {
            reset();
        }
    }, [addItemCalled, addItemError, getValues]);

    function handleOnSubmit(formData) {
        addItem({...formData, listId});
    }

    return (
        <form
            className={rootClassName}
            onSubmit={handleSubmit(handleOnSubmit)}
            name="AddList"
        >
            <TextField
                className={getClass('field')}
                fieldError={fieldErrors.name}
                fullWidth
                id="name"
                inputRef={fieldRegister({required: 'This field is required'})}
                label="Add Item"
                name="name"
            />
            <IconButton className={getClass('button')} type="submit" icon="add" />
        </form>
    );
}

AddItemForm.propTypes = {
    className: PropTypes.string,
    listId: PropTypes.string.isRequired,
};
