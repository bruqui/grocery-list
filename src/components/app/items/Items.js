import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {get} from 'lodash';

import getClassName from 'tools/getClassName';
import {useGlobalLoading} from 'components/providers/LoadingProvider';

// core
import IconButton from 'components/core/IconButton';
import Switch from 'components/core/Switch';
import {List} from 'components/core/list';

// app
import ItemCheckbox from './ItemCheckbox';
import ListItemGrid from 'components/app/ListItemGrid';

export const ALL_ITEMS = gql`
    query ALL_ITEMS($listId: String!) {
        itemsForList(listId: $listId) {
            id
            name
            need
            purchased
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

export default function Items({
    className,
    clearFromNeed,
    editable,
    editMode,
    isDisabled,
    listId,
    pollInterval,
}) {
    const [rootClassName] = getClassName({className, rootClass: 'items'});
    const {loading: itemsLoading, data: itemsDataResponse} = useQuery(ALL_ITEMS, {
        pollInterval,
        skip: !listId,
        ssr: false,
        variables: {listId},
    });
    const [updateItemMutation, {loading: updateItemLoading}] = useMutation(UPDATE_ITEM, {
        refetchQueries: [{query: ALL_ITEMS, variables: {listId}}],
    });
    const itemsData = useMemo(() => {
        const itemsForList = get(itemsDataResponse, 'itemsForList', []);

        return editMode ? itemsForList : itemsForList.filter(({need}) => need);
    }, [itemsDataResponse]);

    useGlobalLoading('itemsLoading', itemsLoading);
    useGlobalLoading('updateItemLoading', updateItemLoading);

    function handleNeedClick(event) {
        updateItemMutation({
            variables: {
                itemId: event.currentTarget.value,
                need: !!event.currentTarget.checked,
                purchased: false,
            },
        });
    }

    function handlePurchasedClick(variables) {
        updateItemMutation({
            variables,
        });
    }

    const disabled = !editable;

    return (
        <div className={rootClassName} key={editMode ? 'itemsEdit' : 'items'}>
            {!editMode && !itemsData.length && (
                <div>
                    No items available. Go to edit and select items needed to complete.
                </div>
            )}
            <List>
                {itemsData.map(({id: itemId, name: itemName, need, purchased}) => (
                    <ListItemGrid key={itemId}>
                        <div>
                            {editMode ? (
                                <Switch
                                    name={`need_${itemId}`}
                                    checked={need}
                                    disabled={disabled}
                                    onClick={handleNeedClick}
                                    value={itemId}
                                />
                            ) : (
                                <ItemCheckbox
                                    value={itemId}
                                    checked={purchased || false}
                                    clearFromNeed={clearFromNeed}
                                    onClick={handlePurchasedClick}
                                />
                            )}
                        </div>
                        <div>{itemName}</div>
                        {editMode ? (
                            <div>
                                <IconButton icon="edit" disabled={disabled} />
                                <IconButton icon="delete" disabled={disabled} />
                            </div>
                        ) : (
                            <div />
                        )}
                    </ListItemGrid>
                ))}
            </List>
        </div>
    );
}

Items.propTypes = {
    className: PropTypes.string,
    clearFromNeed: PropTypes.bool.isRequired,
    editable: PropTypes.bool,
    editMode: PropTypes.bool,
    isDisabled: PropTypes.func.isRequired,
    listId: PropTypes.string.isRequired,
    pollInterval: PropTypes.number.isRequired,
};
