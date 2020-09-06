import React, {useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';

import getClassName from 'tools/getClassName';
import {useGlobalLoading} from 'components/providers/LoadingProvider';
import {useListData} from 'components/providers/ListDataProvider';

// core
import Button from 'components/core/Button';
import Switch from 'components/core/Switch';

// app
import ItemCheckbox from 'components/app/items/ItemCheckbox';

import './CompleteItList.scss';

const UPDATE_ITEMS = gql`
    mutation UPDATE_ITEMS($itemIds: [String!], $need: Boolean, $purchased: Boolean) {
        updateItems(itemIds: $itemIds, need: $need, purchased: $purchased) {
            count
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

export default function CompleteItList({className}) {
    const [rootClassName, getClass] = getClassName({
        className,
        rootClass: 'complete-it-list',
    });
    const [clearFromNeed, setClearFromNeed] = useState(false);
    const {listRefetch, itemsData} = useListData();
    const neededItemsData = useMemo(() => itemsData.filter(({need}) => need) || []);
    const [updateItemsMutation, {loading: updateItemsLoading}] = useMutation(
        UPDATE_ITEMS,
        {refetchQueries: listRefetch ? [listRefetch] : undefined}
    );
    const [updateItemMutation, {loading: updateItemLoading}] = useMutation(UPDATE_ITEM, {
        refetchQueries: listRefetch ? [listRefetch] : undefined,
    });

    useGlobalLoading('updateItemsLoading', updateItemsLoading);
    useGlobalLoading('updateItemLoading', updateItemLoading);

    function handleClearFromNeedClick(event) {
        setClearFromNeed(event.currentTarget.checked);
    }

    function handleClearCompletedClick() {
        const itemIds = itemsData.filter(({purchased}) => purchased).map(({id}) => id);

        if (itemIds.length) {
            updateItemsMutation({variables: {itemIds, need: false, purchased: false}});
        }
    }

    function handlePurchasedClick({checked, itemId, purchased}) {
        updateItemMutation({
            variables: {
                itemId,
                purchased: checked,
                need: !(clearFromNeed && checked),
            },
        });
    }

    return (
        <div className={rootClassName}>
            <div className={getClass('complete-actions')}>
                <Button raised onClick={handleClearCompletedClick}>
                    Clear Completed From List
                </Button>
                <Switch
                    className={getClass('clear-switch')}
                    checked={clearFromNeed}
                    fullWidth={false}
                    label="Clear from list as you complete it."
                    name="clearFromNeed"
                    onClick={handleClearFromNeedClick}
                />
            </div>
            {neededItemsData && neededItemsData.length ? (
                <ul>
                    {neededItemsData.map(({id: itemId, name, purchased}) => (
                        <li className={getClass('li')} key={itemId}>
                            <div>
                                <ItemCheckbox
                                    clearFromNeed={clearFromNeed}
                                    itemId={itemId}
                                    purchased={purchased}
                                    onChange={handlePurchasedClick}
                                />
                            </div>
                            <div>{name}</div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className={getClass('no-items')}>
                    No items available. Please go to edit tab to add to this list.
                </div>
            )}
        </div>
    );
}

CompleteItList.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};
