import React, {createContext, useCallback, useContext, useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {get} from 'lodash';
import {useMutation, useQuery} from '@apollo/react-hooks';

import useGlobalLoading from 'hooks/useGlobalLoading';

const DEFAULT_CONTEXT = {
    addItem: () => null,
    addList: () => null,
    deleteList: () => null,
    lists: [],
    sharedLists: [],
};
const ALL_LISTS = gql`
    query ALL_LISTS {
        allListsForUser {
            lists {
                id
                name
                items {
                    id
                    name
                    need
                }
            }
            sharedLists {
                list {
                    id
                    name
                    collaborated
                    items {
                        id
                        name
                        need
                    }
                }
            }
        }
    }
`;
const DELETE_LIST = gql`
    mutation DELETE_LIST($id: String!) {
        deleteList(id: $id) {
            id
        }
    }
`;
const CREATE_LIST = gql`
    mutation CREATE_LIST($name: String!) {
        createList(name: $name) {
            id
        }
    }
`;
const CREATE_ITEM = gql`
    mutation CREATE_ITEM($name: String!, $listId: String!) {
        createItem(name: $name, listId: $listId) {
            name
        }
    }
`;

const ListContext = createContext(DEFAULT_CONTEXT);

export const useLists = ({itemFormReset, listFormReset} = {}) => {
    return useContext(ListContext);
};

export default function ListProvider({children}) {
    const {loading, setLoading} = useGlobalLoading();
    const {
        loading: listLoading,
        error: listError,
        data: listData,
        refetch: listRefetch,
    } = useQuery(ALL_LISTS, {ssr: false});

    const handleCompleted = useCallback(() => {
        return true;
    }, [listRefetch]);

    const [
        addItemMutation,
        {called: addItemCalled, error: addItemError, loading: addItemLoading},
    ] = useMutation(CREATE_ITEM, {
        onCompleted: handleCompleted,
    });

    const [
        addListMutation,
        {
            called: addListCalled,
            data: addListData,
            error: addListError,
            loading: addListLoading,
        },
    ] = useMutation(CREATE_LIST, {
        onCompleted: handleCompleted,
    });

    const [
        deleteListMutation,
        {error: deleteError, loading: deleteLoading},
    ] = useMutation(DELETE_LIST, {
        onCompleted: listRefetch,
    });

    const {lists, sharedLists} = useMemo(
        () =>
            get(listData, 'allListsForUser', {
                lists: [],
                sharedLists: [],
            }),
        [listData]
    );

    useEffect(() => {
        if (
            !loading &&
            (listLoading || deleteLoading || addListLoading || addItemLoading)
        ) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [listLoading, deleteLoading, addListLoading, addItemLoading]);

    function addList(formData, callback) {
        addListMutation({variables: formData});
    }

    function addItem(formData, callback) {
        addItemMutation({variables: formData});
    }

    function deleteList(listId) {
        deleteListMutation({variables: {id: listId}});
    }

    const context = {
        addItem,
        addItemCalled,
        addItemError,
        addList,
        addListCalled,
        addListData,
        addListError,
        deleteList,
        lists,
        sharedLists,
    };

    return <ListContext.Provider value={context}>{children}</ListContext.Provider>;
}

ListProvider.propTypes = {
    children: PropTypes.node,
};
