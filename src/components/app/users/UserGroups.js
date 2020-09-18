import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {get} from 'lodash';
import {useQuery} from '@apollo/react-hooks';

import getClassName from 'tools/getClassName';
import {useGlobalLoading} from 'components/providers/LoadingProvider';

// core
import Headline from 'components/core/Headline';

// layout
import Section from 'components/layout/Section';

// app
import UserGroupCard from './UserGroupCard';
import UserGroupForm from './UserGroupForm';

const USER_GROUPS = gql`
    query USER_GROUPS {
        groupsWithUsers {
            id
            name
            owner {
                id
                name
            }
            users {
                id
                name
                email
            }
            invites {
                id
                email
            }
            owned
        }
    }
`;
const groupRefresh = {query: USER_GROUPS};

export default function UserGroups({className}) {
    const [rootClassName] = getClassName({className, rootClass: 'user-groups'});
    const {called, data, loading} = useQuery(USER_GROUPS);
    const userGroupData = useMemo(
        () => (called ? get(data, 'groupsWithUsers', []) : []),
        [called, data]
    );

    useGlobalLoading('userGroupLoading', loading);

    return (
        <Section centered className={rootClassName} padding>
            <Headline level={2}>Groups</Headline>
            <UserGroupForm groupRefresh={groupRefresh} />
            {userGroupData.length ? (
                userGroupData.map(({id, ...groupData}) => {
                    return (
                        <UserGroupCard
                            key={id}
                            groupData={{...groupData, id}}
                            groupRefresh={groupRefresh}
                            groupCount={userGroupData.length}
                        />
                    );
                })
            ) : (
                <div>No groups available. Please add a group.</div>
            )}
        </Section>
    );
}

UserGroups.propTypes = {
    className: PropTypes.string,
};
