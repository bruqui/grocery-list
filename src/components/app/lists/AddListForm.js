import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {useForm} from 'react-hook-form';
import {useMutation} from '@apollo/react-hooks';

import getClassName from 'tools/getClassName';
import {useGlobalLoading} from 'components/providers/LoadingProvider';
import {ALL_LISTS} from './Lists';

// core
import Button from 'components/core/Button';
import TextField from 'components/core/TextField';

// TODO: Get NewList fragment to work
const CREATE_LIST = gql`
    mutation CREATE_LIST($name: String!) {
        createList(name: $name) {
            id
            name
            collaborated
            owner {
                id
            }
        }
    }
`;

export default function AddListForm({className, goToEdit}) {
    const [rootClassName] = getClassName({className, rootClass: 'add-list-form'});
    const {register: fieldRegister, handleSubmit, errors: fieldErrors, reset} = useForm();
    const [addListMutation, {loading: addListLoading}] = useMutation(CREATE_LIST, {
        onCompleted: ({createList}) => {
            reset();
            goToEdit(createList.id);
        },
        refetchQueries: [{query: ALL_LISTS}],
    });

    useGlobalLoading('addListLoading', addListLoading);

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
    goToEdit: PropTypes.func,
};
