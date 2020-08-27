import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {useForm} from 'react-hook-form';

import getClassName from 'tools/getClassName';
import {useListsData} from 'components/providers/ListsDataProvider';

// core
import Button from 'components/core/Button';
import TextField from 'components/core/TextField';

export default function AddListForm({className}) {
    const [rootClassName] = getClassName({className, rootClass: 'add-list-form'});
    const {register: fieldRegister, handleSubmit, errors: fieldErrors, reset} = useForm();
    const {addListCalled, addListLoading, addListMutation} = useListsData();

    useEffect(() => {
        if (addListCalled) {
            reset();
        }
    }, [addListCalled, reset]);

    async function handleOnSubmit(formData) {
        addListMutation({variables: formData});
    }

    return (
        <form
            className={rootClassName}
            onSubmit={handleSubmit(handleOnSubmit)}
            name="addList"
        >
            <TextField
                disabled={addListLoading}
                fieldError={fieldErrors.name}
                id="name"
                inputRef={fieldRegister({required: 'This field is required'})}
                label="List Name"
                name="name"
            />
            <Button disabled={addListLoading} raised type="submit">
                Submit
            </Button>
        </form>
    );
}

AddListForm.propTypes = {
    className: PropTypes.string,
};
