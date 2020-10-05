import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {useForm} from 'react-hook-form';
import {useMutation} from '@apollo/react-hooks';

import getClassName from 'tools/getClassName';
import {useNotifications} from 'components/providers/NotificationProvider';

// core
import Button from 'components/core/Button';
import TextField from 'components/core/TextField';

const INVITE_USER = gql`
    mutation INVITE_USER($email: String!) {
        inviteUser(email: $email) {
            id
        }
    }
`;

export default function InviteForm({className, inviteRefetch}) {
    const [rootClassName] = getClassName({className, rootClass: 'invite-form'});
    const {register: fieldRegister, handleSubmit, errors: fieldErrors, reset} = useForm();
    const {setNotification} = useNotifications();
    const [inviteUserMutation, {loading: inviteUserLoading}] = useMutation(INVITE_USER, {
        errorPolicy: 'all',
        onCompleted: () => {
            reset();
            setNotification({
                message: 'Invitation successfully sent.',
                messageKey: 'invitationSent',
                ttl: 10000,
            });
        },
        refetchQueries: [inviteRefetch],
    });

    function handleOnSubmit({email}) {
        inviteUserMutation({
            variables: {email},
        });
    }

    return (
        <form className={rootClassName} onSubmit={handleSubmit(handleOnSubmit)}>
            Send an invitation to connect with other users.
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
                label="Email Address"
                name="email"
                placeholder="example.user@domain.com"
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
    inviteRefetch: PropTypes.object,
};
