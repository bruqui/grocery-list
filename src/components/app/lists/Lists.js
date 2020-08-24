import React, {useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import {find, get} from 'lodash';
import {useQuery} from '@apollo/react-hooks';

import getClassName from 'tools/getClassName';
import usePollingInterval from 'hooks/usePollingInterval';
import {useAuth} from 'components/providers/AuthProvider';
import {useGlobalLoading} from 'components/providers/LoadingProvider';
import {useStorage} from 'components/providers/StorageProvider';

// core
import Button from 'components/core/Button';
import Switch from 'components/core/Switch';
import {TabBar, Tab} from 'components/core/tabs';

// app
import AddListForm from './AddListForm';
import Authenticated from 'components/app/Authenticated';
import EditList from './EditList';
import Items from 'components/app/items/Items';
import ListSelect from './ListSelect';
import ShareList from './ShareList';

import './Lists.scss';

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

export default function Lists({className}) {
    const pollInterval = usePollingInterval(30000);
    const [rootClassName, getClass] = getClassName({className, rootClass: 'lists'});
    const {getItem, setItem} = useStorage();
    const [selectedListId, setSelectedListId] = useState(getItem('selectValue'));
    const [activeTab, setActiveTab] = useState(3);
    const [clearFromNeed, setClearFromNeed] = useState(false);
    const {authenticating, loggedOut, userId} = useAuth();
    const {loading: listLoading, data: listDataResponse} = useQuery(ALL_LISTS, {
        onCompleted: ({allListsForUser}) => {
            if (allListsForUser.length) {
                setActiveTab(1);
            }
        },
        skip: loggedOut || authenticating,
        ssr: false,
        pollInterval,
    });
    const listData = useMemo(() => get(listDataResponse, 'allListsForUser', []), [
        listDataResponse,
    ]);
    const selectValue = useMemo(() => {
        return listData &&
            listData.length &&
            selectedListId &&
            listData.filter(({id}) => id === selectedListId).length
            ? selectedListId
            : get(listData, '0.id');
    }, [listData, selectedListId]);

    const currentList = useMemo(
        () => find(listData, ({id}) => id === selectValue) || {},
        [listData, selectValue]
    );
    const editable = useMemo(() => {
        return get(currentList, 'owner.id') === userId || currentList.collaborated;
    }, [currentList, userId]);

    useGlobalLoading('listLoading', listLoading);

    useEffect(() => {
        setItem('selectValue', selectValue);
    }, [selectValue]);

    function handleActiveTab(event) {
        setActiveTab(event.currentTarget.index);
    }

    function handleClearFromNeedClick(event) {
        setClearFromNeed(event.currentTarget.checked);
    }

    function goToEdit(listId) {
        if (listId) {
            setActiveTab(1);
            setSelectedListId(listId);
        }
    }

    function isDisabled(ownerOnly) {
        let disabled = true;
        const notOwner = get(currentList, 'owner.id') !== userId;

        if (ownerOnly) {
            disabled = notOwner;
        } else {
            disabled = notOwner ? !get(currentList, 'collaborated') : false;
        }

        return disabled;
    }

    function renderItems(editMode) {
        return (
            <Items
                clearFromNeed={clearFromNeed}
                editable={editable}
                editMode={editMode}
                isDisabled={isDisabled}
                listId={selectValue}
                pollInterval={pollInterval}
            />
        );
    }

    function renderToCompleteList() {
        return (
            <div>
                <div className={getClass('complete-actions')}>
                    <Button disabled raised>
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
                {renderItems()}
            </div>
        );
    }

    function renderEditList() {
        return (
            <EditList listId={selectValue} editable={editable}>
                {renderItems(true)}
            </EditList>
        );
    }

    function renderShareList() {
        return (
            <ShareList
                listId={selectValue}
                pollInterval={pollInterval}
                sharedUsers={get(currentList, 'sharedWith', null)}
            />
        );
    }

    function renderCreateList() {
        return <AddListForm key="addList" goToEdit={goToEdit} />;
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
                    <div className={getClass('content')}>{renderArray[activeTab]()}</div>
                )}
            </div>
        </Authenticated>
    );
}

Lists.propTypes = {
    className: PropTypes.string,
};
