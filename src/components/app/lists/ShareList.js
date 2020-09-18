import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {get} from 'lodash';
import {useMutation, useQuery} from '@apollo/react-hooks';

import getClassName from 'tools/getClassName';
import {useListData} from 'components/providers/ListDataProvider';
import {useGlobalLoading} from 'components/providers/LoadingProvider';

// core
import Link from 'components/core/Link';
import Switch from 'components/core/Switch';

import './ShareList.scss';

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
    mutation SHARE_UNSHARE_LIST($listId: String!, $userId: String!, $remove: Boolean) {
        shareUnshareList(listId: $listId, userId: $userId, remove: $remove) {
            id
            sharedWith {
                id
            }
        }
    }
`;

export default function ShareList({className}) {
    const [rootClassName, getChildClass] = getClassName({
        className,
        rootClass: 'share-list',
    });
    const {isDisabled, listId, userId} = useListData();
    const {loading: loadingUsers, data: usersResponse} = useQuery(SHARED_USERS, {
        skip: !listId,
        variables: {
            listId,
        },
    });
    const [shareUnshareListMutation, {loading: loadingShareList}] = useMutation(
        SHARE_UNSHARE_LIST,
        {
            errorPolicy: 'all',
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

    useGlobalLoading('loadingShareList', loadingShareList);
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
        <div className={rootClassName}>
            <p>
                <Link to="/user-groups" className={getChildClass('invite')}>
                    Invite more users
                </Link>
            </p>
            <ul>
                {userData
                    .filter(({id}) => id !== userId)
                    .map(({id: userId, name: userName, sharedLists}) => (
                        <li key={userId} className={getChildClass('li')}>
                            <div>
                                <Switch
                                    name={`share_${userId}`}
                                    checked={
                                        !!sharedLists.filter(({id}) => id === listId)
                                            .length
                                    }
                                    disabled={disabled}
                                    onClick={handleShareUnshareClick}
                                    value={userId}
                                />
                            </div>
                            <div>{userName}</div>
                        </li>
                    ))}
            </ul>
        </div>
    );
}

ShareList.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    listId: PropTypes.string,
    pollInterval: PropTypes.number,
};
