import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import {chain} from 'lodash';

import getClassName from 'tools/getClassName';
import {useGlobalLoading} from 'components/providers/LoadingProvider';

import UserCard from './UserCard';
import Section from 'components/layout/Section';

import './Users.scss';

const ALL_USERS = gql`
    query ALL_USERS {
        allUsers {
            id
            name
            email
        }
    }
`;

export default function Users({className}) {
    const [rootClassName, getChildClass] = getClassName({
        className,
        rootClass: 'users',
    });
    const {loading, data} = useQuery(ALL_USERS);

    useGlobalLoading('usersLoading', loading);

    return (
        <Section className={rootClassName}>
            {chain(data)
                .get('allUsers')
                .map((user) => {
                    return (
                        <UserCard
                            className={getChildClass('user')}
                            user={user}
                            key={`user_${user.id}`}
                        />
                    );
                })
                .value()}
        </Section>
    );
}

Users.propTypes = {
    className: PropTypes.string,
};
