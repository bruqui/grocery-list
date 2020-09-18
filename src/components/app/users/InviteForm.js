import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {useForm} from 'react-hook-form';
import {useMutation} from '@apollo/react-hooks';

import getClassName from 'tools/getClassName';

// core
import Button from 'components/core/Button';
import TextField from 'components/core/TextField';

const INVITE_USER = gql`
    mutation INVITE_USER($groupId: String!, $groupName: String!, $email: String!) {
        inviteUser(groupId: $groupId, groupName: $groupName, email: $email) {
            id
        }
    }
`;

export default function InviteForm({className, groupRefresh, groupData, onSubmit}) {
    const [rootClassName] = getClassName({className, rootClass: 'invite-form'});
    const {register: fieldRegister, handleSubmit, errors: fieldErrors} = useForm();
    const [inviteUserMutation, {loading: inviteUserLoading}] = useMutation(INVITE_USER, {
        errorPolicy: 'all',
        refetchQueries: [groupRefresh],
        onCompleted: onSubmit,
    });

    function handleOnSubmit({email}) {
        inviteUserMutation({
            variables: {email, groupId: groupData.id, groupName: groupData.name},
        });
    }

    return (
        <form className={rootClassName} onSubmit={handleSubmit(handleOnSubmit)}>
            Enter an email address of the person you would like to invite.
            <TextField
                disabled={inviteUserLoading}
                fieldError={fieldErrors.name}
                id="invite_email"
                inputRef={fieldRegister({
                    required: 'This field is required',
                    pattern: {
                        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                        message: 'A valid email address is required',
                    },
                })}
                label="Invite Email"
                name="email"
            />
            <Button
                disabled={inviteUserLoading}
                raised
                type="submit"
                loading={inviteUserLoading}
            >
                Submit
            </Button>
        </form>
    );
}

InviteForm.propTypes = {
    className: PropTypes.string,
    groupData: PropTypes.object,
    groupRefresh: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
};
