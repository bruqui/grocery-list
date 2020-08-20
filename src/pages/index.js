import React from 'react';

// core
import Headline from 'components/core/Headline';

// layout
import Layout from 'components/layout/Layout';
import Section from 'components/layout/Section';

// app
import Lists from 'components/app/lists/Lists';
import ListProvider from 'components/providers/ListProvider';

export default function IndexPage() {
    return (
        <Layout className="home-page" title="Home">
            <Section centered padding>
                <Headline level={2}>List</Headline>
                <ListProvider>
                    <Lists />
                </ListProvider>
            </Section>
        </Layout>
    );
}
