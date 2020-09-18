import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {get} from 'lodash';
import {useQuery} from '@apollo/react-hooks';
import {useRouter} from 'next/router';

import usePollingInterval from 'hooks/usePollingInterval';
import {useAuth} from 'components/providers/AuthProvider';
import {useGlobalLoading} from 'components/providers/LoadingProvider';

const DEFAULT_CONTEXT = {
    allListsData: [],
    isDisabled: () => true,
    itemsData: [],
    listData: null,
    listId: null,
    listRefetch: {},
    pageKey: null,
};
const ALL_LISTS = gql`
    query ALL_LISTS {
        allListsForUser {
            id
            name
            collaborated
            owner {
                id
                name
            }
        }
    }
`;
const LIST = gql`
    query LIST($listId: String!) {
        list(listId: $listId) {
            id
            collaborated
            name
            owner {
                id
                name
            }
            sharedWith {
                id
                name
                email
            }
            items {
                id
                name
                need
                purchased
            }
        }
    }
`;
const ListDataContext = createContext(DEFAULT_CONTEXT);

export function useListData() {
    return useContext(ListDataContext);
}

export default function ListDataProvider({children}) {
    const router = useRouter();
    const [listId, setListId] = useState();
    const [pageListId, pageKey] = useMemo(
        () => get(router, 'query.slug', [null, 'default']),
        [router]
    );
    const pollInterval = usePollingInterval(30000);
    const {authenticating, loggedOut, userId} = useAuth();
    const {
        loading: allListsLoading,
        called: allListsCalled,
        data: allListsDataResponse,
    } = useQuery(ALL_LISTS, {
        skip: loggedOut || authenticating,
        ssr: false,
        pollInterval,
    });
    const {
        called: listDataCalled,
        data: listDataResponse,
        loading: listDataLoading,
    } = useQuery(LIST, {
        skip: !listId,
        variables: {listId},
        pollInterval,
    });
    const allListsData = useMemo(
        () => (allListsCalled ? get(allListsDataResponse, 'allListsForUser', []) : []),
        [allListsCalled, allListsDataResponse]
    );
    const listData = useMemo(
        () => (listDataCalled ? get(listDataResponse, 'list', []) : []),
        [listDataCalled, listDataResponse]
    );
    const itemsData = useMemo(() => get(listData, 'items', []));
    const listRefetch = useMemo(() =>
        listId ? {query: LIST, variables: {listId}} : undefined
    );

    useGlobalLoading('allListsLoading', allListsLoading);
    useGlobalLoading('listDataLoading', listDataLoading);

    useEffect(() => {
        // If a pageListId is set, check if it exists in the list and set it as the
        // listId.  If not, set it to the first record in the list. If a list doesn't exit,
        // go back to the index page.
        if (pageListId && pageListId !== listId) {
            if (allListsData.length) {
                if (allListsData.find(({id}) => id === pageListId)) {
                    setListId(pageListId);
                } else {
                    setListId(allListsData[0].id);
                }
            } else if (!allListsLoading && allListsCalled) {
                router.replace('/');
            }
        }
    }, [allListsCalled, allListsData, allListsLoading, listId, pageListId, setListId]);

    function isDisabled({ownerOnly} = {}) {
        let disabled = true;
        const listIsOwned = get(listData, 'owner.id') === userId;

        if (listIsOwned) {
            disabled = false;
        } else {
            disabled = ownerOnly ? true : !get(listData, 'collaborated');
        }

        return disabled;
    }

    // const selectValue = useMemo(() => {
    //     let responseValue = '';

    //     if (allListsData && allListsData.length) {
    //         if (allListsData.filter(({id}) => id === listId).length) {
    //             responseValue = listId;
    //         } else {
    //             responseValue =
    //                 allListsData.find(({owner}) => owner.id === userId).id ||
    //                 get(allListsData, '0.id');
    //         }
    //     }

    //     return responseValue;
    // }, [allListsData, listId]);
    const context = {
        allListsData,
        allListsRefetch: {query: ALL_LISTS},
        isDisabled,
        itemsData,
        listData: listData || {items: []},
        listId,
        listRefetch,
        pageKey,
    };

    return (
        <ListDataContext.Provider value={context}>{children}</ListDataContext.Provider>
    );
}

ListDataProvider.propTypes = {
    children: PropTypes.node,
};
