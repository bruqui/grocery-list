import React from 'react';
import PropTypes from 'prop-types';
import {useRouter} from 'next/router';

import getClassName from 'tools/getClassName';
import {useListData} from 'components/providers/ListDataProvider';

// core
import {TabBar, Tab} from 'components/core/tabs';

// layout
import Layout from 'components/layout/Layout';
import Section from 'components/layout/Section';

// app
import Authenticated from 'components/app/Authenticated';
import CompleteItList from 'components/app/lists/CompleteItList';
import CreateList from 'components/app/lists/CreateList';
import EditList from 'components/app/lists/EditList';
import ListSelect from './ListSelect';
import ShareList from 'components/app/lists/ShareList';

import './ListLayout.scss';

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

const tabs = [
    {icon: 'assignment_turned_in', label: 'Complete', path: '/complete'},
    {icon: 'edit', label: 'Edit', path: '/edit', title: 'Edit'},
    {icon: 'share', label: 'Share', path: '/share'},
    {icon: 'add', label: 'Create', path: '/create'},
];

export default function ListLayout({className}) {
    const router = useRouter();
    const {pageKey} = useListData();
    const {activeTab, renderComponent} = pageParams[pageKey] || pageParams.default;
    const [rootClassName, getClass] = getClassName({className, rootClass: 'list-layout'});
    const {listId} = useListData();

    function handleTabInteraction({detail: {tabId}}) {
        const tabKey = tabId.replace('tab-', '');
        const pathSuffix = tabKey === 'Create' || !listId ? '' : listId;
        const {path} = listId ? tabs.find(({label}) => label === tabKey) : tabs[3];

        router.push(`list/${path}/${pathSuffix}`);
    }

    return (
        <Layout className={rootClassName} title={tabs[activeTab].label}>
            <Authenticated>
                <Section centered className={getClass('section')}>
                    <div className={getClass('container')}>
                        <TabBar activeTabIndex={activeTab}>
                            {tabs.map(({icon, label}) => (
                                <Tab
                                    key={icon}
                                    stacked
                                    icon={icon}
                                    label={label}
                                    onInteraction={handleTabInteraction}
                                />
                            ))}
                        </TabBar>
                        {activeTab < 3 && <ListSelect />}
                        <div className={getClass('content')}>{renderComponent()}</div>
                    </div>
                </Section>
            </Authenticated>
        </Layout>
    );
}

ListLayout.propTypes = {
    activeTab: PropTypes.number,
    className: PropTypes.string,
};

ListLayout.defaultProps = {
    activeTab: 3,
};
