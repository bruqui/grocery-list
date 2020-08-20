import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

// core
import IconButton from 'components/core/IconButton';
import Switch from 'components/core/Switch';
import {List, ListItem} from 'components/core/list';

// app
import ItemCheckbox from './ItemCheckbox';

import './Items.scss';

export default function Items({className, editMode, itemData}) {
    const [rootClassName, getClass] = getClassName({className, rootClass: 'items'});

    return (
        <div className={rootClassName}>
            <List>
                {itemData.map(({id: itemId, name: itemName, need, purchased}) => (
                    <ListItem className={getClass('list-item')} key={itemId}>
                        <div>
                            {editMode ? (
                                <Switch name={`need_${itemId}`} defaultChecked={need} />
                            ) : (
                                <ItemCheckbox itemId={itemId} purchased={purchased} />
                            )}
                        </div>
                        <div>{itemName}</div>
                        {editMode && (
                            <div className={getClass('last-column')}>
                                <IconButton icon="edit" />
                                <IconButton icon="delete" />
                            </div>
                        )}
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

Items.propTypes = {
    className: PropTypes.string,
    editMode: PropTypes.bool,
    itemData: PropTypes.array,
};
