import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {find, get} from 'lodash';
import {useQuery, useMutation} from '@apollo/react-hooks';

import usePollingInterval from 'hooks/usePollingInterval';
import {useAuth} from 'components/providers/AuthProvider';
import {useGlobalLoading} from 'components/providers/LoadingProvider';
import {useStorage} from 'components/providers/StorageProvider';

const DEFAULT_CONTEXT = {
    activeTab: 3,
    addListCalled: false,
    addListLoading: false,
    addListMutation: () => null,
    currentList: {},
    deleteListMutation: () => null,
    deleteLoading: false,
    goToEdit: () => null,
    isDisabled: () => true,
    listData: [],
    selectedListId: null,
    selectValue: '',
    setActiveTab: () => 3,
    setSelectedListId: () => null,
    updateListMutation: () => null,
    updateListLoading: false,
    userId: null,
};
export const ALL_LISTS = gql`
    query ALL_LISTS {
        allListsForUser {
            id
            name
            collaborated
            owner {
                id
            }
        }
    }
`;
const CREATE_LIST = gql`
    mutation CREATE_LIST($name: String!) {
        createList(name: $name) {
            id
            name
            collaborated
            owner {
                id
            }
        }
    }
`;
const UPDATE_LIST = gql`
    mutation UPDATE_LIST($listId: String!, $collaborated: Boolean, $name: String) {
        updateList(listId: $listId, collaborated: $collaborated, name: $name) {
            id
            name
            collaborated
            owner {
                id
            }
        }
    }
`;

const DELETE_LIST = gql`
    mutation DELETE_LIST($listId: String!) {
        deleteList(id: $listId) {
            id
        }
    }
`;

const ListsDataContext = createContext(DEFAULT_CONTEXT);

export function useListsData() {
    return useContext(ListsDataContext);
}

export default function ListsDataProvider({children}) {
    const pollInterval = usePollingInterval(30000);
    const {getItem, setItem} = useStorage();
    const [selectedListId, setSelectedListId] = useState(getItem('selectValue'));
    const [activeTab, setActiveTab] = useState(3);
    const {authenticating, loggedOut, userId} = useAuth();
    const {loading: listLoading, called: listCalled, data: listDataResponse} = useQuery(
        ALL_LISTS,
        {
            onCompleted: ({allListsForUser}) => {
                if (allListsForUser.length) {
                    setActiveTab(1);
                }
            },
            skip: loggedOut || authenticating,
            ssr: false,
            pollInterval,
        }
    );
    const listData = useMemo(
        () => (listCalled ? get(listDataResponse, 'allListsForUser', []) : []),
        [listCalled, listDataResponse]
    );
    const selectValue = useMemo(() => {
        let responseValue = '';

        if (listData && listData.length) {
            if (listData.filter(({id}) => id === selectedListId).length) {
                responseValue = selectedListId;
            } else {
                responseValue =
                    listData.find(({owner}) => owner.id === userId).id ||
                    get(listData, '0.id');
            }
        }

        return responseValue;
    }, [listData, selectedListId]);
    const currentList = useMemo(
        listCalled ? () => find(listData, ({id}) => id === selectValue) || {} : {},
        [listData, selectValue]
    );
    const [
        addListMutation,
        {called: addListCalled, loading: addListLoading},
    ] = useMutation(CREATE_LIST, {
        onCompleted: ({createList}) => {
            goToEdit(createList.id);
        },
        refetchQueries: [{query: ALL_LISTS}],
    });
    const [deleteListMutation, {loading: deleteLoading}] = useMutation(
        DELETE_LIST,
        {
            variables: {listId: selectedListId},
            refetchQueries: [{query: ALL_LISTS}],
        }
        // TODO: add update function
    );
    const [updateListMutation, {loading: updateListLoading}] = useMutation(
        UPDATE_LIST,
        {
            variables: {listId: selectedListId},
            refetchQueries: [{query: ALL_LISTS}],
        }
        // TODO: add update function
    );

    useGlobalLoading('listLoading', listLoading);
    useGlobalLoading('addListLoading', addListLoading);
    useGlobalLoading('deleteLoading', deleteLoading);

    useEffect(() => {
        const {id: currentId} = currentList;

        if (currentId !== selectedListId) {
            setSelectedListId(currentId);
        }
    }, [currentList, selectedListId, setSelectedListId]);

    useEffect(() => {
        setItem('selectValue', selectValue);
    }, [selectValue]);

    function goToEdit(listId) {
        if (listId) {
            setActiveTab(1);
            setSelectedListId(listId);
        }
    }

    // If ownerOnly is set to true, the item will only be enabled if the
    // the list belongs to the user.
    function isDisabled({ownerOnly} = {}) {
        let disabled = true;
        const listIsOwned = get(currentList, 'owner.id') === userId;

        if (listIsOwned) {
            disabled = false;
        } else {
            disabled = ownerOnly ? true : !get(currentList, 'collaborated');
        }

        return disabled;
    }

    const context = {
        activeTab,
        addListCalled,
        currentList,
        addListLoading,
        addListMutation,
        deleteLoading,
        deleteListMutation,
        goToEdit,
        isDisabled,
        listData,
        listLoading,
        selectValue,
        setActiveTab,
        selectedListId,
        setSelectedListId,
        updateListMutation,
        updateListLoading,
        userId,
    };

    return (
        <ListsDataContext.Provider value={context}>{children}</ListsDataContext.Provider>
    );
}

ListsDataProvider.propTypes = {
    children: PropTypes.node,
};
