import React, {useMemo} from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

// core
import Select from 'components/core/Select';

export default function ListSelect({
    className,
    selectedListId,
    lists,
    setSelectedListId,
    sharedLists,
}) {
    const [rootClassName] = getClassName({className, rootClass: 'list-select'});
    const listOptions = useMemo(() => {
        function transformDataToOptions(data) {
            return data.map(({name, id}) => ({label: name, value: id}));
        }

        return [
            {label: 'My Lists', options: transformDataToOptions(lists)},
            {label: 'Shared Lists', options: transformDataToOptions(sharedLists)},
        ];
    }, [lists, sharedLists]);

    function handleSelectListChange(event) {
        setSelectedListId(event.currentTarget.value);
    }

    return (
        <Select
            defaultValue={selectedListId}
            enhanced
            fullWidth
            label="Select List"
            onChange={handleSelectListChange}
            options={listOptions}
            rootProps={{className: rootClassName}}
        />
    );
}

ListSelect.propTypes = {
    className: PropTypes.string,
    selectedListId: PropTypes.string,
    lists: PropTypes.array,
    setSelectedListId: PropTypes.func,
    sharedLists: PropTypes.array,
};
