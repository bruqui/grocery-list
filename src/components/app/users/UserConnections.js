import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {get} from 'lodash';
import {useMutation, useQuery} from '@apollo/react-hooks';

import getClassName from 'tools/getClassName';
import {useGlobalLoading} from 'components/providers/LoadingProvider';

// core
import Button from 'components/core/Button';
import Headline from 'components/core/Headline';
import IconButton from 'components/core/IconButton';

// layout
import Section from 'components/layout/Section';
import SimpleRecordGrid from 'components/layout/SimpleRecordGrid';

// app
import InviteForm from './InviteForm';

import './UserConnections.scss';

// This is used in other places. Not sure why eslint is throwing error
// eslint-disable-next-line import/no-unused-modules
export const USER_CONNECTIONS = gql`
    query USER_CONNECTIONS {
        userConnections {
            id
            connections {
                id
                email
                name
            }
            invites {
                id
                email
            }
        }
    }
`;

const INVITES = gql`
    query INVITES {
        invites {
            id
            owner {
                id
                name
            }
        }
    }
`;

const DELETE_INVITE = gql`
    mutation DELETE_INVITE($inviteId: String!) {
        deleteInvite(inviteId: $inviteId) {
            id
        }
    }
`;

const ACCEPT_INVITE = gql`
    mutation ACCEPT_INVITE($inviteId: String!) {
        acceptInvite(inviteId: $inviteId) {
            id
        }
    }
`;

const DELETE_CONNECTION = gql`
    mutation DELETE_CONNECTION($connectionUserId: String!) {
        deleteConnection(connectionUserId: $connectionUserId) {
            id
        }
    }
`;

const connectionsRefresh = {query: USER_CONNECTIONS};

export default function UserConnections({className}) {
    const [rootClassName, getChildClass] = getClassName({
        className,
        rootClass: 'user-connections',
    });
    const {
        called: connectionCalled,
        data: connectionDataResponse,
        loading: connectionLoading,
    } = useQuery(USER_CONNECTIONS, {pollInterval: 10000, errorPolicy: 'all'});
    const userConnectionsData = useMemo(() => {
        const defaultData = {
            connections: [],
            invites: [],
        };

        return connectionCalled
            ? get(connectionDataResponse, 'userConnections', defaultData)
            : defaultData;
    }, [connectionCalled, connectionDataResponse]);
    const {
        called: inviteCalled,
        data: inviteDataResponse,
        loading: inviteLoading,
    } = useQuery(INVITES, {pollInterval: 10000, errorPolicy: 'all'});
    const [deleteInviteMutation, {loading: deleteInviteLoading}] = useMutation(
        DELETE_INVITE,
        {
            refetchQueries: [connectionsRefresh],
            errorPolicy: 'all',
        }
    );
    const [acceptInviteMutation, {loading: acceptInviteLoading}] = useMutation(
        ACCEPT_INVITE,
        {
            refetchQueries: [connectionsRefresh, {query: INVITES}],
            errorPolicy: 'all',
        }
    );
    const userInviteData = useMemo(() => {
        return inviteCalled ? get(inviteDataResponse, 'invites', {}) : {};
    }, [inviteCalled, inviteDataResponse]);
    const [deleteConnectionMutation, {loading: deleteConnectionLoading}] = useMutation(
        DELETE_CONNECTION,
        {
            refetchQueries: [connectionsRefresh],
            errorPolicy: 'all',
        }
    );

    useGlobalLoading('connectionLoading', connectionLoading);
    useGlobalLoading('inviteLoading', inviteLoading);
    useGlobalLoading('acceptInviteLoading', acceptInviteLoading);

    function handleDeleteInvite(inviteId, isInvitee) {
        return () => {
            const confirmMsg = isInvitee
                ? 'Are you sure you want to decine this invitation?'
                : 'Are you sure you want delete this invitation?';
            const confirmDelete = confirm(confirmMsg);

            if (confirmDelete) {
                deleteInviteMutation({variables: {inviteId}});
            }
        };
    }

    function handleDeleteConnection(connectionUserId) {
        return () => {
            const confirmDelete = confirm(
                'Are you sure you want delete this connection?'
            );

            if (confirmDelete) {
                deleteConnectionMutation({variables: {connectionUserId}});
            }
        };
    }

    function handleAcceptInvite(inviteId) {
        return () => acceptInviteMutation({variables: {inviteId}});
    }

    function renderConnectionRow({id, name}) {
        return (
            <React.Fragment key={id}>
                <div>{name}</div>
                <div>
                    <IconButton
                        icon="delete"
                        disabled={deleteConnectionLoading}
                        onClick={handleDeleteConnection(id)}
                    />
                </div>
            </React.Fragment>
        );
    }

    function renderInviteRow({email, id}) {
        return (
            <React.Fragment key={id}>
                <div>{email}</div>
                <div>
                    <IconButton
                        icon="delete"
                        disabled={deleteInviteLoading}
                        onClick={handleDeleteInvite(id)}
                    />
                </div>
            </React.Fragment>
        );
    }

    function renderInvitedRow({owner, id}) {
        return (
            <React.Fragment key={id}>
                <div>{owner.name}</div>
                <div>
                    <Button raised onClick={handleAcceptInvite(id)}>
                        Accept
                    </Button>
                    <Button secondary outlined onClick={handleDeleteInvite(id, true)}>
                        Decline
                    </Button>
                </div>
            </React.Fragment>
        );
    }

    return (
        <Section className={rootClassName} centered>
            <Headline level={2}>User Connections</Headline>
            <InviteForm inviteRefetch={{query: USER_CONNECTIONS}} />
            {userConnectionsData &&
                userConnectionsData.connections &&
                !!userConnectionsData.connections.length && (
                    <Section className={getChildClass('section')}>
                        <Headline level={3}>Connections</Headline>
                        <SimpleRecordGrid
                            records={userConnectionsData.connections}
                            renderRow={renderConnectionRow}
                        />
                    </Section>
                )}
            {userConnectionsData &&
                userConnectionsData.invites &&
                !!userConnectionsData.invites.length && (
                    <Section className={getChildClass('section')}>
                        <Headline level={3}>Invites Sent</Headline>
                        <SimpleRecordGrid
                            records={userConnectionsData.invites}
                            renderRow={renderInviteRow}
                        />
                    </Section>
                )}
            {userInviteData && !!userInviteData.length && (
                <Section className={getChildClass('section')}>
                    <Headline level={3}>Invites Received</Headline>
                    <SimpleRecordGrid
                        records={userInviteData}
                        renderRow={renderInvitedRow}
                    />
                </Section>
            )}
        </Section>
    );
}

UserConnections.propTypes = {
    className: PropTypes.string,
};
