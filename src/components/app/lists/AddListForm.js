import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {useForm} from 'react-hook-form';
import {useMutation} from '@apollo/react-hooks';
import {useRouter} from 'next/router';

import getClassName from 'tools/getClassName';
import {useListData} from 'components/providers/ListDataProvider';

// core
import Button from 'components/core/Button';
import TextField from 'components/core/TextField';

import './AddListForm.scss';

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
export default function AddListForm({className}) {
    const router = useRouter();
    const [rootClassName] = getClassName({className, rootClass: 'add-list-form'});
    const {register: fieldRegister, handleSubmit, errors: fieldErrors, reset} = useForm();
    const {allListsRefetch} = useListData();
    const [addListMutation, {loading: addListLoading}] = useMutation(CREATE_LIST, {
        onCompleted: ({createList}) => {
            reset();
            router.push(`/list/${createList.id}/edit`);
        },
        refetchQueries: [allListsRefetch],
    });

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
