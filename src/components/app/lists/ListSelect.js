import React, {useMemo} from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';

// core
import Select from 'components/core/Select';

export default function ListSelect({
    className,
    selectValue,
    listData,
    setSelectedListId,
    userId,
}) {
    const [rootClassName] = getClassName({className, rootClass: 'list-select'});
    const listOptions = useMemo(() => {
        function transformDataToOptions(data) {
            return data.map(({name, id}) => ({
                label: name,
                value: id,
            }));
        }

        function filterListData(shared) {
            return listData.filter(({owner: {id}}) => {
                return shared ? userId !== id : userId === id;
            });
        }

        return [
            {label: 'My Lists', options: transformDataToOptions(filterListData())},
            {
                label: 'Shared Lists',
                options: transformDataToOptions(filterListData(true)),
            },
        ];
    }, [listData]);

    function handleSelectListChange(event) {
        setSelectedListId(event.currentTarget.value);
    }

    return (
        <Select
            enhanced
            fullWidth
            key={selectValue}
            label="Select List"
            onChange={handleSelectListChange}
            options={listOptions}
            rootProps={{className: rootClassName}}
            value={selectValue}
        />
    );
}

ListSelect.propTypes = {
    className: PropTypes.string,
    selectValue: PropTypes.string,
    listData: PropTypes.array,
    setSelectedListId: PropTypes.func,
    userId: PropTypes.string,
};
