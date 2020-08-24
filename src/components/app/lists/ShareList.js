import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {get} from 'lodash';
import {useQuery} from '@apollo/react-hooks';

import getClassName from 'tools/getClassName';
import {useAuth} from 'components/providers/AuthProvider';
import {useGlobalLoading} from 'components/providers/LoadingProvider';

// core
import Switch from 'components/core/Switch';
import {List} from 'components/core/list';

// app
import ListItemGrid from 'components/app/ListItemGrid';

const ALL_USERS = gql`
    query ALL_USERS {
        allUsers {
            id
            name
            email
        }
    }
`;

const ALL_SHARED_WITH = gql`
    query ALL_SHARED_WITH($listId: String!) {
        listSharedWith(listId: $listId) {
            id
        }
    }
`;

export default function ShareList({className, disabled, listId, pollInterval}) {
    const [rootClassName] = getClassName({className, rootClass: 'share'});
    const {userId} = useAuth();
    const {loading: sharedWithLoading, data: sharedWithResponse} = useQuery(
        ALL_SHARED_WITH,
        {
            pollInterval,
            skip: !listId,
            ssr: false,
            variables: {listId},
        }
    );
    const {loading: loadingUsers, data: usersResponse} = useQuery(ALL_USERS);
    const sharedWithData = useMemo(() => get(sharedWithResponse, 'listSharedWith', []), [
        sharedWithResponse,
    ]);
    const userData = useMemo(() => get(usersResponse, 'allUsers', []), [
        sharedWithResponse,
    ]);

    useGlobalLoading('sharedWithLoading', sharedWithLoading);
    useGlobalLoading('loadingUsers', loadingUsers);

    return (
        <List className={rootClassName}>
            {userData
                .filter(({id}) => userId !== id)
                .map(({id: sharedWithId, name: sharedWithName}) => (
                    <ListItemGrid key={sharedWithId}>
                        <div>
                            <Switch
                                name={`need_${sharedWithId}`}
                                defaultChecked={
                                    !!sharedWithData.filter(({id}) => id === sharedWithId)
                                        .length
                                }
                                disabled={disabled}
                            />
                        </div>
                        <div>{sharedWithName}</div>
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
