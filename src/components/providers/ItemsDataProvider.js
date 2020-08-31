import React, {createContext, useContext, useMemo} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {get} from 'lodash';

import usePollingInterval from 'hooks/usePollingInterval';
import {useGlobalLoading} from 'components/providers/LoadingProvider';
import {useListsData} from 'components/providers/ListsDataProvider';

const DEFAULT_CONTEXT = {
    addItemCalled: false,
    addItemLoading: false,
    addItemMutation: () => null,
    itemsData: [],
    updateItemMutation: () => null,
    updateItemsMutation: () => null,
};
const ALL_ITEMS = gql`
    query ALL_ITEMS($listId: String!) {
        itemsForList(listId: $listId) {
            id
            name
            need
            purchased
        }
    }
`;
const CREATE_ITEM = gql`
    mutation CREATE_ITEM($name: String!, $listId: String!) {
        createItem(name: $name, listId: $listId) {
            id
            name
            purchased
            need
            list {
                id
            }
        }
    }
`;
const DELETE_ITEM = gql`
    mutation DELETE_ITEM($itemId: String!) {
        deleteItem(itemId: $itemId) {
            id
        }
    }
`;
const UPDATE_ITEM = gql`
    mutation UPDATE_ITEM($itemId: String!, $need: Boolean, $purchased: Boolean) {
        updateItem(itemId: $itemId, need: $need, purchased: $purchased) {
            id
            name
            need
            purchased
        }
    }
`;
const UPDATE_ITEMS = gql`
    mutation UPDATE_ITEMS($itemIds: [String!], $need: Boolean, $purchased: Boolean) {
        updateItems(itemIds: $itemIds, need: $need, purchased: $purchased) {
            count
        }
    }
`;

const ItemsContext = createContext(DEFAULT_CONTEXT);

export function useItemsData() {
    return useContext(ItemsContext);
}

export default function ItemsProvider({children}) {
    const {selectedListId: listId} = useListsData();
    const pollInterval = usePollingInterval(30000);
    const {loading: itemsLoading, data: itemsDataResponse} = useQuery(ALL_ITEMS, {
        pollInterval,
        skip: !listId,
        ssr: false,
        variables: {listId},
    });
    const itemsData = useMemo(() => {
        return get(itemsDataResponse, 'itemsForList', []);
    }, [itemsDataResponse]);
    const [updateItemMutation, {loading: updateItemLoading}] = useMutation(UPDATE_ITEM, {
        refetchQueries: [{query: ALL_ITEMS, variables: {listId}}],
    });
    const [deleteItemMutation, {loading: deleteItemLoading}] = useMutation(DELETE_ITEM, {
        refetchQueries: [{query: ALL_ITEMS, variables: {listId}}],
    });
    const [updateItemsMutation, {loading: updateItemsLoading}] = useMutation(
        UPDATE_ITEMS,
        {
            refetchQueries: [{query: ALL_ITEMS, variables: {listId: listId}}],
        }
    );
    const [
        addItemMutation,
        {called: addItemCalled, loading: addItemLoading},
    ] = useMutation(CREATE_ITEM, {
        // TODO: It would be better to use the update; however, the Items component doesn't
        // update when the following update is issued. It definitely is working because
        // the new record is in the cache when this happens. The refetchQueries with ALL_ITEMS
        // seems to update the Items component, but this kicks off a request which seems like
        // a wasted network call. I think cache.modify is probably the better thing to use,
        // but that isn't part of cache for some reason and not sure why since it's in the documentation.
        // async update(cache, {data: {createItem}}) {
        //     await cache.writeFragment({
        //         id: listId,
        //         fragment: NewItemFragment,
        //         data: createItem,
        //     });

        //     cache.readQuery({query: ALL_ITEMS, variables: {listId}});
        // },
        refetchQueries: [{query: ALL_ITEMS, variables: {listId}}],
    });

    useGlobalLoading('itemsLoading', itemsLoading);
    useGlobalLoading('updateItemLoading', updateItemLoading);
    useGlobalLoading('updateItemsLoading', updateItemsLoading);

    const context = {
        addItemCalled,
        addItemLoading,
        addItemMutation,
        deleteItemLoading,
        deleteItemMutation,
        itemsData,
        updateItemMutation,
        updateItemsMutation,
    };

    return <ItemsContext.Provider value={context}>{children}</ItemsContext.Provider>;
}

ItemsProvider.propTypes = {
    children: PropTypes.node,
};
