import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {get} from 'lodash';
import {useMutation, useQuery} from '@apollo/react-hooks';

import getClassName from 'tools/getClassName';
import {useListsData} from 'components/providers/ListsDataProvider';
import {useGlobalLoading} from 'components/providers/LoadingProvider';

// core
import Switch from 'components/core/Switch';
import {List} from 'components/core/list';

// app
import ListItemGrid from 'components/app/ListItemGrid';

const SHARED_USERS = gql`
    query SHARED_USERS($listId: String!) {
        sharedUsers(listId: $listId) {
            id
            name
            email
            sharedLists {
                id
            }
        }
    }
`;
const SHARE_UNSHARE_LIST = gql`
    mutation SHARE_UNSHARE_LIST($listId: String!, $userId: String!) {
        shareUnshareList(listId: $listId, userId: $userId) {
            id
            sharedWith {
                id
            }
        }
    }
`;

export default function ShareList({className}) {
    const [rootClassName] = getClassName({className, rootClass: 'share'});
    const {isDisabled, selectedListId: listId, userId} = useListsData();
    const {loading: loadingUsers, data: usersResponse} = useQuery(SHARED_USERS, {
        skip: !listId,
        variables: {
            listId,
        },
    });
    const [shareUnshareListMutation, {loading: loadingShareList}] = useMutation(
        SHARE_UNSHARE_LIST,
        {
            refetchQueries: [{query: SHARED_USERS, variables: {listId}}],
        }
    );
    const userData = useMemo(() => get(usersResponse, 'sharedUsers', []), [
        usersResponse,
    ]);
    const disabled = useMemo(() => isDisabled({ownerOnly: true}) || loadingUsers, [
        isDisabled,
        loadingUsers,
    ]);

    useGlobalLoading('loadingUsers', loadingUsers);

    function handleShareUnshareClick(event) {
        shareUnshareListMutation({
            variables: {
                listId,
                userId: event.currentTarget.value,
                remove: !event.currentTarget.checked,
            },
        });
    }

    return (
        <List className={rootClassName}>
            {userData
                .filter(({id}) => id !== userId)
                .map(({id: userId, name: userName, sharedLists}) => (
                    <ListItemGrid key={userId}>
                        <div>
                            <Switch
                                name={`need_${userId}`}
                                defaultChecked={
                                    !!sharedLists.filter(({id}) => id === listId).length
                                }
                                disabled={disabled}
                                onClick={handleShareUnshareClick}
                                value={userId}
                            />
                        </div>
                        <div>{userName}</div>
                        <div />
                    </ListItemGrid>
                ))}
        </List>
    );
}

ShareList.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    listId: PropTypes.string,
    pollInterval: PropTypes.number,
};
