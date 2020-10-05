import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {get} from 'lodash';
import {useMutation, useQuery} from '@apollo/react-hooks';

import getClassName from 'tools/getClassName';
import {useListData} from 'components/providers/ListDataProvider';
import {useGlobalLoading} from 'components/providers/LoadingProvider';
import {USER_CONNECTIONS} from 'components/app/users/UserConnections';

// core
import Link from 'components/core/Link';
import Switch from 'components/core/Switch';

// layout
import SimpleRecordGrid from 'components/layout/SimpleRecordGrid';

// app
import './ShareList.scss';

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
    const {isDisabled, listId, listData, listRefetch} = useListData();
    const {
        called: connectionsCalled,
        data: connectionsDataResponse,
        loading: connectionsLoading,
    } = useQuery(USER_CONNECTIONS, {pollInterval: 10000, errorPolicy: 'all'});
    const connectionsData = useMemo(() => {
        return connectionsCalled
            ? get(connectionsDataResponse, 'userConnections.connections', [])
            : [];
    }, [connectionsCalled, connectionsDataResponse]);
    const sharedWithUsers = useMemo(() => get(listData, 'sharedWith', []), [listData]);
    const [shareUnshareListMutation, {loading: loadingShareList}] = useMutation(
        SHARE_UNSHARE_LIST,
        {
            errorPolicy: 'all',
            refetchQueries: [listRefetch],
        }
    );
    const disabled = useMemo(() => isDisabled({ownerOnly: true}), [isDisabled]);

    useGlobalLoading('connectionsLoading', connectionsLoading);
    useGlobalLoading('loadingShareList', loadingShareList);

    function handleShareUnshareClick(event) {
        shareUnshareListMutation({
            variables: {
                listId,
                userId: event.currentTarget.value,
                remove: !event.currentTarget.checked,
            },
        });
    }

    function renderSharedUsers({id: shareUserId, name: shareUserName}) {
        return (
            <div key={shareUserId}>
                <Switch
                    checked={
                        !!sharedWithUsers.filter(({id}) => id === shareUserId).length
                    }
                    disabled={disabled}
                    label={shareUserName}
                    name={`share_${shareUserId}`}
                    onClick={handleShareUnshareClick}
                    value={shareUserId}
                />
            </div>
        );
    }

    return (
        <div className={rootClassName}>
            {disabled ? (
                'This list must belong to you to choose who to share with.'
            ) : (
                <React.Fragment>
                    <p>
                        <Link href="/user-groups" className={getChildClass('invite')}>
                            Invite more users
                        </Link>
                    </p>
                    <SimpleRecordGrid
                        records={connectionsData}
                        renderRow={renderSharedUsers}
                    />
                </React.Fragment>
            )}
        </div>
    );
}

ShareList.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    listId: PropTypes.string,
    pollInterval: PropTypes.number,
};
