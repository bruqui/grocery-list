import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {useRouter} from 'next/router';
import {includes} from 'lodash';
import {useForm} from 'react-hook-form';
import {useMutation} from '@apollo/react-hooks';

import getClassName from 'tools/getClassName';
import {required} from 'tools/fieldErrors';
import {useAuth} from 'components/providers/AuthProvider';

import Button from 'components/core/Button';
import LoadingSpinner from 'components/core/LoadingSpinner';
import TextField from 'components/core/TextField';
import SEO from './SEO';

import './LoginForm.scss';

const LOGIN = gql`
    mutation LOGIN($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            accessToken
            userId
            name
        }
    }
`;

const SIGNUP = gql`
    mutation SIGNUP($email: String!, $password: String!, $name: String!) {
        signup(input: {email: $email, name: $name, password: $password}) {
            accessToken
            userId
            name
        }
    }
`;

export default function LoginForm({register}) {
    const router = useRouter();
    const [registering, setRegistering] = useState(register);
    const [mutation, setMutation] = useState(register ? SIGNUP : LOGIN);
    const {
        authenticated,
        authenticating,
        clearNotification,
        handleLoggedIn,
        setAuthenticating,
        setError,
    } = useAuth();
    const [loginMutation] = useMutation(mutation, {
        onCompleted: handleLoggedIn,
        onError: handleError,
    });
    const {
        register: fieldRegister,
        handleSubmit,
        errors: fieldErrors,
        getValues,
    } = useForm();
    const getFieldProps = useCallback(
        ({inputRef, label, name, ...fieldProps}) => {
            const defaultProps = {
                disabled: authenticating,
                fieldError: fieldErrors[name],
                id: `login_${name}`,
                inputRef: inputRef || fieldRegister({required}),
                label: label || name,
                name,
            };

            return {
                ...defaultProps,
                ...fieldProps,
            };
        },
        [authenticating, fieldErrors, required, fieldRegister]
    );

    // Go to home page once logged in and not on a page with private in the url path.
    useEffect(() => {
        if (
            !authenticating &&
            authenticated &&
            (includes(router.pathname, 'login') || includes(router.pathname, 'signup'))
        ) {
            router.replace('/');
        }
    }, [authenticating, authenticated, router]);

    function matchesPassword(value) {
        const {password} = getValues();

        return value && password && value === password
            ? undefined
            : 'Passwords do not match.';
    }

    function handleError(errorResponse) {
        setError(
            errorResponse,
            `There was a problem ${registering ? 'signing up' : 'logging in'}.`
        );
    }

    function handleOnSubmit({confirmPassword, ...variables}) {
        clearNotification();
        loginMutation({variables});
        setAuthenticating();
    }

    function handleLoginTypeClick(event) {
        const newRegistering = !registering;

        event.preventDefault();
        setRegistering(newRegistering);
        setMutation(newRegistering ? SIGNUP : LOGIN);
    }

    const [rootClassName, getChildClass] = getClassName({rootClass: 'login-form'});
    const buttonClass = getChildClass('button');

    return (
        <React.Fragment>
            <SEO title={registering ? 'Sign Up' : 'Login'} />
            <form
                className={rootClassName}
                onSubmit={handleSubmit(handleOnSubmit)}
                name="login"
            >
                {registering && (
                    <TextField {...getFieldProps({name: 'name', label: 'Name'})} />
                )}
                <TextField {...getFieldProps({name: 'email', label: 'Email'})} />
                <TextField
                    {...getFieldProps({
                        name: 'password',
                        label: 'Password',
                        type: 'password',
                    })}
                />
                {registering && (
                    <TextField
                        {...getFieldProps({
                            name: 'confirmPassword',
                            label: 'Confirm Password',
                            inputRef: fieldRegister({
                                required,
                                validate: matchesPassword,
                            }),
                            type: 'password',
                        })}
                    />
                )}
                <Button
                    disabled={authenticating}
                    className={buttonClass}
                    icon={authenticating && <LoadingSpinner small />}
                    raised
                    type="submit"
                >
                    {registering ? 'create account' : 'login'}
                </Button>
                <Button className={buttonClass} onClick={handleLoginTypeClick}>
                    {registering ? 'already have an account' : 'create an account'}
                </Button>
            </form>
        </React.Fragment>
    );
}

LoginForm.propTypes = {
    register: PropTypes.bool,
};

LoginForm.defaultProps = {
    register: false,
};
