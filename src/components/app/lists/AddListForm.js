import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useForm} from 'react-hook-form';

import getClassName from 'tools/getClassName';
import {useLists} from 'components/providers/ListProvider';

// core
import Button from 'components/core/Button';
import TextField from 'components/core/TextField';

export default function AddListForm({className, goToEdit}) {
    const [rootClassName] = getClassName({className, rootClass: 'add-list-form'});
    const {
        register: fieldRegister,
        handleSubmit,
        errors: fieldErrors,
        getValues,
        reset,
    } = useForm();
    const {addList, addListCalled, addListData} = useLists();

    useEffect(() => {
        if (addListCalled && addListData && getValues('name')) {
            reset();
            goToEdit(addListData.id);
        }
    }, [addListCalled, addListData, getValues]);

    async function handleOnSubmit(formData) {
        addList(formData);
    }

    return (
        <form
            className={rootClassName}
            onSubmit={handleSubmit(handleOnSubmit)}
            name="addList"
        >
            <TextField
                fieldError={fieldErrors.name}
                id="name"
                inputRef={fieldRegister({required: 'This field is required'})}
                label="List Name"
                name="name"
            />
            <Button raised type="submit">
                Submit
            </Button>
        </form>
    );
}

AddListForm.propTypes = {
    className: PropTypes.string,
    goToEdit: PropTypes.func,
};
