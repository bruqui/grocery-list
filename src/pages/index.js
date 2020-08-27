import React from 'react';

// layout
import Layout from 'components/layout/Layout';
import Section from 'components/layout/Section';

// app
import ListsDataProvider from 'components/providers/ListsDataProvider';
import Lists from 'components/app/lists/Lists';

export default function IndexPage() {
    // TODO: move layout stuff to lists probably for better layout for LoginForm
    return (
        <Layout className="home-page" title="Home">
            <ListsDataProvider>
                <Section centered>
                    <Lists />
                </Section>{' '}
            </ListsDataProvider>
        </Layout>
    );
}
