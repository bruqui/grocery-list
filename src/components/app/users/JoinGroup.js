import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {get} from 'lodash';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {useRouter} from 'next/router';

import getClassName from 'tools/getClassName';
import {useGlobalLoading} from 'components/providers/LoadingProvider';

// core
import Headline from 'components/core/Headline';
import Button from 'components/core/Button';

// layout
import Section from 'components/layout/Section';

const USER_GROUP_INVITE = gql`
    query USER_GROUP_INVITE($inviteId: String!) {
        userGroupInvite(inviteId: $inviteId) {
            id
            userGroup {
                id
                name
                owner {
                    name
                }
            }
        }
    }
`;
const JOIN_USER_GROUP = gql`
    mutation JOIN_USER_GROUP($inviteId: String!, $accept: Boolean!) {
        joinGroup(inviteId: $inviteId, accept: $accept) {
            id
        }
    }
`;

export default function JoinGroup({className}) {
    const [rootClassName] = getClassName({className, rootClass: 'join-group'});
    const router = useRouter();
    const queryInviteId = useMemo(() => router.query.inviteId, [router]);
    const {
        called: inviteDataCalled,
        data: inviteDataResponse,
        loading: inviteDataLoading,
    } = useQuery(USER_GROUP_INVITE, {
        variables: {inviteId: router.query.inviteId},
        skip: !queryInviteId,
    });
    const [joinGroupMutation, {loading: joinGroupLoading}] = useMutation(
        JOIN_USER_GROUP,
        {errorPolicy: 'all', onCompleted: () => router.push('/user-groups')}
    );
    const inviteData = useMemo(
        () => (inviteDataCalled ? get(inviteDataResponse, 'userGroupInvite', {}) : {}),
        [inviteDataCalled, inviteDataResponse]
    );
    const {name: groupName, owner: groupOwner} = useMemo(
        () => get(inviteData, 'userGroup', {id: null, name: null, owner: {name: null}}),
        [inviteData]
    );

    useGlobalLoading('inviteDataLoading', inviteDataLoading);

    function joinGroup(accept) {
        joinGroupMutation({variables: {accept, inviteId: queryInviteId}});
    }

    function handleAcceptClick() {
        joinGroup(true);
    }

    function handleDeclineClick() {
        joinGroup(false);
    }

    return (
        <Section className={rootClassName} centered padding>
            <Headline level={2}>Join {groupName}</Headline>
            <p>
                {groupOwner.name} has invited you to join {groupName}
            </p>
            <p>
                <Button
                    raised
                    onClick={handleAcceptClick}
                    loading={joinGroupLoading}
                    disabled={joinGroupLoading}
                >
                    Accept
                </Button>
                <Button
                    outlined
                    onClick={handleDeclineClick}
                    loading={joinGroupLoading}
                    disabled={joinGroupLoading}
                >
                    Decline
                </Button>
            </p>
        </Section>
    );
}

JoinGroup.propTypes = {
    className: PropTypes.string,
};
