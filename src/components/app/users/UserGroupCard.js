import React, {useState} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';

import getClassName from 'tools/getClassName';
import {useNotifications} from 'components/providers/NotificationProvider';
// core
import Button from 'components/core/Button';
import Headline from 'components/core/Headline';
import IconButton from 'components/core/IconButton';
import {Card, CardActions} from 'components/core/card';

// app
import InviteForm from './InviteForm';

import './UserGroupCard.scss';

const DELETE_GROUP = gql`
    mutation DELETE_GROUP($groupId: String!) {
        deleteUserGroup(groupId: $groupId) {
            id
        }
    }
`;
const DELETE_USER_FROM_GROUP = gql`
    mutation DELETE_USER_FROM_GROUP($groupId: String!, $userId: String!) {
        deleteUserFromGroup(groupId: $groupId, userId: $userId) {
            id
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

export default function UserGroupCard({className, groupCount, groupData, groupRefresh}) {
    const [rootClassName, getChildClass] = getClassName({
        className,
        rootClass: 'user-group-card',
    });
    const [inviteOpen, setInviteOpen] = useState(false);
    const [deleteGroupMutation, {loading: deleteGroupLoading}] = useMutation(
        DELETE_GROUP,
        {
            refetchQueries: [groupRefresh],
            errorPolicy: 'all',
        }
    );
    const [
        deleteUserFromGroupMutation,
        {loading: deleteUserFromGroupLoading},
    ] = useMutation(DELETE_USER_FROM_GROUP, {
        refetchQueries: [groupRefresh],
        errorPolicy: 'all',
    });
    const [deleteInviteMutation, {loading: deleteInviteLoading}] = useMutation(
        DELETE_INVITE,
        {
            refetchQueries: [groupRefresh],
            errorPolicy: 'all',
        }
    );
    const {setNotification} = useNotifications();

    function handleDeleteClick() {
        if (groupCount > 1) {
            const confirmDelete = confirm('Are you sure you want to delete this group?');

            if (confirmDelete) {
                deleteGroupMutation({variables: {groupId: groupData.id}});
            }
        } else {
            setNotification({
                message: 'You must be associated with at least one group',
                messageKey: 'deleteGroup',
                ttl: 10000,
            });
        }
    }

    function handleInviteClick() {
        setInviteOpen(!inviteOpen);
    }

    function handleDeleteGroupUser(userId) {
        return () => {
            const confirmDelete = confirm(
                'Are you sure you want to remove yourself from this group?'
            );

            if (confirmDelete) {
                deleteUserFromGroupMutation({variables: {userId, groupId: groupData.id}});
            }
        };
    }

    function handleDeleteInvite(inviteId) {
        return () => {
            const confirmDelete = confirm(
                'Are you sure you want delete this invitation?'
            );

            if (confirmDelete) {
                deleteInviteMutation({variables: {inviteId}});
            }
        };
    }

    function renderInvites() {
        return (
            <section className={getChildClass('group-section')}>
                <Headline level={3}>Invites</Headline>
                {groupData.invites.map(({id: inviteId, email}) => (
                    <div key={inviteId} className={getChildClass('grid')}>
                        <div>{email}</div>
                        <div>
                            <IconButton
                                disabled={deleteInviteLoading}
                                icon="delete"
                                onClick={handleDeleteInvite(inviteId)}
                            />
                        </div>
                    </div>
                ))}
            </section>
        );
    }

    function renderOwnedGroups() {
        return (
            <React.Fragment>
                {groupData.users && (
                    <section className={getChildClass('group-section')}>
                        <Headline level={3}>Users In Group</Headline>
                        {groupData.users.map(({id: userId, name}) => (
                            <div key={userId} className={getChildClass('grid')}>
                                <div>{name}</div>
                                <div>
                                    <IconButton
                                        disabled={deleteUserFromGroupLoading}
                                        icon="delete"
                                        onClick={handleDeleteGroupUser(userId)}
                                    />
                                </div>
                            </div>
                        ))}
                    </section>
                )}
                {groupData.invites && !!groupData.invites.length && renderInvites()}
                {inviteOpen && (
                    <InviteForm
                        className={getChildClass('invite-form')}
                        groupData={groupData}
                        groupRefresh={groupRefresh}
                        onSubmit={handleInviteClick}
                    />
                )}
                <CardActions>
                    <IconButton
                        icon="delete"
                        onClick={handleDeleteClick}
                        disabled={deleteGroupLoading}
                    />
                    <IconButton icon="share" onClick={handleInviteClick} />
                </CardActions>
            </React.Fragment>
        );
    }

    return (
        <Card className={rootClassName}>
            <Headline level={2}>
                {!groupData.owned && `${groupData.owner.name} - `}
                {groupData.name}
            </Headline>
            {groupData.owned ? (
                renderOwnedGroups()
            ) : (
                <CardActions>
                    <Button icon="delete" raised onClick={handleDeleteGroupUser()}>
                        Remove Me from Group
                    </Button>
                </CardActions>
            )}
        </Card>
    );
}

UserGroupCard.propTypes = {
    className: PropTypes.string,
    groupCount: PropTypes.number,
    groupData: PropTypes.object,
    groupRefresh: PropTypes.object,
};
