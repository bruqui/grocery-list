import React from 'react';
import PropTypes from 'prop-types';

import getClassName from 'tools/getClassName';
import {useListData} from 'components/providers/ListDataProvider';

// app
import CompleteItList from 'components/app/lists/CompleteItList';
import CreateList from 'components/app/lists/CreateList';
import EditList from 'components/app/lists/EditList';
import ListLayout from 'components/app/lists/ListLayout';
import ShareList from 'components/app/lists/ShareList';

function renderComplete() {
    return <CompleteItList />;
}

function renderCreateList() {
    return <CreateList />;
}

function renderEdit() {
    return <EditList />;
}

function renderShare() {
    return <ShareList />;
}

const pageParams = {
    complete: {activeTab: 0, renderComponent: renderComplete},
    default: {activeTab: 3, renderComponent: renderCreateList},
    edit: {activeTab: 1, renderComponent: renderEdit},
    share: {activeTab: 2, renderComponent: renderShare},
};

export default function ListPage({className}) {
    const [rootClassName] = getClassName({className, rootClass: 'list-page'});
    const {pageKey} = useListData();
    const {activeTab, renderComponent} = pageParams[pageKey] || pageParams.default;

    return (
        <ListLayout
            activeTab={typeof activeTab === 'number' ? activeTab : 3}
            className={rootClassName}
        >
            {renderComponent()}
        </ListLayout>
    );
}

ListPage.propTypes = {
    className: PropTypes.string,
};
