import React, {useMemo, useState} from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';
import {useItemsData} from 'components/providers/ItemsDataProvider';

// core
import Button from 'components/core/Button';
import Switch from 'components/core/Switch';
// app
import Items from 'components/app/items/Items';
import ItemCheckbox from 'components/app/items/ItemCheckbox';

import './CompleteItList.scss';

export default function CompleteItList({className}) {
    const [rootClassName, getClass] = getClassName({
        className,
        rootClass: 'complete-it-list',
    });
    const [clearFromNeed, setClearFromNeed] = useState(false);
    const {updateItemMutation, updateItemsMutation, itemsData} = useItemsData();
    const neededItemsData = useMemo(() => itemsData.filter(({need}) => need) || []);

    function handleClearFromNeedClick(event) {
        setClearFromNeed(event.currentTarget.checked);
    }

    function handleClearCompletedClick() {
        const itemIds = neededItemsData
            .filter(({purchased}) => purchased)
            .map(({id}) => id);

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

    function renderFirstColumn({id: itemId, purchased, need}) {
        return (
            <ItemCheckbox
                clearFromNeed={clearFromNeed}
                itemId={itemId}
                purchased={purchased}
                onChange={handlePurchasedClick}
            />
        );
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
                    label="Clear from list as you complete it."
                    name="clearFromNeed"
                    onClick={handleClearFromNeedClick}
                />
            </div>
            <Items itemsData={neededItemsData} renderFirstColumn={renderFirstColumn} />
        </div>
    );
}

CompleteItList.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};
