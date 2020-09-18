import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {useForm} from 'react-hook-form';
import {useMutation} from '@apollo/react-hooks';

import getClassName from 'tools/getClassName';

// core
import Button from 'components/core/Button';
import TextField from 'components/core/TextField';

const CREATE_GROUP = gql`
    mutation CREATE_GROUP($name: String!) {
        createUserGroup(name: $name) {
            id
            name
        }
    }
`;

export default function UserGroupForm({className, groupRefresh}) {
    const [rootClassName] = getClassName({className, rootClass: 'user-group-form'});
    const [createGroupMutation, {loading}] = useMutation(CREATE_GROUP, {
        errorPolicy: 'all',
        refetchQueries: [groupRefresh],
    });
    const {register: fieldRegister, handleSubmit, errors: fieldErrors} = useForm();

    function handleOnSubmit(formData) {
        createGroupMutation({variables: formData});
    }

    return (
        <form className={rootClassName} onSubmit={handleSubmit(handleOnSubmit)}>
            Create a new group...
            <TextField
                disabled={loading}
                fieldError={fieldErrors.name}
                id="name"
                inputRef={fieldRegister({required: 'This field is required'})}
                label="Group Name"
                name="name"
            />
            <Button disabled={loading} raised type="submit">
                Submit
            </Button>
        </form>
    );
}

UserGroupForm.propTypes = {
    className: PropTypes.string,
    groupRefresh: PropTypes.object,
};
