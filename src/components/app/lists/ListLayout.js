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
import ListSelect from './ListSelect';

import './ListLayout.scss';

const tabs = [
    {icon: 'assignment_turned_in', label: 'Complete', path: '/complete'},
    {icon: 'edit', label: 'Edit', path: '/edit', title: 'Edit'},
    {icon: 'share', label: 'Share', path: '/share'},
    {icon: 'add', label: 'Create', path: '/'},
];

export default function ListLayout({activeTab, children, className}) {
    const router = useRouter();
    const [rootClassName, getClass] = getClassName({className, rootClass: 'list-layout'});
    const {listId} = useListData();

    function handleTabInteraction({detail: {tabId}}) {
        const tabKey = tabId.replace('tab-', '');
        const pathPrefix = tabKey === 'Create' || !listId ? '' : `/list/${listId}`;
        const {path} = listId ? tabs.find(({label}) => label === tabKey) : tabs[3];

        router.push(`${pathPrefix}${path}`);
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
                        <div className={getClass('content')}>{children}</div>
                    </div>
                </Section>
            </Authenticated>
        </Layout>
    );
}

ListLayout.propTypes = {
    activeTab: PropTypes.number,
    children: PropTypes.node,
    className: PropTypes.string,
};

ListLayout.defaultProps = {
    activeTab: 3,
};
