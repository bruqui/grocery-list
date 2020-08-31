import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useForm} from 'react-hook-form';

import getClassName from 'tools/getClassName';
import {useItemsData} from 'components/providers/ItemsDataProvider';

// core
import IconButton from 'components/core/IconButton';
import TextField from 'components/core/TextField';

// app
import ListItemGrid from 'components/app/ListItemGrid';

// import './ItemDetail.scss';

export default function ItemDetail({
    className,
    itemId,
    itemData,
    renderFirstColumn,
    renderThirdColumn,
}) {
    const [rootClassName] = getClassName({className, rootClass: 'item-name'});
    const {register: fieldRegister, handleSubmit, errors: fieldErrors, reset} = useForm();
    const [editMode, setEditMode] = useState(false);
    const {updateItemLoading, updateItemMutation} = useItemsData();

    function handleOnSubmit(formData) {
        // do stufuf with form data
    }

    // function renderForm() {
    //     <form onSubmit={handleSubmit(handleOnSubmit)} name="addList">
    //         <TextField
    //             defaultValue={itemData.name}
    //             disabled={updateItemLoading}
    //             fieldError={fieldErrors.name}
    //             id="name"
    //             inputRef={fieldRegister({required: 'This field is required'})}
    //             label="Item Name"
    //             name="name"
    //         />
    //     </form>;
    // }
    return (
        <div className={rootClassName}>
            <ListItemGrid key={itemId}>
                <div>{renderFirstColumn(itemData)}</div>
                <div>{itemData.name}</div>
                <div>{renderThirdColumn(itemData, setEditMode)}</div>
            </ListItemGrid>
        </div>
    );
}

ItemDetail.propTypes = {
    className: PropTypes.string,
    itemId: PropTypes.string,
    itemData: PropTypes.object,
    renderFirstColumn: PropTypes.func,
    renderThirdColumn: PropTypes.func,
};

ItemDetail.defaultProps = {
    renderFirstColumn: () => null,
    renderThirdColumn: () => null,
};
