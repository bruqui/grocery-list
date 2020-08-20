import React, {useCallback, useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {find, get} from 'lodash';

import getClassName from 'tools/getClassName';
import {useLists} from 'components/providers/ListProvider';

// core
import {Card} from 'components/core/card';
import {TabBar, Tab} from 'components/core/tabs';

// app
import AddListForm from './AddListForm';
import Edit from './Edit';
import ListSelect from './ListSelect';
import Share from './Share';
import Shop from './Shop';

import './Lists.scss';

export default function Lists({className}) {
    const {lists, sharedLists} = useLists();
    const combinedLists = useMemo(() => [...lists, ...sharedLists], [lists, sharedLists]);
    const hasLists = useCallback(() => !!combinedLists.length, [combinedLists]);
    const [selectedListId, setSelectedListId] = useState(get(combinedLists, [0, 'id']));
    const currentList = useMemo(
        () => find(combinedLists, ({id}) => id === selectedListId) || {},
        [combinedLists, selectedListId]
    );
    const items = useMemo(() => currentList.items || [], [currentList]);
    const filteredItems = useMemo(() => items.filter(({need}) => need), [items]);
    const [activeTab, setActiveTab] = useState(hasLists() ? 0 : 3);
    const [rootClassName, getClass] = getClassName({className, rootClass: 'lists'});

    useEffect(() => {
        if (hasLists() && !selectedListId) {
            setSelectedListId(get(combinedLists, [0, 'id']));
        }
    }, [hasLists, selectedListId, setSelectedListId]);

    function handleActiveTab(event) {
        setActiveTab(event.currentTarget.index);
    }

    function goToEdit(listId) {
        setActiveTab(1);

        if (listId) {
            setSelectedListId(listId);
        }
    }

    function getContent() {
        const content = [
            <Shop
                itemData={filteredItems}
                key="shop"
                lists={lists}
                selectedListId={selectedListId}
                setSelectedListId={setSelectedListId}
                sharedLists={sharedLists}
            />,
            <Edit itemData={items} key="edit" listId={selectedListId} />,
            <Share
                key="share"
                listId={selectedListId}
                sharedUsers={get(currentList, 'sharedWith.user', null)}
            />,
            <AddListForm key="addList" goToEdit={goToEdit} />,
        ];

        return hasLists() && activeTab >= 0 ? content[activeTab] : content.slice(-1);
    }

    return (
        <Card className={rootClassName}>
            {activeTab < 3 && (
                <ListSelect
                    lists={lists}
                    selectedListId={selectedListId}
                    setSelectedListId={setSelectedListId}
                    sharedLists={sharedLists}
                />
            )}
            <TabBar activeTabIndex={activeTab} onActivate={handleActiveTab}>
                <Tab stacked icon="shopping_cart" label="Shop" />
                <Tab stacked icon="edit" label="Edit" />
                <Tab stacked icon="share" label="Share" />
                <Tab stacked icon="add" label="Create" />
            </TabBar>
            <div className={getClass('content')}>{getContent()}</div>
        </Card>
    );
}

Lists.propTypes = {
    className: PropTypes.string,
};
