import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash';

import getClassName from 'tools/getClassName';
import {useListData} from 'components/providers/ListDataProvider';

// core
import Button from 'components/core/Button';
import Icon from 'components/core/Icon';
import {ListLink, ListItem} from 'components/core/list';
import {SimpleMenu} from 'components/core/menu';

import './ListSelect.scss';

export default function ListSelect({className, selectValue, setSelectedListId, userId}) {
    const [rootClassName, getChildClass] = getClassName({
        className,
        rootClass: 'list-select',
    });
    const {allListsData, listData} = useListData();

    // const listOptions = useMemo(() => {
    //     function transformDataToOptions(data) {
    //         return data.map(({name, id}) => ({
    //             label: name,
    //             value: id,
    //         }));
    //     }

    //     function filterListData(shared) {
    //         return allListsData.filter(({owner: {id}}) => {
    //             return shared ? userId !== id : userId === id;
    //         });
    //     }

    //     return [
    //         {label: 'My Lists', options: transformDataToOptions(filterListData())},
    //         {
    //             label: 'Shared Lists',
    //             options: transformDataToOptions(filterListData(true)),
    //         },
    //     ];
    // }, [allListsData]);

    function renderLink({id: listId, name, owner}) {
        const linkName = name.length > 15 ? name.substring(0, 11) + '...' : name;
        let ownerName = get(owner, 'name');

        ownerName =
            ownerName.length > 15 ? ownerName.substring(0, 11) + '...' : ownerName;

        return (
            <ListItem key={listId} activated={listId === listData.id}>
                <ListLink
                    className={getChildClass('list-link')}
                    to={`/list/${listId}/edit`}
                >
                    <div>{linkName}</div>
                    <div>
                        <Icon icon="share" className={getChildClass('share-icon')} />
                        {ownerName}
                    </div>
                </ListLink>
            </ListItem>
        );
    }
    return (
        <div className={rootClassName}>
            <SimpleMenu
                className={getChildClass('menu')}
                handle={
                    <Button
                        className={getChildClass('menu-button')}
                        icon="keyboard_arrow_down"
                    >
                        {listData && listData.name ? listData.name : 'Select a list'}
                    </Button>
                }
                style={{minWidth: '200px'}}
            >
                {allListsData && allListsData.length ? (
                    allListsData.map(renderLink)
                ) : (
                    <ListItem>No lists availalable</ListItem>
                )}
            </SimpleMenu>
        </div>
    );
}

ListSelect.propTypes = {
    className: PropTypes.string,
    selectValue: PropTypes.string,
    setSelectedListId: PropTypes.func,
    userId: PropTypes.string,
};
