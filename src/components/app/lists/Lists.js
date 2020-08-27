import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

// providers
import ItemsDataProvider from 'components/providers/ItemsDataProvider';

// core
import {TabBar, Tab} from 'components/core/tabs';

import {useListsData} from 'components/providers/ListsDataProvider';

// app
import AddListForm from './AddListForm';
import Authenticated from 'components/app/Authenticated';
import CompleteItList from './CompleteItList';
import EditList from './EditList';
import ListSelect from './ListSelect';
import ShareList from './ShareList';

import './Lists.scss';

export default function Lists({className}) {
    const [rootClassName, getClass] = getClassName({className, rootClass: 'lists'});
    const {
        activeTab,
        listData,
        selectValue,
        setActiveTab,
        setSelectedListId,
        userId,
    } = useListsData();

    function handleActiveTab(event) {
        setActiveTab(event.currentTarget.index);
    }

    function renderToCompleteList() {
        return <CompleteItList />;
    }

    function renderEditList() {
        return <EditList />;
    }

    function renderShareList() {
        return <ShareList />;
    }

    function renderCreateList() {
        return <AddListForm />;
    }

    const renderArray = [
        renderToCompleteList,
        renderEditList,
        renderShareList,
        renderCreateList,
    ];

    return (
        <Authenticated>
            <div className={rootClassName}>
                <TabBar activeTabIndex={activeTab} onActivate={handleActiveTab}>
                    <Tab stacked icon="assignment_turned_in" label="Complete It" />
                    <Tab stacked icon="edit" label="Edit" />
                    <Tab stacked icon="share" label="Share" />
                    <Tab stacked icon="add" label="Create" />
                </TabBar>
                {activeTab < 3 && (
                    <ListSelect
                        listData={listData}
                        selectValue={selectValue}
                        setSelectedListId={setSelectedListId}
                        userId={userId}
                    />
                )}
                {selectValue && (
                    <ItemsDataProvider>
                        <div className={getClass('content')}>
                            {renderArray[activeTab]()}
                        </div>
                    </ItemsDataProvider>
                )}
            </div>
        </Authenticated>
    );
}

Lists.propTypes = {
    className: PropTypes.string,
};
